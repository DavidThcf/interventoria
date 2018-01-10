import { Component, OnInit } from '@angular/core';
import { Servicios } from '../../services/servicios';
import { ServiciosGlobales } from '../../services/servicios-globales';
import { Router } from "@angular/router";
@Component({
  selector: 'public-beneficiary-component',
  templateUrl: './public-beneficiary-component.component.html',
  styleUrls: ['./public-beneficiary-component.component.css']
})
export class PublicBeneficiaryComponent implements OnInit {
  
  ben: any = null;
  ben_arr: any[] = null;

  constructor(
    private router: Router,
    private serviciog: ServiciosGlobales,
    private servicios: Servicios
  ) { }

  ngOnInit() {
    
   // if (!this.serviciog.ben_arr)
      this.servicios.getAllBeneficiaries()
        .then(beneficiaries => {
          if (beneficiaries) {
            this.serviciog.ben_arr = beneficiaries;
            this.ben_arr = beneficiaries;
            //alert(JSON.stringify(beneficiaries));
          }
        });
    // else
    //   this.ben_arr = this.serviciog.ben_arr;
    // this.ben = this.serviciog.ben_arr[0];
  }

  //Realiza busqueda y filtro de los beneficiarios
  btnSearchAct(value: string) {
    this.ben_arr = this.serviciog.ben_arr.filter(item => {
      return (
        (item.cedula + item.nombre)
          .toLowerCase()
          .replace(/ /g, "")
          .indexOf(value.replace(/ /g, "").toLowerCase()) !== -1
      );
    });
  }

  //muestra la informacion de un beneficiario
  goBen(dat: any) {
    this.serviciog.ben = dat;
    let link = ["pb_detail"];
    this.router.navigate(link);
  }

}
