
const { conn } = require("../db");
const { Router } = require("express");
const rutas = Router();


const { usuarios} = conn.models;


rutas.post("/usuario", async (req, res) => {
    try {
      let { id, correo, nombre, imagen } = req.body;
      let encontrado = await usuarios.findByPk(id);
      if (encontrado) {
        res.send(encontrado.dataValues);
      } else {
        let newUser = await usuarios.create({
          id: id,
          correo: correo,
          nombre: nombre,
          imagen: imagen,
        });
        res.send(newUser.dataValues);
      }
    } catch (err) {
      res.status(404).send(err);
    }
  });
  rutas.put("/modificarUsuario", async (req, res) => {
    let { id, correo, nombre, nivel, imagen1, contrasena } = req.body;
    try {
      let update = await usuarios.update(
        {
          correo: correo,
          nombre: nombre,
          contrasena: contrasena,
          nivel: nivel,
          imagen: imagen1,
        },
        {
          where: {
            id: id,
          },
        }
      );
      res.send(update);
    } catch (err) {
      res.status(404).send(err);
    }
  });
  rutas.delete("/eliminarUsuario/:id", async (req, res) => {
    let { id } = req.params;
    try {
      let eliminarUsuario = await usuarios.destroy({
        where: { id: id },
      });
      res.send("se elimino correctemente", eliminarUsuario);
    } catch (err) {
      res.status(404).send(err);
    }
  });
  rutas.get("/usuario", async (req, res) => {
    let ids = req.query;
  
    try {
      if (ids.id) {
        let usuario = await usuarios.findByPk(ids.id);
        res.send(usuario?.dataValues);
      } else {
        let usuariosList = await usuarios.findAll();
        let lista = usuariosList.map((el) => {
          return {
            id: el.dataValues.id,
            nombre: el.dataValues.nombre,
            correo: el.dataValues.correo,
            imagen: el.dataValues.imagen,
            nivel: el.dataValues.nivel,
          };
        });
  
        res.send(lista);
      }
    } catch (err) {
      res.status(404).send(err);
    }
  });
  
  module.exports = rutas