const Mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../auth/sign");
const getUserInfo = require("../lib/getUserInfo");
const Token = require("../schema/token");

const UserSchema = new Mongoose.Schema({
  id: { type: Object },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nombre: { type: String },
  sexo: { type: String },
  edad: { type: Number },
  foto: { type: String },
  telefono: { type: String },
  correo: { type: String },
  ubicacion: { type: String },
});

UserSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    const document = this;

    bcrypt.hash(document.password, 10, (err, hash) => {
      if (err) {
        next(err);
      } else {
        document.password = hash;
        next();
      }
    });
  } else {
    next();
  }
});

UserSchema.methods.usernameExists = async function (email) {
  const result = await Mongoose.model("usuarios").find({ email: email });
  return result.length > 0;
};

UserSchema.methods.isCorrectPassword = async function (password, hash) {
  const same = await bcrypt.compare(password, hash);

  return same;
};

UserSchema.methods.createAccessToken = function () {
  return generateAccessToken(getUserInfo(this));
};

UserSchema.methods.createRefreshToken = async function (next) {
  const refreshToken = generateRefreshToken(getUserInfo(this));

  try {
    await new Token({ token: refreshToken }).save();

    return refreshToken;
  } catch (error) {
    console.error(error);
  }
};

UserSchema.statics.existsById = async function (usuarioId) {
  const usuarioCount = await this.countDocuments({ _id: usuarioId });
  return usuarioCount > 0;
};

module.exports = Mongoose.model("usuarios", UserSchema);
