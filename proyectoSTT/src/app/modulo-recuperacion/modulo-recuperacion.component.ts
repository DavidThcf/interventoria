import { Component, OnInit ,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServiciosGlobales } from '../services/servicios-globales';
import { PersistenceService, StorageType } from 'angular-persistence';
import { Router } from '@angular/router';
import { Servicios } from '../services/servicios';

@Component({
	selector: 'app-modulo-recuperacion',
	templateUrl: './modulo-recuperacion.component.html',
	styleUrls: ['./modulo-recuperacion.component.css']
})
export class ModuloRecuperacionComponent implements OnInit {

	constructor(private servicios: Servicios, private serviciog: ServiciosGlobales, private persistenceService: PersistenceService, private router: Router) { }
	/* variables para ir guardando la info del formaulario */
	passNow : any = "" ;
	passNew : any = "";
	passConfNew : any = "";
	/* ------------------------ */
	/* variable para saber si contraseñas nuevas son iguales  */
	equalPassword : string = "Las constraseñas no coinciden" ;
	/* --------------- */
	ngOnInit() {
	}

	/* validar  */
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
			'passNow': '',
			'passNew': '',
			'passConfNew' : '',
		};
		// pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
		validationMessages = {
			'passNow': {
				'required': 'Campo Obligatorio'	
			},
			'passNew': {
				'required': 'Campo Obligatorio',
				'pattern' : 'La contraseña debe contener minimo 8 caracteres, una letra mayuscula, una letra minuscula y numeros o caracteres especiales'
			},
			'passConfNew': {
				'required': 'Campo Obligatorio',
				'pattern' : 'La contraseña debe contener minimo 8 caracteres, una letra mayuscula, una letra minuscula y numeros o caracteres especiales'
			}
		};
		/* -------------- */

		changePasssword(){
			var formData = new FormData();
			formData.append('user' , this.serviciog.usuario.id_usuario +'');
			formData.append('passNow', this.passNow);
			formData.append('passNew', this.passNew);
			this.servicios.changePassword(formData)
			.then(x => {
				if(x == true){
					this.serviciog.alert_message = 'Cambio de contraseña exitoso';
					this.serviciog.hidden = true;
					setTimeout(() => {
						this.serviciog.hidden = false;
					},5000);
					let link = [''];
					this.router.navigate(link);
				}
				else{
					this.serviciog.alert_message = 'No se puede cambiar la contraseña';
					this.serviciog.hidden = true;
					setTimeout(() => {
						this.serviciog.hidden = false;
					},5000);
				}
			});
		}
	}
