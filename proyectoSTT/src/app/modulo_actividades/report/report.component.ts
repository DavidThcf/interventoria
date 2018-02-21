import { Component, OnInit, Input } from "@angular/core";
import { NgModule } from "@angular/core";
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core'
import { Router } from "@angular/router";
import { ServiciosGlobales } from "../../services/servicios-globales";
import { ServiciosGlobalesActividades } from "../servicios-globales-actividades";
import { Servicios } from "../../services/servicios";
import * as moment from 'moment';
import { ControlPosition } from "@agm/core/services/google-maps-types";

@Component({
	selector: 'app-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

	public today: number = Date.now();
	images: any[] = [];
	msg: any;
	//public chartLabels: string[] = ["EJECUTADO", "NO EJECUTADO"];
	tipNum: number = 0;
	// public barColor: any[] = [
	// 	{ backgroundColor: ["rgba(15, 255, 0, 0.8)", "rgba(255, 9, 0, 0.81)"] }
	// ];

	@Input() doughnutChartData: any[] = [];
	@Input() doughnutChartLabels: any[] = [];
	@Input() doughnutChartType: any = '';
	@Input() barColor: any[] = [];

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
	@Input() feciniobreal: string = '';
	@Input() porcejec: string = '';
	@Input() firmaEla: string = '';
	@Input() nombreEla: string = '';
	@Input() cargoEla: string = '';
	@Input() firmaApr: string = '';
	@Input() nombreApr: string = '';
	@Input() cargoApr: string = '';
	@Input() ax_parents: any;
	pro: string = '';
	mun: string = '';
	res: string = '';

	public lineChartColors: Array<any> = [
		{ // grey
			backgroundColor: 'rgba(97, 255, 0, 1)',
			//borderColor: 'rgba(148,159,177,1)',
			//pointBackgroundColor: 'rgba(148,159,177,1)',
			//pointBorderColor: '#fff',
			//pointHoverBackgroundColor: '#fff',
			//pointHoverBorderColor: 'rgba(148,159,177,0.8)'
		},
		{ // grey
			backgroundColor: 'rgba(0, 200, 255, 1)',
		},
		{ // dark grey
			backgroundColor: 'rgba(255, 0, 0, 1)',
		}
	];

	public barChartLegend: boolean = true;
	public barChartOptions: any = {
		legend: {
			position: 'top',
			fullWidth: true
		},
		scaleShowVerticalLines: false,
		responsive: true,
		scales: {
			xAxes: [{
				gridLines: { display: false }
			}],
			yAxes: [{
				gridLines: { display: false }
			}]
		}
	};





	constructor(
		private serviciog: ServiciosGlobales,
		private serviGloAct: ServiciosGlobalesActividades,
		private router: Router,
		private servicios: Servicios
	) { }

	ngOnInit() {

		this.msg = [];
		this.tipNum = 0;

		//alert(this.tipo);
		switch (this.tipo) {
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



		//this.chartLabels = ["EJECUTADO " + this.porcejec + ' %', "NO EJECUTADO " + (100 - parseFloat(this.porcejec)) + ' %'];
		if (this.serviciog.porcentajeDifProgramadoEjecutado >= 0) {
			this.lineChartColors = [
				{ // grey
					backgroundColor: 'rgba(97, 255, 0, 1)',
				},
				{ // grey
					backgroundColor: 'rgba(0, 200, 255, 1)',
				},
				{ // dark grey
					backgroundColor: 'rgba(2, 58, 5, 0.993)'
				}
			];
			// alert("positivo")
			// this.barColor = [
			//   { backgroundColor: ["rgba(15, 255, 0, 0.8)", "rgba(255, 9, 0, 0.81)", "rgba(2, 58, 5, 0.993)"] }
			// ];
		} else {
			this.lineChartColors = [
				{ // grey
					backgroundColor: 'rgba(97, 255, 0, 1)',
				},
				{ // grey
					backgroundColor: 'rgba(0, 200, 255, 1)',
				},
				{ // dark grey
					backgroundColor: 'rgba(255, 0, 0, 1)',
				}
			]
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
		formData.append('tipoAct', dat.tipo);
		formData.append('reporte', true + '');

		//alert(JSON.stringify(dat.tipo));

		this.servicios.getMultimedia(formData)
			.then(imagenes => {

				if (imagenes) {
					this.serviciog.imagenes = imagenes;
					imagenes.forEach(element => {
						//alert(JSON.stringify(element.titulo));
						this.images.push({ 'nombre': element.titulo, 'fecha_creacion': element.fecha_creacion, 'url': element.val_configuracion + element.srcServ + element.nombre_archivo });
						//val_configuracion+srcServ+nombre_archivo
						//alert(JSON.stringify(this.images));
					});
				} else {
					this.serviciog.imagenes = []
				}
				//alert(JSON.stringify(this.images));
			});
	}

	downloadReport() {
		// var anchor = event.target;
		//anchor.href = document.getElementsByTagName('canvas')[0].toDataURL();

		var imgReport: string = document.getElementsByTagName('canvas')[0].toDataURL('image/png');
		var imgReport2: string = '';
		try {
			imgReport2 = document.getElementsByTagName('canvas')[1].toDataURL('image/png');
		} catch (e) { }
		this.msg = {
			"tipo": this.tipo,
			"beneficiario": this.beneficiario,
			"cedula": this.cedula,
			"provincia": this.serviciog.pro,
			"municipio": this.serviciog.mun,
			"resguardo": this.serviciog.res,
			"feciniobr": this.feciniobr,
			"porcejec": this.porcejec,
			"observaciones": this.observaciones,
			"porcentajeProgramado": this.serviciog.porcentaje_real,
			"porcentajeEjecutado": this.serviciog.actividad.porcentaje_cumplido,
			"DiferenciaPorcentaje": this.serviciog.porcentaje_real - this.serviciog.actividad.porcentaje_cumplido,
			"valorAsignado": this.serviciog.actividad.costo_real,
			"valorProgramado": this.serviciog.costo_programado,
			"valorEjecutado": this.serviciog.actividad.costo_actual,
			"DiferenciaValor": Math.abs(this.serviciog.actividad.costo_actual - this.serviciog.costo_programado),
			
			"firmaEla": this.firmaEla,
			"nombreEla": this.nombreEla,
			"cargoEla": this.cargoEla,
			"firmaApr": this.firmaApr,

			"nombreApr": this.nombreApr,
			"cargoApr": this.cargoApr,
			"nombre": this.nombre,
			
			"grafica": imgReport,
			"grafica2": imgReport2,
			"imagenes": this.images,
		};
		console.log(this.msg);

		var url;
		// var xml = new XMLHttpRequest();
		url = this.serviciog.servidor + 'downloadReport' + '?val1=' + JSON.stringify(this.msg);
		var re = window.open(url, 'about:blank');
		re.focus();
		// window.open(url, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
	}

	delObservation(obs) {
		//se elimina de la presentacion
		obs.aprobado = false;

		//Invoca al servicio para que se elimine la observacion del reporte
		var formData = new FormData();
		formData.append('obs', JSON.stringify(obs));
		formData.append('opc', 'UP_EST');

		this.servicios.opObservation(formData).then(x => {
			for(var i = this.observaciones.length - 1; i >= 0; i--) {
				if(this.observaciones[i] === obs) {
				   this.observaciones.splice(i, 1);
				}
			}
			this.serviciog.alert_message = 'Observacion eliminada del reporte!!!';
			this.serviciog.hidden = true;
			setTimeout(() => {
				this.serviciog.hidden = false;
			}, 2000);
		});
	}
}
