var express = require("express");
var Sequelize = require("sequelize");
var sqlCon = require("../config/connectionDb");
var router = express.Router();
var fs = require("fs");

var repository =
  "/run/media/admin/DATA/CSV_POST/Point/K/PT/";

module.exports.insertData = function() {
  var keym = 0;
  var id_user = 5;
  var id_car = 31;
  var id_act = 30;
  var sum = 0;
  var sum_usu = 0;
  return new Promise((resolve, reject) => {
    var sequelize = sqlCon.configConnection();
    //Obtenemos IDS lista de resguardos que son IDS_PADRES para nuevas caracteristicas
    var qry_sel_resg = `select a.keym_car,a.id_caracteristica,a.id_usuario_car,a.nombre
      from actividades a join caracteristicas c
      on c.keym = a.keym_car and c.id_caracteristica = a.id_caracteristica and c.id_usuario = a.id_usuario_car
      where c.tipo like 'Resguardo%' ;`;

    sequelize
      .query(qry_sel_resg, {
        type: sequelize.QueryTypes.SELECT
      })
      .then(x => {
        x.forEach(function(element) {
          //Leemos los archivos relacionados a la lista de resguardos => esta la lista de los beneficiarios
          //console.log('\nOK  ===>  '+repository+element.nombre+'.csv');
          //console.log(repository + element.nombre + '.csv');

          var path = repository + element.nombre + ".csv";
          //console.log('-'+path+'-');

          fs.readFile(path.toString(), "utf8", (err, data) => {
            // console.log("err: " + err);
            // console.log(data);
            //console.log('\n\n\n\n\n'+JSON.stringify(data)+'\n\n\n\n\n');
            var dat = data.split("\n");
            //console.log('\n\n'+dt.length);
            var dt = dat.length - 1;
            sum = sum + dat.length - 1;
            console.log("\n\n\nCAR    =>   " + JSON.stringify(element));
            if (dat.length > 0) {
              //console.log('\n\n\n\n'+data);

              dat.forEach(function(beneficiario) {
                id_car++;
                id_act++;
                //console.log("OKI ++++> " + element);
                var ben = beneficiario.split(",");
                sum_usu++;
                var qry_insert =
                  `INSERT INTO caracteristicas

                              (
                                keym ,
                                id_caracteristica ,
                                id_usuario ,

                                keym_padre ,
                                id_caracteristica_padre ,
                                id_usuario_padre ,


                                estado ,
                                porcentaje_cumplido ,
                                porcentaje_asignado ,
                                tipo_caracteristica ,
                                visualizar_superior ,
                                usuario_asignado,
                                publicacion_web ,
                                porcentaje ,
                                fecha_inicio ,
                                fecha_ultima_modificacion ,
                                cedula
                              )
                              VALUES
                              (
                              ` +
                  keym +
                  `,` +
                  id_car +
                  `,` +
                  id_user +
                  `,
                              ` +
                  element.keym_car +
                  `,` +
                  element.id_caracteristica +
                  `,` +
                  element.id_usuario_car +
                  `,
                              'Iniciacion',
                              ` +
                  100 / dt +
                  `,
                              0,
                              'A',
                              true,
                              5,
                              false,
                              0,
                              '2017-08-31',
                              '2017-08-31',
                              ` +
                  ben[1] +
                  `
                              );

                              INSERT INTO actividades
                              (
                                keym,
                                id_actividad ,
                                id_usuario ,

                                keym_car ,
                                id_caracteristica ,
                                id_usuario_car ,

                                nombre ,
                                descripcion ,
                                pos ,
                                folder ,
                                fecha_ultima_modificacion
                              )
                              VALUES
                              (

                              ` +
                  keym +
                  `,` +
                  id_act +
                  `,` +
                  id_user +
                  `,
                              ` +
                  keym +
                  `,` +
                  id_car +
                  `,` +
                  id_user +
                  `,

                              'Beneficiario ` +
                  ben[2] +
                  `  ',
                              '` +
                  ben[0] +
                  ` - ` +
                  ben[1] +
                  `',
                              0,
                              0,
                              '2017-08-31'
                              );`;
                //console.log(qry_insert);
                sequelize
                  .query(qry_insert, {
                    type: sequelize.QueryTypes.SELECT
                  })
                  .then(y => {
                    console.log("OK  =>>  " + sum_usu);
                  })
                  .catch(y => {
                    console.log("BAD  " + y);
                  });
              }, this);
            }
          });
        }, this);
      })
      .catch(x => {
        console.log("Error al registrar actividad " + x);
        reject(false);
      })
      .done(x => {
        //sequelize.close();

        console.log("Se ha cerrado sesion de la conexion a la base de datos");
      });
  });
};

