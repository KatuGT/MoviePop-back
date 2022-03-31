const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const autenticacionRuta = require("./rutas/AutenticacionRutas")
const usuarioRuta = require("./rutas/UsuarioRutas")
const cors = require("cors");

dotenv.config()

mongoose.connect(process.env.MONGO_URL, () => {
    console.log(`conectado a la base de datos: ${process.env.MONGO_URL}`)
})


app.use(cors())
app.use(express.json())
app.use("/api/aut", autenticacionRuta)
app.use("/api/usuario", usuarioRuta)

app.listen( process.env.PORT|| 5002, () => {
    console.log("server funcionando");
})

