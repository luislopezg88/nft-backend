const Mongoose = require("mongoose");

const activoSchema = new Mongoose.Schema({
  id: { type: Object },
  id_usuario: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "usuarios",
  },
  id_coleccion: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "colecciones",
  },
  nombre: { type: String },
  descripcion: { type: String },
  imagen: { type: String },
  precio: { type: Number },
  visto: { type: Number },
  suministrar: { type: Number },
  fechaCreacion: { type: Date, default: Date.now },
  // Nuevo campo para la fecha de creación
});

activoSchema.statics.existsByNombreAndColletion = async function (
  nombre,
  id_coleccion
) {
  const nftCount = await this.countDocuments({ nombre, id_coleccion });
  return nftCount > 0;
};

activoSchema.statics.countActivoCollection = async function (id_coleccion) {
  const nftCount = await this.countDocuments({ id_coleccion });
  return nftCount;
};

module.exports = Mongoose.model("nfts", activoSchema);
