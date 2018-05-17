import { Component, ViewChild}  from '@angular/core';
import { NgModule } 		 from '@angular/core';
import { Router }            from '@angular/router';
import { NgForm } 			from '@angular/forms';
import { ServiciosGlobales } from '../../services/servicios-globales';
import { ServiciosGlobalesActividades} from '../servicios-globales-actividades'
import { Servicios }         from '../../services/servicios';


@Component({
	selector: 'registro-actividad',
	templateUrl: './registro_actividad.component.html',
	styleUrls: [ './registro_actividad.component.css' ]
})

export class RegistroActividad{
	
	actividad = new Actividad('','','','','');
	files:any;

	constructor(
		private serviciog:ServiciosGlobales,
		private serviGloAct:ServiciosGlobalesActividades,
		private router:Router,
		private servicios: Servicios	  
		){ };
	
	
	onSubmitPro(activityForm:NgForm) {	
		var formData = new FormData();

		this.actividad.id_usuario = this.serviciog.usuario.id_usuario + '';

		if(this.serviciog.isSelAct){			
			this.actividad.keym_padre = this.serviciog.actividad.keym;
			this.actividad.id_usuario_padre = this.serviciog.actividad.id_usuario;
			this.actividad.id_caracteristica_padre = this.serviciog.actividad.id_caracteristica;			
		}else{			
			this.actividad.keym_padre = this.serviciog.proyecto.keym;
			this.actividad.id_usuario_padre = this.serviciog.proyecto.id_usuario;
			this.actividad.id_caracteristica_padre = this.serviciog.proyecto.id_caracteristica;						
		}
		
		formData.append('actividad',JSON.stringify (this.actividad));		

		if(this.files){
			formData.append('file', this.files);
		}

		this.servicios.createActividad(formData)
		.then(message => { 
			if(message){
				if(this.serviGloAct.actOpt == 2){
					this.serviGloAct.actOpt = 1;
				}
				if(!this.serviciog.isSubActivity){
					if(!this.serviciog.isSelAct){
						var keym = this.serviciog.proyecto.keym;
						var id_usuario = this.serviciog.proyecto.id_usuario;
						var id_caracteristica = this.serviciog.proyecto.id_caracteristica;
						this.servicios.getActividad(keym,id_usuario,id_caracteristica)
						.then(actividad => this.serviciog.actividades = actividad );
					}					
				}else{
					var keym = this.serviciog.isSubActivity.keym;
					var id_usuario = this.serviciog.isSubActivity.id_usuario;
					var id_caracteristica = this.serviciog.isSubActivity.id_caracteristica;	

					this.servicios.getActividad(keym,id_usuario,id_caracteristica)
					.then(actividad => this.serviciog.actividades = actividad );
				}
			}
		} );	
		
	}

	
	activityForm: NgForm;

	@ViewChild('activityForm') currentForm: NgForm;

	ngAfterViewChecked() {
		this.formChanged();
	}

	formChanged() {
		if (this.currentForm === this.activityForm) { return; }
		this.activityForm = this.currentForm;
		if (this.activityForm) {
			this.activityForm.valueChanges
			.subscribe(data => this.onValueChanged(data));
		}
	}

	onValueChanged(data?: any) {
		if (!this.activityForm) { return; }
		const form = this.activityForm.form;
		
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
		'nombre': '',
		'descripcion': '',
		'fecha_ini': '',
		'fecha_fin': '',
		'etapa': ''
	};

	validationMessages = {
		'nombre': {
			'required': 'Nombre actividad obligatorio'	
		},
		'descripcion': {
			'required': 'Descripcion Obligatorio'		
		},
		'fecha_ini': {
			'required': 'Fecha de Inicio Obligatorio'
		},
		'fecha_fin': {
			'required': 'Password Obligatorio'
		},
		'etapa': {
			'required': 'Selecionar Etapa'
		}

	};	
}

class Actividad{
	constructor(
		public keym_padre:string,
		public id_usuario_padre:string,
		public id_caracteristica_padre:string,
		public id_usuario:string,
		public nombre:string,
		) {  }
}