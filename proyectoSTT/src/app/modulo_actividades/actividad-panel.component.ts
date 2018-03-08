import { Data } from '@agm/core/services/google-maps-types';
import { any } from 'codelyzer/util/function';
import { Component, OnInit } from "@angular/core";
import { NgModule } from "@angular/core";
import { AgmCoreModule } from "@agm/core";
import { CurrencyPipe } from '@angular/common';

import { Router } from "@angular/router";
import { ServiciosGlobales } from "../services/servicios-globales";
import { Servicios } from "../services/servicios";
import { ServiciosGlobalesActividades } from "./servicios-globales-actividades";
import { STRING_TYPE } from '@angular/compiler/src/output/output_ast';
import { stringify } from 'querystring';
import { Alert } from 'selenium-webdriver';
import { retry } from 'rxjs/operators/retry';


@Component({
  selector: "actividad-panel",
  templateUrl: "./actividad-panel.component.html",
  styleUrls: ["./actividad-panel.component.css"]
})

export class ActividadPanel implements OnInit {
  //variable para habilitar o no la modificiacion de actividades
  state_act: boolean = false;

  //variableque almacena texto para realizar busqueda de actividades
  txt_search: string = "";

  //grafica de barras resumen Avance
  public barChartType: string = 'bar';

  dat: any = {};
  public slideval: number = 0;
  nom_act_report: string[] = [];
  listDatChart: any[] = [];
  isTitleSelected: boolean = false;
  act_ant: string = "";
  miPorcentaje: number = 100;
  porcentajeAsignado: number = 0;
  flag: boolean = true;
  isEditar: boolean = false;
  isSubActivity: any = [];
  subActivity: any = 0;
  usuarios: any = [];
  flg: boolean = true;
  porcentaje_ejecutado: number;
  activityList: any = [];
  listTypes: any[] = [];

  /* valores resultados estadisticas */
  valres: any = [];
  valresper: any = [];
  mon: any = [];
  total: any = 0;
  totalm: any = 0;
  totalp: any = 0;
  suma: any = 0;
  fin_label: any = [];
  fin_data: any = [];
  fin_col: any = [{
    backgroundColor: [
      "rgba(90, 255, 0, 0.8)",
      "rgba(255, 255, 0, 0.81)",
      "rgba(50, 25, 100, 25.8)",
      "rgba(255, 90, 20, 0.81)",
      "rgba(0, 255, 255, 0.8)",
      "rgba(0, 90, 20, 0.81)"]
  }];
  /* -------------------------------- */

