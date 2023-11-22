const express = require("express");
const multer = require("multer");
const path = require("path");
const ColeccionesSchema = require("../schema/colecciones");
const { jsonResponse } = require("../lib/jsonResponse");
const router = express.Router();

// Configurar multer carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "imagenes/colecciones/"); // Directorio donde se guardarán las imágenes de colecciones
  },
  filename: function (req, file, cb) {
    const nombreArchivo = req.body.imagen; // + path.extname(file.originalname);
    cb(null, nombreArchivo);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const data = await ColeccionesSchema.find();

    res.json(
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
//
router.post("/", upload.single("file"), async (req, res) => {
  const { idUsuario, nombre, descripcion, estilo, imagen, cadena } = req.body;
  const direccionContrato =
    "address / 0x09a8528539ce1701cfde6ea6ea03ec0e7c3f0a2";
  if (!nombre) {
    return res.status(409).json(
      jsonResponse(409, {
        error: "El nombre es obligatorio",
      })
    );
  }

  try {
    const exists = await ColeccionesSchema.existsByNombreAndUsuarioId(
      nombre,
      idUsuario
    );

    if (exists) {
      return res.status(409).json(
        jsonResponse(409, {
          error: "Colección ya existe",
        })
      );
    } else {
      //Crear Colección
      const nuevaColeccion = new ColeccionesSchema({
        id_usuario: idUsuario,
        nombre: nombre,
        descripcion: descripcion,
        estilo: estilo,
        imagen: imagen,
        cadena: cadena,
        direccionContrato: direccionContrato,
        idToken: "109",
        estandarToken: "ERC - 721",
        cadena: "Ethereum",
      });

      // Guardar la Colección
      const coleccionInfo = await nuevaColeccion.save();
      res.json(
        jsonResponse(200, {
          coleccionInfo,
        })
      );
    }
  } catch (error) {
    res.status(500).json({ error: "Error al crear la colección" });
  }
});

module.exports = router;
