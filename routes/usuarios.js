const express = require("express");
const { jsonResponse } = require("../lib/jsonResponse");
const UsuariosModel = require("../schema/user");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await UsuariosModel.find();
    return res.json(
      jsonResponse(200, {
        data,
        recordsTotal: data.length,
      })
    );
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los todos" });
  }
});

router.get("/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const data = await UsuariosModel.findOne({ _id: id });

    res.json(
      jsonResponse(200, {
        data,
      })
    );
  } catch (err) {
    return res.status(500).json(
      jsonResponse(500, {
        error: "Error al obtener la lista de usuarios",
      })
    );
  }
});

router.put("/:id", async function (req, res) {
  const { nombre, sexo, edad, foto, telefono, correo, ubicacion } = req.body;
  const id = req.params.id;

  try {
    const exists = await UsuariosModel.existsById(id);

    if (!exists) {
      return res.status(404).json({
        error: "El usuario no existe",
      });
    }

    const result = await UsuariosModel.updateOne(
      { _id: id },
      {
        $set: {
          nombre,
          sexo,
          edad,
          telefono,
          ubicacion,
        },
      }
    );

    if (result.matchedCount > 0) {
      return res.status(200).json({
        message: `Usuario actualizado con éxito, matched:${result.matchedCount}.`,
      });
    } else {
      return res.status(500).json({
        error:
          "Usuario no encontrado o los datos son iguales, no se realizó ninguna actualización",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Error al actualizar el usuario",
    });
  }
});

module.exports = router;
