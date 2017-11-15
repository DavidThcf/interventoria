var express = require('express');
var Sequelize = require('sequelize');
var sqlCon = require('../config/connectionDb');
var router = express.Router();
var Caracteristica = require('./Caracteristicas');

module.exports.getOnlyTotalBeneficiary = function (data) {
	//console.log('\n\n\n\n\n\n\n'+JSON.stringify(data)+'\n\n\n\n\n\n\n\n');
	return new Promise((resolve, reject) => {
		
		var sequelize = sqlCon.configConnection();
		var query1 = `
				select getonlytotalbeneficiary(`+ data.keym + `,` + data.id_caracteristica + `,` + data.id_usuario + `)
			`;
			console.log('\n\n\n\n\n'+query1);
		sequelize.query(query1, {
			type: sequelize.QueryTypes.SELECT
		})
			.then(x => {
				console.log('\n\n\n /******************************************************************/\n/******************************************************************/');
				console.log('\n\n'+JSON.stringify(x)+'\n\n');
				console.log('\n\n\n /******************************************************************/\n/******************************************************************/');
				resolve(x);
			}).catch(x => {
				console.log('Error al obtener los usuaruios ' + x);
				reject(false);
			}).done(x => {
				sequelize.close();
				console.log('Se ha cerrado sesion de la conexion a la base de datos');
			});

	}).catch(x => {
		console.log('Error registrar Caracteristica ' + x);
		reject(false);
	});
}


/* ----------------------get total beneficiary---------------------------- */
module.exports.getTotalBeneficiary = function(data){
	console.log('\n\n\n =========     getTotalBeneficiary   =========  \n'+JSON.stringify(data));
	var keym = data.keym;
	var id_usuario = data.id_usuario;
	var id_caracteristica = data.id_caracteristica;

	return new Promise((resolve, reject) => {
		var sequelize = sqlCon.configConnection();
		var query1 = `
		SELECT gettotalbeneficiary(`+
			keym+`,`+
			id_caracteristica+`,`+
			id_usuario+`
		);		
		`;

		//var i = 0;
		//console.log('POLSA ==> '+ query1);
		sequelize.query(query1, {
			type: sequelize.QueryTypes.SELECT
		})
			.then(x => {

				//console.log('\n\nDATA ACTIVITY LIST =>  '+JSON.stringify(x)+'\n\n')
				resolve(x);

			}).catch(x => {
				// console.log('Error al registrar actividad ' + x);
				reject(false);
			}).done(x => {
				sequelize.close();
				// console.log('Se ha cerrado sesion de la conexion a la base de datos');
			});

	});
};
/* -------------------------------------------------- */




