const expres = require("express");
const { Router } = require("express");
const { conn } = require("../db");
const rutas = Router();
const { Op } = require("sequelize");
const FileController = require("./FileController");
const fileController = new FileController();
let fs = require("fs");
const { exec } = require("child_process");
require("dotenv").config();
const { DB_USER, DB_PASS, DB_HOST } = process.env;

/* 
rutas.get("/bochon/infoPDF"
rutas.get("/bochon/especimen/id"
rutas.get("/bochonesHome"
rutas.get("/bochon/especimen"
rutas.put("/bochon/modificar"
rutas.post("/bochon/especimen"
rutas.delete("/bochon/especimen/:id"
*/

const { bochon } = conn.models;

rutas.get("/bochon/infoPDF", async (req, res) => {
  let numeros = req.query.numero;
  let result = [];
  function SortArray(x, y) {
    if (Number(x.bochonnumero) < Number(y.bochonnumero)) {
      return -1;
    }
    if (Number(x.bochonnumero) > Number(y.bochonnumero)) {
      return 1;
    }
    return 0;
  }
  let especimenes = await bochon.sequelize.query(
    `select bochonnumero, genero, especie,cuenca,periodo,epoca,piso,formacion,miembro,localidad,coordlat,coordlong ,armario1,estante1desde,estante1hasta,armario2,estante2desde,estante2hasta,partesesqueletales, cantidadfrag, posicionfilo, campana, nrocampo, descubridor, fechadescubrimiento ,  comentario from bochons`
  );
  if (numeros?.length > 0) {
    let numero = numeros.split(",");
    for (var i = 0; i < numero.length; i++) {
      let find = especimenes[0].filter((el) => el.bochonnumero == numero[i]);
      result.push(find[0]);
    }
    res.send(result.sort(SortArray));
  } else {
    res.send(especimenes[0].sort(SortArray));
  }
});

rutas.get("/bochon/especimen/id", async (req, res) => {
  let id = req.query;

  let especimenEncontrado = await bochon.findByPk(id.id);
  especimenEncontrado?.holotipo
    ? (especimenEncontrado.holotipo = "si")
    : (especimenEncontrado.holotipo = "no");
  especimenEncontrado?.publico
    ? (especimenEncontrado.publico = "si")
    : (especimenEncontrado.publico = "no");
  res.send(especimenEncontrado);
});

rutas.get("/bochonesHome", async (req, res) => {
  let especimenes = await bochon.sequelize.query(
    "select bochonnumero,especimennumero, genero, especie, partesesqueletales, posicionfilo, campana, nrocampo, descubridor, url,formacion,holotipo from bochons"
  );

  res.send(especimenes[0]);
});
rutas.get("/bochon/especimen", async (req, res) => {
  let { parametro, busqueda } = req.query;
  let resultadoBusqueda;

  if (parametro === "genero") {
    resultadoBusqueda = await bochon.findAll({
      where: {
        genero: {
          [Op.iLike]: "%" + busqueda + "%",
        },
      },
    });

    res.send(resultadoBusqueda);
  } else if (parametro === "especie") {
    resultadoBusqueda = await bochon.findAll({
      where: {
        especie: {
          [Op.iLike]: "%" + busqueda + "%",
        },
      },
    });
    res.send(resultadoBusqueda);
  } else if (parametro === "localidad") {
    resultadoBusqueda = await bochon.findAll({
      where: {
        localidad: {
          [Op.iLike]: "%" + busqueda + "%",
        },
      },
    });
    res.send(resultadoBusqueda);
  } else if (parametro === "descubridor") {
    resultadoBusqueda = await bochon.findAll({
      where: {
        descubridor: {
          [Op.iLike]: "%" + busqueda + "%",
        },
      },
    });
    res.send(resultadoBusqueda);
  } else if (parametro === "nuevo") {
    let numero = await bochon.sequelize.query(
      "select bochonnumero from bochons"
    );
    let numeros = [];
    //buscamos el ultimo id ingresado
    numero[0].map((e) => {
      numeros.push(Number(e.bochonnumero));
    });
    newId = Math.max(...numeros) + 1;
    var primero = 1;
    var final = newId;
    var faltantes = [];
    while (primero < final) {
      if (!numeros.includes(primero)) {
        faltantes.push(primero);
      }
      primero++;
    }

    return res.send({ newId, faltantes });
  } else if (!parametro) {
    const especimens = await bochon.findAll();

    if (especimens.length === 0) {
      return res.send("no hay datos en la tabla especimenes del back");
    }

    return res.send(especimens);
  } else {
    return res.send("parametro de busqueda inexistente");
  }
});

