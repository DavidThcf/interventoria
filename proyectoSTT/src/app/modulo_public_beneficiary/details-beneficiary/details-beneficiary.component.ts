import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Servicios } from '../../services/servicios';
import { ServiciosGlobales } from '../../services/servicios-globales';
import { Router } from "@angular/router";
import { AgmCoreModule } from '@agm/core';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'app-details-beneficiary',
  templateUrl: './details-beneficiary.component.html',
  styleUrls: ['./details-beneficiary.component.css']
})
export class DetailsBeneficiaryComponent implements OnInit {
  @ViewChild('mapBen') mapBen : AgmCoreModule;

  // ben contiene la informacion del beneficiario
  @Input() ben: any = null;

  //Almacena la ruta para mostrar en modal grande
  pic :string ='';

  //mapa
  lat: number = 0.82438333300000000000;
  lng: number = -77.83935000000000000000;
  zoom: number = 7;
  today: any = null;

  //var beneficiario
  opc: string = '';
  tipo: string = '';
  archivos: any[] = [];

  images: any[] = [];
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: any[] = [];
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
  public barChartData: any[] = [];
  public doughnutChartType: string = "bar";
  public barChartLegend: boolean = true;

  constructor(
    private router: Router,
    private serviciog: ServiciosGlobales,
    private servicios: Servicios
  ) { }

  public reload(){
    this.today = Date.now();
    
        this.ben = this.serviciog.ben;
        this.tipo = 'img';
        this.opc = 'Reporte';
    
        this.lat = this.ben.latitud;
        this.lng = this.ben.longitud;
    
        
        if (this.ben) {
          //Obtiene los archivos que se muestran en reporte
          var formData = new FormData();
          formData.append('keym', this.ben.keym);
          formData.append('id_caracteristica', this.ben.id_caracteristica);
          formData.append('id_usuario', this.ben.id_usuario);
          formData.append('tipo', this.tipo);
          formData.append('tipoAct', 'Beneficiario');
          formData.append('reporte', true + '');
          this.servicios.getMultimedia(formData)
            .then(imagenes => {
              if (imagenes) {
                this.serviciog.imagenes = imagenes;
                imagenes.forEach(element => {
                  //alert(JSON.stringify(element.titulo));
                  this.images.push({ 'nombre': element.titulo, 'fecha_creacion': element.fecha_creacion, 'url': element.val_configuracion + element.srcServ + element.nombre_archivo });
                  //val_configuracion+srcServ+nombre_archivo
                  //alert(JSON.stringify(this.images));
                });
              }
            });
    
          //calcula los valores y porcentajes programados 
          this.calcPercentReal();
          this.calValueProgra();
    
          //obtiene las imagenes que se muestran en ek inicio de multimedia
          this.archivos = [];
          var formData = new FormData();
          formData.append('keym', this.ben.keym);
          formData.append('id_caracteristica', this.ben.id_caracteristica);
          formData.append('id_usuario', this.ben.id_usuario);
          formData.append('tipo', 'img');
          formData.append('tipoAct', 'Beneficiario');
    
          this.servicios.getMultimedia(formData)
            .then(imagenes => {
              if (imagenes) {
                var cad = JSON.stringify(imagenes);
                this.archivos = imagenes[0].getarchivos;
                //alert(JSON.stringify(imagenes[0].getarchivos));
              } else {
                this.archivos = []
              }
            })
        }
  }

  ngOnInit() {
    this.reload();
  }

  //calculo pocentaje real
  public calcPercentReal() {

    if (this.serviciog.ben.porcentaje == 0)
      this.serviciog.ben.porcentaje = 0.00;
    this.serviciog.porcentaje_real = 0;
    this.serviciog.porcentajeDifProgramadoEjecutado = 0;
    var fecha_actual = new Date();

    if (this.serviciog.ben.estado != 'null' && this.serviciog.ben.estado != 'Inicio') {
      try {
        var aFecha2 = new Date(this.serviciog.ben.fecha_inicio);
        var aFecha3 = new Date(this.serviciog.ben.fecha_fin);
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
          this.serviciog.porcentaje_real = 0;
          if (dias > 9 && dias <= 30) {
            var por = 100 / 21;
            this.serviciog.porcentaje_real = ((dias - 9) * por);
          } else if (dias > 30) {
            this.serviciog.porcentaje_real = 100;
          }

          if (this.serviciog.porcentaje_real > 100) {
            this.serviciog.porcentaje_real = 100;
          }
        }

      } catch (e) {
      }
      this.serviciog.porcentajeDifProgramadoEjecutado = this.serviciog.ben.porcentaje_cumplido - this.serviciog.porcentaje_real;
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
  }


