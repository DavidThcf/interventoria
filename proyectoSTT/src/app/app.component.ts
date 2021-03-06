import { Component, OnInit ,ViewChild } from '@angular/core';
import { Usuario } from './model/usuario';
import { Modallogin } from './modulo_login/modal-login.component'
import { ServiciosGlobales } from './services/servicios-globales';
import { PersistenceService, StorageType } from 'angular-persistence';
import { Router } from '@angular/router';
import { Servicios } from './services/servicios';
import { NgForm } from '@angular/forms';
import * as io from 'socket.io-client';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	constructor(private servicios: Servicios, private serviciog: ServiciosGlobales, private persistenceService: PersistenceService, private router: Router) { }

	/* variables del modal recuperacion */
	email: any ;
	sendConfirmation : any ;
	/* ---------------------------- */

	ngOnInit() {
		/*para saber si existe pausa*/
		this.getPauseJob();
		/*-------------*/
		this.serviciog.usuario = this.persistenceService.get('user', StorageType.SESSION);
		//get Number Total Messages 
		if (this.serviciog.usuario) {
			this.serviciog.socket.emit('newUser',this.serviciog.usuario.id_usuario);
			var formData = new FormData();
			formData.append('id_usuario', this.serviciog.usuario.id_usuario + '');
			this.servicios.getTotalMessage(formData)
			.then(messages => {
				this.serviciog.messageList = messages;

				for (var prop in messages) {
						this.serviciog.totalMessage = this.serviciog.totalMessage + parseInt(messages[prop]);
					}
				})
		}
		/* comumir socket service */
		
		this.serviciog.socket.on('alert', (data) => {
			var audio = new Audio();
			audio.src = '../assets/campana.mp3'
			audio.load();
			audio.play();
			this.serviciog.hidden = true;

			switch (data) {
				case 'per':
				this.serviciog.messageList['percentage']++;
				this.serviciog.alert_message = "Nuevo Cambio de Porcentaje";
				break;
				case 'mul':
				this.serviciog.messageList['files']++;
				this.serviciog.alert_message = "Nuevo Archivo Cargado";
				break;
				case 'obs':
				this.serviciog.messageList['observations']++;
				this.serviciog.alert_message = "Nueva Observación";
				break;
				case 'rec':
				this.serviciog.messageList['remarks']++;
				this.serviciog.alert_message = "Nueva recomendacion";
				break;
			}
			this.serviciog.totalMessage++;
			setTimeout(() => {
				this.serviciog.hidden = false;
			}, 5000);
		});
	}

	gotoNovedades(op) {

		let link = ['novedades'];
		this.serviciog.opcion = op;
		this.router.navigate(link);
		switch (this.serviciog.opcion) {
			case 'por':
			this.serviciog.novedades = [];
			var formData = new FormData();
			formData.append("id_usuario", this.serviciog.usuario.id_usuario + "");
			this.servicios.getDataNewChangePercent(formData)
			.then(novedades => {
				if (novedades) {
					console.log(novedades);
					this.serviciog.novedades = novedades;
				}
			});
			break;
			/* se realiza en caso de que la opcion sea multimedia */
			case 'mul':
			this.serviciog.novedades = []; /* arreglo que contendra todos los archivos a traer */
			var formData = new FormData(); /* variable que contendra todos los datos a enviarse al server */
			formData.append("id_usuario", this.serviciog.usuario.id_usuario + "");/* se carga formData  */
			this.servicios.getDataNewChangeFile(formData) /* llamdo al metodo que se conectara con el server */
			.then(files => {
				if (files) {
							console.log(files);
							this.serviciog.novedades = files;
						}
					});
			break;
			/* end multimedia */
			case 'rec':
			this.serviciog.novedades = [];
			var formData = new FormData();
			formData.append("id_usuario", this.serviciog.usuario.id_usuario + "");
			this.servicios.getDataNewRemarks(formData)
			.then(novedades => {
				if (novedades) {
							console.log(novedades);
							this.serviciog.novedades = novedades;
						}
					});

			break;
			case 'obs':
			this.serviciog.novedades = [];
			var formData = new FormData();
			formData.append("id_usuario", this.serviciog.usuario.id_usuario + "");
			this.servicios.getDataNewObservations(formData)
			.then(novedades => {
				if (novedades) {
					console.log(novedades);
					this.serviciog.novedades = novedades;
				}
			});
			break;
		}
	}

	logout() {
		this.serviciog.socket.disconnect();
		this.persistenceService.remove('user', StorageType.SESSION);
		this.serviciog.usuario = this.persistenceService.get('user', StorageType.SESSION);
		let link = [''];
		this.router.navigate(link);
	}

	/* para validar modal restart */
	loginForm: NgForm;
	
	@ViewChild('loginForm') currentForm: NgForm;
	
	ngAfterViewChecked() {
		this.formChanged();
	}
	
	formChanged() {
		if (this.currentForm === this.loginForm) { return; }
		this.loginForm = this.currentForm;
		if (this.loginForm) {
			this.loginForm.valueChanges
			.subscribe(data => this.onValueChanged(data));
		}
	}
	
	onValueChanged(data?: any) {
		if (!this.loginForm) { return; }
		const form = this.loginForm.form;

		for (const field in this.formErrors) {
				// clear previous error message (if any)
				this.formErrors[field] = '';
				const control = form.get(field);

				if (control && control.dirty && !control.valid) {
					const messages = this.validationMessages[field];
					for (const key in control.errors) {
						this.formErrors[field] += messages[key] + ' ';
					}
				}
			}
		}

		formErrors = {
			'email': '',
			'password': ''
		};
		// pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
		validationMessages = {
			'email': {
				'required': 'Email Obligatorio'	,
				'pattern' : 'Email Incorrecto'
			},
			'password': {
				'required': 'Password Obligatorio'
			}
		};	
		/* -------------------------------- */
		/* manejo modales login y restart */
		openModalLogin() {
			this.serviciog.isModalLogin = !this.serviciog.isModalLogin;
		}

		closeModalRestart(){
			this.serviciog.isModalRestart = false;
			this.serviciog.isModalLogin = true;
		}
		/* ------------------------------- */
		/* enviar email para el usuario a recuperar contraseña */
		sendEmailRestart(){
		this.sendConfirmation = ''
		var formdata  = new FormData();
		formdata.append('email', this.email);
		this.servicios.restartPassword(formdata).then(x => {
			if(x == true ) {
				this.sendConfirmation = 'Por favor reviza tu correo.'
			}else {
				this.sendConfirmation = 'Correo no registrado.'
			}
		})
	}
	/* ------------------------------------------------ */
	/* cambiar contraseña */
	changePassword(){
		
	}
	/* -------------------------------- */
	/*obtener la suspensiin si existe*/
	getPauseJob(){
		this.servicios.getPauseJob().then(message =>{
			if(message.length > 0){

				this.serviciog.activoSuspension = message[0].activo;
				this.serviciog.fecha_inicioSuspension = message[0].fecha_inicio;
				this.serviciog.fecha_finSuspension = message[0].fecha_fin;
				var aFecha2 = new Date(this.serviciog.fecha_inicioSuspension);
				var aFecha3 = new Date(this.serviciog.fecha_finSuspension);
				var fFecha2 = new Date(aFecha2.getFullYear(), aFecha2.getMonth(), aFecha2.getDate());
				var fFecha3 = new Date(aFecha3.getFullYear(), aFecha3.getMonth(), aFecha3.getDate());

				var difAc = fFecha3.getTime() - fFecha2.getTime();
				var diasAc = Math.floor(difAc / (1000 * 60 * 60 * 24));
				this.serviciog.dias_suspension = Math.floor(difAc / (1000 * 60 * 60 * 24));
				
			}
		});
	}
	/*-----------------------------------*/
}
