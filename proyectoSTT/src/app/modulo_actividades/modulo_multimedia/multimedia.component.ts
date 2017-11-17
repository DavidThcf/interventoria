
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

	archivoShow: any;
	urlShow: SafeResourceUrl;
	url: string;

	/* variables para filtro de archivos */
	item: any; //variable para cada subactividad
	item2: any; //variable para cada subactividad
	item3: any; //variable para cada subactividad
	subActivity: any[] = []; //Arreglo para las subactividades
	subActivity2: any[] = []; //Arreglo para las subactividades
	subActivity3: any[] = []; //Arreglo para las subactividades
	flagResg: boolean = false;
	flagBene: boolean = false;

	vshowFilter: boolean = false;
	/*-------------------  */

	//current_url: SafeResourceUrl;
	//tipo:string = "img";

	constructor(
		private serviciog: ServiciosGlobales,
		private router: Router,
		private servicios: Servicios,
		public sanitizer: DomSanitizer
	) { };
	/* inicia todo  */
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
		formData.append('tipoAct', this.serviciog.actividad.tipo);

		this.servicios.getMultimedia(formData)
			.then(imagenes => {
				if (imagenes) {
					//alert(JSON.stringify(imagenes))
					var cad = JSON.stringify(imagenes);
					// cad = cad.replace(/=/g,'/');
					alert(JSON.stringify(imagenes));
					if(this.serviciog.actividad.tipo == 'Proyecto'){
						this.serviciog.imagenes = imagenes;
					}
					
					else if (this.serviciog.actividad.tipo == 'Beneficiario' || this.serviciog.actividad.tipo == 'Capitulo' || this.serviciog.actividad.tipo == 'Actividad') {
						this.serviciog.imagenes = imagenes[0].getarchivos;
					}
					alert(JSON.stringify(this.serviciog.imagenes));
					//this.serviciog.imagenes = imagenes;
				} else {
					this.serviciog.imagenes = []
				}
			});
		this.searchSubActivity(this.serviciog.actividad.keym, this.serviciog.actividad.id_usuario, this.serviciog.actividad.id_caracteristica, this.serviciog.actividad.tipo)
	}
	/* ----------- */

	/* busca las subactividades */
	searchSubActivity(keym, id_usuario, id_caracteristica, tipo) {
		this.servicios.getActividad(keym, id_usuario, id_caracteristica)
			.then(actividad => {
				if (actividad) {
					//alert(tipo)
					if (tipo == 'Provincia') {
						this.item = actividad[0];

						this.cambio2();

						this.subActivity = [];
						this.subActivity = actividad;
					} else if (tipo == 'Municipio') {
						this.item2 = actividad[0];

						this.cambio3();

						this.subActivity2 = [];
						this.subActivity2 = actividad;
					} else {
						this.item3 = actividad[0];
						this.subActivity3 = [];
						this.subActivity3 = actividad;
					}

					//alert(JSON.stringify(this.subActivity))
					//this.serviciog.axActividades = actividad;
				}
			});
	}
	/* ------------ */

	checked(imagen) {
		// var img = imagen;

		imagen.ext = !imagen.ext;
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
		formData.append('tipoAct', this.serviciog.actividad.tipo);

		this.servicios.getMultimedia(formData)
			.then(imagenes => {
				if (imagenes) {
					this.serviciog.imagenes = imagenes
				} else {
					this.serviciog.imagenes = []
				}
			})
	}

	/*  */
	cambio2() {
		this.flagResg = true;
		this.searchSubActivity(this.item.keym, this.item.id_usuario, this.item.id_caracteristica, this.item.tipo);
		//this.item = null; 
	}

	cambio3() {
		this.flagBene = true;
		this.searchSubActivity(this.item2.keym, this.item2.id_usuario, this.item2.id_caracteristica, this.item2.tipo);
		//this.item = null; 
	}

	showFilter() {
		this.vshowFilter = !this.vshowFilter;
		//alert(this.vshowFilter)
	}

	getImagen() {
		//alert(JSON.stringify(this.item3));
		this.serviciog.imagenes = []
		var formData = new FormData();

		var keym = this.item3.keym;
		var id_caracteristica = this.item3.id_caracteristica;
		var id_usuario = this.item3.id_usuario;

		var tipo = 'img';
		var id = this.serviciog.usuario;
		// alert(id);

		formData.append('keym', keym);
		formData.append('id_caracteristica', id_caracteristica);
		formData.append('id_usuario', id_usuario);
		formData.append('tipo', tipo);
		//this.serviciog.actividad.tipo
		formData.append('tipoAct', 'Beneficiario');


		this.servicios.getMultimedia(formData)
			.then(imagenes => {
				//alert(JSON.stringify(imagenes));
				if (imagenes) {
					
					//var cad = JSON.stringify(imagenes);
					// cad = cad.replace(/=/g,'/');

					if(this.serviciog.actividad.tipo == 'Proyecto')
						this.serviciog.imagenes = imagenes;
					else{
						this.serviciog.imagenes = imagenes[0].getarchivos;
						alert(JSON.stringify(this.serviciog.imagenes));
					}
				} else {
					this.serviciog.imagenes = []
				}
			});
	}
	/*  */
	envioCambios() {
		this.isMapSelected = false;
		this.isRepSelected = false;
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
		// alert('aaaaaaaaaaa >>>>>>'+ this.imagenEditView.length);
		if (this.imagenEditView.length > 0) {
			// alert(JSON.stringify(this.imagenEditView))
			var formData = new FormData(); /* variable que contendra todos los datos a enviarse al server */
			formData.append("img_edit", JSON.stringify(this.imagenEditView));/* se carga formData  */
			formData.append("tipo_car", this.serviciog.actividad.tipo);/* se carga el tipo de la caracteristica/actividad  */
			//info de la caracteristica / actividad actual
			formData.append('keym', keym);
			formData.append('id_caracteristica', id_caracteristica);
			formData.append('id_usuario', id_usuario);
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
		}, 5000);
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
			element.ext  = true;
			this.imagenEditView.push(element);
		});
	}

	desSelAll() {
		this.serviciog.imagenes.forEach(element => {
			element.ext = false;
			this.imagenEditView.push(element);
		});
	}

}



