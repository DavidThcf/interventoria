
var express = require('express');
var Sequelize = require('sequelize');
var sqlCon = require('../config/connectionDb');
var router = express.Router();
var fs = require('fs');
var repository = 'files/';

//Service to create files
module.exports.create_file = function (data, files) {
    //Characteristic Data
    var keym_car = data.keym;
    var id_caracteristica = data.id_caracteristica;
    var id_usuario_car = data.id_usuario;
    //File Data
    // data.nombre_archivo == undefined ? nombre_archivo = files.name :  nombre_archivo = '';
    var keym = 0;
    var id_usuario = data.id_usuario_act;
    var id_archivo; //Later initialize
    var nombre_archivo = '';
    var titulo = data.titulo == undefined ? titulo = 'UNDEFINED' : titulo = data.titulo;
    var subtitulo = data.subtitulo == undefined ? subtitulo = 'UNDEFINED' : subtitulo = data.subtitulo;
    var descripcion = data.descripcion == undefined ? descripcion = 'UNDEFINED' : descripcion = data.descripcion;
    var contenido = data.contenido == undefined ? contenido = 'UNDEFINED' : contenido = data.contenido;
    var fecha_creacion = data.fecha_creacion == undefined ? fecha_creacion = 'UNDEFINED' : fecha_creacion = data.fecha_creacion;
    var fecha_ultima_modificacion = data.fecha_ultima_modificacion == undefined ? fecha_ultima_modificacion = 'UNDEFINED' : fecha_ultima_modificacion = data.fecha_ultima_modificacion;
    var publicacion = data.publicacion == undefined ? publicacion = 1 : publicacion = data.publicacion;
    var tipo = data.tipo;
    var localizacion = 0;
    var longitud = 0;
    var srcGif = '';
    var srcServ = '';



    return new Promise((resolve, reject) => {

        getIdFreeFile(keym, id_usuario, files.file.name).then(x => {
            id_archivo = x[0];
            console.log('\n\n\n\n\nPOL  ' + x[0] + '   ' + x[1]);
            joinNameFile(keym, id_archivo, id_usuario, x[1]).then(nom_arc => {
                nombre_archivo = nom_arc;
                var sequelize = sqlCon.configConnection();

                var query1 = `
                    insert into archivos values 
                    (
                        `+ keym + `,
                        `+ id_archivo + `,
                        `+ id_usuario + `,
                        `+ keym_car + `,
                        `+ id_caracteristica + `,
                        `+ id_usuario_car + `,
                        '`+ nombre_archivo + `',
                        '`+ titulo + `',
                        '`+ subtitulo + `',
                        '`+ descripcion + `',
                        '`+ contenido + `',
                        now(),
                        '`+ fecha_ultima_modificacion + `',
                        `+ publicacion + `,
                        '`+ tipo + `',
                        `+ localizacion + `,
                        `+ longitud + `,
                        '`+ srcGif + `',
                        'user`+ id_usuario + `/',
                        false
                    );
    
                `;
                sequelize.query(query1, { type: sequelize.QueryTypes.INSERT }).
                    then(x => {
                        this.fileUpload(files, repository + '/user' + id_usuario + '/', nombre_archivo);
                        console.log('\n\n\n\n\nUpload Completed');
                        resolve(true);
                    }).catch(x => {
                        console.log('Error getIdFreeFile:   ' + x);
                        reject(false);
                    });

            });

        }).catch(x => {
            console.log('Unaxpective load ===>   ' + x);
        });
    });

}


