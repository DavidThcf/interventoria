var express = require('express');
var Sequelize = require('sequelize');
var sqlCon = require('../config/connectionDb');
var router = express.Router();
var Caracteristica = require('./Caracteristicas');
var fs = require('fs');

module.exports.regCategories = function (data) {
    var keym_car = data.keym_car;
    var id_caracteristica = data.id_caracteristica;
    var id_usuario_car = data.id_usuario_car;

    var nombre = data.nombre;
    var color = data.color;

    var query1 = `
        insert into categorias_mapa (nombre,color,keym_car,id_caracteristica,id_usuario_car) values (
            '`+ nombre + `',
            '`+ color + `',
            `+ keym_car + `,
            `+ id_caracteristica + `,
            `+ id_usuario_car + `
        );
        select max(id_categoria) cat from categorias_mapa limit 1 ;
    `;
    console.log('\n\n\n\nQuery1 ===>  ' + query1);
    return new Promise((resolve, reject) => {
        var sequelize = sqlCon.configConnection();
        sequelize.query(query1, {
            type: sequelize.QueryTypes.INSERT
        })
            .then(x => {
                console.log('PRS ==> ' + JSON.stringify(x));
                var id = x[1];
                console.log('Se ha creado la categoria satisfactoriamente.');
                var img = `
                
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     width="32px" height="32px" viewBox="0 0 491.582 491.582" enable-background="new 0 0 491.582 491.582"
                     xml:space="preserve">
                <defs>
                    <filter id="Adobe_OpacityMaskFilter" filterUnits="userSpaceOnUse" x="81.567" y="18.368" width="308.25" height="444.678">
                        
                            <feColorMatrix  type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0" color-interpolation-filters="sRGB" result="source"/>
                        <feFlood  style="flood-color:white;flood-opacity:1" result="back"/>
                        <feBlend  in="source" in2="back" mode="normal"/>
                    </filter>
                </defs>
                <mask maskUnits="userSpaceOnUse" x="81.567" y="18.368" width="308.25" height="444.678" id="SVGID_1_">
                    <g filter="url(#Adobe_OpacityMaskFilter)">
                        <circle fill="#FFFFFF" cx="238.125" cy="168.225" r="72.483"/>
                    </g>
                </mask>
                <path mask="url(#SVGID_1_)" fill="`+ color + `" d="M120.241,69.339c-19.659,23.302-43.134,82.167-37.943,112.209
                    c13.232,76.587,156.477,281.498,156.477,281.498S376.15,265.814,389.092,188.683c4.775-28.468-14.939-87.706-32.106-110.913
                    c-20.25-27.374-88.572-57.873-122.59-59.348C201.423,16.993,141.523,44.113,120.241,69.339z"/>
                <g>
                    <g>
                        <path d="M235.691,4.572c-89.5,0-162.315,72.814-162.315,162.315c0,35.966,21.175,90.663,66.638,172.135
                            c31.023,55.59,61.904,102.546,63.206,104.523l22.32,33.83c2.25,3.413,6.064,5.466,10.151,5.466c4.089,0,7.901-2.053,10.153-5.466
                            l22.318-33.828c1.291-1.957,31.947-48.505,63.207-104.525c45.464-81.469,66.64-136.166,66.64-172.135
                            C398.009,77.386,325.192,4.572,235.691,4.572z M310.13,327.169c-30.827,55.237-60.997,101.057-62.271,102.98l-12.168,18.446
                            l-12.166-18.44c-1.276-1.941-31.681-48.17-62.272-102.986c-42.171-75.572-63.554-129.5-63.554-160.282
                            c0-76.089,61.903-137.992,137.992-137.992c76.091,0,137.995,61.902,137.995,137.992
                            C373.685,197.673,352.302,251.599,310.13,327.169z"/>
                        <path d="M235.691,75.878c-49.623,0-89.995,40.372-89.995,89.995c0,49.623,40.372,89.995,89.995,89.995
                            c49.625,0,89.997-40.372,89.997-89.995C325.687,116.25,285.315,75.878,235.691,75.878z M235.691,231.545
                            c-36.211,0-65.672-29.46-65.672-65.672c0-36.212,29.461-65.672,65.672-65.672c36.214,0,65.674,29.46,65.674,65.672
                            C301.365,202.085,271.905,231.545,235.691,231.545z"/>
                    </g>
                </g>
                </svg>
                


                `;
                fs.writeFile('files/Category/' + x[0][0].cat + '.svg', img, function (err) {
                    if (err) console.log('\n\n\nHubo un error' + err);
                    console.log('Se creo exitosamente el icono de la categoria');
                });
                resolve(true);
            }).catch(x => {
                console.log('Error al registrar la categoria. ' + x);
                reject(false);
            }).done(x => {
                sequelize.close();
                console.log('Se cerro la sesion de sequelize');
            });
    });
}

module.exports.getCategoriesList = function (data) {
    var keym_car = data.keym_car;
    var id_caracteristica = data.id_caracteristica;
    var id_usuario_car = data.id_usuario_car;
    var query1 = `
    select * from categorias_mapa `;
    /*var query1 = `
    select * from categorias_mapa
    where keym_car = `+ keym_car + ` 
    and id_caracteristica = `+ id_caracteristica + `   
    and id_usuario_car =   `+ id_usuario_car + `
    `;*/
    console.log('\n\n\n\nQuery1 ===>  ' + query1);
    return new Promise((resolve, reject) => {
        var sequelize = sqlCon.configConnection();
        sequelize.query(query1, { type: sequelize.QueryTypes.SELECT }).
            then(x => {
                console.log('JSON ===> ' + JSON.stringify(x));
                resolve(x);
            }).catch(x => {
                reject(false);
            }).done(x => {
                console.log('Se ha cerrado la sesion de sequelize');
            });
    });


}

