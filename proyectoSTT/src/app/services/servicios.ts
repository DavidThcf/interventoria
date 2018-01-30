import { formatDate } from 'ngx-bootstrap/bs-moment/format';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Request, RequestMethod } from '@angular/http';
import { Usuario } from '../model/usuario'
import { ServiciosGlobales } from '../services/servicios-globales';


import 'rxjs/add/operator/toPromise';


@Injectable()
export class Servicios {

	private url = this.serviciog.servidor;
	private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
	private headersPost = new Headers({ 'Content-Type': 'multipart/form-data' });
	private options = new RequestOptions({ headers: this.headers });

	constructor(private http: Http, private serviciog: ServiciosGlobales) { }



	// events
	public chartClicked(e: any): void {
		console.log(e);
	}

	public chartHovered(e: any): void {
		//alert("HOver")
		console.log(e);
	}

	getUsuario(formdata: FormData): Promise<Usuario> {
		return this.http
			.post(this.url + "getUser", formdata)
			.toPromise()
			.then(response => response.json() as Usuario)
			.catch(err => false);
	}

	getProyecto(id_usuario: string): Promise<any> {
		return this.http.post(this.url + "getUserProjectList", 'id_usuario=' + id_usuario, this.options)
			.toPromise()
			.then(response => response.json())
			.catch(err => false);
	}

	getActividad(keym: number, id_usuario: number, id_caracteristica: number): Promise<any> {
		var formData = new FormData();

		formData.append('keym', keym + '');
		formData.append('id_usuario', id_usuario + '');
		formData.append('id_caracteristica', id_caracteristica + '');

		//alert(formData);

		return this.http.post(this.url + "getActivityList", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false);
	}

	getBackActividad(keym: number, id_caracteristica: number, id_usuario: number): Promise<any> {
		var formData = new FormData();

		formData.append('keym', keym + '');
		formData.append('id_usuario', id_usuario + '');
		formData.append('id_caracteristica', id_caracteristica + '');

		//alert(formData);

		return this.http.post(this.url + "getBackActivityList", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false);
	}

	getOneProject(formdata: FormData): Promise<any> {
		return this.http
			.post(this.url + "getOneProject", formdata)
			.toPromise()
			.then(res => res.json())
			.catch(err => err.toString());
	}

	createUser(formdata: FormData): Promise<any> {
		return this.http
			.post(this.url + "CreateUser", formdata)
			.toPromise()
			.then(res => JSON.stringify(res))
			.catch(err => err.toString());
	}

	createProject(formdata: FormData): Promise<any> {
		return this.http
			.post(this.url + "CreateProject", formdata)
			.toPromise()
			.then(res => res.json())
			.catch(err => err.toString());
	}

	createActividad(formdata: FormData): Promise<any> {
		return this.http
			.post(this.url + "CreateActivity", formdata)
			.toPromise()
			.then(res => res.json())
			.catch(err => err.toString());
	}

	createMultimedia(formdata: FormData): Promise<any> {
		return this.http
			.post(this.url + "CreateFile", formdata)
			.toPromise()
			.then(res => res.json())
			.catch(err => err.toString());
	}

	getMultimedia(formData: FormData): Promise<any> {

		return this.http
			.post(this.url + "getFileList", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false);
	}
	getMultimediaChild(formData: FormData): Promise<any> {

		return this.http
			.post(this.url + "getFileListChild", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false);
	}

	createCategoria(formdata: FormData): Promise<any> {
		return this.http
			.post(this.url + "CreateCategory", formdata)
			.toPromise()
			.then(res => res.json())
			.catch(err => err.toString());
	}

	getCategoryList(formdata: FormData): Promise<any> {
		return this.http.post(this.url + "getCategoryList", formdata)
			.toPromise()
			.then(response => response.json())
			.catch(err => false);
	}

	regPointMap(formdata: FormData): Promise<any> {
		return this.http.post(this.url + "regPointMap", formdata)
			.toPromise()
			.then(response => response.json())
			.catch(err => false);
	}

	getPointList(formData: FormData): Promise<any> {
		return this.http.post(this.url + "getPointList", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false);
	}

	updatePointMap(formData: FormData): Promise<any> {
		return this.http.post(this.url + "updatePointMap", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false);
	}

