import { Component, OnInit } from '@angular/core';
import { ServiciosGlobales } from '../services/servicios-globales';
import { Servicios } from '../services/servicios';
import { RemarksComponent } from '../modulo_actividades/remarks/remarks.component';

@Component({
	selector: 'app-news-component',
	templateUrl: './news-component.component.html',
	styleUrls: ['./news-component.component.css']

})
export class NewsComponentComponent implements OnInit {
	pic : string = '';
	novedades: any;
	novedad: any;
	archivos: any;
	cad: string = '';
	tipo: string = "img";
	opcion: string = "por";
	constructor(private serviciog: ServiciosGlobales,
		private servicios: Servicios) { }

	ngOnInit() {
		this.novedades = [];
		console.log(this.serviciog.usuario);
		var formData = new FormData();
		formData.append("id_usuario", this.serviciog.usuario.id_usuario + "");
		this.servicios.getDataNewChangePercent(formData)
			.then(novedades => {
				if (novedades) {
					console.log(novedades);
					this.novedades = novedades;
				}
			});
	}

	changeOption(option) {
		//alert(option);
		switch (option) {
			case 'por':
				this.novedades = [];
				var formData = new FormData();
				formData.append("id_usuario", this.serviciog.usuario.id_usuario + "");
				this.servicios.getDataNewChangePercent(formData)
					.then(novedades => {
						if (novedades) {
							console.log(novedades);
							this.novedades = novedades;
						}
					});
				break;
			/* se realiza en caso de que la opcion sea multimedia */
			case 'mul':
				this.novedades = []; /* arreglo que contendra todos los archivos a traer */
				var formData = new FormData(); /* variable que contendra todos los datos a enviarse al server */
				formData.append("id_usuario", this.serviciog.usuario.id_usuario + "");/* se carga formData  */
				this.servicios.getDataNewChangeFile(formData) /* llamdo al metodo que se conectara con el server */
					.then(files => {
						if (files) {
							//alert(JSON.stringify(files));
							//alert(JSON.stringify(files));
							 console.log(files);
							this.novedades = files;
						}
					});
				break;
			/* end multimedia */
			case 'rec':
				this.novedades = [];
				var formData = new FormData();
				formData.append("id_usuario", this.serviciog.usuario.id_usuario + "");
				this.servicios.getDataNewRemarks(formData)
					.then(novedades => {
						if (novedades) {
							//alert(JSON.stringify(novedades));
							console.log(novedades);
							this.novedades = novedades;
						}
					});

				break;
			case 'obs':
				this.novedades = [];
				var formData = new FormData();
				formData.append("id_usuario", this.serviciog.usuario.id_usuario + "");
				this.servicios.getDataNewObservations(formData)
					.then(novedades => {
						if (novedades) {
							console.log(novedades);
							this.novedades = novedades;
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
				
				for (var i = 0; i < this.novedades.length; i++) {
					if (this.novedades[i].id_observacion == this.novedad.id_observacion) {
						this.novedades.splice(i, 1);
						return this.novedades;
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
				
				for (var i = 0; i < this.novedades.length; i++) {
					if (this.novedades[i].keym == this.novedad.keym &&
						this.novedades[i].id_caracteristica == this.novedad.id_caracteristica &&
						this.novedades[i].id_usuario == this.novedad.id_usuario) {
						this.novedades.splice(i, 1);
						return this.novedades;
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
				/*for (var i = 0; i < this.novedades.length; i++) {
					if (this.novedades[i].keym == this.novedad.keym &&
						this.novedades[i].id_caracteristica == this.novedad.id_caracteristica &&
						this.novedades[i].id_usuario == this.novedad.id_usuario) {
						this.novedades.splice(i, 1);
						return this.novedades;
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

}