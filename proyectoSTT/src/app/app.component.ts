import { Component, OnInit } from '@angular/core';
import { Usuario } from './model/usuario';
import { Modallogin } from './modulo_login/modal-login.component'
import { ServiciosGlobales } from './services/servicios-globales';
import { PersistenceService, StorageType } from 'angular-persistence';
import { Router } from '@angular/router';
import { Servicios } from './services/servicios';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	constructor(private servicios: Servicios, private serviciog: ServiciosGlobales, private persistenceService: PersistenceService, private router: Router) { }

	ngOnInit() {
		/* --------------------- */
		this.serviciog.usuario = this.persistenceService.get('user', StorageType.SESSION);
		//get Number Total Messages 
		var formData = new FormData();
		formData.append('id_usuario', this.serviciog.usuario.id_usuario + '');
		//alert(this.serviciog.usuario.id_usuario);
		this.servicios.getTotalMessage(formData)
			.then(messages => { 
				this.serviciog.messageList = messages;

				for (var prop in messages) {
					//alert(parseInt(messages[prop]));
					this.serviciog.totalMessage = this.serviciog.totalMessage + parseInt(messages[prop]);
				}
			})

		/* comumir socket service */
		this.serviciog.socket.on('Hello', (data) => {
			// alert(JSON.stringify(data));
		});
		this.serviciog.socket.on('alert', (data) => {
			//alert(JSON.stringify(data));
			var audio = new Audio();
			audio.src = '../assets/campana.mp3'
			audio.load();
			audio.play();
			//alert(data);
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
					this.serviciog.alert_message = "Nuevo recomendacion";					
					break;
			}
			this.serviciog.totalMessage++;
			setTimeout(() =>{
				this.serviciog.hidden = false;
			},5000);
			//alert(JSON.stringify(this.serviciog.messageList));
		});


	}
	goToActividadesMultimedia() {
		let link = ['actividades'];
		this.router.navigate(link);
	}

	logout() {
		this.persistenceService.remove('user', StorageType.SESSION);
		this.serviciog.usuario = this.persistenceService.get('user', StorageType.SESSION);
		let link = [''];
		this.router.navigate(link);
		this.serviciog.socket.emit('delUser', this.serviciog.usuario.id_usuario);
	}
}
