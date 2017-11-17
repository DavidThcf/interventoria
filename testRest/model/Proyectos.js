var express = require('express');
var Sequelize = require('sequelize');
var sqlCon = require('../config/connectionDb');
var fls = require('../model/Archivos');

var router = express.Router();
var Caracteristica = require('./Caracteristicas');
var repository = 'files/';

// Service to create a project from activity
module.exports.createProjectFromActivity = function (data) {

  //caracteristica
  var keym_car = data.keym;
  var id_caracteristica_car = data.id_caracteristica;
  var id_usuario_car = data.id_usuario;

  //informacion
  var nombre = data.nombre;
  var descripcion = data.descripcion;
  var icon = data.icon != undefined ? icon = data.icon : icon = '';

  //fecha
  var current_date = new Date();
  var fecha_ultima_modificacion = current_date.toLocaleString();

  //creacion del proyecto

  return new Promise((resolve, reject) => {
    var sequelize = sqlCon.configConnection();
    getIdFreeProject(id_usuario, keym).
      then(x => {
        var query1 = `
                insert into proyectos values (
                    `+ keym + `,
                    `+ x + `,
                    `+ id_usuario + `,

                    `+ keym_car + `,
                    `+ id_usuario_car + `,
                    `+ id_caracteristica_car + `,

                    '`+ nombre + `',
                    
                    `+ false + `,
                    '`+ icon + `',
                    '`+ descripcion + `',
                    `+ 0 + `,
                    '`+ fecha_ultima_modificacion + `'
                );

                UPDATE caracteristicas
                SET tipo_caracteristica = 'P'

                WHERE keym= `+ keym_car + `
                and id_caracteristica = `+ id_caracteristica_car + `
                and id_usuario = `+ id_usuario_car + `;
                `;

                console.log('HAHHAHAHAH te jodiste');

        sequelize.query(query1, { type: sequelize.QueryTypes.INSERT })
          .then(x => {
            resolve(true);
          }).catch(x => {
            console.log('Error al registrar actividad ' + x);
            reject(false);
          }).done(x => {
            sequelize.close();
            console.log('Se ha cerrado sesion de la conexion a la base de datos');
          });
      }).catch(x => {
        console.log('ERROR al registrar el PROYECTO.');
      });



  });

};

// Service to get the project list
module.exports.getListProjects = function (id_user) {
  var sequelize = sqlCon.configConnection();
  /*var query1 = `
        select * from proyectos
        join caracteristicas on proyectos.keym_car = caracteristicas.keym
        and proyectos.id_usuario_car = caracteristicas.id_usuario
        and proyectos.id_caracteristica = caracteristicas.id_caracteristica
        where proyectos.id_usuario in (`+id_user+`)

        `;*/
  var query1 = `
      select 	
      b.nombre beneficiario,
      b.cedula,
      b.tipo_identificacion,
      
      p.nombre as nom_pro,
      p.nombre as nom_act,
      p.descripcion,
      u.nombre,
      u.apellido,
      
      c.keym,
      c.id_caracteristica,
      c.id_usuario,
      
      c.usuario_asignado,
      c.tipo,
      c.keym_padre,
      c.id_caracteristica_padre,
      c.id_usuario_padre,
      c.tipo,
      c.tipo_caracteristica,
      c.costo_real,
      c.costo_actual,
      c.estado,
      c.porcentaje_asignado,
      c.porcentaje_cumplido,
      c.publicacion_web,
      c.porcentaje,
      c.fecha_inicio,
      c.fecha_fin,
      c.publicacion_reporte,
      u.nombre as usr_nom,
      u.apellido as usr_ape,
      u.e_mail as e_mail,
      u.cargo as cargo,
      u.tipo_usuario,
      ct.nombre nombre_cat,
      ct.color color_cat
      
      
      
    from proyectos p
    join caracteristicas c on p.keym_car = c.keym
    and p.id_usuario_car = c.id_usuario
    and p.id_caracteristica = c.id_caracteristica
    join usuarios u on  c.usuario_asignado = u.id_usuario
    left join beneficiarios b
    on c.cedula = b.cedula
      
    left join marcador m
    on 	m.keym = c.keym
    and 	m.id_usuario = c.id_usuario
    and 	m.id_caracteristica = c.id_caracteristica
      
    left join categorias_mapa ct
    on 	ct.id_categoria = m.id_categoria
      
    where p.id_usuario in(` + id_user + `)`;


  return new Promise((resolve, reject) => {
    sequelize.query(query1, { type: sequelize.QueryTypes.SELECT })
      .then(x => {
        resolve(x);
      }).catch(x => {
        console.log('Error al Obtener la lista de proyectos  getListProjects ' + x);
        reject(false);
      }).done(x => {
        sequelize.close();
        console.log('Se ha cerrado sesion de la conexion a la base de datos');
      });
  });

}

