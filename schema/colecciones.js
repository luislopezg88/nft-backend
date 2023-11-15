const Mongoose = require("mongoose");

const ColeccionesSchema = new Mongoose.Schema({
  id: { type: Object },
  id_usuario: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "usuarios",
  },
  nombre: { type: String },
  descripcion: { type: String },
  regiones: { type: String },
  estilos: { type: String },
  ingredientes: { type: String },
  tecnicas: { type: String },
  tipo: { type: String },
  imagen: { type: String },
  precio: { type: Number },
});

ColeccionesSchema.statics.existsByNombreAndUsuarioId = async function (nombre, id_usuario) {
  const coleccionCount = await this.countDocuments({ nombre, id_usuario });
  return coleccionCount > 0;
};

module.exports = Mongoose.model("Colecciones", ColeccionesSchema);
