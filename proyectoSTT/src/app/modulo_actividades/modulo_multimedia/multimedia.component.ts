
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

	pic : string = '';
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
		formData.append('tipoCar', this.serviciog.actividad.tipo);

		this.servicios.getMultimedia(formData)
			.then(imagenes => {
				if (imagenes) {

					
					if(this.serviciog.actividad.tipo == 'Proyecto' || this.serviciog.actividad.tipo == 'Provincia' || this.serviciog.actividad.tipo == 'Municipio' || this.serviciog.actividad.tipo == 'Resguardo' ){
						this.serviciog.imagenes = imagenes;
					}
					
					else if (this.serviciog.actividad.tipo == 'Beneficiario' || this.serviciog.actividad.tipo == 'Capitulo' || this.serviciog.actividad.tipo == 'Actividad') {
						var img = imagenes[0].getarchivos;

						img = img.sort((a,b)=>{
							if(a.fecha_creacion < b.fecha_creacion) return -1;
							if(a.fecha_creacion > b.fecha_creacion) return 1;
							return 0;
						});
						this.serviciog.imagenes = img;
					}
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

				}
			});
	}
	/* ------------ */

	checked(imagen) {

		imagen.ext = !imagen.ext;
		imagen.visible_map = !imagen.visible_map;
		var sss = this.imagenEditView.findIndex(x => x === imagen);
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

		formData.append('keym', keym);
		formData.append('id_caracteristica', id_caracteristica);
		formData.append('id_usuario', id_usuario);
		formData.append('tipo', this.serviciog.tipo);
		formData.append('tipoAct', this.serviciog.actividad.tipo);
		formData.append('tipoCar', this.serviciog.actividad.tipo);

		this.servicios.getMultimedia(formData)
			.then(imagenes => {
				if (imagenes) {
					var cad = JSON.stringify(imagenes);
					if(this.serviciog.actividad.tipo == 'Proyecto' || this.serviciog.actividad.tipo == 'Provincia' || this.serviciog.actividad.tipo == 'Municipio' || this.serviciog.actividad.tipo == 'Resguardo' ){
						this.serviciog.imagenes = imagenes;
					}
					
					else if (this.serviciog.actividad.tipo == 'Beneficiario' || this.serviciog.actividad.tipo == 'Capitulo' || this.serviciog.actividad.tipo == 'Actividad') {
						this.serviciog.imagenes = imagenes[0].getarchivos;
					}
				} else {
					this.serviciog.imagenes = []
				}
			})
	}

	/*  */
	cambio2() {
		this.flagResg = true;
		this.searchSubActivity(this.item.keym, this.item.id_usuario, this.item.id_caracteristica, this.item.tipo);
	}

	cambio3() {
		this.flagBene = true;
		this.searchSubActivity(this.item2.keym, this.item2.id_usuario, this.item2.id_caracteristica, this.item2.tipo);
	}

	showFilter() {
		this.vshowFilter = !this.vshowFilter;
	}

	getImagen() {
		this.serviciog.imagenes = []
		var formData = new FormData();

		var keym = this.item3.keym;
		var id_caracteristica = this.item3.id_caracteristica;
		var id_usuario = this.item3.id_usuario;

		var tipo = 'img';
		var id = this.serviciog.usuario;

		formData.append('keym', keym);
		formData.append('id_caracteristica', id_caracteristica);
		formData.append('id_usuario', id_usuario);
		formData.append('tipo', tipo);
		formData.append('tipoAct', 'Beneficiario');
		formData.append('tipoCar', 'Beneficiario');


		this.servicios.getMultimedia(formData)
			.then(imagenes => {
				if (imagenes) {
					
					if(this.serviciog.actividad.tipo == 'Proyecto')
						this.serviciog.imagenes = imagenes;
					else{
						this.serviciog.imagenes = imagenes[0].getarchivos;
					}
					this.vshowFilter = !this.vshowFilter;
				} else {
					this.serviciog.imagenes = []
				}
			});
		
	}
	/*  */
	envioCambios() {
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
		if (this.imagenEditView.length > 0) {
			var formData = new FormData(); /* variable que contendra todos los datos a enviarse al server */
			formData.append("img_edit", JSON.stringify(this.imagenEditView));/* se carga formData  */
			formData.append("tipo_car", this.serviciog.actividad.tipo);/* se carga el tipo de la caracteristica/actividad  */
			//info de la caracteristica / actividad actual
			formData.append('publicar',this.isMapSelected +'');
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
		this.isMapSelected = false;
		this.isRepSelected = false;
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

	mostrarModal(){
		this.serviciog.isModalImg = true;
	}

	delImage(image : any){
		var cad =JSON.stringify(image);
		var formData = new FormData();
		formData.append('file', cad);
		this.servicios.delFile(formData).then(x=>{
			if(x){
				this.serviciog.alert_message = 'Archivo eliminado!!!';
				this.serviciog.hidden = true;
				setTimeout(() => {
					this.serviciog.hidden = false;
				}, 5000);
			}
			
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
			


			for(var i = this.serviciog.imagenes.length - 1; i >= 0; i--) {
				if(this.serviciog.imagenes[i] === image) {
				   this.serviciog.imagenes.splice(i, 1);
				}
			}

		});
	}

	saveEdit(image : any,txt : string){
		image.titulo = txt;
		var cad =JSON.stringify(image);
		var formData = new FormData();
		formData.append('file', cad);
		this.servicios.saveEdit(formData).then(x=>{
			if(x){
				this.serviciog.alert_message = 'Archivo Editado!!!';
				this.serviciog.hidden = true;
				setTimeout(() => {
					this.serviciog.hidden = false;
				}, 2000);
			}
			

			for(var i = this.serviciog.imagenes.length - 1; i >= 0; i--) {
				if(this.serviciog.imagenes[i] === image) {
					this.serviciog.imagenes[i].titulo = txt; 
					this.serviciog.imagenes[i].edit = false;
				}
			}

		});
	}
}