//Servicce to create a new project
module.exports.createProject = function (data, files) {
  //informacion
  var nombre = data.nombre;
  var descripcion = data.descripcion;
  var icon = data.icon;
  if (icon === undefined)
    icon = '';
  var id_usuario = data.id_usuario;
  var keym = 0;

  var id_prj;

  //fecha
  var current_date = new Date();
  var fecha_ultima_modificacion = current_date.toLocaleString();

  return new Promise((resolve, reject) => {
    Caracteristica.createCharacteristic(data, 'P').then(x => {

      console.log("\n\n\n\n\n\n\n YAY " + JSON.stringify(x) + '\n' + keym + '     ' + id_usuario);
      getIdFreeProject(id_usuario, keym).
        then(id => {
          id_prj = id;
          var sequelize = sqlCon.configConnection();
          var query1 = `
                            insert into proyectos values (
                                `+ keym + `,
                                `+ id + `,
                                `+ id_usuario + `,

                                `+ x.keym + `,
                                `+ x.id_usuario + `,
                                `+ x.id_caracteristica + `,

                                '`+ nombre + `',
                                
                                `+ false + `,
                                '`+ icon + `',
                                '`+ descripcion + `',
                                `+ 0 + `,
                                '`+ x.fecha_ultima_modificacion + `');
                        `;
          sequelize.query(query1, { type: sequelize.QueryTypes.INSERT })
            .then(x => {

              var path = repository + 'user' + id_usuario;
              fls.fileUpload(files, path + '/', 'project-' + keym + '-' + id_prj + '-' + id_usuario);
              console.log('Se ha registrado correctamente el proyecto')
              resolve(true);
            }).catch(x => {
              console.log('Error: Ha ocurrido un error al registrar el proyecto. ' + x);
              reject(false);
            }).done(x => {
              sequelize.close();
              console.log('Se ha cerrado sesion de la conexion a la base de datos');
            });
        }).catch(x => {
          console.log('ERROR al registrar el PROYECTO.');
        });



    }).catch(x => {

    });
  });

}

module.exports.editProjectInformation = function (data, files) {
  var sequelize = sqlCon.configConnection();
  var query1 = `
        update proyectos set
        nombre = '`+ data.nombre + `',
        descripcion = '`+ data.descripcion + `'
        where
        keym_car = `+ data.keym_car + ` and
        id_caracteristica = `+ data.id_caracteristica + ` and
        id_usuario_car = `+ data.id_usuario_car + `
    `;

  return new Promise((resolve, reject) => {
    sequelize.query(query1, { type: sequelize.QueryTypes.SELECT })
      .then(x => {
        if (files != null) {
          var path = repository + 'user' + id_usuario;
          fls.fileUpload(files, path + '/', 'project-' + keym + '-' + id_prj + '-' + id_usuario);
        }
        console.log('Se actualizo correctamente la iformacion del proyecto');
        resolve(true);
      }).catch(x => {
        console.log('Error al registrar actividad ' + x);
        reject(false);
      }).done(x => {
        sequelize.close();
        console.log('Se ha cerrado sesion de la conexion a la base de datos');
      });
  });
}

//Service get all project -> temporal
module.exports.getVisibleProjects = function () {
  var sequelize = sqlCon.configConnection();
  var query1 = `
    select * from proyectos
    join caracteristicas c on proyectos.keym_car = c.keym
    and proyectos.id_usuario_car = c.id_usuario
    and proyectos.id_caracteristica = c.id_caracteristica

    where c.keym || '-'|| c.id_caracteristica || '-' ||c.id_usuario
    in (select keym_car||'-'||id_caracteristica||'-'||id_usuario_car from categorias_mapa)


        `;



  return new Promise((resolve, reject) => {
    sequelize.query(query1, { type: sequelize.QueryTypes.SELECT })
      .then(x => {
        console.log('OK consulta get projects');
        resolve(x);
      }).catch(x => {
        console.log('Error al obtener los proyectos' + x);
        reject(false);
      }).done(x => {
        sequelize.close();
        console.log('Se ha cerrado sesion de la conexion a la base de datos');
      });
  });
}

