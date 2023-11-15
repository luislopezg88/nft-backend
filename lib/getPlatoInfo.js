function getColeccionInfo(coleccion) {
    return {
      id: coleccion.id || coleccion._id,
      nombre: coleccion.nombre,
      descripcion: coleccion.descripcion,
      id_user: coleccion.id_user
    };
  }
  
  module.exports = getColeccionInfo;
  