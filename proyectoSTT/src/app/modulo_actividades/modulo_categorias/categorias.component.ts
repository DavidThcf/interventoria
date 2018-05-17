import { Component, OnInit}  from '@angular/core';
import { NgModule, ViewChild } 		 from '@angular/core';
import { NgForm } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

import { Router }            from '@angular/router';
import { ServiciosGlobales } from '../../services/servicios-globales';
import { Servicios }         from '../../services/servicios';

@Component({
	selector: 'categorias',
	templateUrl: './categorias.component.html',
	styleUrls: [ './categorias.component.css' ]
})

export class Categorias implements OnInit{

	categoria:Categoria = new Categoria('','black','','','');
	categorias:any;
	categoryValid:any;
	caracteristica :Caracteristica = new Caracteristica('','','');
	titulo:string = "Categoria";
	isEditar:boolean =  false;

	constructor(
		private serviciog:ServiciosGlobales,
		private router:Router,
		private servicios: Servicios	  
		){ };

	ngOnInit():void {
		this.caracteristica.keym_car = this.serviciog.proyecto.keym;
		this.caracteristica.id_caracteristica = this.serviciog.proyecto.id_caracteristica;
		this.caracteristica.id_usuario_car = this.serviciog.proyecto.id_usuario;
		
		var formData = new FormData();
		formData.append('caracteristica', JSON.stringify(this.caracteristica));
		this.servicios.getCategoryList(formData)
		.then(categorias => {
			this.categorias = categorias;			
		});
	}

	onSubmit(){
		this.categoria.keym_car = this.serviciog.proyecto.keym;
		this.categoria.id_caracteristica = this.serviciog.proyecto.id_caracteristica;
		this.categoria.id_usuario_car = this.serviciog.proyecto.id_usuario;
		
		if(this.categoria.nombre != ''){			
			var formData = new FormData();
			formData.append('categoria', JSON.stringify(this.categoria));

			this.servicios.createCategoria(formData)
			.then(message =>{
				alert(message);
			});
		}
		
	}
	onSubmitEdit(category){

	}
	

	editar(category){
		this.isEditar = true;
		this.categoryValid = category;

	}
	cancelar(category){
		this.isEditar = false;

	}

	eliminar(category){
		this.isEditar = false;

	}

	categoryForm: NgForm;

	@ViewChild('categoryForm') currentForm: NgForm;

	ngAfterViewChecked() {
		this.formChanged();
	}

	formChanged() {
		if (this.currentForm === this.categoryForm) { return; }
		this.categoryForm = this.currentForm;
		if (this.categoryForm) {
			this.categoryForm.valueChanges
			.subscribe(data => this.onValueChanged(data));
		}
	}	

	onValueChanged(data?: any) {

		if (!this.categoryForm) { return; }
		const form = this.categoryForm.form;
		
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
		'nombre': ''
	};

	validationMessages = {
		'nombre': {
			'required': 'Nombre'	
		}		
	};	
	
}
class Categoria{
	constructor(
		public nombre:string,
		public color: string,
		public keym_car: string,
		public id_usuario_car: string,
		public id_caracteristica: string,
		) {  }
}

class Caracteristica{
	constructor(	
		public keym_car: string,
		public id_usuario_car: string,
		public id_caracteristica: string,
		) {  }
}