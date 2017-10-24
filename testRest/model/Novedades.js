var express = require('express');
var Sequelize = require('sequelize');
var sqlCon = require('../config/connectionDb');
var router = express.Router();


module.exports.getDataNewChangePercent = function (data) {
    var sequelize = sqlCon.configConnection();
    console.log(data);
    var query1 = `
    select 
    c.usuario_asignado asignado,us.nombre usu_nov,ua.nombre usu_car,
    n.keym,n.id_caracteristica,n.id_usuario,
    c.tipo,a.nombre,
    c.porcentaje_cumplido porcentaje_actual,
    n.porcentaje_cambio,
    (n.porcentaje_cambio) porcentaje_futuro,
    n.fecha_creacion
    from novedades n
    join usuarios us on n.usuario_own = us.id_usuario
    join caracteristicas c on c.keym = n.keym  and c.id_caracteristica = n.id_caracteristica and c.id_usuario = n.id_usuario
    
    join usuarios ua on c.usuario_asignado = ua.id_usuario
    
    join actividades a on a.keym_car = n.keym  and a.id_caracteristica = n.id_caracteristica and a.id_usuario_car = n.id_usuario
    where usuario_novedad = `+ data.id_usuario + ` and n.tipo = 'POR' and n.estado = 'WAI' order by n.usuario_own;
    `;

    return new Promise((resolve, reject) => {
        sequelize
            .query(query1, { type: sequelize.QueryTypes.SELECT })
            .then(x => {
                console.log("Se encontro correctamente la lista de novedades\n\n\n" + JSON.stringify(x));
                resolve(x);
            })
            .catch(x => {
                console.log("NO se encontro correctamente la lista de novedades " + x);
                reject(false);
            })
            .done(x => {
                sequelize.close();
                console.log("Se ha cerrado sesion de la conexion a la base de datos");
            });
    });
}

module.exports.approvalPercentage = function (data) {
    console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n  DATA ====>    '+data);
    var sequelize = sqlCon.configConnection();
    var query1 = `
        select percentageApproval(
            `+data.keym+`,
            `+data.id_caracteristica+`,
            `+data.id_usuario+`,
            `+data.stateApproval+`,
            `+data.porcentaje_cambio+`
        );
    `;


    console.log('\n\n\n\n\n  query1 ====>    '+query1+'\n\n\n');

    return new Promise((resolve, reject) => {
        sequelize
            .query(query1, { type: sequelize.QueryTypes.SELECT })
            .then(x => {
                console.log("Se aprobo correctamente el cambio de porcentaje => " + JSON.stringify(x));
                resolve(true);
            })
            .catch(x => {
                console.log("NO se aprobo correctamente el cambio de porcentaje " + x);
                reject(false);
            })
            .done(x => {
                sequelize.close();
                console.log("Se ha cerrado sesion de la conexion a la base de datos");
            });
    });
}

module.exports.approvalObservation = function (data) {
    console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n  DATA ====>    '+JSON.stringify(data));
    var sequelize = sqlCon.configConnection();
    var fec = new Date().toLocaleString();
    var query1 = `
        update observaciones set visto = true, fecha_aprovacion = '`+fec+`', aprobado = `+data.stateApproval+` 
        where id_observacion = `+data.id_observacion+`
    `;


    console.log('\n\n\n\n\n  query1 ====>    '+query1+'\n\n\n');

    return new Promise((resolve, reject) => {
        sequelize
            .query(query1, { type: sequelize.QueryTypes.SELECT })
            .then(x => {
                console.log("Se aprobo correctamente la observacion => " + JSON.stringify(x));
                resolve(true);
            })
            .catch(x => {
                console.log("NO se aprobo correctamente la observacion => " + x);
                reject(false);
            })
            .done(x => {
                sequelize.close();
                console.log("Se ha cerrado sesion de la conexion a la base de datos");
            });
    });
}

