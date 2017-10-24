var express = require("express");
var Sequelize = require("sequelize");
var sqlCon = require("../config/connectionDb");
var router = express.Router();
var Caracteristica = require("./Caracteristicas");

//Service to regiter a new point
module.exports.regPoint = function (data) {
  console.log("REGPoint  ==>   " + JSON.stringify(data));
  var keym = data.keym;
  var id_caracteristica = data.id_caracteristica;
  var id_usuario = data.id_usuario;

  var latitud = data.latitud;
  var longitud = data.longitud;
  var id_categoria = data.id_categoria;
  //var etiqueta = data.etiqueta;

  var query1 =
    `
         insert into marcador (keym,id_caracteristica,id_usuario,latitud,longitud,id_categoria) values (
            '` +
    keym +
    `',
            '` +
    id_caracteristica +
    `',
            '` +
    id_usuario +
    `',
            '` +
    latitud +
    `',
            '` +
    longitud +
    `',
            '` +
    id_categoria +
    `'
        );
    `;
  console.log("\n\nQUERY1  ===>  " + query1);
  return new Promise((resolve, reject) => {
    var sequelize = sqlCon.configConnection();
    sequelize
      .query(query1, {
        type: sequelize.QueryTypes.INSERT
      })
      .then(x => {
        console.log("Se ha registrado satisfactoriamente el punto.");
        resolve(true);
      })
      .catch(x => {
        console.log("No se ha registrado el punto. " + x);
        reject(false);
      })
      .done(x => {
        sequelize.close();
        console.log("Se ha cerrado session correctamente");
      });
  });
};

//Service to update marker point
module.exports.updatePoint = function (data) {
  var sequelize = sqlCon.configConnection();
  var query1 =
    `
        update marcador set

        latitud = '` +
    data.latitud +
    `',
        longitud = '` +
    data.longitud +
    `',
        id_categoria = ` +
    data.id_categoria +
    `


        where
        id_marcador = ` +
    data.id_marcador +
    `
    `;
  console.log("QERY " + query1);
  return new Promise((resolve, reject) => {
    sequelize
      .query(query1, { type: sequelize.QueryTypes.UPDATE })
      .then(x => {
        console.log("Se actualizo correctamente la iformacion del marcador");
        resolve(true);
      })
      .catch(x => {
        console.log("Error al actualizar informacion del marcador " + x);
        reject(false);
      })
      .done(x => {
        sequelize.close();
        console.log("Se ha cerrado sesion de la conexion a la base de datos");
      });
  });
};

//Servoce to get point list
module.exports.getPointList = function (data) {
  console.log("\n\n\n\nGEtPintList ===> " + JSON.stringify(data));
  if (data.keym == null || data.keym == undefined) {
    data.keym = data.keym_car;
    data.id_usuario = data.id_usuario_car;
    //data.keym = data.key_car;
    console.log('MODIFY   =>   ' + JSON.stringify(data));
  }
  var sequelize = sqlCon.configConnection();
  switch (data.tipo) {
    case "Beneficiario":
      var query1 =
        `
          select keym,
          m.id_caracteristica,
          m.id_usuario,
          m.latitud,
          m.longitud,
          m.id_categoria,
          b.nombre,
          b.cedula 
          from marcador m  natural join caracteristicas c natural join beneficiarios b
          where m.keym = ` +
        data.keym +
        `
          and m.id_caracteristica = ` +
        data.id_caracteristica +
        `
          and m.id_usuario = ` +
        data.id_usuario +
        `
        `;
      break;
    case "Resguardo":
      var query1 = `select * from marcador m natural join caracteristicas c join beneficiarios b on b.cedula = c.cedula
        where b.cedula is not null
        and c.keym_padre = `+ data.keym + `
        and c.id_caracteristica_padre = `+ data.id_caracteristica + `
        and c.id_usuario_padre = `+ data.id_usuario + ` ; `;
      break;
    case "Municipio":
      var query1 = `select * from caracteristicas c1 
        join caracteristicas c2 on c2.keym_padre = c1.keym and c2.id_caracteristica_padre = c1.id_caracteristica and c2.id_usuario_padre = c1.id_usuario
        join marcador m on m.keym = c2.keym and m.id_caracteristica = c2.id_caracteristica and m.id_usuario = c2.id_usuario
        join beneficiarios b on b.cedula = c2.cedula
        where c2.cedula is not null
        and c1.keym_padre = `+ data.keym + `
        and c1.id_caracteristica_padre = `+ data.id_caracteristica + `
        and c1.id_usuario_padre = `+ data.id_usuario + ` ; `;
      break;
    case "Provincia":
      var query1 = `select * from caracteristicas c1 
      join caracteristicas c2 on c2.keym_padre = c1.keym and c2.id_caracteristica_padre = c1.id_caracteristica and c2.id_usuario_padre = c1.id_usuario
      join caracteristicas c3 on c3.keym_padre = c2.keym and c3.id_caracteristica_padre = c2.id_caracteristica and c3.id_usuario_padre = c2.id_usuario
      join marcador m on m.keym = c3.keym and m.id_caracteristica = c3.id_caracteristica and m.id_usuario = c3.id_usuario
      join beneficiarios b on b.cedula = c3.cedula
      where c3.cedula is not null
      and c1.keym_padre = `+ data.keym + `
      and c1.id_caracteristica_padre = `+ data.id_caracteristica + `
      and c1.id_usuario_padre = `+ data.id_usuario + ` ; `;
      break;
    case "Proyecto":
      var query1 = `select * from marcador natural join caracteristicas natural join beneficiarios b where cedula is not null`;
      break;
  }

  //console.log('\n\n\n\n\n\n\nQUERY1  ======>   \n'+data.tipo+'\n\n\n'+ query1+'\n\n\n');

  return new Promise((resolve, reject) => {
    sequelize
      .query(query1, { type: sequelize.QueryTypes.SELECT })
      .then(x => {
        /*console.log(
          "Se encontro correctamente la lista de puntos\n\n\n" +
            JSON.stringify(x)
        );*/
        resolve(x);
      })
      .catch(x => {
        console.log("NO se encontro correctamente la lista de puntos " + x);
        reject(false);
      })
      .done(x => {
        sequelize.close();
        console.log("Se ha cerrado sesion de la conexion a la base de datos");
      });
  });
};
