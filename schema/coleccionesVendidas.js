const Mongoose = require("mongoose");

const ColeccionesVendidasSchema = new Mongoose.Schema({
  id: { type: Object },
  id_coleccion: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "coleccion",
  },
  id_usuario: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "usuario",
  },
  cantidad: { type: Number },
  fecha: { type: Date, default: Date.now }
});

ColeccionesVendidasSchema.statics.obtenerColeccionesVendidas = async function (id_usuario) {
    const matchStage = {
      $match: {
        id_usuario: id_usuario ? new Mongoose.Types.ObjectId(id_usuario) : { $exists: true },
      },
    };
  
    const resultados = await this.aggregate([
      matchStage,
      {
        $group: {
          _id: "$id_coleccion",
          totalVentas: { $sum: "$cantidad" },
        },
      },
      {
        $lookup: {
          from: "colecciones", // Ajusta según el nombre de tu colección de colecciones
          localField: "_id",
          foreignField: "_id",
          as: "coleccion",
        },
      },
      {
        $unwind: "$coleccion",
      },
      {
        $lookup: {
          from: "usuarios", // Ajusta según el nombre de tu colección de usuarios
          localField: "coleccion.id_usuario",
          foreignField: "_id",
          as: "usuario",
        },
      },
      {
        $unwind: "$usuario",
      },
      {
        $project: {
          _id: 0,
          nombreColeccion: "$coleccion.nombre",
          nombreUsuario: "$usuario.nombre",
          totalVentas: 1,
        },
      },
      {
        $sort: { totalVentas: -1 },
      },
    ]);
  
    return resultados;
};

ColeccionesVendidasSchema.statics.obtenerVentasPorUsuario = async function () {
    const resultados = await this.aggregate([
        {
            $group: {
                _id: "$id_usuario",
                totalVentas: { $sum: "$cantidad" },
            },
        },
        {
            $lookup: {
                from: "usuarios", // Ajusta según el nombre de tu colección de usuarios
                localField: "_id",
                foreignField: "_id",
                as: "usuario",
            },
        },
        {
            $unwind: "$usuario",
        },
        {
            $project: {
                _id: 0,
                nombreUsuario: "$usuario.nombre",
                totalVentas: 1,
            },
        },
    ]);

    return resultados;
};

module.exports = Mongoose.model("ColeccionesVendidas", ColeccionesVendidasSchema);
