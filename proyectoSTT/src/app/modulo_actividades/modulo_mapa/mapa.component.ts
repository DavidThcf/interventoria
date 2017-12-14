import { Component, ElementRef, NgZone, OnInit, Input } from '@angular/core';

import { NgModule, ViewChild } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { MapsAPILoader } from '@agm/core';

import { Router } from '@angular/router';
import { ServiciosGlobales } from '../../services/servicios-globales';
import { Servicios } from '../../services/servicios';

import { } from 'googlemaps';
import { ServiciosGlobalesActividades } from 'app/modulo_actividades/servicios-globales-actividades';

import { ActividadPanel } from '../actividad-panel.component'

@Component({
	selector: 'mapa',
	templateUrl: './mapa.component.html',
	styleUrls: ['./mapa.component.css']
})

export class Mapa implements OnInit {
	public searchControl: FormControl;
	icon_marker = "";
	lat: number = 0.82438333300000000000;
	lng: number = -77.83935000000000000000;
	zoom: number = 11;
	categorias: any;
	categoria: any;
	http: string = this.serviciog.servidor + "Category/";
	ext: string = ".svg"
	caracteristica: Caracteristica = new Caracteristica('', '', '', '');
	ax_caracteristica: Caracteristica = new Caracteristica('', '', '', '');
	id_categoria: string;

	markers: any = [];
	ax_markers: any = [];

	mark: any;

	@Input() tipo: string = '';

	@ViewChild("search")
	public searchElementRef: ElementRef;

	constructor(
		private serviciog: ServiciosGlobales,
		private router: Router,
		private servicios: Servicios,
		private mapsAPILoader: MapsAPILoader,
		private ngZone: NgZone,
		private serviGloAct:ServiciosGlobalesActividades,
		private actPanel : ActividadPanel
	) { };

	ngOnInit(): void {
		this.searchControl = new FormControl();
		this.buscarLugar();


		if (this.serviciog.actividad == null)
      {
        this.caracteristica.keym_car = this.serviciog.proyecto.keym;
        this.caracteristica.id_caracteristica = this.serviciog.proyecto.id_caracteristica;
        this.caracteristica.id_usuario_car = this.serviciog.proyecto.id_usuario;
        this.caracteristica.tipo = this.serviciog.proyecto.tipo;
	  }
    else if (this.serviciog.actividad)
      {
        this.caracteristica.keym_car = this.serviciog.actividad.keym;
        this.caracteristica.id_caracteristica = this.serviciog.actividad.id_caracteristica;
        this.caracteristica.id_usuario_car = this.serviciog.actividad.id_usuario;
        this.caracteristica.tipo = this.serviciog.actividad.tipo;
	  }
    
    


		//alert('OK'+JSON.stringify(this.serviciog.actividad));

		if (this.serviciog.actividad != null) {
			var formData = new FormData();
			formData.append('caracteristica', JSON.stringify(this.caracteristica));
			this.servicios.getCategoryList(formData)
				.then(categorias => {
					//alert(JSON.stringify('Categorias'+categorias));
					this.categorias = categorias;
					if (categorias[0]) {

						this.categoria = categorias[0];
					}
				});

			var formData = new FormData();
			formData.append('caracteristica', JSON.stringify(this.serviciog.actividad));
			this.servicios.getPointList(formData)
				.then(marcador => {
					//alert(JSON.stringify(marcador));
					if (marcador) {

						this.id_categoria = marcador[0].id_categoria;
						this.markers = marcador;
						this.ax_markers = marcador;
						//alert(JSON.stringify(marcador[0]));
					}
				});
		}
		else {
			//alert(this.tipo);
			this.ax_caracteristica.tipo = this.tipo;
			if (this.tipo == undefined)
				this.ax_caracteristica.tipo = 'Proyecto';
			this.ax_caracteristica.keym_car = '0';
			this.ax_caracteristica.id_caracteristica = this.serviciog.proyecto.id_caracteristica;
			this.ax_caracteristica.id_usuario_car = '5';

			var formData = new FormData();
			formData.append('caracteristica', JSON.stringify(this.caracteristica));
			this.servicios.getCategoryList(formData)
				.then(categorias => {
					//alert(JSON.stringify('Categorias => '+categorias));
					this.categorias = categorias;
					if (categorias[0]) {
						this.categoria = categorias[0];
					}
				});

			var formData = new FormData();
			formData.append('caracteristica', JSON.stringify(this.caracteristica));
			this.servicios.getPointList(formData)
				.then(marcador => {
					//alert("Marcador => "+JSON.stringify(marcador));
					if (marcador) {
						this.id_categoria = marcador[0].id_categoria;
						this.markers = marcador;
						this.ax_markers = marcador;
					}
				});
		}
	}

	btnCat(category) {
		this.categoria = category;
		if (category != undefined) {
			this.markers = this.ax_markers.filter(x => {
				return x.id_categoria == category.id_categoria;
			});

		}
		else {
			this.markers = this.ax_markers;
		}

		//alert(JSON.stringify(this.markers));

	}

