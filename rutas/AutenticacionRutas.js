const router = require("express").Router();
const Usuario = require("../modelos/Usuario");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTRO
router.post("/register", async (req, res) => {
  const newUsuario = new Usuario({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });

  try {
    const usuario = await newUsuario.save();
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json(error);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ email: req.body.email });

    if (!usuario) {
      return res.status(401).json("Contraseña o email incorrectos");
    }

    const bytes = CryptoJS.AES.decrypt(
      usuario.password,
      process.env.SECRET_KEY
    );
    const passwordOriginal = bytes.toString(CryptoJS.enc.Utf8);

    if (passwordOriginal !== req.body.password) {
      return res.status(401).json("Contraseña o email incorrectos");
    }

    const accessToken = jwt.sign(
      { id: usuario._id, esAdmin: usuario.esAdmin },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    const { password, ...info } = usuario._doc;

    res.status(200).json({...info, accessToken});
  } catch (error) {
    res.status(200).json(error);
  }
});

module.exports = router;
