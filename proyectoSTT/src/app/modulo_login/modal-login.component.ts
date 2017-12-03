import { Component , ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router }            from '@angular/router';

import { Usuario } from '../model/usuario';
import { Servicios }         from '../services/servicios';
import { ServiciosGlobales } from '../services/servicios-globales'


@Component({
	selector: 'modal-login',
	templateUrl: './modal-login.html',
	styleUrls: [ './modal-login.component.css' ]
})


export class Modallogin {

	constructor(
		private servicios: Servicios,
		private serviciog:ServiciosGlobales,
		private router:Router	  
		) {};


	usuario = new Usuario(null,'','','','','','','','','','',"",null);	

	cadena:string;
	hideModal: boolean = false;
	mAlert:boolean= false;	
	submitted = false;	

	onSubmit() {

		this.submitted = true;
		var formData = new FormData();
		formData.append('usuario',JSON.stringify(this.usuario))
		this.servicios.getUsuario(formData)
		.then( 
			usuario =>
			{
				if(usuario){
					this.serviciog.isModalLogin = false;
					this.serviciog.socket.emit('newUser',usuario.id_usuario);
					this.serviciog.getUserSession(usuario);
					let link = [''];
					this.router.navigate(link);
				}else{
					this.mAlert = true;
				}		
			}
			);
	}
	
	
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

	validationMessages = {
		'email': {
			'required': 'Email Obligatorio'		
		},
		'password': {
			'required': 'Password Obligatorio'
		}
	};	
	closeModalLogin(){
		this.serviciog.isModalLogin = false;
	}
}
