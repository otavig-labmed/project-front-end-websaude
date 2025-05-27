import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(express.json());
app.use(cors());
app.use(express.static('public'))

function verify(req, res, next){
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).send('Acesso negado. Token não foi provido');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(401).send('Acesso negado. Token inválido');
    }
}

app.get("/private", verify, (req, res) => {
    res.json({msg: "Bem vindooo!"})
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    try {
        if (username != "admin" && password != "password") res.json({msg: "Credencial inválida"});

        const token = jwt.sign({username}, SECRET_KEY, {expiresIn: "300s"});

        res.status(200).json({msg: "Seja bem-vindo!", token_acess: token});
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: "Ocorreu um erro no servidor!"});
    }

})

app.listen(PORT, ()=>console.log(`Running in http://localhost:${PORT}`))