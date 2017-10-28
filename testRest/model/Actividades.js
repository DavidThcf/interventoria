var express = require('express');
var Sequelize = require('sequelize');
var sqlCon = require('../config/connectionDb');
var router = express.Router();
var Caracteristica = require('./Caracteristicas');

module.exports.createActivity = function (data) {
	//console.log(req);
	//variables del usuario
	//==> Informacion de la actividad
	var keym = 0;
	var id_usuario = data.id_usuario;
	var id_actividad = 95;

	var nombre = data.nombre;
	var descripcion = data.descripcion;
	var pos = 0;
	var folder = data.folder;


	return new Promise((resolve, reject) => {
		var sequelize = sqlCon.configConnection();
		var car = Caracteristica.createCharacteristic(data, 'A');

		car.then(x => {

			var keym_car = x.keym;
			var id_caracteristica_car = x.id_caracteristica;
			var id_usuario_car = x.id_usuario;
			var fecha_ultima_modificacion = x.fecha_ultima_modificacion;

			id_actividad = data.id_actividad;

			var query1 = `
				insert into actividades values(

					` + keym_car + `,
					` + id_actividad + `,
					` + id_usuario + `,

					` + keym_car + `,
					` + id_usuario_car + `,
					` + id_caracteristica_car + `,

					'` + nombre + `',
					'` + descripcion + `',
					` + pos + `,
					` + 0 + `,
					'` + fecha_ultima_modificacion + `'

				);
			`;
			sequelize.query(query1, {
				type: sequelize.QueryTypes.INSERT
			})
				.then(x => {
					resolve(true);
				}).catch(x => {
					//console.log('Error al registrar actividad ' + x);
					reject(false);
				}).done(x => {
					sequelize.close();
					console.log('Se ha cerrado sesion de la conexion a la base de datos');
				});

		}).catch(x => {
			console.log('Error registrar Caracteristica ' + x);
			reject(false);
		});
	});


}
var jsn;
module.exports.getActivityList = function (data) {
	jsn = [];
	//variables del usuario
	//==> Informacion de la actividad
	var keym = data.keym;
	var id_usuario = data.id_usuario;
	var id_caracteristica = data.id_caracteristica;

	return new Promise((resolve, reject) => {
		var sequelize = sqlCon.configConnection();
		var query1 = `
				select
				a.nombre as nom_act,
				a.descripcion as desc_act,
				a.folder,
				a.pos,

				c.keym,
				c.id_caracteristica,
				c.id_usuario,

        		c.usuario_asignado,
        		c.tipo,
				c.keym_padre,
				c.id_caracteristica_padre,
        		c.id_usuario_padre,
        		c.tipo,

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
        		b.cedula,
        		b.nombre,
        		b.tipo_identificacion,

				u.nombre as usr_nom,
				u.apellido as usr_ape,
       			u.e_mail as e_mail,
        		u.cargo as cargo,
				u.tipo_usuario,
				ct.nombre nombre_cat,
				ct.color color_cat

				from actividades a join caracteristicas c
 				on 	a.keym_car = c.keym
				and 	a.id_usuario_car = c.id_usuario
				and 	a.id_caracteristica = c.id_caracteristica
				join usuarios u
        		on c.usuario_asignado=u.id_usuario

				

				left join beneficiarios b
				on c.cedula = b.cedula

				left join marcador m
				on 	m.keym = c.keym
				and 	m.id_usuario = c.id_usuario
				and 	m.id_caracteristica = c.id_caracteristica
		
				left join categorias_mapa ct
				on 	ct.id_categoria = m.id_categoria

				where c.keym_padre = ` + keym + `
				and c.id_caracteristica_padre = ` + id_caracteristica + `
				and c.id_usuario_padre = ` + id_usuario + `

				order by a.pos, a.nombre ; `;

		var i = 0;
		//console.log('POLSA');
		sequelize.query(query1, {
			type: sequelize.QueryTypes.SELECT
		})
			.then(x => {

				//console.log('\n\nDATA ACTIVITY LIST =>  '+JSON.stringify(x)+'\n\n')
				resolve(x);

			}).catch(x => {
				console.log('Error al registrar actividad ' + x);
				reject(false);
			}).done(x => {
				sequelize.close();
				console.log('Se ha cerrado sesion de la conexion a la base de datos');
			});

	});
}


function getRecursiveActivity(keym, car, usu, sequelize, element, i) {
	var query1 = `
				select

				a.nombre as nom_act,
				a.descripcion as desc_act,
				a.folder,
				a.pos,


				c.keym,
				c.id_caracteristica,
				c.id_usuario,
        c.tipo,

				c.keym_padre,
				c.id_caracteristica_padre,
				c.id_usuario_padre,

				c.estado,
				c.porcentaje_asignado,
				c.porcentaje_cumplido,
				c.publicacion_web,
				c.porcentaje,
				c.fecha_inicio,
				c.fecha_fin,
				c.publicacion_reporte,

				u.nombre as usr_nom,
				u.apellido as usr_ape

				from actividades a join caracteristicas c
 				on 	a.keym_car = c.keym
				and 	a.id_usuario_car = c.id_usuario
				and 	a.id_caracteristica = c.id_caracteristica
				join usuarios u
				on c.usuario_asignado=u.id_usuario

				where c.keym_padre = ` + keym + `
				and c.id_caracteristica_padre = ` + car + `
				and c.id_usuario_padre = ` + usu + `

				order by a.pos ;`;
	return new Promise((res, rej) => {
		sequelize.query(query1, {
			type: sequelize.QueryTypes.SELECT
		})
			.then(x => {
				var rt = [i, x];

				res(rt);
			}).catch(x => {
				rej(false);
			});
	});

}





