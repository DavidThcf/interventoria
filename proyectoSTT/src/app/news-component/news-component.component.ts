import { Component, OnInit } from '@angular/core';
import { ServiciosGlobales } from '../services/servicios-globales';
import { Servicios } from '../services/servicios';
import { RemarksComponent } from '../modulo_actividades/remarks/remarks.component';
import { ServiciosGlobalesActividades } from 'app/modulo_actividades/servicios-globales-actividades'; 

import { Router }            from '@angular/router';

@Component({
	selector: 'app-news-component',
	templateUrl: './news-component.component.html',
	styleUrls: ['./news-component.component.css']

})
export class NewsComponentComponent implements OnInit {
	pic : string = '';
	
	novedad: any;
	archivos: any;
	cad: string = '';
	tipo: string = "img";
	
	constructor(private serviciog: ServiciosGlobales,
		private servicios: Servicios,
		private router:Router,		
		private serviGloAct:ServiciosGlobalesActividades) { }

	ngOnInit() {
		this.serviciog.novedades = [];
		
		
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
							//alert(JSON.stringify(files));
							//alert(JSON.stringify(files));
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
							//alert(JSON.stringify(novedades));
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

	changeOption(option) {
		//alert(option);
		switch (option) {
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
							//alert(JSON.stringify(files));
							//alert(JSON.stringify(files));
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
							//alert(JSON.stringify(novedades));
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

	getMultimediaNovedad(novedad) {
		this.novedad = novedad;
		this.getArchivo();
	}

	cambio($event) {
		this.getArchivo();
	}

	getArchivo() {
		this.archivos = [];
		var formData = new FormData();

		formData.append('keym', this.novedad.keym);
		formData.append('id_caracteristica', this.novedad.id_caracteristica);
		formData.append('id_usuario', this.novedad.id_usuario);
		formData.append('tipo', this.tipo);

		this.servicios.getFilesNovedades(formData)
			.then(archivos => {
				if (archivos) {
					this.archivos = archivos
				}
			})

	}

	approvalObservation(novedad: any, state: boolean) {
		this.novedad = novedad;
		var formData = new FormData();
		var dat: any = {};
		dat.id_observacion = novedad.id_observacion;
		dat.stateApproval = state;
		formData.append('novedad', JSON.stringify(dat));
		alert(JSON.stringify(dat));
		this.servicios.approvalObservation(formData)
			.then(message => {
				if(this.serviciog.messageList['observations'] > 0){
					this.serviciog.totalMessage --;
					this.serviciog.messageList['observations']--;
				}
				
				for (var i = 0; i < this.serviciog.novedades.length; i++) {
					if (this.serviciog.novedades[i].id_observacion == this.novedad.id_observacion) {
						this.serviciog.novedades.splice(i, 1);
						return this.serviciog.novedades;
					}
				}
				//this.serviciog.messageList['observations']--;
			})
	}

	approvalPercentage(novedad: any, state: boolean) {
		this.novedad = novedad;
		var formData = new FormData();
		novedad.stateApproval = state;
		formData.append('novedad', JSON.stringify(novedad));
		this.servicios.approvalPercentage(formData)
			.then(message => {
				if(this.serviciog.messageList['percentage']){
					this.serviciog.totalMessage --;
					this.serviciog.messageList['percentage'] --;
				}
				
				for (var i = 0; i < this.serviciog.novedades.length; i++) {
					if (this.serviciog.novedades[i].keym == this.novedad.keym &&
						this.serviciog.novedades[i].id_caracteristica == this.novedad.id_caracteristica &&
						this.serviciog.novedades[i].id_usuario == this.novedad.id_usuario) {
						this.serviciog.novedades.splice(i, 1);
						return this.serviciog.novedades;
					}
				}
				//this.serviciog.messageList['percentage']--;
			})
	}

	regMarkNovedad() {

		//alert(this.serviciog.usuario.id_usuario+'-'+this.cad);
		var dat = {
			keym: this.novedad.keym,
			id_caracteristica: this.novedad.id_caracteristica,
			id_usuario: this.novedad.id_usuario,
			usu_observacion: this.serviciog.usuario.id_usuario,
			observacion: this.cad
		};
		//alert(JSON.stringify(dat)+'-'+this.serviciog.usuario.id_usuario+'-'+this.cad);
		var formData = new FormData();
		formData.append("remark", JSON.stringify(dat));

		this.servicios.regRemarks(formData)
			.then(message => {
				//alert(JSON.stringify(message));
				/*for (var i = 0; i < this.serviciog.novedades.length; i++) {
					if (this.serviciog.novedades[i].keym == this.novedad.keym &&
						this.serviciog.novedades[i].id_caracteristica == this.novedad.id_caracteristica &&
						this.serviciog.novedades[i].id_usuario == this.novedad.id_usuario) {
						this.serviciog.novedades.splice(i, 1);
						return this.serviciog.novedades;
					}
				}*/
				
				//Envio de mensaje por socket
				
				this.serviciog.socket.emit('sendSocketNovedad',{
					'userSend':message,
					'tipo':'rec'
				  })
				
				//this.serviGloAct.remarks = message;
			})
	}

	goActivity(subActividad) {
		
		//alert(JSON.stringify(subActividad));
		this.serviciog.proyecto = subActividad;
		//this.serviciog.recomendacion = subActividad;
		//alert(JSON.stringify(this.serviciog.recomendacion));
		let link = ['actividades'];
		this.router.navigate(link);


		this.serviciog.tree_name.push(subActividad.nom_act);
		this.serviGloAct.tipo2 = 'Beneficiario';

		this.serviGloAct.lastActividad.push(this.serviciog.actividad);
		
		this.serviciog.actividades = [];
		this.serviciog.actividad = subActividad;
		this.serviciog.isSubActivity = subActividad;
		
		var keym = subActividad.keym;
		var id_usuario = subActividad.id_usuario;
		var id_caracteristica = subActividad.id_caracteristica;

		this.serviciog.titulo = subActividad.nombre;
		this.serviGloAct.actOpt = 1;

		this.servicios.getActividad(keym, id_usuario, id_caracteristica)
			.then(actividad => {
				if (actividad) {
					this.serviciog.actividades = actividad;
					this.serviciog.axActividades = actividad;

				}
			});
	}
}