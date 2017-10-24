import { Component, OnInit, Input } from "@angular/core";
import { NgModule } from "@angular/core";

import { Router } from "@angular/router";
import { ServiciosGlobales } from "../../services/servicios-globales";
import { ServiciosGlobalesActividades } from "../servicios-globales-actividades";
import { Servicios } from "../../services/servicios";

@Component({
  selector: 'app-observaciones',
  templateUrl: './observaciones.component.html',
  styleUrls: ['./observaciones.component.css']
})
export class ObservacionesComponent implements OnInit {

  @Input() tipo_usuario: string = '';
  @Input() isTitleSelected: string = '';
  @Input() observaciones: any[] = [];

  constructor(
    private serviciog: ServiciosGlobales,
    private serviGloAct: ServiciosGlobalesActividades,
    private router: Router,
    private servicios: Servicios
  ) { }

  ngOnInit() { }
  regObservacion(cad) {

    //alert(cad);

    if (this.isTitleSelected && this.serviciog.actividad == null)
      var dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario,
        usu_observacion: this.serviciog.usuario.id_usuario,
        observacion: cad,
        usu_sup: this.serviciog.usuario.usuario_superior
      };
    else if (this.serviciog.actividad)
      var dat = {
        keym: this.serviciog.actividad.keym,
        id_caracteristica: this.serviciog.actividad.id_caracteristica,
        id_usuario: this.serviciog.actividad.id_usuario,
        usu_observacion: this.serviciog.usuario.id_usuario,
        observacion: cad,
        usu_sup: this.serviciog.usuario.usuario_superior
      };
    else
      var dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario,
        usu_observacion: this.serviciog.usuario.id_usuario,
        observacion: cad,
        usu_sup: this.serviciog.usuario.usuario_superior
      };
    var formData = new FormData();
    formData.append("observacion", JSON.stringify(dat));

    this.servicios.regObservacion(formData)
      .then(message => {
        //alert(JSON.stringify(message));
        var mark = { usuario: this.serviciog.usuario.nombre + ' ' + this.serviciog.usuario.apellido, observacion: cad };
        this.observaciones.push(mark);
        this.serviciog.socket.emit('sendSocketNovedad', {
          'userSend': this.serviciog.usuario.usuario_superior,
          'tipo': 'obs'
        });
        //alert(JSON.stringify(message));
        //this.serviGloAct.remarks = message;
      })
  }

}
