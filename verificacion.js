const jwt = require("jsonwebtoken");

function verificacion(req, res, next){
    const autHeader = req.headers.token;
    if(autHeader){
        const token = autHeader.split(" ")[1]
        jwt.verify(token, process.env.SECRET_KEY, (error, usuario) =>{
            if (error) res.status(403).json("El token no es valido");
            req.usuario = usuario
            next()
        })
    }else{
        return res.status(401).json("No estas autorizado")
    }
}

module.exports = verificacion