module.exports.assignActivityToUser = function (data) {
  var car = JSON.parse(data.caracteristica);
  var usr = JSON.parse(data.usuario);
  var keym = JSON.parse(data.keym);

  var sequelize = sqlCon.configConnection();


  return new Promise((resolve, reject) => {
    getIdFreeProject(usr.id_usuario, car.keym).
      then(id_prj => {
        //revision
        console.log('\n\n aisg  ' + car.usuario_asignado + '   =   usu  ' + car.id_usuario + '\n\n\n UA ===>   '+id_prj);
        if (JSON.stringify(car.usuario_asignado) != JSON.stringify(car.id_usuario)) {
          console.log('\n\n ===========');
          var query1 = `

          UPDATE caracteristicas
          SET usuario_asignado  =  `+ usr.id_usuario + `
          WHERE keym = `+ car.keym + `
          AND id_caracteristica = `+ car.id_caracteristica + `
          AND id_usuario = `+ car.id_usuario + `;

          UPDATE proyectos
          SET
          keym = `+ keym + `,
          id_proyecto = `+ id_prj + `,
          id_usuario  =  `+ usr.id_usuario + `
          WHERE keym_car = `+ car.keym + `
          AND id_caracteristica = `+ car.id_caracteristica + `
          AND id_usuario_car = `+ car.id_usuario + `;

        `;
        }
        else {
          console.log('\n\n XXXXXXXXX');
          var query1 = `
        INSERT INTO proyectos
        (
            keym,   id_proyecto,   id_usuario,
            keym_car,   id_usuario_car,   id_caracteristica,
            nombre,descripcion
        )
        VALUES(
          `+ keym + `,
          `+ id_prj + `,
          `+ usr.id_usuario + `,

          `+ car.keym + `,
          `+ car.id_usuario + `,
          `+ car.id_caracteristica + `,

          '`+ car.nom_act + `',
          '`+ car.desc_act + `'
        );

        UPDATE caracteristicas
        SET usuario_asignado  =  `+ usr.id_usuario + `
        WHERE keym = `+ car.keym + `
        AND id_caracteristica = `+ car.id_caracteristica + `
        AND id_usuario = `+ car.id_usuario + `
        ;
      `;
        }
        console.log('OKI  \n\n\n\n' + query1);
        return new Promise((res, rej) => {
          sequelize.query(query1, { type: sequelize.QueryTypes.SELECT })
            .then(x => {
              console.log('Se creo exitosamente el proyecto de una actividad');
              resolve(true);
            }).catch(x => {
              console.log('Error al crear el proyecto de una actividad ' + x);
              reject(false);
            }).done(x => {
              sequelize.close();
              console.log('Se ha cerrado sesion de la conexion a la base de datos');

            });
        });
      }).catch(x => {
        console.log('Error catch assignActivityToUser' + x);
        reject(x);
      });

  });


}

/* susoension de obra */
module.exports.pauseProyect = function (data) {
  console.log(JSON.stringify(data));
  var sequelize = sqlCon.configConnection();
  var query1 = `INSERT INTO suspensiones(keym, id_caracteristica,id_usuario,fecha_inicio,fecha_fin) 
  VALUES (`+
  data.keym+`,`+
  data.id_caracteristica+`,`+
  data.id_usuario+`,'`+
  data.datePauseInicio+`','`+
  data.datePauseFin+`'
  );`;
  return new Promise((resolve, reject) => {
    sequelize.query(query1, { type: sequelize.QueryTypes.INSERT })
      .then(x => {
        console.log('OK consulta get projects');
        resolve(x);
      }).catch(x => {
        console.log('Error al obtener los proyectos' + x);
        reject(false);
      }).done(x => {
        sequelize.close();
        console.log('Se ha cerrado sesion de la conexion a la base de datos');
      });
  });
}
/* -------------------- */

//Function to get the ID free
function getIdFreeProject(id_usuario, keym) {
  return new Promise((resolve, reject) => {
    var sequelize = sqlCon.configConnection();
    var query1 = `
            select max(id_proyecto) as prj from proyectos
            where keym = `+ keym + ` and id_usuario = ` + id_usuario + `
        `;
    sequelize.query(query1, { type: sequelize.QueryTypes.SELECT }).
      then(x => {
        var pr = parseInt(x[0].prj)+1;
        console.log('\n\n\n\n\n\PRJ        \n\n '+pr  );
        console.log('\n\n\n\n\n\n');
        if (pr != null && pr > 0)
          resolve(pr);
        else
          resolve(1);
      }).catch(x => {
        console.log('EROR  ->  PRJ  ' + x);
        reject(false);
      }).done(x => {
        sequelize.close();
        console.log('Se ha cerrado sesion de la conexion a la base de datos');
      });
  });
}
