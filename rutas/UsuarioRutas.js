const router = require("express").Router();
const Usuario = require("../modelos/Usuario");
const CryptoJS = require("crypto-js");
const verificacion = require("./../verificacion");

//MODIFICAR
router.put("/:id", verificacion, async (req, res) => {
  if (req.usuario.id === req.params.id || req.usuario.esAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }
    try {
      const usuarioModificado = await Usuario.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(usuarioModificado);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Solo puede modificar tu propio usuario");
  }
});

//  BORRAR
router.delete("/:id", verificacion, async (req, res) => {
  if (req.usuario.id === req.params.id || req.usuario.esAdmin) {
    try {
      await Usuario.findByIdAndDelete(req.params.id);
      res.status(200).json("Usuario borrado.");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Solo puede borrar tu propio usuario");
  }
});

// OBTENER 1 USUARIO
router.get("/find/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    const { password, ...info } = usuario._doc;
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json(error);
  }
});


//OBTENER TODOS
router.get("/", verificacion, async (req, res) => {
    if (req.usuario.esAdmin) {
      try {
       const usuarios = await Usuario.find();
       res.status(200).json(usuarios.reverse());
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("No estas autorizado para ver todos los usuarios");
    }
  });



  //AGREGAR A FAVORITOS
router.post("/:idUsuario/addfavorito/:idPelicula", async (req, res) => {
    try {
      const idPelicula = req.params.idPelicula;
      const usuario = await Usuario.findById(req.params.idUsuario);
      usuario.favoritos.push(idPelicula);
  
      await usuario.save();
      res.status(200).json(usuario);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //BORRAR DE FAVORITOS
  router.delete("/:idUsuario/borrarpelicula/:idPelicula", async (req, res) => {
    try {
      const idPelicula = req.params.idPelicula;
      const idUsuario = req.params.idUsuario;
      const actualizado = await Usuario.findByIdAndUpdate(
        idUsuario,
        { $pullAll: { favoritos: [idPelicula] } },
        { new: true }
      );
      res.status(200).json(actualizado);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  });

module.exports = router;