//Service to get files original
module.exports.getFileList = function (data) {
    //console.log('OK ');
    var sequelize = sqlCon.configConnection();
    var keym = data.keym;
    var id_caracteristica = data.id_caracteristica;
    var id_usuario = data.id_usuario;
    var tipo = 'reporte_' + data.tipoAct.toLowerCase();
    //console.log('OK ' + keym + '  ' + id_caracteristica + '  ' + id_usuario);
    return new Promise((resolve, reject) => {

        if (data.reporte) {
            if (data.tipoAct == "Proyecto")
                var query1 = `
                    SELECT * FROM archivos ar, (select val_configuracion from configuracion_inicial where id = 1) t1
                    WHERE (now()::date- ar.fecha_creacion::date) <= 15 
                    and tipo = '`+ data.tipo + `' and ` + tipo + ` =  ` + id_caracteristica + `  ;
                `;

            else
                var query1 = `
                    select *,
                    CASE WHEN  `+ id_caracteristica + ` = a.` + tipo + `
                    THEN true
                    ELSE false
                    END as ext
                    from archivos a, (select val_configuracion from configuracion_inicial where id = 1) t1
                    where tipo = '`+ data.tipo + `'
                    and ` + tipo + ` =  ` + id_caracteristica + `  ;
                `;
        }
        else {
            if (data.tipoAct == "Proyecto") {
                var query1 = `
                SELECT *,
                
                CASE WHEN  `+ id_caracteristica + ` = ar.` + tipo + `
                THEN true
                ELSE false
                END as ext
                FROM archivos ar, (select val_configuracion from configuracion_inicial where id = 1) t1
                WHERE (now()::date- ar.fecha_creacion::date) <= 15 
                and tipo = '`+ data.tipo + `' 
                ORDER BY
                ar.fecha_creacion DESC  LIMIT 25; 
                `;
            } 
            
            else if(data.tipoAct == "Beneficiario" || data.tipoAct == "Capitulo" || data.tipoAct == "Actividad") {
                var query1 = `
                    select getarchivos(
                        `+ keym + `,
                        `+ id_caracteristica + ` ,
                        `+ id_usuario + `,
                        '`+ data.tipo + `'
                    );
                  
                `;
            }
            
            else{
                var query1 = `
                select *,
                CASE WHEN  `+ id_caracteristica + ` = a.` + tipo + `
                THEN true
                ELSE false
                END as ext
                from archivos a, (select val_configuracion from configuracion_inicial where id = 1) t1
                where tipo = '`+ data.tipo + `'
                and ` + tipo + ` =  ` + id_caracteristica + `  ;
                `;
            }
        }
        //console.log(query1);
        sequelize.query(query1, { type: sequelize.QueryTypes.SELECT }).
            then(x => {

                var cad = JSON.stringify(x);
                cad = cad.replace(/\//g, '=');
                console.log('RESPONDE =======>    ' + JSON.stringify(x))
                resolve(x);
            }).catch(x => {
                reject(false);
            }).done(x => {
                sequelize.close();
                console.log('Se ha cerrado sesion de la conexion a la base de datos');
            });;
    });
}


//get all files from characteristica
module.exports.getFileListChild = function (data) {
    //console.log('OK ');
    var sequelize = sqlCon.configConnection();
    var keym = data.keym;
    var id_caracteristica = data.id_caracteristica;
    var id_usuario = data.id_usuario;
    var tipo = 'reporte_' + data.tipoAct.toLowerCase();
    //console.log('OK ' + keym + '  ' + id_caracteristica + '  ' + id_usuario);
    return new Promise((resolve, reject) => {


        var query1 = `
            select getarchivos(0,315,5,'img');
        
            
        `;
        // --and tipo = '`+ data.tipo + `' and ` + tipo + ` =  ` + id_caracteristica + `  ;
        //console.log(query1);
        sequelize.query(query1, { type: sequelize.QueryTypes.SELECT }).
            then(x => {
                console.log('\n\n\n\n\n\n\n\nRESPONDE =======>    ' + JSON.stringify(x['getarchivos']))
                resolve(x);
            }).catch(x => {
                reject(false);
            }).done(x => {
                sequelize.close();
                console.log('Se ha cerrado sesion de la conexion a la base de datos');
            });;
    });
}

//service to get files for show novedades/news
module.exports.getFilesNovedades = function (data) {
    //console.log('data  >  '+JSON.stringify(data));
    var keym = data.keym;
    var id_caracteristica = data.id_caracteristica;
    var id_usuario = data.id_usuario;

    return new Promise((resolve, reject) => {
        var sequelize = sqlCon.configConnection();
        var query1 = `

            select * from archivos a, (select val_configuracion from configuracion_inicial where id = 1) as t1
            where keym_car = `+ keym + ` 
            and id_caracteristica = `+ id_caracteristica + ` 
            and id_usuario_car = `+ id_usuario + `
            and tipo = '`+ data.tipo + `' and a.visto = false ;
        `;
        //console.log(query1);
        sequelize.query(query1, { type: sequelize.QueryTypes.SELECT }).
            then(x => {
                //console.log('RESPONDE =======>    ' + JSON.stringify(x))
                resolve(x);
            }).catch(x => {
                resolve(false);
            }).done(x => {
                sequelize.close();
                console.log('Se ha cerrado sesion de la conexion a la base de datos');
            });;
    });

}

//Service to upload profile image
module.exports.imageProfileUpload = function (files, path) {

    var file;

    var result = '-1';

    if (!files) {
        result = '0';
        console.log("no existe archivo");
    }
    else {
        file = files.file;

        //var fina = file.name.replace(/\s/g, "");
        var fina = file.name = 'profile' + getExtension(file.name);

        file.mv(path + fina, function (err) {
            if (err) console.log("error " + err.toString());
            else console.log("carga exitosa");
        });

    }
}

//Service to upload files
module.exports.fileUpload = function (files, path, nom) {

    var file;
    var name = nom;
    console.log('\n\n\n\n Name    ' + name);
    if (name.length == 0)
        name = 'project-' + file.name;

    var result = '-1';
    console.log('REPOSITORY   ' + path);
    if (!files) {
        result = '0';
        console.log("no existe archivo");
    }
    else {
        file = files.file;
        //var fina = file.name.replace(/\s/g, "");
        var fina;
        if (name.length == 0)
            fina = name + getExtension(file.name);
        else
            fina = name;
        file.mv(path + fina, function (err) {
            if (err) console.log("error " + err.toString());
            else console.log("carga exitosa");
        });

    }
}



//===========     Auxiliar Funcions     =================//

// Join IDs to create the name
function joinNameFile(keym, id_archivo, id_usuario, nombre) {
    return new Promise((resolve, reject) => {
        console.log('\n\n\n\nNOMBRE FILE    ======>   ' + nombre);
        resolve(keym + '-' + id_archivo + '-' + id_usuario + '.' + getExtension(nombre));
    });
}

// return the extension te file
function getExtension(dat) {
    var cad = dat.split('.');
    return cad[cad.length - 1];
}

// Return the Free ID of the files
function getIdFreeFile(keym, id_usuario, nombre) {
    console.log('NOMBRE hahahaha ===>   ' + nombre);
    return new Promise((resolve, reject) => {
        var sequelize = sqlCon.configConnection();
        var query1 = `
            select max(id_archivo) as id_act from archivos 
            where keym_arc = `+ keym + ` 
            and id_usuario_arc = `+ id_usuario + `
        `;
        sequelize.query(query1, { type: sequelize.QueryTypes.SELECT }).
            then(x => {
                console.log('\n\n\n\n' + JSON.stringify(x) + '\n\n\n\n\n');
                if (x[0].id_act != null) {
                    console.log('NOT NULL ===>   ' + JSON.stringify(x));
                    var dat = [parseInt(x[0].id_act) + 1, nombre];

                    resolve(dat);
                }

                else {
                    console.log('NOT NULL ===>   ' + JSON.stringify(x));
                    var dat = [1, nombre];
                    resolve(dat);
                }

            }).catch(x => {
                console.log('Error getIdFreeFile:   ' + x);
                reject(false);
            });
    });
}

/* ------------updateImageEditView---------- */
module.exports.updateImageEditView = function (data) {
    console.log('\n\n\n\n\n\n\n\n\n\n=============================================================\n' + data.img_edit);
    var sequelize = sqlCon.configConnection();
    var d = JSON.parse(data.img_edit)
    var tipo = 'reporte_' + data.tipo_car.toLowerCase();
    console.log('\n\n\n\nasasas >>>>> ' + JSON.stringify(d[0]));
    var q = '';
    for (var i = 0; i < d.length; i++) {

        if (d[i].ext === true) {
            var query1 = `
                UPDATE archivos SET 
                `+ tipo + ` =` + data.id_caracteristica + `
                WHERE keym_arc = `+ d[i].keym_arc +
                ` AND id_archivo =  ` + d[i].id_archivo +
                ` AND id_usuario_arc = ` + d[i].id_usuario_arc + `;
            `;
        } else {
            var query1 = `
                UPDATE archivos SET 
                `+ tipo + ` = null
                WHERE keym_arc = `+ d[i].keym_arc +
                ` AND id_archivo =  ` + d[i].id_archivo +
                ` AND id_usuario_arc = ` + d[i].id_usuario_arc + `;
            `;
        }

        q = q + query1;
    }

    /*
for (var i = 0; i < d.length; i++) {
        var query1 = `
        UPDATE archivos SET 
        `+tipo+` =` + d[i].reporte + `
        WHERE keym_arc = `+ d[i].keym_arc +
            ` AND id_archivo =  ` + d[i].id_archivo +
            ` AND id_usuario_arc = ` + d[i].id_usuario_arc + `;
        `;
        q = q + query1;
    }
    */


    console.log('query >>>>>>>>>>>> ' + q)
    return new Promise((resolve, reject) => {
        sequelize
            .query(q, { type: sequelize.QueryTypes.SELECT })
            .then(x => {
                console.log("\n\n\n\nSe encontro correctamente la lista de observaciones\n\n\n" + JSON.stringify(x));
                resolve(x);
            })
            .catch(x => {
                console.log("NO se encontro correctamente la lista de observaciones " + x);
                reject(false);
            })
            .done(x => {
                sequelize.close();
                console.log("Se ha cerrado sesion de la conexion a la base de datos");
            });
    });
}
/* -------------------------------------- */


//multimedia reporte
//Service to get files original
module.exports.getMultimediaReport = function (data) {
    //console.log('OK ');
    var sequelize = sqlCon.configConnection();
    var keym = data.keym;
    var id_caracteristica = data.id_caracteristica;
    var id_usuario = data.id_usuario;
    //console.log('OK ' + keym + '  ' + id_caracteristica + '  ' + id_usuario);
    return new Promise((resolve, reject) => {

        if (data.reporte) {
            if (data.tipo_car == 'Proyecto')
                var query1 = `
                SELECT * FROM archivos ar, (select val_configuracion from configuracion_inicial where id = 1) t1
                WHERE (now()::date- ar.fecha_creacion::date) <= 15 and tipo = '`+ data.tipo + `' and reporte =  true  ;
                ORDER BY
                ar.fecha_creacion DESC  LIMIT 25; 
            `;
            else
                var query1 = `
                select * from archivos a, (select val_configuracion from configuracion_inicial where id = 1) t1
                where keym_car = `+ keym + ` 
                and id_caracteristica = `+ id_caracteristica + ` 
                and id_usuario_car = `+ id_usuario + `
                and tipo = '`+ data.tipo + `' and reporte =  true  ;
            `;
        }
        else {
            if (data.tipoAct == "Proyecto") {
                var query1 = `
                SELECT * FROM archivos ar, (select val_configuracion from configuracion_inicial where id = 1) t1
                WHERE (now()::date- ar.fecha_creacion::date) <= 15
                ORDER BY
                ar.fecha_creacion DESC  LIMIT 25; 
                `;
            } else {
                var query1 = `
                    select * from archivos a, (select val_configuracion from configuracion_inicial where id = 1) t1
                    where keym_car = `+ keym + ` 
                    and id_caracteristica = `+ id_caracteristica + ` 
                    and id_usuario_car = `+ id_usuario + `
                    and tipo = '`+ data.tipo + `'  ;
                `;
            }
        }
        //console.log(query1);
        sequelize.query(query1, { type: sequelize.QueryTypes.SELECT }).
            then(x => {

                var cad = JSON.stringify(x);
                cad = cad.replace(/\//g, '=');
                console.log('RESPONDE =======>    ' + JSON.stringify(x))
                resolve(x);
            }).catch(x => {
                reject(false);
            }).done(x => {
                sequelize.close();
                console.log('Se ha cerrado sesion de la conexion a la base de datos');
            });;
    });
}
