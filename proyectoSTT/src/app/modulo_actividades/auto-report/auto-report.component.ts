import { Component, OnInit } from '@angular/core';
import { Servicios } from "../../services/servicios";
import { ServiciosGlobales } from 'app/services/servicios-globales';
import { reject } from 'q';
import { resolve } from 'url';

@Component({
  selector: 'app-auto-report',
  templateUrl: './auto-report.component.html',
  styleUrls: ['./auto-report.component.css']
})
export class AutoReportComponent implements OnInit {

  imgReport: any = '';
  imgReport2: any = '';

  imagenes: any[] = [];
  observaciones: any[] = [];

  costo_programado: any = 0;
  valueDifProgramadoEjecuato: any = 0;
  porcentajeDifProgramadoEjecutado: any = 0;
  porcentaje_real: any = 0;

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ['% de Obra Programado', '% Real Ejecutado', '% Programado VS Ejecutado'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    { data: [65, 0, 0], label: 'Series A' },
    { data: [0, 55, 0], label: 'Series B' },
    { data: [0, 0, 40], label: 'Series C' },
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


  actividades: any = null;
  json_act: any = null;
  activity: any = null;

  constructor(
    private serviciog: ServiciosGlobales,
    private servicios: Servicios
  ) { }

  ngOnInit() {
    this.actividades = this.serviciog.actividades;
    this.recusriveFunc(this.actividades.length).then(x => {
    });
    
  }

  recusriveFunc(pos) {
    this.costo_programado = 0;
    return new Promise((resolve, reject) => {
      pos = pos - 1;
      if (pos != null || pos != undefined) {
        if (pos != null || pos != undefined) {
          setTimeout(() => {
            try {
              if (this.actividades[pos].tipo !== 'Beneficiario' || ((this.actividades[pos].estado == 'Entrega de materiales' || this.actividades[pos].estado == 'Ejecucion de obra') && this.actividades[pos].tipo === 'Beneficiario')) {
                this.asignData(parseInt(pos + '')).then(x => {
                  if (pos >= 0)
                    resolve(pos);
                  else
                    resolve(null);
                });
              }
              else {
                var flag = true;
                while (flag && pos > -1) {
                  pos = pos - 1;
                  if (this.actividades[pos].tipo !== 'Beneficiario' || ((this.actividades[pos].estado == 'Entrega de materiales' || this.actividades[pos].estado == 'Ejecucion de obra') && this.actividades[pos].tipo === 'Beneficiario'))
                    flag = false;
                }
                this.asignData(parseInt(pos + '')).then(x => {
                  if (pos >= 0)
                    resolve(pos);
                  else
                    resolve(null);
                });
                resolve(pos);
              }
            } catch (e) {
              resolve(pos);
            }
            this.recusriveFunc(parseInt(pos + ''));
          }, 3000);
        }
      }
    }).then(x => {

      // if (x != null || x != undefined ) {
      //   setTimeout(() => {
      //     try {
      //       this.asignData(parseInt(x + ''));
      //       //console.log(this.nombre);
      //     } catch (e) {
      //       console.log('ERROR  => ' + e);
      //     }
      //     this.recusriveFunc(parseInt(x + ''));
      //   }, 1000);
      // }

    });
  }

  asignData(pos) {
    return new Promise((resolve, reject) => {
      
      try {
        this.activity = this.actividades[pos];
        var dat = {
          keym: this.activity.keym,
          id_caracteristica: this.activity.id_caracteristica,
          id_usuario: this.activity.id_usuario,
          tipo: this.activity.tipo
        };
        try {
          setTimeout(() => {
           this.getDataChart(dat).then(x => {
           });
          }, 1500);
         } catch (e) { }
         
        if (this.activity != undefined && this.activity != null) {
          this.calcPercentReal(this.activity).then(x => {
            if (x)
              this.calValueProgra(this.activity).then(y => {
               

                try {
                    var formData = new FormData();
                    formData.append("caracteristica", JSON.stringify(dat));
                    this.servicios.getObservacionesReport(formData).then(message => {
                      this.observaciones = message;
                    });
                } catch (e) { }
                setTimeout(() => {
                  this.getMoreInformation().then(inf => {
                    var idEla = 5;
                    if (this.activity.tipo === 'Beneficiario')
                      idEla = this.activity.usuario_asignado;
                    try { var imgReport: string = document.getElementsByTagName('canvas')[0].toDataURL('image/png'); } catch (e) { }
                    try { var imgReport2: string = document.getElementsByTagName('canvas')[1].toDataURL('image/png'); } catch (e) { }
                    try {
                      this.json_act = {
                        "tipo": this.activity.tipo,
                        "beneficiario": this.activity.nombre,
                        "cedula": this.activity.cedula,
                        "provincia": this.serviciog.pro,
                        "municipio": this.serviciog.mun,
                        "resguardo": this.serviciog.res,
                        "feciniobr": this.activity.fecha_inicio,
                        "porcejec": this.activity.porcentaje_cumplido,
                        "observaciones": this.observaciones,
                        "porcentajeProgramado": this.porcentaje_real,
                        "porcentajeEjecutado": this.activity.porcentaje_cumplido,
                        "DiferenciaPorcentaje": this.porcentaje_real - this.activity.porcentaje_cumplido,
                        "valorAsignado": this.activity.costo_real,
                        "valorProgramado": this.costo_programado,
                        "valorEjecutado": this.activity.costo_actual,
                        "DiferenciaValor": Math.abs(this.activity.costo_actual - this.costo_programado),
                        "firmaEla": "",
                        "nombreEla": "",
                        "cargoEla": "",
                        "firmaApr": "",
                        "nombreApr": "",
                        "cargoApr": "",
                        "nombre": this.activity.nom_act,
                        "grafica": imgReport,
                        "grafica2": imgReport2,
                        "imagenes": this.imagenes,
                        "usuelaboro": idEla
                      };
                      var url;
                      url = this.serviciog.servidor + 'downloadReport' + '?val1=' + JSON.stringify(this.json_act);
                      this.downloadFile(url, this.actividades[pos].nom_act).then(z => {
                        if (z) resolve(true);
                      });
                    } catch (e) { };
                  });
                }, 1500);
              });
            else
              resolve(false);
          });
        }
        else
          resolve(false);
      } catch (e) { resolve(false); }
    });
  }

  //calculo pocentaje real
  public calcPercentReal(actividad) {
    return new Promise((resolve, reject) => {
        
      if (actividad.porcentaje == 0)
        actividad.porcentaje = 0.00;
      this.porcentaje_real = 0;
      this.porcentajeDifProgramadoEjecutado = 0;
      var fecha_actual = new Date();
      if (actividad.estado != 'null' && actividad.estado != 'Inicio') {
        try {
          var aFecha2 = new Date(actividad.fecha_inicio);
          var aFecha3 = new Date(actividad.fecha_fin);
          var fFecha1 = new Date(fecha_actual.getFullYear(), fecha_actual.getMonth(), fecha_actual.getDate());
          var fFecha2 = new Date(aFecha2.getFullYear(), aFecha2.getMonth(), aFecha2.getDate());
          var fFecha3 = new Date(aFecha3.getFullYear(), aFecha3.getMonth(), aFecha3.getDate());
          var dif = fFecha1.getTime() - fFecha2.getTime();
          var difAc = fFecha3.getTime() - fFecha2.getTime();
          var diasAc = Math.floor(difAc / (1000 * 60 * 60 * 24));
          var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
        } catch (e) {
        }
        try {
          if ((dias + 1) > 0) {
            if (actividad.tipo == "Beneficiario") {
              this.porcentaje_real = 0;
              if (dias > 9 && dias <= 30) {
                var por = 100 / 21;
                this.porcentaje_real = ((dias - 9) * por);
              } else if (dias > 30) {
                this.porcentaje_real = 100;
              }
            } else if (actividad.tipo == "Proyecto") {
              this.porcentaje_real = (dias * (100 / 365));
            } else {
              this.porcentaje_real = (dias * (100 / (diasAc)));
            }
            if (this.porcentaje_real > 100) {
              this.porcentaje_real = 100;
            }
          }
        } catch (e) {
        }
        this.porcentajeDifProgramadoEjecutado = actividad.porcentaje_cumplido - this.porcentaje_real;
      }
      if (this.porcentajeDifProgramadoEjecutado >= 0) {
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
      }
      else {
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

      resolve(true);
    });

  }

  /* calcostoProgramdo */
  public calValueProgra(actividad) {
   
    return new Promise((resolve, reject) => {
      this.costo_programado = 0;
      this.valueDifProgramadoEjecuato = 0;
      var fecha_actual = new Date();

      try {
        if (actividad.estado !== 'null' && actividad.estado !== 'Inicio') {
          var aFecha2 = new Date(actividad.fecha_inicio); //fecha inico actividad
          var aFecha3 = new Date(actividad.fecha_fin); //fecha fin actividad 
          //fecha actual 
          var fFecha1 = new Date(fecha_actual.getFullYear(), fecha_actual.getMonth(), fecha_actual.getDate());
          var fFecha2 = new Date(aFecha2.getFullYear(), aFecha2.getMonth(), aFecha2.getDate());
          var fFecha3 = new Date(aFecha3.getFullYear(), aFecha3.getMonth(), aFecha3.getDate());
          var dif = fFecha1.getTime() - fFecha2.getTime();
          var difAc = fFecha3.getTime() - fFecha2.getTime();
          var diasAc = Math.floor(difAc / (1000 * 60 * 60 * 24));
          var dias = Math.floor(dif / (1000 * 60 * 60 * 24));

          if (dias >= 0 && dias) {

            if (actividad.tipo == 'Beneficiario') {
              if (dias > 9) {
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
                this.costo_programado = plata;
              }
              else
                this.costo_programado = 0;

            } else {
              if (dias > diasAc) {
                this.costo_programado = actividad.costo_real;
              }
              else {
                var costo_diario = actividad.costo_real / (diasAc + 1);
                this.costo_programado = actividad.costo_real * (this.porcentaje_real / 100);
              }
            }
            this.valueDifProgramadoEjecuato = Math.abs(actividad.costo_actual - this.costo_programado).toFixed(2);
          }
          this.valueDifProgramadoEjecuato = Math.abs(actividad.costo_actual - this.costo_programado).toFixed(2);
        }
        try {
          this.barChartData = [
            { data: [this.porcentaje_real], label: parseFloat(this.porcentaje_real).toFixed(2) + '  %' },
            { data: [actividad.porcentaje_cumplido], label: parseFloat(actividad.porcentaje_cumplido).toFixed(2) + '  %' },
            { data: [Math.abs(this.porcentajeDifProgramadoEjecutado)], label: Math.abs(parseFloat((this.porcentajeDifProgramadoEjecutado) + '')).toFixed(2) + '  %' }
          ];
          this.barChartLabels = [
            '% de obra Programado ',
            '% Real Ejecutado ',
            '% Programado VS Ejecutado'
          ];
        } catch (e) {
        }
        resolve(true);
      } catch (e) {
        resolve(false);
      }
    });
  
  }


  //get image list and observation list
  getMoreInformation() {
    this.imagenes = [];
    return new Promise((resolve, reject) => {
      var dat = {
        keym: this.activity.keym,
        id_caracteristica: this.activity.id_caracteristica,
        id_usuario: this.activity.id_usuario,
        tipo: this.activity.tipo
      };

      try {
        var frmDat2 = new FormData();
        frmDat2.append("caracteristica", JSON.stringify(dat));
        this.servicios.getRecursiveAllParents(frmDat2).then(message => {
          message['getrecursiveallparents'].forEach(element => {
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
      } catch (e) { }
      try {
        var formData = new FormData();
        formData.append('keym', dat.keym);
        formData.append('id_caracteristica', dat.id_caracteristica);
        formData.append('id_usuario', dat.id_usuario);
        formData.append('tipo', 'img');
        formData.append('tipoAct', dat.tipo);
        formData.append('reporte', true + '');
        formData.append('tipoCar', dat.tipo);
        this.servicios.getMultimedia(formData)
          .then(imagenes => {
            if (imagenes && imagenes[0] != null) {
              try {
                imagenes.forEach(element => {
                  this.imagenes.push({ 'nombre': element.titulo, 'fecha_creacion': element.fecha_creacion, 'url': element.val_configuracion + element.srcServ + element.nombre_archivo });
                });
              } catch (e) { }
            } else {
              this.imagenes = []
            }
            resolve(true);
          });
      } catch (e) { }

     
    });
  }

  getDataChart(dat) {
    return new Promise((resolve, reject) => {
      this.serviciog.listDatChart = [];
      this.serviciog.data = [];
      this.serviciog.labels = [];
      this.serviciog.colors = [];
      var formData = new FormData();
      formData.append("caracteristica", JSON.stringify(dat));
      this.servicios.getDataChart(formData).then(message => {


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
        resolve(true);
      });
      
    });
  }

  downloadFile(filePath, name) {
    return new Promise((resolve, reject) => {
      var link = document.createElement('a');
      document.body.appendChild(link);
      link.href = filePath;
      link.download = name;
      link.name = name;
      link.title = name;
      link.click();
      document.body.removeChild(link);
      resolve(true);
    });
  }


}

// var re = window.open(url, 'Download');