	mapClicked($event: any) {
		/*if(!this.mark){
			var marker:any = {				
				keym:this.serviciog.actividad.keym,
				id_caracteristica:this.serviciog.actividad.id_caracteristica,
				id_usuario:this.serviciog.actividad.id_usuario,
				latitud: $event.coords.lat,
				longitud: $event.coords.lng,
				id_categoria:this.categoria.id_categoria,
				url:this.http + this.categoria.id_categoria + '.svg'
			};
			
			var formData = new FormData();
			formData.append('marcador',JSON.stringify(marker));
			this.servicios.regPointMap(formData).
			then(message => {
				if(!message){
					alert("Error al Registrar");
				}else{
					this.markers.push(marker);
					//alert(JSON.stringify(this.markers))
				}
			});
		}else{
			var marker:any = {
				id_marcador:  this.id_categoria,
				keym:this.serviciog.actividad.keym,
				id_caracteristica:this.serviciog.actividad.id_caracteristica,
				id_usuario:this.serviciog.actividad.id_usuario,
				latitud: $event.coords.lat,
				longitud: $event.coords.lng,
				id_categoria:this.categoria.id_categoria
			};
			this.markers.push(marker);
			this.lat= $event.coords.lat;
			this.lng = $event.coords.lng;

			
		}*/
	}
	

	buscarLugar() {
		//this.setCurrentPosition();		
		this.mapsAPILoader.load().then(() => {
			let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {

			});
			autocomplete.addListener("place_changed", () => {
				this.ngZone.run(() => {
					//get the place result
					let place: google.maps.places.PlaceResult = autocomplete.getPlace();

					//verify result
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}
					var marker: any = {
						id_marcador: this.id_categoria,
						keym: this.serviciog.actividad.keym,
						id_caracteristica: this.serviciog.actividad.id_caracteristica,
						id_usuario: this.serviciog.actividad.id_usuario,
						latitud: place.geometry.location.lat(),
						longitud: place.geometry.location.lng(),
						id_categoria: this.categoria.id_categoria
					};

					this.markers.push(marker);
					this.lat = place.geometry.location.lat();
					this.lng = place.geometry.location.lng();

				});
			});
		});
	}

	setCurrentPosition() {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				var marker: any = {
					id_marcador: this.id_categoria,
					keym: this.serviciog.actividad.keym,
					id_caracteristica: this.serviciog.actividad.id_caracteristica,
					id_usuario: this.serviciog.actividad.id_usuario,
					latitud: position.coords.latitude,
					longitud: position.coords.longitude,
					id_categoria: this.categoria.id_categoria
				};

				this.markers.push(marker);
				this.lat = position.coords.latitude;
				this.lng = position.coords.longitude;
			});
		}
	}

	//filtro beneficiarios
	search_ben(beneficiario: string) {
		this.markers = [];		//Vacio los marcadores que tengo
		var ax_arr: any = [];	//arreglo auxiliar de marcadores
		var ax = [];			//arreglo de palabras a buscar 

		//Se crea el arreglo de las palabras a buscar separadas por coma ','
		beneficiario.split(',').forEach(function (x) {
			if (x)
				ax.push(x);//solo se agregan aquellas que sean palabras not null
		});

		//si arreglo contiene palabras realizo fitro
		if (ax.length > 0) {
			//recorro el arreglo de palabras
			for (var i = ax.length - 1; i >= 0; i--) {
				//realizo filtro por nombre y cedula
				ax_arr = this.ax_markers.filter(item => {
					return item.cedula.indexOf(ax[i]) !== -1 ||
						item.nombre.toLowerCase().replace(/ /g, '').indexOf(ax[i].replace(/ /g, '').toLowerCase()) !== -1;
				});
				//si el filtro contiene elemnetos se agregan a los marcadores del mapa
				if (ax_arr.length > 0) {
					for (var j = ax_arr.length - 1; j >= 0; j--) {
						this.markers.push(ax_arr[j]);
					}
				}
			}
		}
		else
			this.markers = this.ax_markers; //sin palabras a buscar solo asigno todos los marcadores
	}

	guardarPunto(marker) {
		/*var formData = new FormData();
		formData.append('marcador',JSON.stringify(marker));
		this.servicios.updatePointMap(formData).
		then(message => {
			if(!message){
				alert("Error al actualizar");
			}else{
				this.markers.push(marker);
			}
		});*/
	}

	entrarAct(subActividad) {
		// alert(JSON.stringify(subActividad));
		this.serviciog.tree_name.push(subActividad.nom_act);
		this.serviGloAct.tipo2 = this.serviciog.tipos_act[this.serviciog.tipos_act.indexOf(subActividad.tipo) + 1];

		this.serviGloAct.lastActividad.push(this.serviciog.actividad);
		
		this.serviciog.actividades = [];
		this.serviciog.actividad = subActividad;
		this.serviciog.ax_actividad = subActividad;
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
				this.actPanel.calcPercentReal();
				this.actPanel.calValueProgra();
		
			});
	}

}


interface Marker {
	keym: string,
	id_caracteristica: string,
	id_usuario: string,
	latitud: number,
	longitud: number,
	id_categoria: string
}

class Caracteristica {
	constructor(
		public keym_car: string,
		public id_usuario_car: string,
		public id_caracteristica: string,
		public tipo: string
	) { }
}