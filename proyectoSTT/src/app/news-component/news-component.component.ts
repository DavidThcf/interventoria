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
	imagenView : any[] = []; //arreglo para imagenes vistas
	
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
							this.imagenView = []; //arreglo para imagenes vistas
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
					this.serviciog.novedades = novedades;
				}
			});
			break;
		}

	}

	changeOption(option) {
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
							 this.imagenView = [];
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
		if(!state)
			this.serviciog.isModalRemark = true;
		this.novedad = novedad;
		var formData = new FormData();
		var dat: any = {};
		dat.id_observacion = novedad.id_observacion;
		dat.stateApproval = state;
		formData.append('novedad', JSON.stringify(dat));
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
			})
	}

	approvalPercentage(novedad: any, state: boolean) {
		if(!state)
			this.serviciog.isModalRemark = true;
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
			})
	}

	regMarkNovedad() {
		this.serviciog.isModalRemark = false;
		var dat = {
			keym: this.novedad.keym,
			id_caracteristica: this.novedad.id_caracteristica,
			id_usuario: this.novedad.id_usuario,
			usu_observacion: this.serviciog.usuario.id_usuario,
			observacion: this.cad
		};
		var formData = new FormData();
		formData.append("remark", JSON.stringify(dat));

		this.servicios.regRemarks(formData)
		.then(message => {
				
				
				//Envio de mensaje por socket
				
				this.serviciog.socket.emit('sendSocketNovedad',{
					'userSend':message,
					'tipo':'rec'
				})
				
			})
	}

	goActivity(subActividad) {
		
		console.log('ACTIVIDAD GO');
		console.log(subActividad);
		this.serviciog.proyecto = subActividad;
		this.serviciog.actividad = subActividad;
		this.serviciog.ax_actividad = subActividad;
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
				this.serviciog.activityList = actividad;
			}
		});
	}

	/* checke view */
	checked(imagen) {
		imagen.visto = !imagen.visto;
		var sss = this.imagenView.findIndex(x => x === imagen);
		if (sss >= 0) {
			this.imagenView.splice(sss, 1)
		} else {
			this.imagenView.push(imagen);
		}
	}

	selAll() {
		this.serviciog.novedades.forEach(element => {
			element.visto = !element.visto;
			this.imagenView.push(element);
		});
	}

	sendChangeView(){
		if (this.imagenView.length > 0) {
			var formData = new FormData(); /* variable que contendra todos los datos a enviarse al server */
			formData.append("img_edit", JSON.stringify(this.imagenView));/* se carga formData  */
			this.servicios.updateImageView(formData) /* llamdo al metodo que se conectara con el server */
			.then(x => {
				if (x) {
					if(this.serviciog.messageList['files'] > 0){
						this.serviciog.totalMessage = this.serviciog.totalMessage - this.imagenView.length;
						this.serviciog.messageList['files'] = this.serviciog.messageList['files'] - this.imagenView.length;
					}
					this.serviciog.alert_message = 'Cambios Actualizados';
					this.serviciog.hidden = true;
						

						this.serviciog.novedades = []; /* arreglo que contendra todos los archivos a traer */
						var formData1 = new FormData(); /* variable que contendra todos los datos a enviarse al server */
						formData1.append("id_usuario", this.serviciog.usuario.id_usuario + "");/* se carga formData  */
						this.servicios.getDataNewChangeFile(formData1) /* llamdo al metodo que se conectara con el server */
						.then(files => {
							if (files) {
								this.imagenView = [];
								this.serviciog.novedades = files;
							}
						});
					}
				});
		} else {
			this.serviciog.alert_message = 'No se puede actualizar';
			this.serviciog.hidden = true;
		}
		setTimeout(() => {
			this.serviciog.hidden = false;
		}, 5000);
	}

	closeModal(){
		this.serviciog.isModalRemark = false;
	}
	/* -------------- */
}