import { ViewChild, Component, OnInit } from '@angular/core';
import { Servicios } from '../services/servicios';
import { AgmCoreModule } from '@agm/core';
import { ServiciosGlobales } from '../services/servicios-globales';

import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from 'app/app.component';
import { AppModule } from 'app/app.module';
import { DetailsBeneficiaryComponent } from 'app/modulo_public_beneficiary/details-beneficiary/details-beneficiary.component';
import { resolveDefinition } from '@angular/core/src/view/util';



@Component({
	selector: 'mapa',
	templateUrl: './mapa.component.html',
	styleUrls: ['./mapa.component.css']
})

export class Mapa implements OnInit {

	@ViewChild("det") benPub: DetailsBeneficiaryComponent;


	lat: number = 0.90800775860100700000;
	lng: number = -77.79117062687874000000;
	zoom: number = 7;
	proyectos: any = [];
	proyectoSelect: any;
	categorias: any = [];
	marcadores: any = [];
	ax_marcadores: any = [];
	marcador: any;
	http: string = this.serviciog.servidor + "Category/";
	ext: string = ".svg"
	tipo: string = "img";
	archivos: any = [];
	constructor(
		private serviciog: ServiciosGlobales,
		private servicios: Servicios
	) { };

	ngOnInit(): void {
		this.servicios.getVisibleProject()
			.then(proyectos => {
				if (proyectos) {
					this.proyectos = proyectos;
					this.servicios.getMarkersListFormCategory(null)
						.then(marcadores => {
							if (marcadores) {
								//alert(JSON.stringify(proyectos[0]));
								this.marcadores = marcadores;
								this.ax_marcadores = marcadores;
								console.log(marcadores);
							}
						})
				}
			});
	}

	clickCategoria(categoria) {
		var formData = new FormData();
		formData.append("id_categoria", categoria.id_categoria);
		this.servicios.getMarkersListFormCategory(formData)
			.then(marcadores => {
				if (marcadores) {
					this.marcadores = marcadores;
				}
			})
	}

	clickTodasCategoria() {
		this.servicios.getMarkersListFormCategory(null)
			.then(marcadores => {
				if (marcadores) {
					this.marcadores = marcadores;
				}
			})
	}

	search_ben(beneficiario: string) {
		//alert(beneficiario);
		//alert(JSON.stringify(this.ax_marcadores[0]));
		if (beneficiario.trim().length > 0)
			this.marcadores = this.ax_marcadores.filter(
				item => item.nombre.toLowerCase().trim().indexOf(beneficiario.trim().toLowerCase()) !== -1 ||
					item.cedula.toLowerCase().trim().indexOf(beneficiario.trim().toLowerCase()) !== -1
			);
		else
			this.marcadores = this.ax_marcadores;

		//alert(JSON.stringify(this.marcadores));

	}

	markerClick(marcador) {
		this.serviciog.ben = marcador;
		this.benPub.reload();
	}

	cambioProyecto(value) {
		var formData = new FormData();
		formData.append("caracteristica", JSON.stringify(this.proyectoSelect));
		this.servicios.getCategoryList(formData)
			.then(categorias => {
				if (categorias) {
					this.categorias = categorias
				}
			})
	}

	cambio($event) {
		this.getArchivo();
	}

	getArchivo() {
		this.archivos = [];
		var formData = new FormData();

		formData.append('keym', this.marcador.keym);
		formData.append('id_caracteristica', this.marcador.id_caracteristica);
		formData.append('id_usuario', this.marcador.id_usuario);
		formData.append('tipo', this.tipo);

		this.servicios.getMultimedia(formData)
			.then(archivos => {
				if (archivos) {
					this.archivos = archivos
				}
			})

	}
}
