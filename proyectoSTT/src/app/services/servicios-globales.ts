import { Injectable } from '@angular/core';
import { Usuario } from '../model/usuario';
import { PersistenceService, StorageType } from 'angular-persistence';
import * as io from 'socket.io-client';


@Injectable()
export class ServiciosGlobales {

	/* porcentaje real */
	porcentaje_real: any;
	/* --------------------- */

	//Total de beneficiarios por actividad
	total_beneficiary: number = 0;
	
	//recomendacion go
	public recomendacion : any = {}; 

	//news
	public opcion: string = "por";
	par_activity: any = {};

	public novedades: any;

	//datos para grafica total de beneficiarios por categorias mapa
	public colors: any[] = [];
	color: string[] = [];
	public labels: string[] = [];
	public data: number[] = [];
	public types: string = "doughnut";


	dat: any = [];
	ax_dat: any = [];

	messageList: any[] = [];	//Tiene la lista discriminada de cuales son las novedades
	totalMessage: number = 0;	//Muestra en la campana el total de novedaeds

	http_str: string = 'http://';


	tree_name: string[] = [];
	listDatChart: any[] = [];
	remarks: any = [];
	usuario: Usuario;
	proyecto: any;
	actividad: any;
	actividades: any;
	titulo: string;
	isSelAct: boolean = false;
	servidor: string = "http://172.16.133.190:81/";// URL to web api api/heroes http://10.42.0.1:81  10.0.0.64 http:///knower.udenar.edu.co:81
	isSubActivity: any;
	tipo: string = 'img';
	axActividades: any;
	/* vaiables para mensaje de novedades */
	hidden: boolean = false;
	alert_message: string;
	/* ------------- */

	/* variables del soket */
	socket = io.connect(this.servidor);
	/* ---------------------------- */

	tipos_act = ['Proyecto', 'Proyecto', 'Provincia', 'Municipio', 'Resguardo', 'Beneficiario', 'Capitulo', 'Actividad'];

	constructor(private persistenceService: PersistenceService) { }

	getUserSession(usuario: Usuario) {
		this.persistenceService.set('user', usuario, { type: StorageType.SESSION });
		this.usuario = usuario;
	}

	imagenes: imagen[] = [

	]

}

interface imagen {
	titulo: string;
	subtitulo: string;
	url: string;
	isViewMap: boolean;
	reporte: boolean;
	ext : boolean;
	reporte_proyecto: boolean;
	reporte_provincia: boolean;
	reporte_municipio: boolean;
	reporte_resguardo: boolean;
	reporte_beneficiario: boolean
}

