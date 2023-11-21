const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authenticateToken = require("./auth/authenticateToken");
const log = require("./lib/trace");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3100;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);

  console.log("Conectado a la base de datos");
}

app.use("/api/login", require("./routes/login"));
app.use("/api/signup", require("./routes/signup"));
app.use("/api/signout", require("./routes/logout"));
app.use("/api/usuario", require("./routes/usuarios"));
app.use("/api/coleccion", require("./routes/colecciones"));
app.use("/api/activo", require("./routes/activo"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/carrito", require("./routes/carrito"));
// Ruta para renovar el
app.use("/api/refresh-token", require("./routes/refreshToken"));

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

module.exports = app;
