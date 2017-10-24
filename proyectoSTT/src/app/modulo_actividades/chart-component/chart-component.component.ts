import { Component, OnInit, Input } from '@angular/core';
import { ServiciosGlobales } from "../../services/servicios-globales";

@Component({
  selector: 'app-chart-component',
  templateUrl: './chart-component.component.html',
  styleUrls: ['./chart-component.component.css']
})
export class ChartComponentComponent implements OnInit {

 


  constructor(private serviciog: ServiciosGlobales) { }
  
  ngOnInit() {
    
   
  }
 
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    //alert("HOver")
    console.log(e);
  }

}
