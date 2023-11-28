const express = require("express");
const multer = require("multer");
const path = require("path");
const activoSchema = require("../schema/activo");
const { jsonResponse } = require("../lib/jsonResponse");
const router = express.Router();

// Configurar multer carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "imagenes/activos/"); // Directorio donde se guardarán las imágenes de colecciones
  },
  filename: function (req, file, cb) {
    const nombreArchivo = req.body.imagen; // + path.extname(file.originalname);
    cb(null, nombreArchivo);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const data = await activoSchema.find();

    res.json(
      jsonResponse(200, {
        data,
        recordsTotal: data.length,
      })
    );
  } catch (error) {
    //console.log(error);
    return res.status(500).json({ error: "Error al obtener los todos" });
  }
});

router.get("/coleccion/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const data = await activoSchema.find({ id_coleccion: id });

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

router.get("/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const data = await activoSchema.find({ id_usuario: id });

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

router.post("/", upload.single("file"), async (req, res) => {
  const {
    idUsuario,
    idColeccion,
    nombre,
    descripcion,
    imagen,
    precio,
    suministrar,
    visto,
  } = req.body;
  if (!nombre) {
    return res.status(409).json(
      jsonResponse(409, {
        error: "El nombre es obligatorio",
      })
    );
  }

  try {
    const exists = await activoSchema.existsByNombreAndColletion(
      nombre,
      idColeccion
    );

    if (exists) {
      return res.status(409).json(
        jsonResponse(409, {
          error: "NFT ya existe",
        })
      );
    } else {
      //Crear NFT
      const nuevaActivo = new activoSchema({
        id_usuario: idUsuario,
        id_coleccion: idColeccion,
        nombre: nombre,
        descripcion: descripcion,
        imagen: imagen,
        precio: precio,
        visto: visto,
        suministrar: suministrar,
      });
      // Guardar la Activo
      const coleccionInfo = await nuevaActivo.save();
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

router.get("/imagen/:img", function (req, res) {
  const img = req.params.img;
  const fileName = encodeURIComponent(img);
  const filePath = path.join(__dirname, "..", "imagenes", "activos", fileName);
  res.sendFile(filePath);
});

module.exports = router;
