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

  isEditar = false;

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

    if (!this.observaciones)
      this.observaciones = [];

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

        var mark = {
          usuario: this.serviciog.usuario.nombre + ' ' +
            this.serviciog.usuario.apellido, observacion: cad
        };
        this.observaciones.push(mark);
        // alert(this.serviciog.actividad.tipo);
        if (['Proyecto', 'Provincia', 'Municipio', 'Resguardo'].indexOf(this.serviciog.actividad.tipo) >= 0 || this.serviciog.usuario.tipo_usuario != 'sup') {
          this.serviciog.socket.emit('sendSocketNovedad', {
            'userSend': this.serviciog.usuario.id_usuario,
            'tipo': 'rec',
            'tipoAct': this.serviciog.actividad.tipo
          });
        } else {
          this.serviciog.socket.emit('sendSocketNovedad', {
            'userSend': this.serviciog.usuario.usuario_superior,
            'tipo': 'obs'
          });
        }


      })
  }
  okReporte(obs, act) {
    obs.aprobado = act;

    if (!obs.visto) {
      obs.visto = true;
      this.serviciog.messageList['observations']--;
      this.serviciog.totalMessage--;
    }
    var formData = new FormData();
    formData.append('obs', JSON.stringify(obs));
    formData.append('opc', 'UP_EST');

    this.servicios.opObservation(formData).then(x => {
      if (act)
        this.serviciog.alert_message = 'Observacion agregada al reporte!!!';
      else
        this.serviciog.alert_message = 'Observacion eliminada del reporte!!!';
      this.serviciog.hidden = true;
      setTimeout(() => {
        this.serviciog.hidden = false;
      }, 2000);
    });
  }

  saveEdit(obs: any) {
    obs.edit = false;

    //Invoca al servicio para cambiar la observacion (EDITAR)
    var formData = new FormData();
    formData.append('obs', JSON.stringify(obs));
    formData.append('opc', 'UP_TXT');

    this.servicios.opObservation(formData).then(x => {
      this.serviciog.alert_message = 'Modificacion exitosa!!!';
      this.serviciog.hidden = true;
      setTimeout(() => {
        this.serviciog.hidden = false;
      }, 2000);
    });

  }

}