rutas.put("/bochon/modificar", async (req, res) => {
  var parameters = req.body[0];
  var modificacion = [req.body[1]];
  var propiedades = Object.keys(modificacion[0].espPrev);
  var valoresPrev = Object.values(modificacion[0].espPrev);
  var valoresNew = Object.values(modificacion[0].espNew);
  var modificado = {
    usuario: modificacion[0].usuario,
    fecha: modificacion[0].fecha,
    cambios: [],
  };

  var cont = 0;

  propiedades.map((e) => {
    var prop = e;
    if (prop === "partesesqueletales") {
      var partes = 0;
      if (valoresNew[cont].length === 0 && valoresPrev[cont].length > 0) {
        modificado.cambios.push(
          prop + ": " + valoresPrev[cont] + " ---> Sin partes"
        );
        partes = 1;
      }
      valoresNew[cont].map((e) => {
        if (
          valoresNew[cont].length !== valoresPrev[cont].length ||
          !valoresPrev[cont].includes(e)
        ) {
          if (partes == 0) {
            modificado.cambios.push(
              prop + ": " + valoresPrev[cont] + " ---> " + valoresNew[cont]
            );
            partes = 1;
          }
        }
      });
    } else if (prop === "posicionfilo") {
      var filo = 0;
      if (valoresNew[cont].length === 0 && valoresPrev[cont].length > 0) {
        modificado.cambios.push(
          prop + ": " + valoresPrev[cont] + " ---> Sin posicion filogenética"
        );
        filo = 1;
      }
      valoresNew[cont].map((e) => {
        if (
          valoresNew[cont].length !== valoresPrev[cont].length ||
          !valoresPrev[cont].includes(e)
        ) {
          if (filo == 0) {
            modificado.cambios.push(
              prop + ": " + valoresPrev[cont] + " ---> " + valoresNew[cont]
            );
            filo = 1;
          }
        }
      });
    } else if (prop === "comentario") {
      if (valoresPrev[cont] != valoresNew[cont]) {
        modificado.cambios.push(
          prop + ": " + valoresPrev[cont] + " ---> " + valoresNew[cont]
        );
      }
    } else if (
      valoresPrev[cont] != valoresNew[cont] &&
      prop != "imagen" &&
      prop != "pdf" &&
      prop != "modificado"
    ) {
      modificado.cambios.push(
        prop + ": " + valoresPrev[cont] + " ---> " + valoresNew[cont]
      );
    }
    cont++;
  });

  ///////////////////// publico   ////////////////////////
  if (parameters.publico) {
    var public;
    parameters.publico == "si" ? (public = true) : (public = false);
  }

  ///////////////////   holotipo  /////////////////////
  if (parameters.holotipo) {
    var holo;
    parameters.holotipo == "si" ? (holo = true) : (holo = false);
  }

  var modif;
  if (parameters.modificado) {
    modif = parameters.modificado;
    modif.push(modificado);
  } else {
    modif = [modificado];
  }

  let especimen1 = await bochon.findOne({
    where: { bochonnumero: parameters.bochonnumero },
  });
  let cambiarDetail = await bochon.update(
    {
      especimennumero: parameters.especimennumero
        ? parameters.especimennumero
        : especimen1.dataValues?.especimennumero
        ? especimen1.dataValues?.especimennumero
        : [],
      genero: parameters.genero
        ? parameters.genero
        : especimen1.dataValues?.genero
        ? especimen1.dataValues?.genero
        : "sin especificar",
      especie: parameters.especie
        ? parameters.especie
        : especimen1.dataValues?.especie
        ? especimen1.dataValues?.especie
        : "sin especificar",
      subespecie: parameters.subespecie
        ? parameters.subespecie
        : especimen1.dataValues?.subespecie
        ? especimen1.dataValues?.subespecie
        : "sin especificar",
      posicionfilo: parameters.posicionfilo
        ? parameters.posicionfilo
        : especimen1.dataValues?.posicionfilo
        ? especimen1.dataValues?.posicionfilo
        : [],
      periodo: parameters.periodo
        ? parameters.periodo
        : especimen1.dataValues?.periodo
        ? especimen1.dataValues?.periodo
        : "sin especificar",
      epoca: parameters.epoca
        ? parameters.epoca
        : especimen1.dataValues?.epoca
        ? especimen1.dataValues?.epoca
        : "sin especificar",
      piso: parameters.piso
        ? parameters.piso
        : especimen1.dataValues?.piso
        ? especimen1.dataValues?.piso
        : "sin especificar",
      cuenca: parameters.cuenca
        ? parameters.cuenca
        : especimen1.dataValues?.cuenca
        ? especimen1.dataValues?.cuenca
        : "sin especificar",
      formacion: parameters.formacion
        ? parameters.formacion
        : especimen1.dataValues?.formacion
        ? especimen1.dataValues?.formacion
        : "sin especificar",
      miembro: parameters.miembro
        ? parameters.miembro
        : especimen1.dataValues?.miembro
        ? especimen1.dataValues?.miembro
        : "sin especificar",
      localidad: parameters.localidad
        ? parameters.localidad
        : especimen1.dataValues?.localidad
        ? especimen1.dataValues?.localidad
        : "sin especificar",
      coordlat: parameters.coordlat
        ? parameters.coordlat
        : especimen1.dataValues?.coordlat
        ? especimen1.dataValues?.coordlat
        : 0,
      coordlong: parameters.coordlong
        ? parameters.coordlong
        : especimen1.dataValues?.coordlong
        ? especimen1.dataValues?.coordlong
        : 0,
      campana: parameters.campana
        ? parameters.campana
        : especimen1.dataValues?.campana
        ? especimen1.dataValues?.campana
        : "sin especificar",
      nrocampo: parameters.nrocampo
        ? parameters.nrocampo
        : especimen1.dataValues?.nrocampo
        ? especimen1.dataValues?.nrocampo
        : "sin especificar",
      descubridor: parameters.descubridor
        ? parameters.descubridor
        : especimen1.dataValues?.descubridor
        ? especimen1.dataValues?.descubridor
        : "sin especificar",
      fechadescubrimiento: parameters.fechadescubrimiento
        ? parameters.fechadescubrimiento
        : especimen1.dataValues?.fechadescubrimiento
        ? especimen1.dataValues?.fechadescubrimiento
        : null,
      preparador: parameters.preparador
        ? parameters.preparador
        : especimen1.dataValues?.preparador
        ? especimen1.dataValues?.preparador
        : "sin especificar",
      preparacionfecha: parameters.preparacionfecha
        ? parameters.preparacionfecha
        : especimen1.dataValues?.preparacionfecha
        ? especimen1.dataValues?.preparacionfecha
        : null,
      armario1: parameters.armario1
        ? parameters.armario1
        : especimen1.dataValues?.armario1
        ? especimen1.dataValues?.armario1
        : 0,
      estante1desde: parameters.estante1desde
        ? parameters.estante1desde
        : especimen1.dataValues?.estante1desde
        ? especimen1.dataValues?.estante1desde
        : 0,
      estante1hasta: parameters.estante1hasta
        ? parameters.estante1hasta
        : especimen1.dataValues?.estante1hasta
        ? especimen1.dataValues?.estante1hasta
        : 0,
      armario2: parameters.armario2
        ? parameters.armario2
        : especimen1.dataValues?.armario2
        ? especimen1.dataValues?.armario2
        : 0,
      estante2desde: parameters.estante2desde
        ? parameters.estante2desde
        : especimen1.dataValues?.estante2desde
        ? especimen1.dataValues?.estante2desde
        : 0,
      estante2hasta: parameters.estante2hasta
        ? parameters.estante2hasta
        : especimen1.dataValues?.estante2hasta
        ? especimen1.dataValues?.estante2hasta
        : 0,
      partesesqueletales: parameters.partesesqueletales
        ? parameters.partesesqueletales
        : especimen1.dataValues?.partesesqueletales
        ? especimen1.dataValues?.partesesqueletales
        : [],
      cantidadfrag: parameters.cantidadfrag
        ? parameters.cantidadfrag
        : especimen1.dataValues?.cantidadfrag
        ? especimen1.dataValues?.cantidadfrag
        : 0,
      comentario: parameters.comentario
        ? parameters.comentario
        : especimen1.dataValues?.comentario
        ? especimen1.dataValues?.comentario
        : "sin especificar",
      imagen: parameters.imagen
        ? parameters.imagen
        : especimen1.dataValues?.imagen
        ? especimen1.dataValues?.imagen
        : [],
      pdf: parameters.pdf
        ? parameters.pdf
        : especimen1.dataValues?.pdf
        ? especimen1.dataValues?.pdf
        : [],
      url: parameters.url
        ? parameters.url
        : especimen1.dataValues?.url
        ? especimen1.dataValues?.url
        : "sin URL",
      publico: public,
      holotipo: holo,
      modificado: modif,
      prestado: parameters.prestado,
    },
    {
      where: {
        bochonnumero: parameters.bochonnumero,
      },
    }
  );

  res.send(cambiarDetail);
});

