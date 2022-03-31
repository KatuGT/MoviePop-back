const { check } = require("express-validator");
const Usuario = require("../modelos/Usuario");

const registroValidaciones = [
  check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Debes escribir tu apodo.")
    .isLength({ min: 4, max: 15 })
    .withMessage("Tu apodo debe tener entre 4 y 15 caracteres.")
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        Usuario.findOne({ username: req.body.username }, function (err, user) {
          if (err) {
            reject(new Error("Server Error"));
          }
          if (Boolean(user)) {
            reject(new Error("Este apodo ya esta en uso."));
          }
          resolve(true);
        });
      });
    }),
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Ingresa tu E-mail.")
    .isEmail()
    .withMessage("Ingresa un E-mail valido.")
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        Usuario.findOne({ email: req.body.email }, function (err, user) {
          if (err) {
            reject(new Error("Server Error"));
          }
          if (Boolean(user)) {
            reject(new Error("Este e-mail ya esta en uso."));
          }
          resolve(true);
        });
      });
    }),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Ingresa una contraseña.")
    .isLength({ min: 8 })
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .withMessage(
      "Debe tener almenos 1 letra y 1 numero, largo minimo 8 caracteres."
    ),
];


module.exports = {registroValidaciones}