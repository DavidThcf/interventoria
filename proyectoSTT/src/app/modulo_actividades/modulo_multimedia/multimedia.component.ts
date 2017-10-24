
import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { Router } from '@angular/router';
import { ServiciosGlobales } from '../../services/servicios-globales';
import { Servicios } from '../../services/servicios';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'multimedia',
	templateUrl: './multimedia.component.html',
	styleUrls: ['./multimedia.component.css']
})

export class Multimedia implements OnInit {

	isMapSelected: boolean = false;
	isRepSelected: boolean = false;
	imagenEditView: any[] = []; // arreglo imagenes a agregar al reporte
	imagenEditViewDel: any[] = []; //arreglo imagenes a eliminar del reporte
	archivoShow: any;
	urlShow: SafeResourceUrl;
	url: string;

	//current_url: SafeResourceUrl;
	//tipo:string = "img";

	constructor(
		private serviciog: ServiciosGlobales,
		private router: Router,
		private servicios: Servicios,
		public sanitizer: DomSanitizer
	) { };

	ngOnInit(): void {
		this.serviciog.imagenes = []
		var formData = new FormData();


		if (this.serviciog.actividad == null) {
			var keym = this.serviciog.proyecto.keym;
			var id_caracteristica = this.serviciog.proyecto.id_caracteristica;
			var id_usuario = this.serviciog.proyecto.id_usuario;
		}
		else if (this.serviciog.actividad) {
			var keym = this.serviciog.actividad.keym;
			var id_caracteristica = this.serviciog.actividad.id_caracteristica;
			var id_usuario = this.serviciog.actividad.id_usuario;
		}
		else {
			var keym = this.serviciog.proyecto.keym;
			var id_caracteristica = this.serviciog.proyecto.id_caracteristica;
			var id_usuario = this.serviciog.proyecto.id_usuario;
		};
		var tipo = 'img';
		var id = this.serviciog.usuario;
		// alert(id);

		formData.append('keym', keym);
		formData.append('id_caracteristica', id_caracteristica);
		formData.append('id_usuario', id_usuario);
		formData.append('tipo', tipo);
		

		this.servicios.getMultimedia(formData)
			.then(imagenes => {
				if (imagenes) {
					//alert(JSON.stringify(imagenes))
					var cad = JSON.stringify(imagenes);
					// cad = cad.replace(/=/g,'/');

					this.serviciog.imagenes = imagenes;
				} else {
					this.serviciog.imagenes = []
				}
			});
	}

	checked(imagen) {
		// var img = imagen;

		imagen.reporte = !imagen.reporte;
		var sss = this.imagenEditView.findIndex(x => x === imagen);
		//alert(sss);
		if (sss >= 0) {
			this.imagenEditView.splice(sss, 1)
		} else {
			this.imagenEditView.push(imagen);
		}
	}

	show(imagen) {
		this.archivoShow = imagen;
		this.url = "http://docs.google.com/gview?url=" + this.archivoShow.val_configuracion + this.archivoShow.srcServ + this.archivoShow.nombre_archivo + "&embedded=true";
		this.urlShow = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
	}

	cambio($event) {
		this.serviciog.imagenes = [];
		//alert("cambio " + JSON.stringify(this.tipo));
		var formData = new FormData();
		//alert(JSON.stringify(this.serviciog.actividad));
		if (this.serviciog.actividad == null) {
			var keym = this.serviciog.proyecto.keym;
			var id_caracteristica = this.serviciog.proyecto.id_caracteristica;
			var id_usuario = this.serviciog.proyecto.id_usuario;
		}
		else if (this.serviciog.actividad) {
			var keym = this.serviciog.actividad.keym;
			var id_caracteristica = this.serviciog.actividad.id_caracteristica;
			var id_usuario = this.serviciog.actividad.id_usuario;
		}
		else {
			var keym = this.serviciog.proyecto.keym;
			var id_caracteristica = this.serviciog.proyecto.id_caracteristica;
			var id_usuario = this.serviciog.proyecto.id_usuario;
		};
		var tipo = 'img';

		formData.append('keym', keym);
		formData.append('id_caracteristica', id_caracteristica);
		formData.append('id_usuario', id_usuario);
		formData.append('tipo', this.serviciog.tipo);

		this.servicios.getMultimedia(formData)
			.then(imagenes => {
				if (imagenes) {
					this.serviciog.imagenes = imagenes
				} else {
					this.serviciog.imagenes = []
				}
			})
	}

	envioCambios() {
		this.isMapSelected = false;
		this.isRepSelected = false;
		// alert('aaaaaaaaaaa >>>>>>'+ this.imagenEditView.length);
		if (this.imagenEditView.length > 0) {
			// alert(JSON.stringify(this.imagenEditView))
			var formData = new FormData(); /* variable que contendra todos los datos a enviarse al server */
			formData.append("img_edit", JSON.stringify(this.imagenEditView));/* se carga formData  */
			this.servicios.updateImageEditView(formData) /* llamdo al metodo que se conectara con el server */
				.then(x => {
					if (x) {
						this.serviciog.alert_message = 'Cambios Actualizados';
						this.serviciog.hidden = true;
					}
				});

		} else {
			this.serviciog.alert_message = 'No se puede actualizar';
			this.serviciog.hidden = true;
		}
		setTimeout(() => {
			this.serviciog.hidden = false;
		},5000);
	}

	btnAddImgMap() {
		this.imagenEditView = [];
		this.isMapSelected = true;
	}

	btnAddImgRep() {
		this.imagenEditView = [];
		this.isRepSelected = true;
	}

	cancelar() {
		this.isMapSelected = false;
		this.isRepSelected = false;
	}

	selAll() {
		this.serviciog.imagenes.forEach(element => {
			element.reporte = true;
			this.imagenEditView.push(element);
		});
	}

	desSelAll() {
		this.serviciog.imagenes.forEach(element => {
			element.reporte = false;
			this.imagenEditView.push(element);
		});
	}

}



