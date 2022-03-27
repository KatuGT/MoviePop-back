const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fotoPerfil: { type: String, default: "" },
  favoritos: { type: Array },
  esAdmin:{type:Boolean, default:false}

});

module.exports = mongoose.model("Usuario", usuarioSchema)
