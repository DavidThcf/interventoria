var express = require('express');
var Sequelize = require('sequelize');
var sqlCon = require('../config/connectionDb');
var router = express.Router();
var Caracteristica = require('./Caracteristicas');


module.exports.getMarkersListFromCategory = function(id_categoria,select_cat){
    var sequelize = sqlCon.configConnection();
    console.log('\n\n\n\n\n\n\n\n\n\n\n\n\nPRUEBA ======================>   SLECT  '+id_categoria+'  -  '+select_cat);
    if(select_cat)
        query1 = `
        select * from caracteristicas c  join actividades a
        on c.keym = a.keym_car
        and c.id_caracteristica = a.id_caracteristica
        and c.id_usuario = a.id_usuario_car

        join marcador p
        on c.keym = p.keym
        and c.id_caracteristica = p.id_caracteristica
        and c.id_usuario = p.id_usuario

		where p.id_categoria = `+id_categoria+`
        `;
    else
        query1 = `
        select 
        
                c.keym,
                c.id_caracteristica,
                c.id_usuario,
                c.fecha_inicio,
                c.fecha_fin,
                c.porcentaje_cumplido,
                c.costo_real,
                c.costo_actual,
                c.porcentaje,
                c.estado,
        
        
                m.longitud,
                m.latitud,
        
                b.nombre,
                b.tipo_identificacion,
                b.cedula
        
        
        from beneficiarios b join caracteristicas c 
        on b.cedula = c.cedula

        join actividades a
        on c.keym = a.keym_car
        and c.id_caracteristica = a.id_caracteristica
        and c.id_usuario = a.id_usuario_car


        join marcador m
        on c.keym = m.keym
        and c.id_caracteristica = m.id_caracteristica
        and c.id_usuario = m.id_usuario


        `;



    return new Promise((resolve, reject) => {
        sequelize.query(query1, { type: sequelize.QueryTypes.SELECT })
            .then(x => {
                console.log('OK consulta get Activity from Category');
                resolve(x);
            }).catch(x => {
                console.log('Error al obtener las Actividades from Category' + x);
                reject(false);
            }).done(x => {
                sequelize.close();
                console.log('Se ha cerrado sesion de la conexion a la base de datos');
            });
    });
}
