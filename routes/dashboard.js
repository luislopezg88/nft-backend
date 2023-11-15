const express = require("express");
const ColeccionesVendidasSchema = require("../schema/coleccionesVendidas");
const { jsonResponse } = require("../lib/jsonResponse");
const router = express.Router();

router.get("/", async (req, res) => {
  return "hola";
});

router.get("/usuario/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const data = await ColeccionesSchema.dashboard({ id_usuario: id });

    res.json(
      jsonResponse(200, {
        data,
        recordsTotal: data.length,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(
      jsonResponse(500, {
        error: "Error al obtener el coleccion",
      })
    );
  }
});
// Ruta para Colecciones más vendidas
router.get("/ColeccionesVendidas", async (req, res) => {
  const data = await ColeccionesVendidasSchema.obtenerColeccionesVendidas();

  return res.json(
    jsonResponse(200, {
      data,
      recordsTotal: data.length,
    })
  );
});
// Ruta para Colecciones más vendidos del usuario
router.get("/coleccionesVendidas/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  const data = await ColeccionesVendidasSchema.obtenerColeccionesVendidas(id_usuario);
  return res.json(
    jsonResponse(200, {
      data,
      recordsTotal: data.length,
    })
  );
});
// Ruta para usuario con más ventas
router.get("/ventasPorUsuario", async (req, res) => {
  const data = await ColeccionesVendidasSchema.obtenerVentasPorUsuario();
  return res.json(
    jsonResponse(200, {
      data,
      recordsTotal: data.length,
    })
  );
});

module.exports = router;
