import { Injectable } from '@angular/core';
import { Usuario } from '../model/usuario';
import { PersistenceService, StorageType } from 'angular-persistence';
import * as io from 'socket.io-client';


@Injectable()
export class ServiciosGlobales {
	//variable de la informacion de todos los beneficiarios	
	ben_arr : any[] = null;
	//variable de la informacion de un beneficiario
	ben :any = null;

	//JOSON de las actividades
	json_act : string[] = ["0108 - LOCALIZACION Y REPLANTEO","0201 - EXCAVACIÓN A MANO","0209 - VIGA DE CIMENTACION EN CONCRETO. Dim 25cm x 25cm","0211 - VIGA DE CIMENTACION EN CONCRETO Dim 12cm x 25cm","0301 - VIGA AEREA EN CONCRETO. Dim 12cm x 17 cm","0303 - DINTELES TENSORES, CINTAS DE AMARRE Y ELEMENTOS DE BORDE(12cm X 12cm)","0305 - COLUMNAS DE CONCRETO (12cm x 17cm)","0311 - HIERRO A - 37","0312 - HIERRO N° A - 60","0315 - MALLA ELECTROSOLDADA 4mm.","0317 - ESTRUCTURA METALICA","0402 - MAMPOSTERÍA BLOQUE ARCILLA E= 12 cm","0412 - MESON PARA COCINA","0501 - PLACA DE CONCRETO (e= 8 cm)","0604 - CANALES Y BAJANTES (material, calibres y longitud)","0605 - OTROS ELEMENTOS DE CUBIERTA","0609 - TEJA FIBROCEMENTO N° 5","0611 - TEJA FIBROCEMENTO N° 8","0702 - RED HIDRAULICA (indicar material y diam)","0705 - LAVADERO EN MAMPOSTERÍA","0708 - DUCHA (Accesorios)","0803 - RED ELÉCTRICA INTERNA y accesorios","0905 - RED SANITARIA DE 4 PULGADAS y accesorios","0906 - RED SANITARIA 2 PULGADAS y accesorios","0913 - SANITARIO (especificaciónes ) y accesorios","0914 - LAVAMANOS  CERAMICA (especificaciones ) y Accesorios","0917 - LAVAPLATOS (especificaciones) y Accesorios","1001 - ENCHAPE DE PISOS EN BALDOSA CERAMICA","1003 - ESMALTADO O AFINADO DE PISOS","1004 - ENCHAPE DE MUROS EN BALDOSA CERAMICA","1007 - PAÑETE, ESTUCADO O ALISADO DE MUROS","1008 - PINTURA VINILO PARA INTERIORES","1009 - PINTURA ACRILICA PARA EXTERIORES","1103 - PUERTA Y MARCO METALICOS. Incluye cerradura","1104 - PUERTA MADERA Y MARCO 0,70m  Incluye cerradura","1105 - PUERTA MADERA Y MARCO 0,80m incluye cerradura","1110 - VENTANA  EN ALUMINIO (1m x 1m)","1111 - VENTANA EN MADERA (otra dimensión) (1 m2)","1204 - ESTUFA ECOLOGICA, (Incluye cuello de camisa)","1301 - SIS. DE TRATAMIENTO DE AGUA RESIDUAL PREFABRICADO","1305 - TRATAMIENTO SECUNDARIO Y EFLUENTE A CAMPO DE INF. O POZO DE ABSORCIÓN RED DE CONECCIÓN Y EFLUENTES RAS 2000"];

	/* porcentaje real */
	porcentaje_real: any = 0;
	/* --------------------- */

	// variable auxiliar => necesaria para esconder o no el boton atras 
	public ax_actividad : any = null;

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
	servidor: string = "http://localhost:81/";// URL to web api api/heroes http://10.42.0.1:81  10.0.0.64 http:///knower.udenar.edu.co:81
	isSubActivity: any;
	tipo: string = 'img';
	axActividades: any;
	/* vaiables para mensaje de novedades */
	hidden: boolean = false;
	alert_message: string;
	isModalImg : boolean = false;
	isModalLogin : boolean = false;
	isModalRemark : boolean = false;
	isModalRestart : boolean = false;
	/* sasdasdasd */
	public costo_programado: any = 0;
	valueDifProgramadoEjecuato : any = 0;
	porcentajeDifProgramadoEjecutado : any = 0;


	/* ------------- */
	/*variables para verificar suspension*/
	activoSuspension : boolean = false;
	fecha_inicioSuspension : string;
	fecha_finSuspension : string;
	dias_suspension : any;
	/*------------------------------------*/
	/* variables del soket */
	socket = io.connect(this.servidor);
	/* ---------------------------- */

	//variable para permitir modificar o no las actividades
	public state_act: boolean = false;

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

