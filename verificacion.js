const jwt = require("jsonwebtoken");

function verificacion(req, res, next){
    const autHeader = req.headers.token;
    if(autHeader){
        
        jwt.verify(autHeader, process.env.SECRET_KEY, (error, usuario) =>{
            if (error) res.status(403).json("El token no es valido");
            req.usuario = usuario
            next()
        })
    }else{
        return res.status(401).json("No estas autorizado")
    }
}

module.exports = verificacion