module.exports.insertCapitulos = function() {
  var keym = 0;
  var id_user = 5;
  var id_car = 1673;
  var id_act = 1672;
  var sum = 0;
  var sum_usu = 0;

  return new Promise((resolve, reject) => {
    var sequelize = sqlCon.configConnection();

    //Obtenemos IDS lista de resguardos que son IDS_PADRES para nuevas caracteristicas
    var qry_sel_car = `select
        keym,id_caracteristica,id_usuario
        from caracteristicas
        where cedula is not null;`;
    var inf_cap = [
      {
        nom: "01 - Obras Preliminares",
        per: 0.75
      },
      {
        nom: "02 - Cimentacion",
        per: 4.31
      },
      {
        nom: "03 - Estructura En Concreto",
        per: 27.45
      },
      {
        nom: "04 - Mamposteria",
        per: 10
      },
      {
        nom: "05 - Pisos",
        per: 4.1
      },
      {
        nom: "06 - Cubierta",
        per: 7.19
      },
      {
        nom: "07 - Instalaciones Hidraulicas",
        per: 1.93
      },
      {
        nom: "08 - Instalaciones Electricas",
        per: 4.28
      },
      {
        nom: "09 - Instalaciones Sanitarias",
        per: 3.71
      },
      {
        nom: "10 - Acabados",
        per: 19.25
      },
      {
        nom: "11 - Carpinterias",
        per: 7.58
      },
      {
        nom: "12 - Otros",
        per: 4.62
      },
      {
        nom: "13 - Pozo Séptico",
        per: 4.83
      }
    ];
    sequelize
      .query(qry_sel_car, {
        type: sequelize.QueryTypes.SELECT
      })
      .then(x => {
        x.forEach(function(res_qry_car) {
          //console.log('\n\n\n\n'+JSON.stringify(res_qry_car));
          inf_cap.forEach(function(cap) {
            id_car++;
            id_act++;
            var qry_ins =
              `
              INSERT INTO caracteristicas
              (
                keym ,
                id_caracteristica ,
                id_usuario ,

                keym_padre ,
                id_caracteristica_padre ,
                id_usuario_padre ,


                estado ,
                porcentaje ,
                porcentaje_cumplido ,
                tipo_caracteristica ,
                visualizar_superior ,
                usuario_asignado,
                publicacion_web ,
                porcentaje_asignado ,
                fecha_inicio ,
                fecha_ultima_modificacion
              )
              VALUES
              (
                ` +
              keym +
              `,` +
              id_car +
              `,` +
              id_user +
              `,
                ` +
              res_qry_car.keym +
              `,` +
              res_qry_car.id_caracteristica +
              `,` +
              res_qry_car.id_usuario +
              `,
                'Iniciacion',
                ` +
              cap.per +
              `,
                0,
                'A',
                true,
                5,
                false,
                0,
                '2017-08-31',
                '2017-08-31'
              );

              INSERT INTO actividades
              (
                keym,
                id_actividad ,
                id_usuario ,

                keym_car ,
                id_caracteristica ,
                id_usuario_car ,

                nombre ,
                descripcion ,
                pos ,
                folder ,
                fecha_ultima_modificacion
              )
              VALUES
              (

                ` +
              keym +
              `,` +
              id_act +
              `,` +
              id_user +
              `,
                ` +
              keym +
              `,` +
              id_car +
              `,` +
              id_user +
              `,

                '` +
              cap.nom +
              `',
                '` +
              cap.nom +
              `',
                0,
                0,
                '2017-08-31'
              );
            `;
            //var sequelize1 = sqlCon.configConnection();
            sequelize
              .query(qry_ins, {
                type: sequelize.QueryTypes.SELECT
              })
              .then(x => {
                console.log("OK");
              })
              .catch(x => {
                console.log("BAD  " + x);
              })
              .done(x => {});
          }, this);
        }, this);
      })
      .catch(x => {});
  });
};