module.exports.getDataNew = function (data) {
    var sequelize = sqlCon.configConnection();
    console.log('OKOKOKOKOK  ==>  '+data);
    var query1 = `
        select * from
        (select count(id_novedad) percentage from novedades where estado = 'WAI' and visto = false and usuario_novedad = `+data+` ) t1,
        (select count(id_observacion) observations from observaciones where reporte = true and visto = false and usu_observacion = `+data+` ) t3,
        (select count(id_observacion) remarks from observaciones where reporte = false and visto = false and usu_observacion = `+data+` ) t4,
        (
            select count(a.id_archivo) files from archivos a join caracteristicas c
            on c.keym = a.keym_car
            and c.id_caracteristica = a.id_caracteristica
            and c.id_usuario = a.id_usuario_car


            where a.visto = false 
            and `+data+` = (
                select usuario_superior from usuarios 
                where id_usuario = (
                    select getdifusuarioasignado(c.keym,c.id_caracteristica,c.id_usuario)
                )
            )
        ) t2 ; 
    `;

    return new Promise((resolve, reject) => {
        sequelize
            .query(query1, { type: sequelize.QueryTypes.SELECT })
            .then(x => {
                console.log("Se encontro correctamente la lista de novedades\n\n\n" + JSON.stringify(x));
                resolve(x[0]);
            })
            .catch(x => {
                console.log("NO se encontro correctamente la lista de novedades " + x);
                reject(false);
            })
            .done(x => {
                sequelize.close();
                console.log("Se ha cerrado sesion de la conexion a la base de datos");
            });
    });
}

//Trae los datos de las observaciones que hace el subordinado => supervisor para luego ser aceptadas o no
module.exports.getDataNewObservations = function (data,reporte) {
    var sequelize = sqlCon.configConnection();
    console.log(data);
    var query1 = `
        select 
        o.id_observacion,o.keym,o.id_caracteristica,o.id_usuario,
        o.observacion,fecha_creacion,act.nombre nom_act,
        act.descripcion des_act,u.nombre usu_nom, u.apellido usu_ape,u.cargo usu_cargo
        from observaciones o left join actividades act
        on o.keym = act.keym_car
        and o.id_caracteristica = act.id_caracteristica
        and o.id_usuario = act.id_usuario_car
        join usuarios u
        on o.usuario_own_observacion = u.id_usuario
        where o.visto = false  and o.usu_observacion = `+data.id_usuario+` and o.reporte = `+reporte+`
    ;`;

    return new Promise((resolve, reject) => {
        sequelize
            .query(query1, { type: sequelize.QueryTypes.SELECT })
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


//Trae los datos de las observaciones que hace el subordinado => supervisor para luego ser aceptadas o no
module.exports.getDataNewChangeFile = function (data,reporte) {
    var sequelize = sqlCon.configConnection();
    console.log(data);
    var query1 = `
    select 
        act.nombre,
        ar.id_archivo,
        ar.nombre_archivo,
        ar.titulo,
        ar.descripcion,
        ar.fecha_creacion,
        ar."srcServ", 
        act.nombre nom_act,
        act.descripcion des_act,
        u.nombre usu_nom, 
        u.apellido usu_ape,
        u.cargo usu_cargo,
        concat((select val_configuracion from configuracion_inicial where id = 1),ar."srcServ",ar.nombre_archivo) link
        
    from archivos ar 
        left join actividades act
        on ar.keym_car = act.keym_car
        and ar.id_caracteristica = act.id_caracteristica
        and ar.id_usuario_car = act.id_usuario_car
        join usuarios u
        on ar.id_usuario_arc= u.id_usuario
        where ar.visto = false  and u.usuario_superior = `+data.id_usuario+ ` and ar.reporte = false 
    ;`;

    return new Promise((resolve, reject) => {
        sequelize
            .query(query1, { type: sequelize.QueryTypes.SELECT })
            .then(x => {
                // console.log("\n\n\n\nSe encontro correctamente la lista de observaciones\n\n\n" + JSON.stringify(x));
                resolve(x);
            })
            .catch(x => {
                // console.log("NO se encontro correctamente la lista de observaciones " + x);
                reject(false);
            })
            .done(x => {
                sequelize.close();
                // console.log("Se ha cerrado sesion de la conexion a la base de datos");
            });
    });
}
