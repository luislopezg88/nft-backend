const Mongoose = require("mongoose");

const ColeccionesSchema = new Mongoose.Schema({
  id: { type: Object },
  id_usuario: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "usuarios",
  },
  nombre: { type: String },
  descripcion: { type: String },
  estilo: { type: String },
  imagen: { type: String },
  direccionContrato: { type: String },
  idToken: { type: String },
  estandarToken: { type: String },
  cadena: { type: String },
  fechaCreacion: { type: Date, default: Date.now },
  actualizacion: { type: Date, default: Date.now }, // Nuevo campo para la fecha de creación
});

ColeccionesSchema.statics.existsByNombreAndUsuarioId = async function (
  nombre,
  id_usuario
) {
  const coleccionCount = await this.countDocuments({ nombre, id_usuario });
  return coleccionCount > 0;
};

module.exports = Mongoose.model("Colecciones", ColeccionesSchema);
