function getUsuarioInfo(usuario) {
    return {
      id: usuario.id || usuario._id,
      nombre: usuario.nombre,
      id_user: usuario.id_user
    };
  }
  
  module.exports = getUsuarioInfo;
  