module.exports.insertMarker = function() {
  var sequelize = sqlCon.configConnection();
  var keym = 0;
  var id_user = 5;
  var id_car = 1673;
  var id_act = 1672;
  var sum = 0;
  var sum_usu = 0;

  
  //var res = ["Aldea de Maria", "Chiles", "Gran Cumbal","Carlosama","Funes","Gran Tescual","Iles","Ipiales",
  //"Males Cordoba","Mayasquer","Miraflores","Panan",'Pastas Aldana'];
  //var res = ["Aldea de Maria"];
  //var res = ["Chiles"];
  //var res = ["Gran Cumbal"];
  //var res = ["Carlosama"];
  //var res = ["Funes"];
  //var res = ["Gran Tescual"];
  //--var res = ["Iles"];
  //var res = ["Ipiales"];
  //var res = ["Males Cordoba"];
  //var res = ["Mayasquer"];
  //var res = ["Miraflores"];
  //var res = ["Panan"];
  var res = ["San Juan"];

  res.forEach(function(element) {
    var path = repository + element + ".csv";
    //console.log(path);
    fs.readFile(path, "utf8", (err, data) => {
      //console.log("\n\n\n"+path+'\n\n\n');

      if (!err) {
        //console.log(data);
        data.split("\n").forEach(function(item) {
          item = item.split(",");
          var cedula = item[1];
          var lat = item[4];
          var lon = item[3];
          var alt = item[5];


          if (cedula != undefined) {
            getIdMarker(cedula,sequelize).then(x => {

              var keym = x.keym, id_caracteristica = x.id_caracteristica, id_usuario = x.id_usuario;
              //console.log(cedula+'\t\t'+keym+' - '+id_caracteristica+' - '+id_usuario)

              var query1 = `
                insert into marcador (
                  keym,
                  id_caracteristica,
                  id_usuario,
                  id_categoria,
                  latitud ,
                  longitud ,
                  altitud
                )
                values(
                  `+keym+`,
                  `+id_caracteristica+`,
                  `+id_usuario+`,
                  `+2+`,
                  `+lat+`,
                  `+lon+`,
                  `+alt+`
                )
              `;
              //console.log('\n\n\n'+query1);

              sequelize
                .query(query1, { type: sequelize.QueryTypes.INSERT })
                .then(x => {
                  console.log('ok');
                })
                .catch(x => {
                  console.log("Error Usuario: " + x);
                });
            });
          }
        }, this);
      } else console.log("error");
    });
  }, this);

  console.log("\n\nFINISH");
};

function getIdMarker(cedula,sequelize) {
//var sequelize = sqlCon.configConnection();
  var query1 =
    `
      select keym,id_caracteristica,id_usuario from caracteristicas where cedula = ` +
    cedula +
    `;`;
  return new Promise((resolve, reject) => {
    sequelize
      .query(query1, { type: sequelize.QueryTypes.SELECT })
      .then(x => {
        //console.log("\n\n\n x==>" + JSON.stringify(x));
        if (x[0] != null) {
          //console.log('ok');
          resolve(x[0]);
        } else {
          //console.log('bad');
          reject(false);
        }
      })
      .catch(x => {
        console.log("Error Usuario: " + x);
        reject(false);
      });
  });
}
