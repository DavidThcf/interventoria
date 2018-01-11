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
				
				ap.nombre as nom_padre,
				cp.tipo tipo_padre,
				
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
				c.fecha_ultima_modificacion,
				c.publicacion_reporte,
				c.fecha_inicio_real,
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

				left join caracteristicas cp 
				on c.keym_padre = cp.keym
				and c.id_caracteristica_padre = cp.id_caracteristica
				and c.id_usuario_padre = cp.id_usuario
				
				left join actividades ap 
				on 	ap.keym_car = cp.keym
				and 	ap.id_usuario_car = cp.id_usuario
				and 	ap.id_caracteristica = cp.id_caracteristica				

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

module.exports.getpar = function(data){
	console.log('\n\n\n\nDATA=>'+JSON.stringify(data));
	var keym = data.keym;
	var id_usuario = data.id_usuario;
	var id_caracteristica = data.id_caracteristica;
	
	
	var sequelize = sqlCon.configConnection();
	var query1 = `
		select 
		ben.tipo tipo_padre,
		ap.nombre nom_padre,
		res.tipo,
		a.nombre as nom_act,a.descripcion  as desc_act,
		res.keym,res.id_caracteristica,res.id_usuario,
		res.usuario_asignado,
		res.keym_padre,res.id_caracteristica_padre,res.id_usuario_padre,
		res.costo_real,res.costo_actual,res.estado,
		res.porcentaje_asignado,res.porcentaje,res.porcentaje_cumplido,
		a.folder,a.pos,
		res.publicacion_web,
		res.fecha_inicio, 	res.fecha_fin, 	res.fecha_ultima_modificacion, 	res.publicacion_reporte,
		b.nombre,b.cedula,b.tipo_identificacion,
		u.nombre as usr_nom,
		u.apellido as usr_ape,
		u.e_mail as e_mail,
		u.cargo as cargo,
		u.tipo_usuario,
		ct.nombre nombre_cat,
		ct.color color_cat
		
		from  caracteristicas res
		
			
		join actividades a 
		on res.keym =a.keym_car
		and res.id_caracteristica = a.id_caracteristica
		and res.id_usuario = a.id_usuario_car
		
		
		
		left join beneficiarios b
		on b.cedula = res.cedula
		
		left join marcador m
		on 	m.keym = res.keym
		and 	m.id_usuario = res.id_usuario
		and 	m.id_caracteristica = res.id_caracteristica
		
		left join categorias_mapa ct
		on 	ct.id_categoria = m.id_categoria
		
		join usuarios u
		on res.usuario_asignado = u.id_usuario

		left join caracteristicas ben
		on ben.keym = res.keym_padre
		and ben.id_caracteristica = res.id_caracteristica_padre
		and ben.id_usuario = res.id_usuario_padre
		
		left join actividades ap 
		on ben.keym =ap.keym_car
		and ben.id_caracteristica = ap.id_caracteristica
		and ben.id_usuario = ap.id_usuario_car
		where res.keym = `+ keym + ` and res.id_caracteristica = ` + id_caracteristica + ` and res.id_usuario = ` + id_usuario + `
	`;

	return new Promise((resolve, reject) => {
		//Consulta padre
		sequelize.query(query1, {
			type: sequelize.QueryTypes.SELECT
		})
			.then(x => {
				
				console.log('\n\n\n\n\n\n\n\n**************************************'+JSON.stringify(x));
				resolve(x[0]);
			}).catch(x => {
				console.log('Error al registrar actividad ' + x);
				reject(false);
			}).done(x => {
				sequelize.close();
				console.log('Se ha cerrado sesion de la conexion a la base de datos');
			});

	});


}

module.exports.getBackActivityList = function (data) {
	jsn = [];
	//variables del usuario
	//==> Informacion de la actividad
	var keym = data.keym;
	var id_usuario = data.id_usuario;
	var id_caracteristica = data.id_caracteristica;

	return new Promise((resolve, reject) => {
		var sequelize = sqlCon.configConnection();

		var query2 = `
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
				c.fecha_ultima_modificacion,
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

				from caracteristicas c
				
				join actividades a
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

				where c.id_caracteristica_padre in 
				( select id_caracteristica_padre from caracteristicas ben 
					where ben.keym = ` + keym + ` and ben.id_caracteristica = ` + id_caracteristica + ` and ben.id_usuario = ` + id_usuario + ` 
				)

				order by a.pos, a.nombre ; `;


		//console.log('POLSA');

		var dat_json = [];

		getPadre(keym, id_caracteristica, id_usuario, dat_json)
			.then(x1 => {
				//Consulta subactividades
				sequelize.query(query2, {
					type: sequelize.QueryTypes.SELECT
				})
					.then(x => {
						dat_json.push(x);
						console.log('\n\n\n\n\n\n\n\n\n\====================================================='+
					JSON.stringify(dat_json));
						resolve(dat_json);
					}).catch(x => {
						console.log('Error al registrar actividad ' + x);
						reject(false);
					}).done(x => {
						sequelize.close();
						console.log('Se ha cerrado sesion de la conexion a la base de datos');
					});

			})
			.catch(x1 => {

			});



	});
}

function getPadre(keym, id_caracteristica, id_usuario, dat_json) {
	var sequelize = sqlCon.configConnection();
	var query1 = `
		select 
		res.tipo,
		a.nombre as nom_act,a.descripcion  as desc_act,
		res.keym,res.id_caracteristica,res.id_usuario,
		res.keym_padre,res.id_caracteristica_padre,res.id_usuario_padre,
		res.costo_real,res.costo_actual,res.estado,
		res.porcentaje_asignado,res.porcentaje,res.porcentaje_cumplido,
		a.folder,a.pos,
		res.publicacion_web,
		res.fecha_inicio,res.fecha_fin,res.fecha_ultima_modificacion,res.publicacion_reporte,
		b.nombre,b.cedula,b.tipo_identificacion,
		u.nombre as usr_nom,
		u.apellido as usr_ape,
		u.e_mail as e_mail,
		u.cargo as cargo,
		u.tipo_usuario,
		ct.nombre nombre_cat,
		ct.color color_cat
		
		from caracteristicas ben
		
		join caracteristicas res
		on ben.keym_padre = res.keym
		and ben.id_caracteristica_padre = res.id_caracteristica
		and ben.id_usuario_padre = res.id_usuario
			
		join actividades a 
		on res.keym =a.keym_car
		and res.id_caracteristica = a.id_caracteristica
		and res.id_usuario = a.id_usuario_car
		
		left join beneficiarios b
		on b.cedula = res.cedula
		
		left join marcador m
		on 	m.keym = res.keym
		and 	m.id_usuario = res.id_usuario
		and 	m.id_caracteristica = res.id_caracteristica
		
		left join categorias_mapa ct
		on 	ct.id_categoria = m.id_categoria
		
		join usuarios u
		on res.usuario_asignado = u.id_usuario
	
		where ben.keym = `+ keym + ` and ben.id_caracteristica = ` + id_caracteristica + ` and ben.id_usuario = ` + id_usuario + `
	`;

	return new Promise((resolve, reject) => {
		//Consulta padre
		sequelize.query(query1, {
			type: sequelize.QueryTypes.SELECT
		})
			.then(x => {
				dat_json.push(x[0]);
				console.log('\n\n\n\n\n\n\n\n**************************************'+JSON.stringify(dat_json));
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
				c.fecha_ultima_modificacion,
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





