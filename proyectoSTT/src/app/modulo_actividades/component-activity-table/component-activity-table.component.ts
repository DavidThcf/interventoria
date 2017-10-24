
import { Component, OnInit}  from '@angular/core';
import { NgModule } 		 from '@angular/core';

import { Router }            from '@angular/router';
import { ServiciosGlobales } from '../../services/servicios-globales';
import { ServiciosGlobalesActividades} from '../servicios-globales-actividades'
import { Servicios }         from '../../services/servicios';



@Component({
	selector: 'activity-table',
	templateUrl: './component-activity-table.component.html',
	styleUrls: ['./component-activity-table.component.css']
})
export class ActivityTableComponent implements OnInit{
	subActivity:any = [];
	isSubActivity:any = [];
	usuarios:any = [];
	axUsers : any = [];
	typeUser: string = 'sup';
	flag : boolean=false;
	x:string;
	constructor(
		private serviciog:ServiciosGlobales,
		private serviGloAct:ServiciosGlobalesActividades,
		private router:Router,
		private servicios: Servicios	  
		){ };

	ngOnInit():void {
		//alert(JSON.stringify(this.serviciog.usuario.tipo_usuario ));
		this.subActivity = [];
		var keym = this.serviciog.actividad.keym;
		var id_usuario = this.serviciog.actividad.id_usuario;
		var id_caracteristica = this.serviciog.actividad.id_caracteristica;		

		this.servicios.getActividad(keym,id_usuario,id_caracteristica)
		.then(actividad =>{				
			if(actividad){
				this.subActivity = actividad;
				//alert(JSON.stringify(actividad));
				this.serviciog.axActividades = actividad;
				
			}
		});
	}

	entrarAct(subActividad){

		this.serviciog.tree_name.push(subActividad.nom_act);
		this.serviGloAct.tipo2 = this.serviciog.tipos_act[this.serviciog.tipos_act.indexOf(subActividad.tipo)+1];

		this.serviGloAct.lastActividad.push(this.serviciog.actividad);
		this.subActivity = [];
		this.serviciog.actividades = [];
		this.serviciog.actividad = subActividad;
		this.serviciog.isSubActivity = subActividad;
		var keym = subActividad.keym;
		var id_usuario = subActividad.id_usuario;
		var id_caracteristica = subActividad.id_caracteristica;
		
		this.serviciog.titulo = subActividad.nom_act;
		this.serviGloAct.actOpt= 1;

		this.servicios.getActividad(keym,id_usuario,id_caracteristica)
		.then(actividad => { 
			if(actividad){
				this.serviciog.actividades = actividad;
				this.serviciog.axActividades = actividad;

			}		
		});
	}



	asignarUsuario(actividad : any){
		var usuario = this.serviciog.usuario;
		var formData = new FormData();
		formData.append("keym","0");
		formData.append("usuario",JSON.stringify(usuario));
		formData.append("caracteristica",JSON.stringify(actividad));
		this.servicios.assignActivityToUser(formData)
		.then(message =>{
			alert(JSON.stringify(message));
		})
	}

	filter(text : string){
		//alert(this.serviciog.axActividades[0].id_beneficiario);
		this.subActivity = [];

		if(text.trim() == ''){
			this.subActivity = this.serviciog.axActividades; 	
		}
		else if(this.serviciog.axActividades[0].tipo != 'Beneficiario'){
			//alert('Activity');
			this.subActivity = this.serviciog.axActividades.filter(item => 
				item.nom_act.toLowerCase().indexOf(text.toLowerCase()) !== -1 ||
				item.usr_nom.toLowerCase().indexOf(text.toLowerCase()) !== -1 ||
				item.usr_ape.toLowerCase().indexOf(text.toLowerCase()) !== -1  
				);
		}
		else{
			
			this.subActivity = this.serviciog.axActividades.filter(item => 
				item.usr_nom.toLowerCase().indexOf(text.toLowerCase()) !== -1 ||
				item.usr_ape.toLowerCase().indexOf(text.toLowerCase()) !== -1 ||
				item.nombre.toLowerCase().indexOf(text.toLowerCase()) !== -1 ||
				item.cedula.indexOf(text) !== -1 
				//item.tipo_identificacion.toLowerCase().indexOf(text.toLowerCase()) !== -1 
				);
			//alert('Beneficiario'+JSON.stringify(this.subActivity));
		}


	}

	getUsers(){		
		this.servicios.getUserList(null)
		.then(usuarios => {
			if(usuarios){				
				this.axUsers = usuarios;
			}			
		})
	}

}
