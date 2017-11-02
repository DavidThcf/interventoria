import { Component, OnInit}  from '@angular/core';
import { NgModule } 		 from '@angular/core';
import { Router }            from '@angular/router';
import { ServiciosGlobales } from '../services/servicios-globales';
import { Servicios }         from '../services/servicios';
import { DecimalPipe } from '@angular/common';

@Component({
	selector: 'proyecto-panel',
	templateUrl: './proyecto-panel.component.html',
	styleUrls: [ './proyecto-panel.component.css' ]
})

export class ProyectoPanel implements OnInit{

	projectList : any = [];

	constructor(
		private serviciog:ServiciosGlobales,
		private router:Router,
		private servicios: Servicios	  
		){ };

	ngOnInit():void { 
		
		var id:number= Number(this.serviciog.usuario.id_usuario);
		if([3,4,6,7,8,9,10].indexOf(id) !== -1 ){
			
			this.servicios.getProyecto( [5 , this.serviciog.usuario.id_usuario ] + '')
			.then(cadena => {
				this.serviciog.proyecto = cadena;
				this.projectList = cadena;
			});
		}
		else if(this.serviciog.usuario){
			this.servicios.getProyecto(this.serviciog.usuario.id_usuario + '')
			.then(cadena => {
				this.serviciog.proyecto = cadena
				this.projectList = cadena;
			});
		}
	}	

	entrar(proyect:any){
		//alert(JSON.stringify(proyect));
		this.serviciog.proyecto = proyect;	
		let link = ['actividades'];
		this.router.navigate(link);
	}

	btnSearchPrj(value : string){
		//alert(JSON.stringify(this.serviciog.proyecto));
		this.projectList = this.serviciog.proyecto.filter(item  => {
				return (item.nom_pro + item.descripcion).toLowerCase().replace(/ /g,'').indexOf(value.replace(/ /g,'').toLowerCase()) !== -1;
			});
	}
}