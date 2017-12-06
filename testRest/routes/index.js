// import { Usuario } from '../../proyectoSTT/src/app/model/usuario';
var express = require("express");
var router = express.Router();
var fs = require("fs");
var http = require("http");
'use strict';
var configmail = require("../config/emailconfig.js");

//Model's Variables
var User = require("../model/Usuarios");
var Activity = require("../model/Actividades");
var Project = require("../model/Proyectos");
var files = require("../model/Files");
var Category = require("../model/Categorias");
var Map = require("../model/Mapa");
var File = require("../model/Archivos");
var Marker = require("../model/Marcadores");
var Characteristic = require("../model/Caracteristicas");
var AuxModel = require("../model/AuxModel");
var Novedades = require("../model/Novedades");
var Beneficiaries = require("../model/Beneficiarios");
//POST Services

//Service for createa new User
router.post("/createUser", function (req, res, next) {
  var usr = User.createUser(JSON.parse(req.body.usuario), req.files);
  usr
    .then(x => {
      console.log("CreateUser OK");
      res.header("Access-Control-Allow-Origin", "*");
      res.send("Se ha registrado correctamente el usuario.");
    })
    .catch(x => {
      console.log("Error user:  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      if (x === "err-mail")
        res.send(
          "El correo electronico ya se encuentra registrado, intentelo con otro."
        );
      else res.send("No se podido registrar el usuario.");
    });
});

//Service for create a new Activity
router.post("/createActivity", function (req, res, next) {
  console.log(JSON.stringify(req.body));
  var act = Activity.createActivity(JSON.parse(req.body.actividad));
  act
    .then(x => {
      console.log("CreateActivity OK " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(true);
    })
    .catch(x => {
      console.log("Error:  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

//Serice for create a new Project
router.post("/createProject", function (req, res, next) {
  var prj = Project.createProject(JSON.parse(req.body.proyecto), req.files);
  prj
    .then(x => {
      console.log("CreateProject OK " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(true);
    })
    .catch(x => {
      console.log("Error:  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

router.post("/createProjectFromActivity", function (req, res, next) {
  var prj = Project.createProjectFromActivity(JSON.parse(req.body.json));
  prj
    .then(x => {
      console.log("CreateProjectFromActivity OK " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.send("Se ha registrado correctamente el PROYECTO.");
    })
    .catch(x => {
      console.log("Error:  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.send("No se podido registrar el proyecto.");
    });
});

//service for get information user when login into application
router.post("/getUser", function (req, res, next) {
  var usr = User.sigIn(JSON.parse(req.body.usuario));

  usr
    .then(x => {
      if (x === false) {
        res.header("Access-Control-Allow-Origin", "*");
        res.json(false);
      } else {
        var obj = JSON.stringify(x)
          .replace(/\[/g, "")
          .replace(/\]/g, "");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(obj);
      }
    })
    .catch(x => {
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

//service to get user's project list
router.post("/getUserProjectList", (req, res, next) => {
  var prj = Project.getListProjects(req.body.id_usuario);

  prj
    .then(x => {
      res.header("Access-Control-Allow-Origin", "*");
      res.send(x);
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

//service to get one project 
router.post("/getOneProject", (req, res, next) => {
  console.log('\n\n\n\n\n\n\n\n\n\nGet One Project  '+ req.body.caracteristica);
  var prj = Project.getOneProject(JSON.parse(req.body.caracteristica));

  prj
    .then(x => {
      res.header("Access-Control-Allow-Origin", "*");
      res.send(x);
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

//service to get user's activity with theirs Characteristics
router.post("/getActivityList", (req, res, next) => {
  console.log("GET ACTIVITY LIST");
  var act = Activity.getActivityList(req.body);
  act
    .then(x => {
      //console.log(JSON.stringify(x));
      if (x != false) {
        res.header("Access-Control-Allow-Origin", "*");
        res.send(x);
      } else {
        res.header("Access-Control-Allow-Origin", "*");
        res.json(false);
      }
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});
//service to get user's activity with theirs Characteristics
router.post("/getBackActivityList", (req, res, next) => {
  console.log("GET BACK ACTIVITY LIST");
  var act = Activity.getpar(req.body);
  act
    .then(x => {
      //console.log(JSON.stringify(x));
      if (x != false) {
        res.header("Access-Control-Allow-Origin", "*");
        res.send(x);
      } else {
        res.header("Access-Control-Allow-Origin", "*");
        res.json(false);
      }
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

//Service to register a new category for work with the map
router.post("/createCategory", (req, res, next) => {
  console.log("----- Create Category  --------  " + JSON.stringify(req.body));
  var cat = Category.regCategories(JSON.parse(req.body.categoria));
  cat
    .then(x => {
      if (x != false) {
        console.log("Se ha creado correctamente la categoria");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(x);
      } else {
        console.log("No se ha creado la categoria");
        res.header("Access-Control-Allow-Origin", "*");
        res.json(false);
      }
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

//Service to register a new point in the map
router.post("/regPointMap", (req, res, next) => {
  var map = Map.regPoint(JSON.parse(req.body.marcador));
  map
    .then(x => {
      if (x != false) {
        console.log("Se ha registrado correctamente el punto");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(x);
      } else {
        console.log("No se ha registrado el punto");
        res.header("Access-Control-Allow-Origin", "*");
        res.json(false);
      }
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

//Service to register a new point in the map
router.post("/updatePointMap", (req, res, next) => {
  console.log(
    "=====  UPDATE POINT MARKER ======= \n" + JSON.stringify(req.body)
  );
  var map = Map.updatePoint(JSON.parse(req.body.marcador));
  map
    .then(x => {
      if (x != false) {
        console.log("Se ha registrado correctamente el punto");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(x);
      } else {
        console.log("No se ha registrado el punto");
        res.header("Access-Control-Allow-Origin", "*");
        res.json(false);
      }
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

//Service to get the list users
router.post("/getUserList", (req, res, next) => {
  var usr = User.getUserList(req.body.user);
  usr
    .then(x => {
      if (x != false) {
        console.log("Se ha registrado correctamente el punto");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(x);
      } else {
        console.log("No se ha registrado el punto");
        res.header("Access-Control-Allow-Origin", "*");
        res.json(false);
      }
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

//service to create a new file into th data base
router.post("/createFile", (req, res, next) => {
  console.log("BODY===>   " + JSON.stringify(req.body));
  var fls = File.create_file(JSON.parse(req.body.archivo), req.files);

  fls
    .then(x => {
      console.log("Se ha registrado correctamente el punto");
      res.header("Access-Control-Allow-Origin", "*");
      res.json(true);
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

//Service to get list of the files
router.post("/getFileList", (req, res, next) => {
  console.log("\n\n\n\n\n\n\n\n============ get file list   ==== >   " + JSON.stringify(req.body));
  

  try {
    var fls = File.getFileList(req.body);
    fls.then(x => {

      console.log("\n\n\n\nSe ha obtenido los archivos  ==>   " + JSON.stringify(x));
      res.header("Access-Control-Allow-Origin", "*");
      res.send(x);

    })
      .catch(x => {
        //console.log("ERROR =>  " + x);
        res.header("Access-Control-Allow-Origin", "*");
        res.json(false);
      });
  } catch (e) {
    console.log("Revisar   " + e);
  }
});

//Service to get list of the files
router.post("/getFileListChild", (req, res, next) => {
  console.log("\n\n\n\n\n\n\n\n============ get file list   ==== >   " + JSON.stringify(req.body));
  res.header("Access-Control-Allow-Origin", "*");

  try {
    var fls = File.getFileListChild(req.body);
    fls.then(x => {

      console.log("\n\n\n\nSe ha obtenido los archivos  ==>   " + JSON.stringify(x));

      res.send(x);

    })
      .catch(x => {
        //console.log("ERROR =>  " + x);
        //res.header("Access-Control-Allow-Origin", "*");
        res.json(false);
      });
  } catch (e) {
    console.log("Revisar   " + e);
  }
});

//Service to update the file information
router.post("/updateImageFile", (req, res, next) => {
  var fls = File.getImagesList(req.body.caracteristica);
  fls
    .then(x => {
      if (x != false) {
        console.log("Se ha registrado correctamente el punto");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(x);
      } else {
        console.log("No se ha registrado el punto");
        res.header("Access-Control-Allow-Origin", "*");
        res.json(false);
      }
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

router.post("/getCategoryList", (req, res, next) => {
  console.log(
    "get category list   ==== >   " + JSON.stringify(req.body.caracteristica)
  );
  var cat = Category.getCategoriesList(JSON.parse(req.body.caracteristica));
  cat
    .then(x => {
      if (x != false) {
        //console.log('Se ha retornado correctamente las categorias');
        res.header("Access-Control-Allow-Origin", "*");
        res.send(x);
      } else {
        console.log("No se ha retornado las categorias");
        res.header("Access-Control-Allow-Origin", "*");
        res.json(false);
      }
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

router.post("/editProjectInformation", (req, res, next) => {
  console.log(
    " ------- Edit Project Information    ==== >   " +
    JSON.stringify(req.body.caracteristica)
  );
  var prj = Project.getCategoriesList(JSON.parse(req.body.caracteristica));
  prj
    .then(x => {
      if (x == true) {
        console.log("Se ha editado correctamente la informacion");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(x);
      } else {
        console.log("No se ha editado la informacion del proyecto");
        res.header("Access-Control-Allow-Origin", "*");
        res.json(false);
      }
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

router.post("/editActivityInformation", (req, res, next) => {
  console.log(
    " ------- Edit Project Information    ==== >   " +
    JSON.stringify(req.body.caracteristica)
  );
  var prj = Project.getCategoriesList(JSON.parse(req.body.caracteristica));
  prj
    .then(x => {
      if (x == true) {
        console.log("Se ha editado correctamente la informacion");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(x);
      } else {
        console.log("No se ha editado la informacion del proyecto");
        res.header("Access-Control-Allow-Origin", "*");
        res.json(false);
      }
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

router.post("/getPointList", (req, res, next) => {
  //console.log('GET Points list   ==== >   '+JSON.stringify(req.body.caracteristica));
  var maps = Map.getPointList(JSON.parse(req.body.caracteristica));
  maps
    .then(x => {
      if (x != false) {
        console.log("Se ha retornado correctamente la lista de puntos");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(x);
      } else {
        console.log("No se ha retornado la lista de puntos");
        res.header("Access-Control-Allow-Origin", "*");
        res.json(false);
      }
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

router.post("/getVisibleProjects", (req, res, next) => {
  console.log(
    " <=====       Get Visible Projects List      ==== >   " +
    JSON.stringify(req.body.caracteristica)
  );
  var prj = Project.getVisibleProjects();
  prj
    .then(x => {
      console.log("Se ha retornado correctamente los Proyectos");
      res.header("Access-Control-Allow-Origin", "*");
      res.send(x);
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

router.post("/getMarkersListFromCategory", (req, res, next) => {
  console.log(
    " <=====     Get Markers List From Category      ==== >   " +
    JSON.stringify(req.body)
  );

  if (req.body.id_categoria != undefined)
    var mar = Marker.getMarkersListFromCategory(req.body.id_categoria, true);
  else var mar = Marker.getMarkersListFromCategory("", false);
  mar
    .then(x => {
      console.log(
        "Se ha retornado correctamente los marcadores de la categoria"
      );
      res.header("Access-Control-Allow-Origin", "*");
      res.send(x);
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

router.post("/getPercentage", (req, res, next) => {
  console.log(
    " <=====    getPercentage      ==== >   " +
    JSON.stringify(req.body.caracteristica.keym)
  );

  var mar = Characteristic.getPercentage(JSON.parse(req.body.caracteristica));
  mar
    .then(x => {
      console.log(
        "Se ha retornado correctamente el porcentaje cumplido de la actividad"
      );
      res.header("Access-Control-Allow-Origin", "*");
      res.send(x);
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

router.post("/updatePercentage", (req, res, next) => {
  console.log(
    " <=====    Update Percentage      ==== >   " + JSON.stringify(req.body)
  );

  var per = Characteristic.updatePercentage(JSON.parse(req.body.actividades));
  per
    .then(x => {
      console.log("Se ha Acctualizado correctamente el porcentaje");
      res.header("Access-Control-Allow-Origin", "*");
      res.json(true);
    })
    .catch(x => {
      console.log("ERROR al actualizar el porcentaje  =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

router.post("/updateCharacteristic", (req, res, next) => {
  console.log(
    " <=====    Update Characteristic      ==== >   " + JSON.stringify(req.body)
  );

  var car = Characteristic.updateCharacteristic(JSON.parse(req.body.actividad), req.body.isUpdatePercentage, req.body.porcentaje_cumplido);
  car
    .then(x => {
      console.log("Se ha Acctualizado correctamente la caracteristica");
      res.header("Access-Control-Allow-Origin", "*");
      res.json(true);
    })
    .catch(x => {
      console.log("ERROR al actualizar la caracteristica  =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

//Assign an activity to new user
router.post("/assignActivityToUser", (req, res, next) => {
  console.log(
    " <=====    Assign Activity To User      ==== >   " +
    JSON.stringify(req.body)
  );

  var prj = Project.assignActivityToUser(JSON.parse(JSON.stringify(req.body)));
  prj
    .then(x => {
      console.log(
        "!!!!!!!!!!!!!Se ha creado exitosamente el proyecto de la asignacion de la actividad al usuario !!!!!!!!!!!"
      );
      res.header("Access-Control-Allow-Origin", "*");
      res.json(true);
    })
    .catch(x => {
      console.log("ERROR al asignar actividad a usuario  =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

//Assign an activity to new user
router.post("/insertData", (req, res, next) => {
  console.log(
    " <=====    Assign Activity To User      ==== >   " +
    JSON.stringify(req.body)
  );

  var ax = AuxModel.insertData();
  ax
    .then(x => {
      console.log(
        "!!!!!!!!!!!!!Se han creado todos los beneficiarios correctamente  !!!!!!!!!!!"
      );
      res.header("Access-Control-Allow-Origin", "*");
      res.json(true);
    })
    .catch(x => {
      console.log("ERROR al insertar beneficiarioss  =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

router.post("/insertCapitulos", (req, res, next) => {
  console.log(
    " <=====    Assign Activity To User      ==== >   " +
    JSON.stringify(req.body)
  );

  var ax = AuxModel.insertCapitulos();
  ax
    .then(x => {
      console.log(
        "!!!!!!!!!!!!!Se han creado todos los beneficiarios correctamente  !!!!!!!!!!!"
      );
      res.header("Access-Control-Allow-Origin", "*");
      res.json(true);
    })
    .catch(x => {
      console.log("ERROR al insertar beneficiarioss  =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

router.post("/insertMarker", (req, res, next) => {
  console.log(
    " <=====    Insertar Marcadores      ==== >   " +
    JSON.stringify(req.body)
  );

  var ax = AuxModel.insertMarker();
  ax
    .then(x => {
      console.log(
        "!!!!!!!!!!!!!Se han creado todos los beneficiarios correctamente  !!!!!!!!!!!"
      );
      res.header("Access-Control-Allow-Origin", "*");
      res.json(true);
    })
    .catch(x => {
      console.log("ERROR al insertar beneficiarioss  =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

//Obtiene las observaciones de una caracteristica
router.post('/getRemarks', (req, res, next) => {
  console.log(' <=====    Get Remarks      ==== >   ' + JSON.stringify(req.body));

  var car = Characteristic.getRemarks(JSON.parse(req.body.caracteristica), false, false);
  car.then(x => {
    console.log('!!!!!!!!!!!!!Se ha creado exitosamente el proyecto!!!!!!!!!!!');
    console.log('\n\n\nREMARKS\n' + JSON.stringify(x));
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);

  }).catch(x => {
    console.log('ERROR al actualizar el porcentaje  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});

router.post('/getObservaciones', (req, res, next) => {
  console.log(' <=====    Get All Observaciones      ==== >   ' + JSON.stringify(req.body));

  var car = Characteristic.getRemarks(JSON.parse(req.body.caracteristica), true, false);
  car.then(x => {
    console.log('!!!!!!!!!!!!!Se ha creado exitosamente el proyecto!!!!!!!!!!!');
    console.log('\n\n\n Observaciones \n' + JSON.stringify(x));
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);

  }).catch(x => {
    console.log('ERROR al actualizar el porcentaje  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});

router.post('/getObservacionesReport', (req, res, next) => {
  console.log(' <=====    Get Observaciones For Report     ==== >   ' + JSON.stringify(req.body));

  var car = Characteristic.getRemarks(JSON.parse(req.body.caracteristica), true, true);
  car.then(x => {
    console.log('!!!!!!!!!!!!!Se ha creado exitosamente el proyecto!!!!!!!!!!!');
    console.log('\n\n\n Observaciones \n' + JSON.stringify(x));
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);

  }).catch(x => {
    console.log('ERROR al actualizar el porcentaje  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});

router.post('/regRemarks', (req, res, next) => {
  console.log(' <=====    reg Remarks      ==== >   ' + JSON.stringify(req.body));

  var car = Characteristic.regRemarks(JSON.parse(req.body.remark));
  car.then(x => {
    console.log('!!!!!!!!!!!!!Se ha creado exitosamente el proyecto!!!!!!!!!!!');
    console.log('\n\n\nREMARKS\n' + JSON.stringify(x));
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);

  }).catch(x => {
    console.log('ERROR al actualizar el porcentaje  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});

router.post('/regObservacion', (req, res, next) => {
  console.log(' <=====    reg Observacion      ==== >   ' + JSON.stringify(req.body));

  var car = Characteristic.regObservacion(JSON.parse(req.body.observacion));
  car.then(x => {
    console.log('!!!!!!!!!!!!!Se ha creado exitosamente el proyecto!!!!!!!!!!!');
    console.log('\n\n\nREMARKS\n' + JSON.stringify(x));
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);

  }).catch(x => {
    console.log('ERROR al actualizar el porcentaje  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});

router.post('/updateCompletePercentage', (req, res, next) => {
  console.log('\n\n\n\n\n\n\n <=====    updateCompletePercentage     ==== >   ' + JSON.stringify(req.body));

  var car = Characteristic.updateCompletePercentage(
    JSON.parse(req.body.actividad), JSON.parse(req.body.porcentaje_cumplido),
    JSON.parse(req.body.usuario_superior),
    JSON.parse(req.body.usuario_own)
  );
  car.then(x => {
    console.log('!!!!!!!!!!!!!Se ha creado exitosamente el proyecto!!!!!!!!!!!');
    console.log('\n\n\n Percentage completed \n' + JSON.stringify(x));
    res.header("Access-Control-Allow-Origin", "*");
    res.json(true);

  }).catch(x => {
    console.log('ERROR al actualizar el porcentaje  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});

router.post('/updateEtapa', (req, res, next) => {
  console.log(' <=====    updateEtapa     ==== >   ' + JSON.stringify(req.body));

  var car = Characteristic.updateEtapa(JSON.parse(req.body.actividad), JSON.parse(req.body.etapa));
  car.then(x => {
    console.log('!!!!!!!!!!!!!Se ha creado exitosamente el proyecto!!!!!!!!!!!');
    console.log('\n\n\n Etapa OK  \n' + JSON.stringify(x));
    res.header("Access-Control-Allow-Origin", "*");
    res.json(true);

  }).catch(x => {
    console.log('ERROR al actualizar la etapa  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});

router.post('/getTypes', (req, res, next) => {
  console.log(' <=====    Get Types      ==== >   ' + JSON.stringify(req.body));

  var car = Characteristic.getTypes(JSON.parse(req.body.caracteristica));
  car.then(x => {
    console.log('!!!!!!!!!!!!!Se ha creado exitosamente el proyecto!!!!!!!!!!!');
    console.log('\n\n\n Observaciones \n' + JSON.stringify(x));
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);

  }).catch(x => {
    console.log('ERROR al actualizar el porcentaje  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});

router.post('/getDataChart', (req, res, next) => {
  console.log(' <=====    Get DataChart      ==== >   ' + JSON.stringify(req.body));

  var car = Characteristic.getDataChart(JSON.parse(req.body.caracteristica));
  car.then(x => {
    console.log('\n\n\n OK data chart \n' + JSON.stringify(x));
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);

  }).catch(x => {
    console.log('ERROR al actualizar el porcentaje  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});

var client = require("jsreport-client")("http://indicadoresacademicos.udenar.edu.co:5488", 'admin', 'password');
router.get('/downloadReport', function (req, res) {
  console.log('\n\n\n\n\n\n\n\n =============   Download Report  =============\n\n' + JSON.stringify(req.query));
  try {
    //res.header("Access-Control-Allow-Origin", "*");
    // res.json("goal"); 

    var data = JSON.parse(req.query.val1);

    armJSONReport(data).then(x => {
      console.log('\n\n\n\n\n\n\n\n\n\n' + JSON.stringify(x) + '\n\n\n\n\n\n\n\n\n\n');
      //console.log('\n\n\nOKI => ' + JSON.stringify(data.grafica));
      //configuracion de template y datos a enviar al pdf 
      client.render({
        template: {
          "shortid": "HyEDwVhjW"
        },

        "data": x
      }, function (err, response) {

        if (err) {
          console.log(err);
        }
        response.pipe(res);
      });
      console.log(client);
    }).catch(x => {

    });



  } catch (e) {
    res.header("Access-Control-Allow-Origin", "*");
    res.json('error => ' + e);
  }

});

router.post('/getDataNewChangePercent', (req, res) => {
  console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\ <=====    get DataNew Change Percent     ==== >   ' + JSON.stringify(req.body));

  var nov = Novedades.getDataNewChangePercent(req.body);
  nov.then(x => {
    console.log('!!!!!!!!!!!!!Se ha retornado exitosamente las novedades!!!!!!!!!!!');
    console.log('\n\n\n Novedades \n' + JSON.stringify(x));
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);

  }).catch(x => {
    console.log('ERROR al btener novedades  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});


//trae todas las nuevas observaciones que correspondan a un usuario
router.post('/getDataNewObservations', (req, res) => {
  console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\ <=====    get Data New Observations      ==== >   ' + JSON.stringify(req.body));

  var nov = Novedades.getDataNewObservations(req.body, true);
  nov.then(x => {
    console.log('!!!!!!!!!!!!!Se ha retornado exitosamente las novedades!!!!!!!!!!!');
    console.log('\n\n\n Novedades \n' + JSON.stringify(x));
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);

  }).catch(x => {
    console.log('ERROR al btener novedades  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});

//trae todas los nuevos comentarios que correspondan a un usuario
router.post('/getDataNewRemarks', (req, res) => {
  console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\ <=====    get Data New Remarks      ==== >   ' + JSON.stringify(req.body));

  var nov = Novedades.getDataNewObservations(req.body, false);
  nov.then(x => {
    console.log('!!!!!!!!!!!!!Se ha retornado exitosamente las novedades!!!!!!!!!!!');
    console.log('\n\n\n Novedades \n' + JSON.stringify(x));
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);

  }).catch(x => {
    console.log('ERROR al btener novedades  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});

router.post("/getFilesNovedades", (req, res, next) => {
  //console.log("\n\n\n\n\n\n\n\n\n\n\nget file list Novedades   ==== >   " + JSON.stringify(req.body));
  var fls = File.getFilesNovedades(req.body);
  fls
    .then(x => {
      //console.log(JSON.stringify(x)+'\n\n\n\n\n\n\n\n\n\n');
      if (x != false) {
        //console.log("Se ha obtenido la lista de archivos");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(x);
      } else {
        console.log("No se ha obtenido la lista de archivos");
        res.header("Access-Control-Allow-Origin", "*");
        res.json(false);
      }
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

router.post("/approvalPercentage", (req, res, next) => {
  console.log("\n\n\n\n\n\n\n\n\n\n\n approval Percentage OKOKOK   ==== >   " + req.body.novedad);
  var nov = Novedades.approvalPercentage(JSON.parse(req.body.novedad));
  nov
    .then(x => {
      console.log("Se ha obtenido la lista de archivos");
      res.header("Access-Control-Allow-Origin", "*");
      res.json(x);
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

router.post("/approvalObservation", (req, res, next) => {
  console.log("\n\n\n\n\n\n\n\n\n\n\n approval Percentage OKOKOK   ==== >   " + req.body.novedad);
  var nov = Novedades.approvalObservation(JSON.parse(req.body.novedad));
  nov
    .then(x => {
      console.log("Se ha obtenido la lista de archivos");
      res.header("Access-Control-Allow-Origin", "*");
      res.json(x);
    })
    .catch(x => {
      console.log("ERROR =>  " + x);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(false);
    });
});

router.post('/getTotalMessage', (req, res) => {
  console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\ <=====    Get Total Message      ==== >   ' + JSON.stringify(req.body));

  var nov = Novedades.getDataNew(req.body.id_usuario);
  nov.then(x => {
    console.log('!!!!!!!!!!!!!Se ha retornado exitosamente las novedades!!!!!!!!!!!');
    console.log('\n\n\n Novedades \n' + JSON.stringify(x));
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);

  }).catch(x => {
    console.log('ERROR al btener novedades  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});


router.post('/getOnlyTotalBeneficiary', (req, res) => {
  console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\ <=====    Get Only Total Beneficiary      ==== >   ' + JSON.stringify(req.body));

  var nov = Beneficiaries.getOnlyTotalBeneficiary(JSON.parse(req.body.caracteristica));
  nov.then(x => {
    console.log('!!!!!!!!!!!!!Se ha retornado exitosamente la cantidad de beneficiarios!!!!!!!!!!!');
    //console.log('\n\n\n Novedades \n' + JSON.stringify(x));
    
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);

  }).catch(x => {
    console.log('ERROR al btener los beneficiarios  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});

/* inicio updateImageEditView*/
router.post('/updateImageEditView', (req, res, next) => {
  var data = JSON.parse(JSON.stringify(req.body));
  // console.log('llama'+JSON.stringify(data));
  // res.header("Access-Control-Allow-Origin", "*");
  // res.json(true);
  var fil = File.updateImageEditView((data));
  fil.then(x => {
    res.header("Access-Control-Allow-Origin", "*");
    res.json(true);

  }).catch(x => {
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});
/* fin */

router.post("/getMultimediaReport", (req, res, next) => {
  console.log("\n\n\n\n\n\n\n\n============ get file list   ==== >   " + JSON.stringify(req.body));
  res.header("Access-Control-Allow-Origin", "*");

  try {
    var fls = File.getMultimediaReport(req.body);
    fls.then(x => {

      console.log("\n\n\n\nSe ha obtenido los archivos  ==>   " + JSON.stringify(x));

      res.send(x);

    })
      .catch(x => {
        //console.log("ERROR =>  " + x);
        //res.header("Access-Control-Allow-Origin", "*");
        res.json(false);
      });
  } catch (e) {
    console.log("Revisar   " + e);
  }
});


/* inicio  getDataNewChangeFile*/
router.post('/getDataNewChangeFile', (req, res) => {
  // console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\ <=====    get Data Novedades      ==== >   ' + JSON.stringify(req.body));

  var nov = Novedades.getDataNewChangeFile(req.body, true);
  nov.then(x => {
    // console.log('!!!!!!!!!!!!!Se ha retornado exitosamente las novedades!!!!!!!!!!!');
    // console.log('\n\n\n Novedades \n' + JSON.stringify(x));
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);

  }).catch(x => {
    // console.log('ERROR al btener novedades  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
  // console.log("\n\n\n\n\n\n\nesto es de juan:"+JSON.stringify(req.body))

});

/* fin */

/* ----------------------getTotalBeneficiary----------------------- */
router.post('/getTotalBeneficiary',(req, res) => {
  var nov = Beneficiaries.getTotalBeneficiary(JSON.parse(req.body.datos));
  nov.then(x => {
    // console.log('!!!!!!!!!!!!!Se ha retornado exitosamente las novedades!!!!!!!!!!!');
    // console.log('\n\n\n Novedades \n' + JSON.stringify(x));
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);

  }).catch(x => {
    // console.log('ERROR al btener novedades  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});
/* --------------------------------------------------------------- */

/* -----------------------pause proyect --------------------------- */
router.post('/pauseProyect',(req, res) => {
  //console.log(JSON.stringify(req.body));
  var nov = Project.pauseProyect(req.body);
  nov.then(x => {
    // console.log('!!!!!!!!!!!!!Se ha retornado exitosamente las novedades!!!!!!!!!!!');
    // console.log('\n\n\n Novedades \n' + JSON.stringify(x));
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);

  }).catch(x => {
    // console.log('ERROR al btener novedades  =>  ' + x)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});
/* ---------------------------------------------------------------- */
/* ---------------------- updateImageView ----------------------- */
router.post('/updateImageView',(req, res) => {
  var data = JSON.parse(JSON.stringify(req.body));
  console.log('llama'+JSON.stringify(data));
  // res.header("Access-Control-Allow-Origin", "*");
  // res.json(true);
  var fil = File.updateImageView((data));
  fil.then(x => {
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);

  }).catch(x => {
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  });
});
/* ---------------------------------------------------------------- */
router.post('/restartPassword',(req, res) => {
  var data = JSON.parse(JSON.stringify(req.body));
  // console.log("datos recupracion" + data.email);
  var passTemp = generar();
  // console.log("datos" +  passTemp);
  var user = User.restartPassword(data.email , passTemp);
  user.then(x => {
    console.log('calor d ex '+ x);
    if(x === true){
      console.log('entrar si correo good');
      /* enviarmensaje */
    let transporter = configmail.configmail();
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Juan Bastidas" <juanbasdel@udenar.edu.co>', // sender address
        to: ''+data.email, // list of receivers
        subject: 'Recuperar contraseña ✔', // Subject line
        text: 'Contraseña: '+ passTemp,
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
    
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.json(x);
  }).catch(x => {
    res.header("Access-Control-Allow-Origin", "*");
    res.json(false);
  })
});
/* funcion para preparar datos del reporte pdf */
function armJSONReport(data) {
  return new Promise((resolve, reject) => {

    var img = data.grafica;
    var img2 = data.grafica2;
    img = img.replace(/ /g, '+');
    img2 = img2.replace(/ /g, '+');

    //console.log("\n\n\n\n\n\n\n\nOK   =>   " + img.length + '\n\n\n' + data.grafica.length);
    var dat = {
      "tipo": data.tipo, // PROYECTO, PROVINCIA, MUNICIPIO, RESGUARDO, BENEFICIARIO
      "beneficiario": data.beneficiario,
      "cedula": data.cedula,
      "provincia": data.provincia,
      "municipio": data.municipio,
      "resguardo": data.resguardo,
      "feciniobr": data.feciniobr,
      "observaciones": data.observaciones,
      "porcejec": data.porcejec,
      "nombre": data.nombre,
      "grafica": img,
      "grafica2": img2,
      "imagenes": data.imagenes,
      "firmaEla": "david e",
      "nombreEla": "David Estrada",
      "cargoEla": "Interventor",
      "firmaApr": "kelvin c",
      "nombreApr": "Kelvin Cadena",
      "cargoApr": "Supervisor",
      "porcentajeProgramado": data.porcentajeProgramado,
			"porcentajeEjecutado": data.porcentajeEjecutado,
      "DiferenciaPorcentaje": data.DiferenciaPorcentaje,
      "valorAsignado": data.valorAsignado,
      "valorProgramado": data.valorProgramado,
			"valorEjecutado": data.valorEjecutado,
			"DiferenciaValor": data.DiferenciaValor
    }
    resolve(dat);
  });
}
/* --------------------------------------------------- */
/* funcion para genrar contraseñas aleatoriasy temporales */
function generar()
{
  var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789";
  var contraseña = "";
  for (i=0; i<8; i++) contraseña += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
  return contraseña;
}
/* ---------------------------------- */


module.exports = router;
