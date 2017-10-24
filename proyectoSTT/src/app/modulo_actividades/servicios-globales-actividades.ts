import { Injectable } from '@angular/core';
import { Usuario } from '../model/usuario';
import { PersistenceService, StorageType } from 'angular-persistence';



@Injectable()
export class ServiciosGlobalesActividades {	
	actOpt:number = 0;
	subActividades:any = [];
	lastActividad:any = [];
	remarks:any=[];
	observaciones:any=[];
	tipo :string = '';
	tipo2 :string = '';
	
	constructor(private persistenceService:PersistenceService){}
}