  /* calcostoProgramdo */
  public calValueProgra() {
    this.serviciog.costo_programado = 0;
    this.serviciog.valueDifProgramadoEjecuato = 0;
    var fecha_actual = new Date();

    if (this.serviciog.ben.estado !== 'null' && this.serviciog.ben.estado !== 'Inicio') {
      var aFecha2 = new Date(this.serviciog.ben.fecha_inicio);
      var aFecha3 = new Date(this.serviciog.ben.fecha_fin);
      var fFecha1 = new Date(fecha_actual.getFullYear(), fecha_actual.getMonth(), fecha_actual.getDate());
      var fFecha2 = new Date(aFecha2.getFullYear(), aFecha2.getMonth(), aFecha2.getDate());
      var fFecha3 = new Date(aFecha3.getFullYear(), aFecha3.getMonth(), aFecha3.getDate());
      var dif = fFecha1.getTime() - fFecha2.getTime();
      var difAc = fFecha3.getTime() - fFecha2.getTime();
      var diasAc = Math.floor(difAc / (1000 * 60 * 60 * 24));
      // alert(diasAc);
      // alert(dias);
      var dias = Math.floor(dif / (1000 * 60 * 60 * 24));

      if (dias >= 0 && dias) {

        if (dias > 9) {
          var dinero = {
            '10': 97304,
            '11': 471609.333333333,
            '12': 374305.333333333,
            '13': 699772.958333333,
            '14': 325467.625,
            '15': 325467.625,
            '16': 325467.625,
            '17': 325467.625,
            '18': 325467.625,
            '19': 1516692.625,
            '20': 2145737.625,
            '21': 2107201.44444444,
            '22': 1478156.44444444,
            '23': 1790141.44444444,
            '24': 2003908.84444444,
            '25': 1141481.67777778,
            '26': 2384793.87777778,
            '27': 2384793.87777778,
            '28': 2384793.87777778,
            '29': 1859041.47777778,
            '30': 1572110.03333333
          };
          if (dias > 30)
            dias = 30;
          this.serviciog.costo_programado = dinero[dias];
        }

        this.serviciog.valueDifProgramadoEjecuato = Math.abs(this.serviciog.ben.costo_actual - this.serviciog.costo_programado).toFixed(2);
        // alert(this.serviciog.valueDifProgramadoEjecuato);
      }
      this.serviciog.valueDifProgramadoEjecuato = Math.abs(this.serviciog.ben.costo_actual - this.serviciog.costo_programado).toFixed(2);
    }


    try {

      this.barChartData = [
        { data: [this.serviciog.porcentaje_real], label: parseFloat(this.serviciog.porcentaje_real).toFixed(2) + '  %' },
        { data: [this.serviciog.ben.porcentaje_cumplido], label: parseFloat(this.serviciog.ben.porcentaje_cumplido).toFixed(2) + '  %' },
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


  cambio($event) {
    this.archivos = [];
    var formData = new FormData();
    var keym = this.serviciog.ben.keym;
    var id_caracteristica = this.serviciog.ben.id_caracteristica;
    var id_usuario = this.serviciog.ben.id_usuario;
    formData.append('keym', keym);
    formData.append('id_caracteristica', id_caracteristica);
    formData.append('id_usuario', id_usuario);
    formData.append('tipo', this.tipo);
    formData.append('tipoAct', 'Beneficiario');

    this.servicios.getMultimedia(formData)
      .then(imagenes => {
        if (imagenes) {
          var cad = JSON.stringify(imagenes);
          this.archivos = imagenes[0].getarchivos;
        } else {
          this.archivos = []
        }
      })
  }


	loadPoint(){
    this.opc="Mapa";
    //alert(this.ben.latitud +'    '+this.ben.longitud)
    this.lat = parseFloat(this.ben.latitud);
    this.lng = parseFloat(this.ben.longitud);
	}

}
