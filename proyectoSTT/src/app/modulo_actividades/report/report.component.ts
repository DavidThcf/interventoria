import { Component, OnInit, Input } from "@angular/core";
import { NgModule } from "@angular/core";
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core'
import { Router } from "@angular/router";
import { ServiciosGlobales } from "../../services/servicios-globales";
import { ServiciosGlobalesActividades } from "../servicios-globales-actividades";
import { Servicios } from "../../services/servicios";
import * as moment from 'moment';

@Component({
	selector: 'app-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

	public today: number = Date.now();
	images: any[] = [];
	msg: any;
	public chartLabels: string[] = ["EJECUTADO", "NO EJECUTADO"];
	tipNum: number = 0;
	public barColor: any[] = [
		{ backgroundColor: ["rgba(15, 255, 0, 0.8)", "rgba(255, 9, 0, 0.81)"] }
	];

	@Input() doughnutChartData: string[] = [];
	@Input() doughnutChartLabels: number[] = [];
	@Input() doughnutChartType: any = '';

	@Input() isTitleSelected: boolean = false;

	//Falta Juanito
	@Input() etapa: string = '';
	@Input() estado: string = '';
	@Input() color: string = '';
	@Input() nombre: string = '';

	@Input() observaciones: any[] = [];

	//Datos reporte
	@Input() tipo: string = '';
	@Input() beneficiario: string = '';
	@Input() cedula: string = '';
	@Input() provincia: string = '';
	@Input() municipio: string = '';
	@Input() resguardo: string = '';
	@Input() feciniobr: string = '';
	@Input() porcejec: string = '';
	@Input() firmaEla: string = '';
	@Input() nombreEla: string = '';
	@Input() cargoEla: string = '';
	@Input() firmaApr: string = '';
	@Input() nombreApr: string = '';
	@Input() cargoApr: string = '';




	constructor(
		private serviciog: ServiciosGlobales,
		private serviGloAct: ServiciosGlobalesActividades,
		private router: Router,
		private servicios: Servicios
	) { }

	ngOnInit() {
		this.msg = [];
		this.tipNum = 0;
		this.chartLabels = ["EJECUTADO " + this.porcejec + ' %', "NO EJECUTADO " + (100 - parseFloat(this.porcejec)) + ' %'];



		switch (this.tipo.toUpperCase()) {
			case 'BENEFICIARIO':
				this.tipNum = 4;
				break;
			case 'RESGUARDO':
				this.tipNum = 3;
				break;
			case 'MUNICIPIO':
				this.tipNum = 2;
				break;
			case 'PROVINCIA':
				this.tipNum = 1;
				break;
		}
		if (this.isTitleSelected && this.serviciog.actividad == null)
			var dat = {
				keym: this.serviciog.proyecto.keym,
				id_caracteristica: this.serviciog.proyecto.id_caracteristica,
				id_usuario: this.serviciog.proyecto.id_usuario,
				tipo: this.serviciog.proyecto.tipo
			};
		else if (this.serviciog.actividad)
			var dat = {
				keym: this.serviciog.actividad.keym,
				id_caracteristica: this.serviciog.actividad.id_caracteristica,
				id_usuario: this.serviciog.actividad.id_usuario,
				tipo: this.serviciog.actividad.tipo
			};
		else
			var dat = {
				keym: this.serviciog.proyecto.keym,
				id_caracteristica: this.serviciog.proyecto.id_caracteristica,
				id_usuario: this.serviciog.proyecto.id_usuario,
				tipo: this.serviciog.proyecto.tipo
			};
		//alert(JSON.stringify(dat));
		this.serviciog.imagenes = [];
		var formData = new FormData();
		formData.append('keym', dat.keym);
		formData.append('id_caracteristica', dat.id_caracteristica);
		formData.append('id_usuario', dat.id_usuario);
		formData.append('tipo', this.serviciog.tipo);
		formData.append('reporte', true+'');

		this.servicios.getMultimedia(formData)
			.then(imagenes => {
				if (imagenes) {
					this.serviciog.imagenes = imagenes;
					imagenes.forEach(element => {

						this.images.push({ 'nombre': element.subtitulo, 'url': element.val_configuracion + element.srcServ + element.nombre_archivo });
						//val_configuracion+srcServ+nombre_archivo

					});
				} else {
					this.serviciog.imagenes = []
				}
				//alert(JSON.stringify(this.images));
			});
	}

	downloadReport() {
		var anchor = event.target;
		//anchor.href = document.getElementsByTagName('canvas')[0].toDataURL();

		var imgReport : string = document.getElementsByTagName('canvas')[0].toDataURL('image/png');
		var imgReport2 : string = '';
		try{
			imgReport2 = document.getElementsByTagName('canvas')[1].toDataURL('image/png');
		}catch(e){}
		this.msg = {
			"tipo": this.tipo,
			"beneficiario": this.beneficiario,
			"cedula": this.cedula,
			"provincia": this.provincia,
			"municipio": this.municipio,
			"resguardo": this.resguardo,
			"feciniobr": this.feciniobr,
			"porcejec": this.porcejec,
			"firmaEla": this.firmaEla,
			"nombreEla": this.nombreEla,
			"cargoEla": this.cargoEla,
			"firmaApr": this.firmaApr,
			"nombreApr": this.nombreApr,
			"cargoApr": this.cargoApr,
			"nombre": this.nombre,
			"observaciones": this.observaciones,
			"grafica": imgReport,
			"grafica2": imgReport2,
			"imagenes": this.images
		};
		console.log(this.msg);


		var url;
		var xml = new XMLHttpRequest();
		url = 'http://localhost:81/downloadReport' + '?val1=' + JSON.stringify(this.msg);
		window.open(url, '_blank');

	}

}
