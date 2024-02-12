const expres = require("express");
const { Router } = require("express");
const { conn } = require("../db");
const rutas = Router();

const {
    prestamo,
  } = conn.models;



  rutas.get("/prestamos", async (req, res) => {
    let numero = req.query.id;
    if (numero) {
      let prestamo1 = await prestamo.findAll();
      let filtrado = prestamo1.filter((e) => e.numeroespecimen.includes(numero));
  
      res.send(filtrado);
    } else {
      let prestamos = await prestamo.findAll();
      res.send(prestamos);
    }
  });
  
  rutas.post("/prestamos", async (req, res) => {
    try {
      const post = await prestamo.create({
        numeroespecimen: req.body.numeroespecimen,
        generoespecie: req.body.generoespecie,
        tipoprestamo: req.body.tipoprestamo,
        emisor: req.body.emisor,
        correo: req.body.correo,
        investigador: req.body.investigador,
        contacto: req.body.contacto,
        institucion: req.body.institucion,
        fechaprestamo: req.body.fechaprestamo,
        fechadevolucionest: req.body.fechadevolucionest,
        fechadevolucion: null,
        devuelto: false,
        comentarios: req.body.comentarios,
      });
      res.status(202).send(post);
    } catch (err) {
      res.status(404).send(err);
    }
  });
  
  rutas.put("/prestamos", async (req, res) => {
    try {
      let updatePresta = await prestamo.update(
        {
          fechadevolucion: req.body.fechadevolucion,
          devuelto: req.body.devuelto,
        },
        {
          where: {
            id: req.body.id,
          },
        }
      );
      res.send(updatePresta);
    } catch (err) {}
  });
  
  rutas.delete("/eliminarprestamos", async (req, res) => {
    const { id } = req.query;
  
    try {
      let eliminarPrestamo = await prestamo.destroy({
        where: { id: id },
      });
      res.status(200).send("se elimino correctemente");
    } catch (err) {}
  });
  



module.exports = rutas