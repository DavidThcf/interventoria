
import { Component, OnInit, Input}  from '@angular/core';
import { NgModule } 		 from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { ServiciosGlobales } from '../../services/servicios-globales';
import { Servicios }         from '../../services/servicios';


@Component({
	selector: 'app-assign-user',
	templateUrl: './assign-user.component.html',
	styleUrls: ['./assign-user.component.css']
})
export class AssignUserComponent implements OnInit {

	@Input() usuarios:any = [];
	@Input('act') actividad:any ;
	ids : string;


	constructor(
		private serviciog:ServiciosGlobales,
		private servicios: Servicios	) { }

	ngOnInit() {
		this.ids = this.actividad.keym+'-'+this.actividad.id_caracteristica+'-'+this.actividad.id_usuario;
	}
	

	assignUser(usuario : any ){
		//alert(JSON.stringify(this.actividad));
		this.actividad.usr_nom = usuario.nombre;
		this.actividad.usr_ape = usuario.apellido;
		this.actividad.e_mail = usuario.e_mail;
		var formData = new FormData();
		formData.append("keym","0");
		formData.append("usuario",JSON.stringify(usuario));
		formData.append("caracteristica",JSON.stringify(this.actividad));
		this.servicios.assignActivityToUser(formData)
		.then(message =>{
			alert(JSON.stringify(message));

		})
	}



}
