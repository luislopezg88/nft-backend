const express = require("express");
const ColeccionesSchema = require("../schema/colecciones");
const ColeccionesVendidas = require("../schema/coleccionesVendidas");
const { jsonResponse } = require("../lib/jsonResponse");
const router = express.Router();

router.get("/usuario/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const data = await ColeccionesSchema.find({ id_usuario: id });

    res.json(
      jsonResponse(200, {
        data,
        recordsTotal: data.length,
      })
    );
  } catch (err) {
    return res.status(500).json(
      jsonResponse(500, {
        error: "Error al obtener la colección",
      })
    );
  }
});

// Ruta para guardar la lista de colecciones vendidos
router.post("/", async (req, res) => {
  try {
    const listaColecciones = req.body.listaColecciones;

    // Iterar sobre la lista de colecciones y guardarlos en la base de datos
    for (const coleccion of listaColecciones) {
      const nuevaColeccion = new ColeccionesVendidas({
        id_coleccion: coleccion._id,
        id_usuario: coleccion.id_usuario,
        cantidad: coleccion.cantidad,
      });
      await nuevaColeccion.save();
    }

    res
      .status(200)
      .json({ mensaje: "Lista de colecciones vendidas guardada exitosamente" });
  } catch (ersror) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