  /* suspesnsion de obra */
  toggleProyect: boolean = false;
  datePause: any;
  /* ----------------------- */
  fechaInicio: any;
  /* porcentaje real */
  // porcentaje_real: any;
  /* --------------------- */

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
        gridLines: { display: false },
        display: true,
        ticks: {
          suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
          // OR //
          beginAtZero: true   // minimum value will be 0.
        }
      }]
    }

  };
  public barChartLabels: string[] = [
    '% de obra Programado ',
    '% Real Ejecutado ',
    '% Programado VS Ejecutado'
  ];
  public barChartLegend: boolean = true;
  public barChartData: any[] = [];
  public barColor: any[] = [
    // { backgroundColor: ["rgba(15, 255, 0, 0.8)", "rgba(255, 9, 0, 0.81)", "rgba(255, 9, 100, 0.81)"] }
  ];

  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(97, 255, 0, 1)',
    },
    { // grey
      backgroundColor: 'rgba(0, 200, 255, 1)',
    },
    { // dark grey
      backgroundColor: 'rgba(255, 0, 0, 1)',
    }
  ];

  public doughnutChartLabels: string[] = [];
  public doughnutChartData: any[] = [];
  public doughnutChartType: string = "doughnut";

  constructor(
    private serviciog: ServiciosGlobales,
    private serviGloAct: ServiciosGlobalesActividades,
    private router: Router,
    private servicios: Servicios
  ) { }

  ngOnInit(): void {
    this.serviciog.isSelAct = false;
    this.serviciog.isSubActivity = null;
    this.serviciog.isSelAct = false;
    this.serviGloAct.actOpt = 0;
    this.serviciog.tree_name = [];

    this.listTypes = [];
    this.serviGloAct.observaciones = [];

    if (this.serviciog.usuario.tipo_usuario === "sup") this.flg = false;

    this.serviciog.actividades = [];
    this.serviciog.activityList = [];
    if (this.serviciog.ax_actividad) {

      this.slideval = this.serviciog.proyecto.porcentaje_cumplido;
      this.serviciog.tree_name.push(this.serviciog.proyecto.nom_pro);
      this.serviciog.titulo = this.serviciog.proyecto.nom_pro;
      var keym = this.serviciog.proyecto.keym;
      var id_usuario = this.serviciog.proyecto.id_usuario;
      var id_caracteristica = this.serviciog.proyecto.id_caracteristica;

      this.servicios
        .getActividad(keym, id_usuario, id_caracteristica)
        .then(actividades => {

          if (actividades) {
            this.serviciog.actividades = actividades;

            this.serviciog.activityList = actividades;
            this.calculateValue(this.serviciog.actividades);
            var num = this.serviciog.tipos_act.indexOf(actividades[0].tipo);
            this.serviGloAct.tipo = this.serviciog.tipos_act[num + 1];
            this.serviGloAct.tipo2 = this.serviciog.tipos_act[num];
            //Agrega variable para mostrar si esta bloqueado o no el capitulo y sus subactividades 
            this.verifyAllActs();
          }
        });
    }
    else {
      let link = ["administrador"];
      this.router.navigate(link);
      this.serviciog.tree_name.pop();
    }

    this.serviciog.actividad = this.serviciog.proyecto;
    this.serviciog.porcentaje_real = 0;
    this.serviciog.porcentajeDifProgramadoEjecutado = 0;

    try {
      this.barChartData = [
        { data: [this.serviciog.porcentaje_real], label: parseFloat(this.serviciog.porcentaje_real).toFixed(2) + '  %' },
        { data: [this.serviciog.actividad.porcentaje_cumplido], label: parseFloat(this.serviciog.actividad.porcentaje_cumplido).toFixed(2) + '  %' },
        { data: [Math.abs(this.serviciog.porcentajeDifProgramadoEjecutado)], label: Math.abs(parseFloat((this.serviciog.porcentajeDifProgramadoEjecutado) + '')).toFixed(2) + '  %' }
      ];
      this.barChartLabels = [
        '% de obra Programado ',
        '% Real Ejecutado ',
        '% Programado VS Ejecutado'
      ];
    } catch (e) {
    }

    if (this.isTitleSelected && this.serviciog.actividad == null)
      this.dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario,
        tipo: this.serviciog.proyecto.tipo
      };
    else if (this.serviciog.actividad)
      this.dat = {
        keym: this.serviciog.actividad.keym,
        id_caracteristica: this.serviciog.actividad.id_caracteristica,
        id_usuario: this.serviciog.actividad.id_usuario,
        tipo: this.serviciog.actividad.tipo
      };
    else
      this.dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario,
        tipo: this.serviciog.proyecto.tipo
      };

    if (JSON.stringify(this.dat) != JSON.stringify(this.serviciog.dat)) {
      this.serviciog.labels = [];
      this.serviciog.data = [];
      this.serviciog.colors = [];
      this.serviciog.dat = this.dat;
      var formData = new FormData();
      formData.append("caracteristica", JSON.stringify(this.dat));
      this.servicios.getDataChart(formData).then(message => {

        //calculo grafica resumen avance
        this.serviciog.listDatChart = [];
        this.serviciog.listDatChart = message;
        var ax: any[] = [];
        this.serviciog.listDatChart.forEach(element => {
          ax.push(element.gettotalmarkerscategory);
        });
        this.serviciog.listDatChart = ax;
        var val = 0;
        this.serviciog.listDatChart.forEach(element => {
          var x = element.split(',');
          var num = parseInt(x[2]);
          if (num) val = val + num;
        });
        this.serviciog.listDatChart.forEach(element => {
          element = element.replace('(', '');
          element = element.replace(')', '');
          var x = element.split(',');
          this.serviciog.color.push(x[0]);
          var num = parseInt(x[2]);
          if (num) {
            var z = num * 100 / val;
            this.serviciog.data.push(z);
            this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : ' + z.toFixed(2) + ' %');
          }
          else {
            this.serviciog.data.push(0);
            this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : 0 %');
          }
        });

        this.serviciog.colors = [{ backgroundColor: this.serviciog.color }];

      });

    }

    try {
      this.calcPercentReal();
    } catch (e) {
      alert(e);
    }
    try {
      this.calValueProgra();
    } catch (e) {
      alert(e);
    }

  }

  actualizarActividad(actividad) {
    var isUpdatePercentage = false;
    this.isEditar = !this.isEditar;
    ////se comprueba si ubieron cambios en el porcentaje ejecutado
    if (this.porcentaje_ejecutado != actividad.porcentaje_cumplido) {
      this.porcentaje_ejecutado = actividad.porcentaje_cumplido - this.porcentaje_ejecutado;
      //this.porcentaje_ejecutado = this.porcentaje_ejecutado * (actividad.porcentaje/100);
      isUpdatePercentage = true;
      //alert(this.porcentaje_ejecutado);
    }

    //alert(isUpdatePercentage);
    var formData = new FormData();
    formData.append("actividad", JSON.stringify(actividad));
    formData.append(
      "porcentaje_cumplido",
      JSON.stringify(this.porcentaje_ejecutado)
    );
    formData.append("isUpdatePercentage", JSON.stringify(isUpdatePercentage));

    this.servicios.updateCaracteristica(formData).then(message => {
      //alert(JSON.stringify(message));
    });
  }

  editarClick(actividad) {
    this.isEditar = !this.isEditar;
    this.porcentaje_ejecutado = actividad.porcentaje_cumplido;
  }

  onSelectActivity(activity) {


    try {
      this.serviGloAct.actOpt = 1;

      activity.porcentaje_cumplido = activity.porcentaje_cumplido * 1;
      this.slideval = activity.porcentaje_cumplido;

      this.isTitleSelected = false;
      this.miPorcentaje = 100;
      this.porcentajeAsignado = 0;
      this.serviciog.actividad = activity;
      this.serviciog.isSelAct = true;
      this.serviGloAct.actOpt = 1;
      this.serviGloAct.subActividades = [];

      var keym = activity.keym;
      var id_usuario = activity.id_usuario;
      var id_caracteristica = activity.id_caracteristica;

      if (this.isTitleSelected && this.serviciog.actividad == null)
        this.dat = {
          keym: this.serviciog.proyecto.keym,
          id_caracteristica: this.serviciog.proyecto.id_caracteristica,
          id_usuario: this.serviciog.proyecto.id_usuario,
          tipo: this.serviciog.proyecto.tipo
        };
      else if (this.serviciog.actividad)
        this.dat = {
          keym: this.serviciog.actividad.keym,
          id_caracteristica: this.serviciog.actividad.id_caracteristica,
          id_usuario: this.serviciog.actividad.id_usuario,
          tipo: this.serviciog.actividad.tipo
        };
      else
        this.dat = {
          keym: this.serviciog.proyecto.keym,
          id_caracteristica: this.serviciog.proyecto.id_caracteristica,
          id_usuario: this.serviciog.proyecto.id_usuario,
          tipo: this.serviciog.proyecto.tipo
        };




      if (JSON.stringify(this.dat) != JSON.stringify(this.serviciog.dat)) {
        //alert(JSON.stringify(this.dat)+'        '+JSON.stringify(this.serviciog.dat));
        this.serviciog.labels = [];
        this.serviciog.data = [];
        this.serviciog.colors = [];
        this.serviciog.dat = this.dat;
        var formData = new FormData();
        formData.append("caracteristica", JSON.stringify(this.dat));
        this.servicios.getDataChart(formData).then(message => {

          //calculo grafica resumen avance



          //alert(JSON.stringify(message));
          this.serviciog.listDatChart = [];
          this.serviciog.listDatChart = message;
          var ax: any[] = [];
          this.serviciog.listDatChart.forEach(element => {
            ax.push(element.gettotalmarkerscategory);
          });
          this.serviciog.listDatChart = ax;
          var val = 0;
          this.serviciog.listDatChart.forEach(element => {
            var x = element.split(',');
            var num = parseInt(x[2]);
            if (num) val = val + num;
          });
          this.serviciog.listDatChart.forEach(element => {
            element = element.replace('(', '');
            element = element.replace(')', '');
            var x = element.split(',');
            this.serviciog.color.push(x[0]);
            var num = parseInt(x[2]);
            if (num) {
              var z = num * 100 / val;
              this.serviciog.data.push(z);
              this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : ' + z.toFixed(2) + ' %');
            }
            else {
              this.serviciog.data.push(0);
              this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : 0 %');
            }
          });

          this.serviciog.colors = [{ backgroundColor: this.serviciog.color }];

        });

      }

      var tot_ben = new FormData();

      //total benefuciary
      tot_ben.append("caracteristica", JSON.stringify(this.dat));
      this.servicios.getOnlyTotalBeneficiary(tot_ben).then(message => {
        this.serviciog.total_beneficiary = 0;
        try { this.serviciog.total_beneficiary = message[0].getonlytotalbeneficiary; }
        catch (e) {
          // alert(e)
        };
      }).catch(e => {
        alert('ERROR   =>  ' + e);
      });


      this.servicios
        .getActividad(keym, id_usuario, id_caracteristica)
        .then(actividades => {
          if (actividades) {
            this.serviGloAct.subActividades = actividades;
            var num = this.serviciog.tipos_act.indexOf(
              this.serviGloAct.subActividades[0].tipo
            );
            this.serviGloAct.tipo = this.serviciog.tipos_act[num];

            this.calculateValue(actividades);

          }
        });
      this.serviciog.porcentaje_real = 0;
      this.serviciog.porcentajeDifProgramadoEjecutado = 0;
      this.calcPercentReal();
      this.calValueProgra();
      try {

        this.barChartData = [
          { data: [this.serviciog.porcentaje_real], label: parseFloat(this.serviciog.porcentaje_real).toFixed(2) + '  %' },
          { data: [this.serviciog.actividad.porcentaje_cumplido], label: parseFloat(this.serviciog.actividad.porcentaje_cumplido).toFixed(2) + '  %' },
          { data: [Math.abs(this.serviciog.porcentajeDifProgramadoEjecutado)], label: Math.abs(parseFloat((this.serviciog.porcentajeDifProgramadoEjecutado) + '')).toFixed(2) + '  %' }
        ];
        this.barChartLabels = [
          '% de obra Programado ',
          '% Real Ejecutado ',
          '% Programado VS Ejecutado'
        ];
      } catch (e) {
        // alert(e);
      }

    } catch (e) {
      //alert('bad' + e);
    }
    if (this.serviciog.actividad.tipo === 'Capitulo')
      this.activityEnabled();
  }

  valPor(flag, i) {
    if (flag) {
      if (this.serviciog.actividades[i].porcentaje < 0) {
        this.serviciog.actividades[i].porcentaje = 0;
        this.calculateValue(this.serviciog.actividades);
      } else if (this.serviciog.actividades[i].porcentaje > 100) {
        this.serviciog.actividades[i].porcentaje = 100;
        this.calculateValue(this.serviciog.actividades);
      } else {
        this.calculateValue(this.serviciog.actividades);
      }
    } else {
      this.calculateValue(this.serviGloAct.subActividades);
    }


  }

  tituloClick() {
    //alert(this.serviciog.ax_dat);
    this.isTitleSelected = true;

    var num = this.serviciog.tipos_act.indexOf(
      this.serviciog.actividades[0].tipo
    );
    this.serviGloAct.tipo2 = this.serviciog.tipos_act[num];

    if (!this.serviciog.isSubActivity) {
      this.serviciog.isSelAct = false;
      this.serviGloAct.actOpt = 0;
    } else {
      this.serviGloAct.actOpt = 1;
      this.serviciog.actividad = this.serviciog.isSubActivity;
      //alert('Global act  ' + JSON.stringify(this.serviciog.isSubActivity));
      this.serviciog.actividad.porcentaje_cumplido = this.serviciog.actividad.porcentaje_cumplido * 1;
      //alert(this.serviciog.actividad);
      this.slideval = this.serviciog.isSubActivity.porcentaje_cumplido * 1;
    }


    if (this.isTitleSelected && this.serviciog.actividad == null)
      this.dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario,
        tipo: this.serviciog.proyecto.tipo
      };
    else if (this.serviciog.actividad)
      this.dat = {
        keym: this.serviciog.actividad.keym,
        id_caracteristica: this.serviciog.actividad.id_caracteristica,
        id_usuario: this.serviciog.actividad.id_usuario,
        tipo: this.serviciog.actividad.tipo
      };
    else
      this.dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario,
        tipo: this.serviciog.proyecto.tipo
      };

    if (JSON.stringify(this.serviciog.dat) != JSON.stringify(this.dat)) {
      this.serviciog.dat = this.dat;
      this.serviciog.labels = [];
      this.serviciog.data = [];
      this.serviciog.colors = [];
      var formData = new FormData();
      formData.append("caracteristica", JSON.stringify(this.dat));
      this.servicios.getDataChart(formData).then(message => {
        //alert(JSON.stringify(message));
        //alert(JSON.stringify(this.serviciog.isSubActivity));
        if (this.serviciog.isSubActivity) {
          this.barChartData = [
            { data: [this.serviciog.porcentaje_real], label: parseFloat(this.serviciog.porcentaje_real).toFixed(2) + '  %' },
            { data: [this.serviciog.actividad.porcentaje_cumplido], label: parseFloat(this.serviciog.actividad.porcentaje_cumplido).toFixed(2) + '  %' },
            { data: [Math.abs(this.serviciog.porcentajeDifProgramadoEjecutado)], label: Math.abs(parseFloat((this.serviciog.porcentajeDifProgramadoEjecutado) + '')).toFixed(2) + '  %' }
          ];
          this.barChartLabels = [
            '% de obra Programado ',
            '% Real Ejecutado ',
            '% Programado VS Ejecutado'
          ];
        }


        this.serviciog.listDatChart = [];
        this.serviciog.listDatChart = message;
        var ax: any[] = [];
        this.serviciog.listDatChart.forEach(element => {
          ax.push(element.gettotalmarkerscategory);
        });
        this.serviciog.listDatChart = ax;
        var val = 0;
        this.serviciog.listDatChart.forEach(element => {
          var x = element.split(',');
          var num = parseInt(x[2]);
          if (num) val = val + num;
        });
        this.serviciog.listDatChart.forEach(element => {
          element = element.replace('(', '');
          element = element.replace(')', '');
          var x = element.split(',');
          this.serviciog.color.push(x[0]);
          var num = parseInt(x[2]);
          if (num) {
            var z = num * 100 / val;
            this.serviciog.data.push(z);
            this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : ' + z.toFixed(2) + ' %');
          }
          else {
            this.serviciog.data.push(0);
            this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : 0 %');
          }
        });
        this.serviciog.colors = [{ backgroundColor: this.serviciog.color }];
      });

    }

    var tot_ben = new FormData();

    //total benefuciary
    tot_ben.append("caracteristica", JSON.stringify(this.dat));
    this.servicios.getOnlyTotalBeneficiary(tot_ben).then(message => {
      this.serviciog.total_beneficiary = 0;
      try { this.serviciog.total_beneficiary = message[0].getonlytotalbeneficiary; }
      catch (e) {
        // alert(e) 
      };
    }).catch(e => {
      alert('ERROR   =>  ' + e);
    });
    this.serviciog.porcentaje_real = 0;
    this.serviciog.porcentajeDifProgramadoEjecutado = 0;
    this.calcPercentReal();
    this.calValueProgra();

    try {
      this.barChartData = [
        { data: [this.serviciog.porcentaje_real], label: parseFloat(this.serviciog.porcentaje_real).toFixed(2) + '  %' },
        { data: [this.serviciog.actividad.porcentaje_cumplido], label: parseFloat(this.serviciog.actividad.porcentaje_cumplido).toFixed(2) + '  %' },
        { data: [Math.abs(this.serviciog.porcentajeDifProgramadoEjecutado)], label: Math.abs(parseFloat((this.serviciog.porcentajeDifProgramadoEjecutado) + '')).toFixed(2) + '  %' }
      ];
      this.barChartLabels = [
        '% de obra Programado ',
        '% Real Ejecutado ',
        '% Programado VS Ejecutado'
      ];
    } catch (e) {
      // alert(e);
    }


    if (
      this.serviciog.actividad.keym == this.serviciog.proyecto.keym &&
      this.serviciog.actividad.id_caracteristica == this.serviciog.proyecto.id_caracteristica &&
      this.serviciog.actividad.id_usuario == this.serviciog.proyecto.id_usuario
    ) {
      this.serviGloAct.actOpt = 0;
      //this.ngOnInit();
    }


  }

  //actualiza los porcentajes de las  actividades hijas
  sendPercentage() {
    var formData = new FormData();
    if (!this.serviciog.isSelAct) {
      formData.append(
        "actividades",
        JSON.stringify(this.serviciog.actividades)
      );
    } else {
      formData.append(
        "actividades",
        JSON.stringify(this.serviGloAct.subActividades)
      );
    }

    this.servicios.updatePercentage(formData).then(message => {
      alert(JSON.stringify(message));
    });
  }

  inicio() {

    for (var i = 0; i < this.serviciog.tree_name.length; i++) {
      this.serviciog.tree_name.pop();
    }
    this.serviGloAct.tipo2 = this.serviciog.tipos_act[
      this.serviciog.tipos_act.indexOf(this.serviciog.proyecto.tipo) + 1
    ];

    this.serviciog.titulo = this.serviciog.proyecto.nom_pro;

    var keym = this.serviciog.proyecto.keym;
    var id_usuario = this.serviciog.proyecto.id_usuario;
    var id_caracteristica = this.serviciog.proyecto.id_caracteristica;
    this.serviciog.isSubActivity = null;
    this.serviciog.isSelAct = false;
    this.serviGloAct.actOpt = 0;
    this.servicios
      .getActividad(keym, id_usuario, id_caracteristica)
      .then(actividad => {
        this.serviciog.actividades = actividad;
        this.serviciog.activityList = actividad;
        actividad.porcentaje_cumplido = actividad.porcentaje_cumplido * 1;
        this.slideval = actividad.porcentaje_cumplido;

      });
  }

  entrarACtividad(actividad) {
    this.txt_search = "";
    this.serviGloAct.actOpt = 1;
    this.serviciog.ax_actividad = actividad;
    actividad.porcentaje_cumplido = actividad.porcentaje_cumplido * 1;
    this.slideval = actividad.porcentaje_cumplido;
    this.isTitleSelected = true;
    this.serviciog.tree_name.push(actividad.nom_act);
    this.serviGloAct.tipo2 = this.serviciog.tipos_act[
      this.serviciog.tipos_act.indexOf(actividad.tipo) + 1
    ];


    if (this.isTitleSelected && this.serviciog.actividad == null)
      var xdat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario,
        tipo: this.serviciog.proyecto.tipo
      };
    else if (this.serviciog.actividad)
      var xdat = {
        keym: this.serviciog.actividad.keym,
        id_caracteristica: this.serviciog.actividad.id_caracteristica,
        id_usuario: this.serviciog.actividad.id_usuario,
        tipo: this.serviciog.actividad.tipo
      };
    else
      var xdat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario,
        tipo: this.serviciog.proyecto.tipo
      };
    this.serviciog.dat = xdat;
    //alert(JSON.stringify(this.serviciog.tree_name));
    this.serviGloAct.lastActividad.push(this.serviciog.isSubActivity);

    this.subActivity = [];
    this.serviciog.actividades = [];
    this.serviciog.activityList = [];
    this.serviciog.actividad = actividad;
    this.serviciog.isSubActivity = actividad;
    var keym = actividad.keym;
    var id_usuario = actividad.id_usuario;
    var id_caracteristica = actividad.id_caracteristica;

    this.serviciog.titulo = actividad.nom_act;

    this.servicios
      .getActividad(keym, id_usuario, id_caracteristica)
      .then(actividad => {
        if (actividad) {
          this.serviciog.actividades = actividad;
          this.serviciog.activityList = actividad;
          var num = this.serviciog.tipos_act.indexOf(
            this.serviciog.actividades[0].tipo
          );
          this.serviGloAct.tipo = this.serviciog.tipos_act[num + 1];
          //Agrega variable para mostrar si esta bloqueado o no el capitulo y sus subactividades 
          this.verifyAllActs();
          //alert('1 '+this.serviGloAct.tipo);
        }

      });
  }

  regresar() {
    this.txt_search = "";
    if (this.serviciog.isSubActivity)
      this.serviciog.actividad = this.serviciog.isSubActivity;
    else
      this.serviciog.actividad = this.serviciog.proyecto;
    this.serviciog.tree_name.pop();
    var axAct = this.serviciog.actividad;


    if (this.serviciog.actividad.id_caracteristica_padre != 1 && (this.serviciog.usuario.tipo_usuario != 'sup' || this.serviciog.actividad.usuario_asignado != this.serviciog.usuario.id_usuario)) {

      this.servicios.getBackActividad(axAct.keym_padre, axAct.id_caracteristica_padre, axAct.id_usuario_padre).
        then(x => {
          //alert('Back  =>   ' + x + '     -    ' + x.id_caracteristica + '  -   ' + x.id_caracteristica_padre);
          //var lastActividad = this.serviGloAct.lastActividad.pop();
          var lastActividad = x;
          this.serviciog.ax_actividad = x;

          if (lastActividad != this.serviciog.isSubActivity && lastActividad != false) {
            this.serviGloAct.tipo2 = this.serviciog.tipos_act[
              this.serviciog.tipos_act.indexOf(lastActividad.tipo) + 1
            ];
            this.subActivity = [];
            this.serviciog.actividades = [];
            this.serviciog.activityList = [];
            //alert(this.serviciog.proyecto.id_caracteristica+'    '+this.serviciog.actividad.id_caracteristica +'      '+this.serviciog.actividad.id_caracteristica_padre);
            if (this.serviciog.proyecto != null && this.serviciog.actividad.id_caracteristica_padre == this.serviciog.proyecto.id_caracteristica) {
              this.serviciog.actividad = this.serviciog.proyecto;
              this.serviGloAct.actOpt = 0;
            }
            else {
              this.serviGloAct.actOpt = 1;
              this.serviciog.actividad = lastActividad;
            }

            //this.serviciog.actividad = lastActividad;
            this.serviciog.isSubActivity = lastActividad;
            var keym = lastActividad.keym;
            var id_usuario = lastActividad.id_usuario;
            var id_caracteristica = lastActividad.id_caracteristica;

            this.serviciog.titulo = lastActividad.nom_act;


            this.servicios
              .getActividad(keym, id_usuario, id_caracteristica)
              .then(actividad => {
                if (actividad) {

                  this.serviciog.actividades = actividad;
                  this.serviciog.activityList = actividad;
                  var num = this.serviciog.tipos_act.indexOf(actividad[0].tipo);
                  this.serviGloAct.tipo = this.serviciog.tipos_act[num];


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

                  this.serviciog.labels = [];
                  this.serviciog.data = [];
                  this.serviciog.colors = [];
                  var formData = new FormData();
                  formData.append("caracteristica", JSON.stringify(dat));
                  this.servicios.getDataChart(formData).then(message => {

                    //alert(JSON.stringify(message));
                    this.serviciog.listDatChart = [];
                    this.serviciog.listDatChart = message;
                    var ax: any[] = [];
                    this.serviciog.listDatChart.forEach(element => {
                      ax.push(element.gettotalmarkerscategory);
                    });
                    this.serviciog.listDatChart = ax;
                    var val = 0;
                    this.serviciog.listDatChart.forEach(element => {
                      var x = element.split(',');
                      var num = parseInt(x[2]);
                      if (num) val = val + num;
                    });
                    this.serviciog.listDatChart.forEach(element => {
                      element = element.replace('(', '');
                      element = element.replace(')', '');
                      var x = element.split(',');
                      this.serviciog.color.push(x[0]);
                      var num = parseInt(x[2]);
                      if (num) {
                        var z = num * 100 / val;
                        this.serviciog.data.push(z);
                        this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : ' + z.toFixed(2) + ' %');
                      }
                      else {
                        this.serviciog.data.push(0);
                        this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : 0 %');
                      }
                    });
                    this.serviciog.colors = [{ backgroundColor: this.serviciog.color }];
                  });

                  var tot_ben = new FormData();
                  //total benefuciary
                  tot_ben.append("caracteristica", JSON.stringify(dat));
                  this.servicios.getOnlyTotalBeneficiary(tot_ben).then(message => {
                    this.serviciog.total_beneficiary = 0;
                    try { this.serviciog.total_beneficiary = message[0].getonlytotalbeneficiary; }
                    catch (e) {
                      // alert(e) 
                    };
                  }).catch(e => {
                    alert('ERROR   =>  ' + e);
                  });
                  this.serviciog.porcentaje_real = 0;
                  this.serviciog.porcentajeDifProgramadoEjecutado = 0;
                  this.calcPercentReal();
                  this.calValueProgra();
                  //Agrega variable para mostrar si esta bloqueado o no el capitulo y sus subactividades 
                  this.verifyAllActs();
                }
              });
          } else {
            this.serviGloAct.tipo2 = this.serviciog.tipos_act[0];
            this.inicio();
          }
        }).catch(x => { })
    }
    else if (this.serviciog.actividad.id_caracteristica_padre == 1 && (this.serviciog.usuario.tipo_usuario != 'sup' || this.serviciog.actividad.usuario_asignado != this.serviciog.usuario.id_usuario)) {
      if (this.isTitleSelected && this.serviciog.actividad == null)
        var xdat = {
          keym: this.serviciog.proyecto.keym_padre,
          id_caracteristica: this.serviciog.proyecto.id_caracteristica_padre,
          id_usuario: this.serviciog.proyecto.id_usuario_padre
        };
      else if (this.serviciog.actividad)
        var xdat = {
          keym: this.serviciog.actividad.keym_padre,
          id_caracteristica: this.serviciog.actividad.id_caracteristica_padre,
          id_usuario: this.serviciog.actividad.id_usuario_padre
        };
      else
        var xdat = {
          keym: this.serviciog.proyecto.keym_padre,
          id_caracteristica: this.serviciog.proyecto.id_caracteristica_padre,
          id_usuario: this.serviciog.proyecto.id_usuario_padre
        };

      var formData = new FormData();

      formData.append('caracteristica', JSON.stringify(xdat));
      this.servicios.getOneProject(formData).then(x => {
        //alert('Back  =>   ' + JSON.stringify(x) + '     -    ' + x.id_caracteristica + '  -   ' + x.id_caracteristica_padre);
        //var lastActividad = this.serviGloAct.lastActividad.pop();
        var lastActividad = x[0];
        this.serviciog.ax_actividad = x[0];
        this.serviciog.proyecto = x[0];
        this.serviGloAct.actOpt = 0;

        //alert(this.serviciog.proyecto.tipo_caracteristica);
        if (lastActividad != this.serviciog.isSubActivity && lastActividad != false) {
          this.serviGloAct.tipo2 = this.serviciog.tipos_act[
            this.serviciog.tipos_act.indexOf(lastActividad.tipo) + 1
          ];
          this.subActivity = [];
          this.serviciog.actividades = [];
          this.serviciog.activityList = [];
          this.serviciog.actividad = lastActividad;
          this.serviciog.isSubActivity = lastActividad;
          var keym = lastActividad.keym;
          var id_usuario = lastActividad.id_usuario;
          var id_caracteristica = lastActividad.id_caracteristica;

          this.serviciog.titulo = lastActividad.nom_act;
          this.serviGloAct.actOpt = 0;

          // alert(JSON.stringify(lastActividad));
          this.servicios
            .getActividad(keym, id_usuario, id_caracteristica)
            .then(actividad => {
              if (actividad) {

                this.serviciog.actividades = actividad;
                this.serviciog.activityList = actividad;
                var num = this.serviciog.tipos_act.indexOf(actividad[0].tipo);
                this.serviGloAct.tipo = this.serviciog.tipos_act[num];


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

                this.serviciog.labels = [];
                this.serviciog.data = [];
                this.serviciog.colors = [];
                var formData = new FormData();
                formData.append("caracteristica", JSON.stringify(dat));
                this.servicios.getDataChart(formData).then(message => {

                  //alert(JSON.stringify(message));
                  this.serviciog.listDatChart = [];
                  this.serviciog.listDatChart = message;
                  var ax: any[] = [];
                  this.serviciog.listDatChart.forEach(element => {
                    ax.push(element.gettotalmarkerscategory);
                  });
                  this.serviciog.listDatChart = ax;
                  var val = 0;
                  this.serviciog.listDatChart.forEach(element => {
                    var x = element.split(',');
                    var num = parseInt(x[2]);
                    if (num) val = val + num;
                  });
                  this.serviciog.listDatChart.forEach(element => {
                    element = element.replace('(', '');
                    element = element.replace(')', '');
                    var x = element.split(',');
                    this.serviciog.color.push(x[0]);
                    var num = parseInt(x[2]);
                    if (num) {
                      var z = num * 100 / val;
                      this.serviciog.data.push(z);
                      this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : ' + z.toFixed(2) + ' %');
                    }
                    else {
                      this.serviciog.data.push(0);
                      this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : 0 %');
                    }
                  });
                  this.serviciog.colors = [{ backgroundColor: this.serviciog.color }];
                });

                var tot_ben = new FormData();
                //total benefuciary
                tot_ben.append("caracteristica", JSON.stringify(dat));
                this.servicios.getOnlyTotalBeneficiary(tot_ben).then(message => {
                  this.serviciog.total_beneficiary = 0;
                  try { this.serviciog.total_beneficiary = message[0].getonlytotalbeneficiary; }
                  catch (e) {
                    // alert(e) 
                  };
                }).catch(e => {
                  alert('ERROR   =>  ' + e);
                });

                this.calcPercentReal();
                //Agrega variable para mostrar si esta bloqueado o no el capitulo y sus subactividades 
                this.verifyAllActs();
              }
            });
        } else {
          this.serviGloAct.tipo2 = this.serviciog.tipos_act[0];
          this.inicio();
        }
      }).catch(x => { });
    }

  }

  getUsers() {
    if (this.serviciog.usuario.tipo_usuario !== "sup")
      this.servicios.getUserList(null).then(usuarios => {
        if (usuarios) {
          this.usuarios = usuarios;
        }
      });
  }

  asignarUsuario(usuario) {
    this.serviciog.actividad.usr_nom = usuario.nombre;
    this.serviciog.actividad.usr_ape = usuario.apellido;
    this.serviciog.actividad.e_mail = usuario.e_mail;
    //alert(JSON.stringify(usuario))
    var formData = new FormData();
    formData.append("keym", "0");
    formData.append("usuario", JSON.stringify(usuario));
    formData.append("caracteristica", JSON.stringify(this.serviciog.actividad));
    //alert(formData.toString());
    this.servicios.assignActivityToUser(formData).then(message => {
      alert(JSON.stringify(message));
    });
  }

  //Detalles    =   Detalles del proyecto padre
  c0() {
    this.serviGloAct.actOpt = 0;

    if (this.isTitleSelected && this.serviciog.actividad == null)
      this.dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario,
        tipo: this.serviciog.proyecto.tipo
      };
    else if (this.serviciog.actividad)
      this.dat = {
        keym: this.serviciog.actividad.keym,
        id_caracteristica: this.serviciog.actividad.id_caracteristica,
        id_usuario: this.serviciog.actividad.id_usuario,
        tipo: this.serviciog.actividad.tipo
      };
    else
      this.dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario,
        tipo: this.serviciog.proyecto.tipo
      };




    if (JSON.stringify(this.dat) != JSON.stringify(this.serviciog.dat)) {
      //alert(JSON.stringify(this.dat)+'        '+JSON.stringify(this.serviciog.dat));
      this.serviciog.dat = this.dat;
      var formData = new FormData();
      formData.append("caracteristica", JSON.stringify(this.dat));
      this.servicios.getDataChart(formData).then(message => {

        //alert(JSON.stringify(message));
        this.serviciog.listDatChart = [];
        this.serviciog.listDatChart = message;
        var ax: any[] = [];
        this.serviciog.listDatChart.forEach(element => {
          ax.push(element.gettotalmarkerscategory);
        });
        this.serviciog.listDatChart = ax;
        var val = 0;
        this.serviciog.listDatChart.forEach(element => {
          var x = element.split(',');
          var num = parseInt(x[2]);
          if (num) val = val + num;
        });
        this.serviciog.listDatChart.forEach(element => {
          element = element.replace('(', '');
          element = element.replace(')', '');
          var x = element.split(',');
          this.serviciog.color.push(x[0]);
          var num = parseInt(x[2]);
          if (num) {
            var z = num * 100 / val;
            this.serviciog.data.push(z);
            this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : ' + z.toFixed(2) + ' %');
          }
          else {
            this.serviciog.data.push(0);
            this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : 0 %');
          }
        });

        this.serviciog.colors = [{ backgroundColor: this.serviciog.color }];

      });

    }

  }

  //Detalles    =   Muestra informacion detallada del proyecto interno o actividad seleccionada
  c1() {


    this.serviGloAct.actOpt = 1;

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
    var tot_ben = new FormData();
    tot_ben.append("caracteristica", JSON.stringify(dat));
    this.servicios.getOnlyTotalBeneficiary(tot_ben).then(message => {
      this.serviciog.total_beneficiary = 0;
      try { this.serviciog.total_beneficiary = message[0].getonlytotalbeneficiary; }
      catch (e) {
        // alert(e) 
      };
    }).catch(e => {
      alert('ERROR   =>  ' + e);
    });

    this.calcPercentReal();
    this.calValueProgra();

  }

  //  Funcion para habilitar o no la el cambio del porcentaje de actividad
  private activityEnabled() {
    var fecha_actual = new Date();


    var ax_ult_mod = new Date(this.serviciog.actividad.fecha_ultima_modificacion);

    var fec_act = new Date(fecha_actual.getFullYear(), fecha_actual.getMonth(), fecha_actual.getDate());
    var fec_ini = new Date(this.serviciog.actividad.fecha_inicio);

    var fact = new Date(fec_act.getFullYear(), fec_act.getMonth(), fec_act.getDate());
    var fini = new Date(fec_ini.getFullYear(), fec_ini.getMonth(), fec_ini.getDate());
    var axmod = new Date(ax_ult_mod.getFullYear(), ax_ult_mod.getMonth(), ax_ult_mod.getDate());

    var dif = fact.getTime() - fini.getTime();
    var dias = Math.floor(dif / (1000 * 60 * 60 * 24));

    if (this.serviciog.actividad.estado !== 'Inicio' || this.serviciog.actividad.estado !== 'Entrega de materiales') {

      if (this.serviciog.actividad.nom_act === this.serviciog.json_act[0]) {
        // this.serviciog.state_act = true;
        this.verifyEnableAct(false, null);
        // alert(this.serviciog.actividad.fecha_ultima_modificacion+'  '+true+'   '+this.serviciog.actividad.nom_act);
      }
      else if (dias >= 0) {
        // this.serviciog.state_act = true;
        this.verifyEnableAct(false, null);
        // alert(this.serviciog.actividad.fecha_ultima_modificacion+'  '+true+'  dias > 0 '+ dias);
      }
      else {
        var dif = fact.getTime() - ax_ult_mod.getTime();
        var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
        if (dias >= 0) {
          // this.serviciog.state_act = true;
          this.verifyEnableAct(false, null);
          // alert(this.serviciog.actividad.fecha_ultima_modificacion+'  '+true+' recalculo dias > 0 '+ dias);
        }
        else {
          this.serviciog.state_act = false;
          // alert(this.serviciog.actividad.fecha_ultima_modificacion+'  '+true+' recalculo dias < 0 '+ dias);
        }
      }

    }
    else {
      //alert(this.serviciog.actividad.nom_act);
      this.serviciog.state_act = false;
    }
    //alert(dif + '   '+dias);
  }

  getActivity(nom) {
    var act;
    this.serviciog.actividades.forEach(element => {
      if (element.nom_act == nom) {
        act = element;
      }
    });
    return act;
  }

  verifyAllActs() {
    if (this.serviciog.activityList[0].tipo === 'Capitulo')
      this.serviciog.activityList.forEach(element => {
        element = this.verifyEnableAct(true, element);
      });
  }

  verifyEnableAct(ban: boolean, activity: any) {
    if (ban)
      var cad = activity.nom_act;
    else
      var cad = this.serviciog.actividad.nom_act;

    switch (cad) {
      //==================    01     ================//
      case '01 - Obras Preliminares':
        {

          if (this.serviciog.ax_actividad.estado === 'Ejecucion de obra') {
            this.serviciog.state_act = true;
            if (ban) activity.lock = false;
          }
          else {
            this.serviciog.state_act = false;
            if (ban) activity.lock = true;
          }

        }
        break;
      //==================    02     ================//
      case '02 - Cimentacion':
        var act = this.getActivity('01 - Obras Preliminares');
        if (act.porcentaje_cumplido > 0) {
          this.serviciog.state_act = true;
          if (ban) activity.lock = false;
        }
        else {
          this.serviciog.state_act = false;
          if (ban) activity.lock = true;
        }
        break;
      //==================    07     ================//
      case '03 - Estructura En Concreto':
        var act = this.getActivity('02 - Cimentacion');
        if (act.porcentaje_cumplido > 0) {
          this.serviciog.state_act = true;
          if (ban) activity.lock = false;
        }
        else {
          this.serviciog.state_act = false;
          if (ban) activity.lock = true;
        }
        break;
      //==================    03     ================//
      case '04 - Mamposteria':
        var act = this.getActivity('02 - Cimentacion');
        if (act.porcentaje_cumplido > 0) {
          this.serviciog.state_act = true;
          if (ban) activity.lock = false;
        }
        else {
          this.serviciog.state_act = false;
          if (ban) activity.lock = true;
        }
        break;
      //==================    08     ================//
      case '05 - Pisos':
        var act = this.getActivity('02 - Cimentacion');
        if (act.porcentaje_cumplido > 0) {
          this.serviciog.state_act = true;
          if (ban) activity.lock = false;
        }
        else {
          this.serviciog.state_act = false;
          if (ban) activity.lock = true;
        }
        break;
      //==================    10     ================//
      case '06 - Cubierta':
        //var act = this.getActivity('13 - Pozo Séptico');
        var act_1 = this.getActivity('04 - Mamposteria');
        // if (act.porcentaje_cumplido > 0 && act_1.porcentaje_cumplido > 0) {
        if (act_1.porcentaje_cumplido > 0) {
          this.serviciog.state_act = true;
          if (ban) activity.lock = false;
        }
        else {
          this.serviciog.state_act = false;
          if (ban) activity.lock = true;
        }
        break;
      //==================    04     ================//
      case '07 - Instalaciones Hidraulicas':
        var act = this.getActivity('02 - Cimentacion');
        if (act.porcentaje_cumplido > 0) {
          this.serviciog.state_act = true;
          if (ban) activity.lock = false;
        }
        else {
          this.serviciog.state_act = false;
          if (ban) activity.lock = true;
        }
        break;
      //==================    05     ================//
      case '08 - Instalaciones Electricas':
        var act = this.getActivity('02 - Cimentacion');
        if (act.porcentaje_cumplido > 0) {
          this.serviciog.state_act = true;
          if (ban) activity.lock = false;
        }
        else {
          this.serviciog.state_act = false;
          if (ban) activity.lock = true;
        }
        break;
      //==================    06     ================//
      case '09 - Instalaciones Sanitarias':
        var act = this.getActivity('02 - Cimentacion');
        if (act.porcentaje_cumplido > 0) {
          this.serviciog.state_act = true;
          if (ban) activity.lock = false;
        }
        else {
          this.serviciog.state_act = false;
          if (ban) activity.lock = true;
        }
        break;
      //==================    12     ================//
      case '10 - Acabados':
        var act = this.getActivity('04 - Mamposteria');
        if (act.porcentaje_cumplido > 0) {
          this.serviciog.state_act = true;
          if (ban) activity.lock = false;
        }
        else {
          this.serviciog.state_act = false;
          if (ban) activity.lock = true;
        }
        break;
      //==================    11     ================//
      case '11 - Carpinterias':
        var act = this.getActivity('06 - Cubierta');
        if (act.porcentaje_cumplido > 0) {
          this.serviciog.state_act = true;
          if (ban) activity.lock = false;
        }
        else {
          this.serviciog.state_act = false;
          if (ban) activity.lock = true;
        }
        break;
      //==================    13     ================//
      case '12 - Otros':
        var act = this.getActivity('11 - Carpinterias');
        if (act.porcentaje_cumplido > 0) {
          this.serviciog.state_act = true;
          if (ban) activity.lock = false;
        }
        else {
          this.serviciog.state_act = false;
          if (ban) activity.lock = true;
        }
        break;
      //==================    09     ================//
      case '13 - Pozo Séptico':

        var act_1 = this.getActivity('04 - Mamposteria');
        var act_2 = this.getActivity('07 - Instalaciones Hidraulicas');
        var act_3 = this.getActivity('08 - Instalaciones Electricas');
        var act_4 = this.getActivity('09 - Instalaciones Sanitarias');

        var act_5 = this.getActivity('03 - Estructura En Concreto');
        var act_6 = this.getActivity('05 - Pisos');

        if (
          act_1.porcentaje_cumplido > 0 &&
          act_2.porcentaje_cumplido > 0 &&
          act_3.porcentaje_cumplido > 0 &&
          act_4.porcentaje_cumplido > 0 &&
          act_5.porcentaje_cumplido > 0 &&
          act_6.porcentaje_cumplido > 0
        ) {
          this.serviciog.state_act = true;
          if (ban) activity.lock = false;
        }

        else {
          this.serviciog.state_act = false;
          if (ban) activity.lock = true;
        }

        break;
    }
    // alert('ok ' + activity.lock);
    if (ban) return activity;
    //alert(this.serviciog.state_act);
  }

  //calculo pocentaje real
  public calcPercentReal() {

    if (this.serviciog.actividad.porcentaje == 0)
      this.serviciog.actividad.porcentaje = 0.00;
    this.serviciog.porcentaje_real = 0;
    this.serviciog.porcentajeDifProgramadoEjecutado = 0;
    var fecha_actual = new Date();

    if (this.serviciog.actividad.estado != 'null' && this.serviciog.actividad.estado != 'Inicio') {
      try {
        var aFecha2 = new Date(this.serviciog.actividad.fecha_inicio);
        var aFecha3 = new Date(this.serviciog.actividad.fecha_fin);
        var fFecha1 = new Date(fecha_actual.getFullYear(), fecha_actual.getMonth(), fecha_actual.getDate());
        var fFecha2 = new Date(aFecha2.getFullYear(), aFecha2.getMonth(), aFecha2.getDate());
        var fFecha3 = new Date(aFecha3.getFullYear(), aFecha3.getMonth(), aFecha3.getDate());

        var dif = fFecha1.getTime() - fFecha2.getTime();
        var difAc = fFecha3.getTime() - fFecha2.getTime();
        var diasAc = Math.floor(difAc / (1000 * 60 * 60 * 24));
        var dias = Math.floor(dif / (1000 * 60 * 60 * 24));

      } catch (e) {
        //alert(e);
      }
      try {
        //alert(dias);
        if ((dias + 1) > 0) {
          if (this.serviciog.actividad.tipo == "Beneficiario") {
            //alert(diasAc)
            this.serviciog.porcentaje_real = 0;
            if (dias > 9 && dias <= 30) {
              //alert(dias)
              var por = 100 / 21;
              //alert(por);
              this.serviciog.porcentaje_real = ((dias - 9) * por);

            } else if (dias > 30) {

              this.serviciog.porcentaje_real = 100;
            }
          } else {
            //  alert(dias)
            this.serviciog.porcentaje_real = (dias * (100 / (diasAc)));
            // alert('TOT   '+this.serviciog.porcentaje_real);
          }
          if (this.serviciog.porcentaje_real > 100) {
            this.serviciog.porcentaje_real = 100;
          }
          // else {
          //   var aFecha = this.serviciog.actividad.fecha_inicio.split('-');
          //   var cFecha = this.serviciog.proyecto.fecha_inicio.split('-');
          //   var faFecha = new Date(parseInt(cFecha[0]), parseInt(cFecha[1]) - 1, parseInt(cFecha[2]));
          //   var fcFecha = new Date(parseInt(aFecha[0]), parseInt(aFecha[1]) - 1, parseInt(aFecha[2]));
          //   var diff = fcFecha.getTime() - faFecha.getTime();
          //   var diasd = Math.floor(diff / (1000 * 60 * 60 * 24));
          //   this.serviciog.porcentaje_real = (dias * (100 / (300 - diasd))).toFixed(2);
          // }
          //alert(this.serviciog.porcentaje_real)
        }

      } catch (e) {
        //alert(e);
      }
      if (this.serviGloAct.actOpt == 1)
        this.serviciog.porcentajeDifProgramadoEjecutado = this.serviciog.proyecto.porcentaje_cumplido - this.serviciog.porcentaje_real;
      this.serviciog.porcentajeDifProgramadoEjecutado = this.serviciog.actividad.porcentaje_cumplido - this.serviciog.porcentaje_real;
      // console.log(this.serviciog.porcentajeDifProgramadoEjecutado);
    }

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
    //alert(this.serviciog.actividad.fecha_inicio)
  }


  /* calcostoProgramdo */
  public calValueProgra() {
    this.serviciog.costo_programado = 0;
    this.serviciog.valueDifProgramadoEjecuato = 0;
    var fecha_actual = new Date();

    if (this.serviciog.actividad.estado !== 'null' && this.serviciog.actividad.estado !== 'Inicio') {
      // alert(this.serviciog.actividad.fecha_fin)
      var aFecha2 = new Date(this.serviciog.actividad.fecha_inicio); //fecha inico actividad
      var aFecha3 = new Date(this.serviciog.actividad.fecha_fin); //fecha fin actividad 
      //fecha actual 
      var fFecha1 = new Date(fecha_actual.getFullYear(), fecha_actual.getMonth(), fecha_actual.getDate());
      var fFecha2 = new Date(aFecha2.getFullYear(), aFecha2.getMonth(), aFecha2.getDate());
      var fFecha3 = new Date(aFecha3.getFullYear(), aFecha3.getMonth(), aFecha3.getDate());
      var dif = fFecha1.getTime() - fFecha2.getTime();
      var difAc = fFecha3.getTime() - fFecha2.getTime();
      var diasAc = Math.floor(difAc / (1000 * 60 * 60 * 24));
      //alert(diasAc);
      var dias = Math.floor(dif / (1000 * 60 * 60 * 24));

      if (dias >= 0 && dias) {

        if (this.serviciog.actividad.tipo == 'Beneficiario') {
          if (dias > 9) {
            // alert('DIAS ' + dias);
            var dinero = {
              "10": 93922.275,
              "11": 473564.841666667,
              "12": 379642.566666667,
              "13": 1537994.51664216,
              "14": 1158351.94997549,
              "15": 1158351.94997549,
              "16": 1158351.94997549,
              "17": 1158351.94997549,
              "18": 1158351.94997549,
              "19": 1158351.94997549,
              "20": 1286678.2990664,
              "21": 949753.111566399,
              "22": 949753.111566399,
              "23": 949753.111566399,
              "24": 1326397.9455664,
              "25": 1060232.91639973,
              "26": 2256561.74639973,
              "27": 2256561.74639973,
              "28": 2256561.74639973,
              "29": 1810640.44614973,
              "30": 1653452.95909091,
            };
            if (dias > 30)
              dias = 30;
            var plata = 0;
            for (var i = dias; i > 9; i--) {
              plata += dinero[i];
            }
            this.serviciog.costo_programado = plata;
            //alert(this.serviciog.costo_programado);
          }
          else
            this.serviciog.costo_programado = 0;

        } else {

          if (dias > diasAc) {
            // var costo_diario = this.serviciog.actividad.costo_real / (diasAc + 1);
            this.serviciog.costo_programado = this.serviciog.actividad.costo_real;
          }
          else {
            var costo_diario = this.serviciog.actividad.costo_real / (diasAc + 1);
            // this.serviciog.costo_programado = costo_diario * dias;
            this.serviciog.costo_programado = this.serviciog.actividad.costo_real * (this.serviciog.porcentaje_real / 100);
          }

        }
        this.serviciog.valueDifProgramadoEjecuato = Math.abs(this.serviciog.actividad.costo_actual - this.serviciog.costo_programado).toFixed(2);
        // alert(this.serviciog.valueDifProgramadoEjecuato);
      }
      this.serviciog.valueDifProgramadoEjecuato = Math.abs(this.serviciog.actividad.costo_actual - this.serviciog.costo_programado).toFixed(2);
    }


    try {

      this.barChartData = [
        { data: [this.serviciog.porcentaje_real], label: parseFloat(this.serviciog.porcentaje_real).toFixed(2) + '  %' },
        { data: [this.serviciog.actividad.porcentaje_cumplido], label: parseFloat(this.serviciog.actividad.porcentaje_cumplido).toFixed(2) + '  %' },
        { data: [Math.abs(this.serviciog.porcentajeDifProgramadoEjecutado)], label: Math.abs(parseFloat((this.serviciog.porcentajeDifProgramadoEjecutado) + '')).toFixed(2) + '  %' }
      ];
      this.barChartLabels = [
        '% de obra Programado ',
        '% Real Ejecutado ',
        '% Programado VS Ejecutado'
      ];
    } catch (e) {
      // alert(e);
    }
  }

  /* -------------------- */

  //LISTA       =   Lista de actividades => cambia nombre segun proyecto municipios resguardos beneficiario etc. 
  c2() {
    this.serviGloAct.actOpt = 2;
  }

  //Reporte
  c3() {

    //calculo grafica resumen avance
    try {
      this.barChartData = [
        { data: [this.serviciog.porcentaje_real], label: parseFloat(this.serviciog.porcentaje_real).toFixed(2) + '  %' },
        { data: [this.serviciog.actividad.porcentaje_cumplido], label: parseFloat(this.serviciog.actividad.porcentaje_cumplido).toFixed(2) + '  %' },
        { data: [Math.abs(this.serviciog.porcentajeDifProgramadoEjecutado)], label: Math.abs(parseFloat((this.serviciog.porcentajeDifProgramadoEjecutado) + '')).toFixed(2) + '  %' }
      ];
    } catch (e) { }
    this.barChartLabels = [
      '% de obra Programado ',
      '% Real Ejecutado ',
      '% Programado VS Ejecutado'
    ];


    this.serviGloAct.actOpt = 3;
    this.listTypes = [];
    this.serviGloAct.observaciones = [];
    //alert(JSON.stringify(this.serviciog.actividad));
    if (this.isTitleSelected && this.serviciog.actividad == null)
      this.dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario,
        tipo: this.serviciog.proyecto.tipo
      };
    else if (this.serviciog.actividad)
      this.dat = {
        keym: this.serviciog.actividad.keym,
        id_caracteristica: this.serviciog.actividad.id_caracteristica,
        id_usuario: this.serviciog.actividad.id_usuario,
        tipo: this.serviciog.actividad.tipo
      };
    else
      this.dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario,
        tipo: this.serviciog.proyecto.tipo
      };



    var frmDat2 = new FormData();
    frmDat2.append("caracteristica", JSON.stringify(this.dat));
    this.servicios.getRecursiveAllParents(frmDat2).then(message => {


      message['getrecursiveallparents'].forEach(element => {
        //alert(JSON.stringify(element.tipo));
        switch (element.tipo) {
          case 'Provincia':
            this.serviciog.pro = element.nombre;
            break;
          case 'Municipio':
            this.serviciog.mun = element.nombre;
            break;
          case 'Resguardo':
            this.serviciog.res = element.nombre;
            break;
        }

      });
    });

    var formData = new FormData();
    formData.append("caracteristica", JSON.stringify(this.dat));
    this.servicios.getObservacionesReport(formData).then(message => {
      //alert(JSON.stringify(message));
      this.serviGloAct.observaciones = message;
    });


    //alert(JSON.stringify(dat));
    var frmDat = new FormData();
    frmDat.append("caracteristica", JSON.stringify(this.dat));
    this.servicios.getTypes(frmDat).then(message => {
      //alert(JSON.stringify(message));
      message.forEach(element => {
        var x = element.gettypes;
        this.listTypes.push(x);
        console.log(x);
      });
    });

    //alert(JSON.stringify(this.serviciog.dat));
    //alert(JSON.stringify(this.dat)+'        '+JSON.stringify(this.serviciog.dat)+'      '+this.serviciog.dat.length+'        '+JSON.stringify(this.serviciog.dat));
    if (JSON.stringify(this.dat) != JSON.stringify(this.serviciog.dat) || JSON.stringify(this.serviciog.dat) == '{}') {

      this.serviciog.labels = [];
      this.serviciog.data = [];
      this.serviciog.colors = [];


      this.serviciog.dat = this.dat;
      var formData = new FormData();
      formData.append("caracteristica", JSON.stringify(this.dat));
      this.servicios.getDataChart(formData).then(message => {

        //alert(JSON.stringify(message));
        this.serviciog.listDatChart = [];
        this.serviciog.listDatChart = message;
        var ax: any[] = [];
        this.serviciog.listDatChart.forEach(element => {
          ax.push(element.gettotalmarkerscategory);
        });
        this.serviciog.listDatChart = ax;
        var val = 0;
        this.serviciog.listDatChart.forEach(element => {
          var x = element.split(',');
          var num = parseInt(x[2]);
          if (num) val = val + num;
        });
        this.serviciog.listDatChart.forEach(element => {
          element = element.replace('(', '');
          element = element.replace(')', '');
          var x = element.split(',');
          this.serviciog.color.push(x[0]);
          var num = parseInt(x[2]);
          if (num) {
            var z = num * 100 / val;
            this.serviciog.data.push(z);
            this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : ' + z.toFixed(2) + ' %');
          }
          else {
            this.serviciog.data.push(0);
            this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : 0 %');
          }
        });

        this.serviciog.colors = [{ backgroundColor: this.serviciog.color }];

      });

    }



    if (this.serviciog.isSelAct) {
      var numSi = this.serviciog.actividad.porcentaje_cumplido;
      var numNo = 100 - numSi;
      this.doughnutChartData = [numSi, numNo];
    } else {
      var numSi = this.serviciog.proyecto.porcentaje_cumplido;
      var numNo = 100 - numSi;
      this.doughnutChartData = [numSi, numNo];
    }
  }

  //Multimedia
  c4() {
    this.serviGloAct.actOpt = 4;
    //alert(JSON.stringify(this.serviciog.imagenes));
  }

  //Estadisticas  - Diagramas Charts
  c5() {
    this.serviGloAct.actOpt = 5;

    this.fin_label = [];
    this.fin_data = [];

    this.barChartData = [];
    this.barChartLabels = [];
    //calculo grafica resumen avance
    this.barChartData = [
      { data: [this.serviciog.porcentaje_real], label: parseFloat(this.serviciog.porcentaje_real).toFixed(2) + '  %' },
      { data: [this.serviciog.actividad.porcentaje_cumplido], label: parseFloat(this.serviciog.actividad.porcentaje_cumplido).toFixed(2) + '  %' },
      { data: [Math.abs(this.serviciog.porcentajeDifProgramadoEjecutado)], label: Math.abs(parseFloat((this.serviciog.porcentajeDifProgramadoEjecutado) + '')).toFixed(2) + '  %' }
    ];
    this.barChartLabels = [
      '% de obra Programado ',
      '% Real Ejecutado ',
      '% Programado VS Ejecutado'
    ];



    //alert(JSON.stringify(this.serviciog.actividad));
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
    /* llamado para tabla de estadisticas */
    this.valresper = []; this.valres = []; this.mon = [];
    var formData = new FormData();

    formData.append("datos", JSON.stringify(dat));
    this.servicios.getTotalBeneficiary(formData).then(message => {

      //alert(JSON.stringify(this.valres));
      var res = message[0].gettotalbeneficiary;
      res = res.replace(/\(/g, "").replace(/\)/g, "");
      this.valres = res.split(',');

      this.suma = 0;
      var n = 0;
      /* recorrido para calcular la suma de datos */
      this.valres.forEach(element => {
        if (n % 2 == 0)
          this.suma = this.suma + parseInt(element);
        n++;
      });

      //alert(suma);
      n = 0;

      /* recorrido par acalcular los porcentajes */
      this.valres.forEach(element => {
        if (n % 2 == 0) {
          var per = (parseInt(element) * 100) / this.suma;
          this.valresper.push(per);
        }
        else
          this.mon.push(parseFloat(element));
        //alert(per);
        n++;
      });

      this.totalm = 0;
      this.mon.forEach(element => {
        this.total = this.total + parseFloat(element);
        this.totalm = this.totalm + parseFloat(element);
      });

      this.totalp = 0;
      this.valresper.forEach(element => {
        this.totalp = this.totalp + parseFloat(element);
      });


      this.fin_data = this.valresper;
      //Asignar valores correspondientes a los labels
      //'0-19 %', '20-39 %', '40-59 %', '60-79 %', '80-99 %', '100 %'
      this.fin_label.push('0-19 % => ' + this.fin_data[0] + ' %');
      this.fin_label.push('20-39 % => ' + this.fin_data[1] + ' %');
      this.fin_label.push('40-59 % => ' + this.fin_data[2] + ' %');
      this.fin_label.push('60-79 % => ' + this.fin_data[3] + ' %');
      this.fin_label.push('80-99 % => ' + this.fin_data[4] + ' %');
      this.fin_label.push('100 % => ' + this.fin_data[5] + ' %');

      //alert(JSON.stringify(this.valresper))
    });
    /* ------------------------------------ */
  }

  //mapa
  c6() {
    this.serviGloAct.actOpt = 6;
  }

  //CATEGORIAS  -  Se Asignan las categorias de los mapas 
  c7() {
    this.serviGloAct.actOpt = 7;
  }

  //PORCENTAJE  -  Cambian porcentajes a Actividades
  c8() {
    this.serviGloAct.actOpt = 8;
  }

  //Recomendaciones
  c9() {
    this.serviGloAct.remarks = [];
    this.serviGloAct.actOpt = 9;
    console.log(this.serviciog.proyecto);
    console.log(this.serviciog.actividad);
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
    var formData = new FormData();
    formData.append("caracteristica", JSON.stringify(dat));

    this.servicios.getRemarks(formData).then(message => {
      //alert(JSON.stringify(message));
      this.serviGloAct.remarks = message;
    });
  }

  //Observaciones
  c10() {
    this.serviGloAct.observaciones = [];
    this.serviGloAct.actOpt = 10;
    //alert(JSON.stringify(this.serviciog.actividad));
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
    var formData = new FormData();
    formData.append("caracteristica", JSON.stringify(dat));

    this.servicios.getObservaciones(formData).then(message => {
      //alert(JSON.stringify(message));
      this.serviGloAct.observaciones = message;
    });
  }

  c11() {
    this.serviGloAct.actOpt = 11;
    //alert(JSON.stringify(this.serviciog.actividad));
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
  }

  c12() {
    this.serviGloAct.actOpt = 12;
    //alert(JSON.stringify(this.serviciog.actividad));
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
  }

  calculateValue(actividades) {
    var percent = 0;
    for (let i = 0; i < actividades.length; i++) {
      percent = percent + Number(actividades[i].porcentaje);
    }
    this.porcentajeAsignado = percent;
    this.miPorcentaje = 100 - this.porcentajeAsignado;
  }

  //Realiza busqueda y filtro de las actividades que estan al lado izquierdo
  btnSearchAct(value: string) {
    //alert(JSON.stringify(this.serviciog.actividades[0].tipo));
    if (this.serviciog.actividades[0].tipo !== "Beneficiario")
      this.serviciog.activityList = this.serviciog.actividades.filter(item => {
        return (
          (item.tipo + item.nom_act)
            .toLowerCase()
            .replace(/ /g, "")
            .indexOf(value.replace(/ /g, "").toLowerCase()) !== -1
        );
      });
    else
      this.serviciog.activityList = this.serviciog.actividades.filter(item => {
        return (
          (item.cedula + item.nombre)
            .toLowerCase()
            .replace(/ /g, "")
            .indexOf(value.replace(/ /g, "").toLowerCase()) !== -1);
      }
      );


    //alert(JSON.stringify(this.serviciog.activityList));
  }

  //actualiza el valor del porcentaje cumplido cunado se cambia el valor del slider
  slideValue(activity, value) {
    var perComp = activity.porcentaje_cumplido - this.slideval;

    if (this.serviciog.actividad.costo_actual == null) {
      this.serviciog.actividad.costo_actual = 0;
    }
    if (this.serviciog.actividad.porcentaje_cumplido == null) {
      this.serviciog.actividad.porcentaje_cumplido = 0;
    }

    if (perComp != 0) {
      //alert(activity.porcentaje_cumplido+'   +   '+this.slideval +'  = '+perComp);
      //alert(this.serviciog.actividad.costo_actual + '    '+this.serviciog.actividad.costo_real);
      this.serviciog.actividad.costo_actual = this.serviciog.actividad.costo_real * (this.serviciog.actividad.porcentaje_cumplido + this.slideval) / 100;
      //alert(this.serviciog.actividad.valor_actual);
      var formData = new FormData();
      formData.append("actividad", JSON.stringify(activity));
      formData.append("porcentaje_cumplido", JSON.stringify(value));
      formData.append("usuario_superior", this.serviciog.usuario.usuario_superior + "");
      formData.append("usuario_own", this.serviciog.usuario.id_usuario + "");
      this.slideval = activity.porcentaje_cumplido;
      this.servicios.updateCompletePercentage(formData).then(message => {
        //Envio de mensaje por socket
        // alert(''+ JSON.stringify({
        //   'userSend': this.serviciog.usuario.usuario_superior,
        //   'tipo': 'per'
        // }))
        this.serviciog.socket.emit('sendSocketNovedad', {
          'userSend': this.serviciog.usuario.usuario_superior,
          'tipo': 'per'
        })
      });
    }
  }

  //actualiza el valor del porcentaje cumplido cunado se cambia el valor en la caja de texto
  changeEtapa(etapa, tipo) {
    // alert(etapa+'   '+tipo);
    var banEntrega = true;
    if (etapa === 'Entrega de materiales') {
      this.serviciog.proyecto.nombre_cat = 'Ejecucion Normal';
      this.serviciog.proyecto.color_cat = '#5fff00';
      if (this.fechaInicio === undefined) {
        banEntrega = false;
      }
    }
    if (banEntrega) {
      if (tipo == 'P') {
        if (etapa != this.serviciog.proyecto.estado) {
          var dateNow = new Date();
          formData.append("actividad", JSON.stringify(this.serviciog.proyecto));
          formData.append("etapa", JSON.stringify(etapa));
          formData.append("fechaInicio", JSON.stringify(this.fechaInicio));
          this.servicios.updateEtapa(formData).then(message => {
            this.serviciog.proyecto.estado = etapa;
            var keym = this.serviciog.ax_actividad.keym;
            var id_usuario = this.serviciog.ax_actividad.id_usuario;
            var id_caracteristica = this.serviciog.ax_actividad.id_caracteristica;
            if (message == 'true') {
              this.serviciog.actividades = [];
              this.serviciog.activityList = [];
              this.servicios
                .getActividad(keym, id_usuario, id_caracteristica)
                .then(actividad => {
                  alert("Pro >>>" + JSON.stringify(actividad));
                  this.serviciog.actividades = actividad;
                  this.serviciog.activityList = actividad;
                  actividad.porcentaje_cumplido = actividad.porcentaje_cumplido * 1;
                  this.slideval = actividad.porcentaje_cumplido;
                });
            }
          });
        }
      }
      else if (tipo == 'A') {
        if (etapa != this.serviciog.actividad.estado) {
          var formData = new FormData();
          formData.append("actividad", JSON.stringify(this.serviciog.actividad));
          formData.append("etapa", JSON.stringify(etapa));
          formData.append("fechaInicio", JSON.stringify(this.fechaInicio));
          this.servicios.updateEtapa(formData).then(message => {
            this.serviciog.actividad.estado = etapa;
            var keym = this.serviciog.ax_actividad.keym;
            var id_usuario = this.serviciog.ax_actividad.id_usuario;
            var id_caracteristica = this.serviciog.ax_actividad.id_caracteristica;
            /*  this.serviciog.isSubActivity = null;
             this.serviciog.isSelAct = false;
             this.serviGloAct.actOpt = 0; */

            /* ------------------ */
            //alert("a >>>" + message);
            if (message) {
              this.serviciog.actividades = [];
              this.serviciog.activityList = [];
              this.servicios
                .getActividad(keym, id_usuario, id_caracteristica)
                .then(actividad => {
                  // alert("act >> "+ JSON.stringify(actividad));
                  this.serviciog.actividades = actividad;
                  this.serviciog.activityList = actividad;
                  //alert("act >> " + JSON.stringify(this.serviciog.activityList));
                  actividad.porcentaje_cumplido = actividad.porcentaje_cumplido * 1;
                  this.slideval = actividad.porcentaje_cumplido;
                });
            }
          });
        }
      }
    }
  }

  /* stop obra */
  toggleStop() {
    this.serviciog.activoSuspension = !this.serviciog.activoSuspension;
    this.toggleProyect = !this.toggleProyect;
    if (!this.serviciog.activoSuspension) {
      var formData = new FormData();
      formData.append("keym", this.serviciog.proyecto.keym);
      formData.append("id_caracteristica", this.serviciog.proyecto.id_caracteristica);
      formData.append("id_usuario", this.serviciog.proyecto.id_usuario);
      formData.append("activo", this.serviciog.activoSuspension + '');
      this.servicios.pauseProyect(formData).then(message => {
        if (message)
          console.log("Actualizado");
      });
    }
  }

  ClickPause(value: any) {
    var formData = new FormData();
    var dateInicio = new Date();
    var fecIni = dateInicio.getFullYear() + "-" + (dateInicio.getMonth() + 1) + "-" + dateInicio.getDate();
    // alert(fecIni);
    formData.append("keym", this.serviciog.proyecto.keym);
    formData.append("id_caracteristica", this.serviciog.proyecto.id_caracteristica);
    formData.append("id_usuario", this.serviciog.proyecto.id_usuario);
    formData.append("datePauseInicio", fecIni);
    formData.append("datePauseFin", value);
    formData.append("activo", this.serviciog.activoSuspension + '');
    this.servicios.pauseProyect(formData).then(message => {
      if (message)
        console.log("Actualizado");
    });
  }

  salir() {
    let link = ["administrador"];
    this.router.navigate(link);
  }

}