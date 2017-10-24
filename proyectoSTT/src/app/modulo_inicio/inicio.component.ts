import { Component, OnInit} from '@angular/core';
import { NgModule } from '@angular/core';
import { ServiciosGlobales } from '../services/servicios-globales';


@Component({
	selector: 'inicio-view',
	templateUrl: './inicio.component.html',
	styleUrls: [ './inicio.component.css' ]
})


export class InicioView implements OnInit{
	id_number:number = 0;
	constructor(private serviciog:ServiciosGlobales){}
	ngOnInit(): void {

		//this.valorCumplido = this.calculateValorCumplido(this.id_number,this.kelv[0]);
		//alert(this.valorCumplido);
	}
	kelv:Tree[] = [
	{
		id:0,
		id_pad:-1,
		porcentaje:0,
		asignado:40,
		cumplido:0,
	},
	{
		id:1,
		id_pad:0,
		porcentaje:30,
		asignado:80,
		cumplido:10,
	},
	{
		id:2,
		id_pad:1,
		porcentaje:50,
		asignado:0,
		cumplido:50,
	},
	{
		id:3,
		id_pad:1,
		porcentaje:30,
		asignado:0,
		cumplido:25,
	},
	{
		id:4,
		id_pad:0,
		porcentaje:10,
		asignado:10,
		cumplido:5,
	},
	{
		id:5,
		id_pad:4,
		porcentaje:10,
		asignado:0,
		cumplido:10,
	}
	];

	valorCumplido:number=0;
	
	calculateValorCumplido(id:number,kel:Tree){
		var cont = this.calculateNumberChild(id);
		if(cont > 0){
			var val = 0;			
			for(var i=0; i < this.kelv.length; i++){
				if(this.kelv[i].id_pad == id){
					//alert("aws"+ i +" "+val);
					val=val+this.calculateValorCumplido(this.kelv[i].id,this.kelv[i]);
					//alert("axd"+ i +" "+val);					
				}
			}	
			if(this.id_number != id){
				val = val + kel.cumplido;
				val = kel.porcentaje * val / 100 
			}else{
				val = val + kel.cumplido;
			}

			//alert(val + " " + JSON.stringify(kel));
			return val;			
			
		}else{		
			
			return  (kel.porcentaje * (kel.cumplido/100));
		}		
	}

	calculateNumberChild(id:number){
		var cont:number = 0;

		for(var i=0; i < this.kelv.length; i++){
			if(this.kelv[i].id_pad==id){
				cont++;				
			}
		}
		return cont;
	}
}
interface Tree{
	id:number;
	id_pad?:number;
	porcentaje:number;
	asignado:number;
	cumplido:number;
}