	getVisibleProject(): Promise<any> {
		return this.http.post(this.url + "getVisibleProjects", null)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	getMarkersListFormCategory(formData: FormData): Promise<any> {
		return this.http.post(this.url + "getMarkersListFromCategory", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	updatePercentage(formData: FormData): Promise<any> {
		return this.http.post(this.url + "updatePercentage", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	updateCaracteristica(formData: FormData): Promise<any> {
		return this.http.post(this.url + "updateCharacteristic", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	getPercentage(formData: FormData): Promise<any> {
		return this.http.post(this.url + "getPercentage", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	getUserList(formData: FormData): Promise<any> {
		return this.http.post(this.url + "getUserList", null)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	assignActivityToUser(formData: FormData): Promise<any> {
		return this.http.post(this.url + "assignActivityToUser", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	getRemarks(formData: FormData): Promise<any> {
		return this.http.post(this.url + "getRemarks", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	getObservaciones(formData: FormData): Promise<any> {
		return this.http.post(this.url + "getObservaciones", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	getObservacionesReport(formData: FormData): Promise<any> {
		return this.http.post(this.url + "getObservacionesReport", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	regRemarks(formData: FormData): Promise<any> {
		return this.http.post(this.url + "regRemarks", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	regObservacion(formData: FormData): Promise<any> {
		return this.http.post(this.url + "regObservacion", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	updateCompletePercentage(formData: FormData): Promise<any> {
		return this.http.post(this.url + "updateCompletePercentage", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	updateEtapa(formData: FormData): Promise<any> {
		return this.http.post(this.url + "updateEtapa", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	downloadReport(formData: FormData): Promise<any> {
		return this.http.post(this.url + "downloadReport", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	getTypes(formData: FormData): Promise<any> {
		return this.http.post(this.url + "getTypes", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	getDataChart(formData: FormData): Promise<any> {
		return this.http.post(this.url + "getDataChart", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}
	/*----Sevicios Novedades-----*/

	//Envia la aceptacion o no del cambio del porcentaje que el supervisor realiza
	approvalPercentage(formData: FormData) {
		return this.http.post(this.url + "approvalPercentage", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}
	//Envia la aceptacion o no de la observacion que hace el supervisor
	approvalObservation(formData: FormData) {
		return this.http.post(this.url + "approvalObservation", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	//trae las lista de las actividades que cambian de porcentaje
	getDataNewChangePercent(formData: FormData) {
		return this.http.post(this.url + "getDataNewChangePercent", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	/* inicio metodo para traer los archivo mostrar */
	getDataNewChangeFile(formData: FormData) {
		return this.http.post(this.url + "getDataNewChangeFile", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}
	/* end metodo files  */

	//trae las nuevas observaciones  segun flag que tiene el usuario
	getDataNewObservations(formData: FormData) {
		return this.http.post(this.url + "getDataNewObservations", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}
	//trae las nuevas recomendaciones segun flag que tiene el usuario
	getDataNewRemarks(formData: FormData) {
		return this.http.post(this.url + "getDataNewRemarks", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}


	//trae la multimedia archivos que tiene una actividad la cual se cambia de porcentaje
	getFilesNovedades(formData: FormData) {
		return this.http.post(this.url + "getFilesNovedades", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}
	//-----------  MESSAGE   -------------//

	getTotalMessage(formData: FormData) {
		return this.http.post(this.url + "getTotalMessage", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}
	/*---------------------------*/

	/* --------------update report en archivo----------------- */
	updateImageEditView(formData: FormData) {
		// alert('si invoca')
		return this.http.post(this.url + "updateImageEditView", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}
	/* ---------------------------------------- */

	/* ----------------- get total_beneficiary ------------------*/
	getTotalBeneficiary(formData: FormData) {
		return this.http.post(this.url + "getTotalBeneficiary", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	getOnlyTotalBeneficiary(formData: FormData): Promise<any> {
		return this.http.post(this.url + "getOnlyTotalBeneficiary", formData)
			.toPromise()
			.then(response => {
				return response.json();
			})
			.catch(err => false)
	}
	/* --------------------------------------------------------- */
	/* ----------------- pause proyect ----------------------- */
	pauseProyect(formData: FormData) {
		return this.http.post(this.url + "pauseProyect", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}
	/* ----------------------------------------------------------- */
	/* ----------------- updateImageView ---------------------- */
	updateImageView(formData: FormData) {
		return this.http.post(this.url + "updateImageView", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}
	/* ---------------------------------------------------------- */

	getMultimediaReport(formData: FormData): Promise<any> {
		return this.http
			.post(this.url + "getMultimediaReport", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false);
	}

	getSuspension(formData: FormData) {
		return this.http.post(this.url + "getSuspension", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}

	/* servicio recuperacion contraseña  */
	restartPassword(formData: FormData) {
		return this.http.post(this.url + "restartPassword", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}
	/* ------------------------------------ */
	/* servicio recuperacion contraseña  */
	changePassword(formData: FormData) {
		
		return this.http.post(this.url + "changePassword", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}
	/* ------------------------------------ */

	/*obtener suspension*/
	getPauseJob(){
		// alert('servicio')
		return this.http.post(this.url + "getPauseJob",'')
				.toPromise()
				.then(response => response.json())
				.catch(err => false)
	}
	/*-------------------*/

	/* servicio recuperacion contraseña  */
	getAllBeneficiaries() {
		
		return this.http.post(this.url + "getAllBeneficiaries","")
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}
	/* ------------------------------------ */

	/* servicio recuperacion contraseña  */
	delFile(formData: FormData) {
		return this.http.post(this.url + "delFile", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}
	/* ------------------------------------ */
	
	/* servicio obtener el tipo y nombre de los padres de una caracteristica  */
	getRecursiveAllParents(formData: FormData) {
		return this.http.post(this.url + "getRecursiveAllParents", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}
	/* ------------------------------------ */
	
	/* Operacion con observaciones  */
	opObservation(formData: FormData) {
		return this.http.post(this.url + "opObservation", formData)
			.toPromise()
			.then(response => response.json())
			.catch(err => false)
	}
// askkasjd
} 