rutas.post("/bochon/especimen", async (req, res) => {
  let numero = await bochon.sequelize.query("select bochonnumero from bochons");
  let numeros = [];

  console.log(req.body);
  //buscamos el ultimo id ingresado
  numero[0].map((e) => {
    numeros.push(e.bochonnumero);
  });
  let newId = 1;
  try {
    const post = await bochon.create({
      bochonnumero: req.body[0]?.bochonnumero.toString() || newId.toString(),
      especimennumero: [],
      sigla: "PVBSJ",
      genero: req.body[0].genero,
      especie: req.body[0].especie,
      subespecie: req.body[0].subespecie,
      periodo: req.body[0].periodo,
      epoca: req.body[0].epoca,
      piso: req.body[0].piso,
      posicionfilo: req.body[0].posicionfilo,
      cuenca: req.body[0].cuenca,
      formacion: req.body[0].formacion,
      miembro: req.body[0].miembro,
      localidad: req.body[0].localidad,
      coordlat: req.body[1].latitud,
      coordlong: req.body[1].longitud,
      campana: req.body[0].campana,
      descubridor: req.body[0].descubridor,
      fechadescubrimiento: req.body[0].fechadescubrimiento,
      nrocampo: req.body[0].nrocampo,
      preparador: req.body[0].preparador,
      armario1: req.body[0].armario1,
      estante1desde: req.body[0].estante1desde,
      estante1hasta: req.body[0].estante1hasta,
      armario2: req.body[0].armario2,
      estante2desde: req.body[0].estante2desde,
      estante2hasta: req.body[0].estante2hasta,
      preparacionfecha: req.body[0].preparacionfecha,
      partesesqueletales: req.body[0].partesesqueletales,
      cantidadfrag: req.body[0].cantidadfrag,
      imagen: req.body[0].imagen,
      pdf: req.body[0].pdf,
      comentario: req.body[0].comentario,
      url: req.body[0].url,
      publico: req.body[0].publico === "si" ? true : false,
      holotipo: req.body[0].holo === "si" ? true : false,
      modificado: false,
      prestado: false,
    });
    res.status(202).send(post);
  } catch (err) {
    res.status(404).send(err);
  }
});

rutas.delete("/bochon/especimen/:id", (req, res, next) => {
  const { id } = req.params;
  bochon
    .destroy({
      where: {
        bochonnumero: id,
      },
    })
    .then(() => res.status(202).send("Especimen Borrado!"))
    .catch((err) => res.status(404).send(err));
});

module.exports = rutas;
