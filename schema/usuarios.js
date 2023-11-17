const Mongoose = require("mongoose");

const UsuarioSchema = new Mongoose.Schema({
  id: { type: Object },
  nombre: { type: String },
  sexo: { type: String },
  edad: { type: Number },
  foto: { type: String },
  telefono: { type: String },
  correo: { type: String },
  ubicacion: { type: String }
});

UsuarioSchema.statics.existsById = async function (usuarioId) {
  const usuarioCount = await this.countDocuments({ _id: usuarioId });
  return usuarioCount > 0;
};

module.exports = Mongoose.model("usuarios", UsuarioSchema);
