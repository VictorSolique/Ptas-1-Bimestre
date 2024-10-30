const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController{

    static async cadastro(req, res){
        const { nome, email, password } = req.body;

        if(!nome || nome.length < 6){
            return res.json({
                erro: true,
                mensagem: "O nome deve ter pelo menos 6 caracteres.",
            });
        }
        
        if(!email || email.length < 10){
            return res.json({
                erro: true,
                mensagem: "O email deve ter pelo menos 10 caracteres.",
            });
        }

        if(!password || password.length < 8){
            return res.json({
                erro: true,
                mensagem: "A senha deve ter pelo menos 8 caracteres.",
            });
        }

        const existe = await prisma.usuario.count({
            where: {
                email: email,
            }
        })

        if (existe != 0) {
            return res.json({
                erro: true,
                mensagem: "Já existe um usuário cadastrado com este e-mail.",
            });
        }

        const salt = bcryptjs.genSaltSync(8);
        const hashedPassword = bcryptjs.hashSync(password, salt);

        try {
            const usuario = await prisma.usuario.create({
                data: {
                    nome: nome,
                    email: email,
                    password: hashedPassword,
                    tipo: "cliente",
                }
            });

            return res.json({
                erro: false,
                mensagem: "Usuário cadastrado com sucesso!"
            });

        } catch (error) {
            return res.json({
                erro: true,
                mensagem: "Ocorreu um erro, tente novamente mais tarde! " + error,
            });
        }
        

        
    }

    static async login(req, res){

        const {email, password} = req.body;

        const usuario = await prisma.usuario.findUnique;



        const senhaCorreta = bcryptjs.compareSync(password, usuario.password)

        if(!senhaCorreta){
            return res.json({
                erro: true.
                mensagem: "Senha incorreta",
            });
        }

        const token = jwt.sign({id: usuario.id}, "1234567890", {
            expiresIn: "1h
        });

        res.json({
            erro: false,
            mensagem: "Autenticado com sucesso!",
            token: token,
        })

    }

}

module.exports = AuthController;