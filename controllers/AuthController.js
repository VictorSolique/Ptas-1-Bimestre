const prisma = require("../prisma/prismaClient");

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {

    static async cadastrar(req, res) {
        const { nome, email, password } = req.body;

        if (!nome || nome.length < 6) {
            return res.status(422).json({
                erro: true,
                mensagem: "O nome deve ter pelo menos 6 caracteres.",
            });
        }

        if (!email || email.length < 10) {
            return res.status(422).json({
                erro: true,
                mensagem: "O email deve ter pelo menos 10 caracteres.",
            });
        }

        if (!password || password.length < 8) {
            return res.status(422).json({
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
            return res.status(422).json({
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

            console.log(JSON.stringify(usuario));

            const token = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY, {
                expiresIn: "1h",
            });

            return res.status(201).json({
                erro: false,
                mensagem: "Usuário cadastrado com sucesso!",
                token: token,
            });

        } catch (error) {
            return res.status(500).json({
                erro: true,
                mensagem: "Ocorreu um erro, tente novamente mais tarde! " + error,
            });
        }



    }

    static async login(req, res) {
        const { email, password } = req.body;

        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email,
            },
        });

        if (!usuario) {
            return res.status(422).json({
                erro: true,
                mensagem: "Usuario não foi encontrado.",
            });
        }

        // Verificação da senha
        const senhaCorreta = bcryptjs.compareSync(password, usuario.password);

        if (!senhaCorreta) {
            return res.status(422).json({
                erro: true,
                mensagem: "Senha incorreta.",
            });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });

        res.status(200).json({
            erro: false,
            mensagem: "Autenticação realizada com sucesso!",
            token: token,
        });

    }

    // Middleware para verificar se o usuario está autenticado
    static async verificarAutenticacao(req, res, next) {
        const authHeader = req.headers["authorization"];

        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(422).json({ message: "Token não encontrado." });
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
            if (err) {
                return res.status(401).json({ mensagem: "Token Inválido!" });
            }

            req.usuarioId = payload.id;
            next();
        });
    }

    // Middleware para verificar se o usuario é administrador
    static async verificarPermissaoAdm(req, res, next) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: req.usuarioId },
        });

        if(usuario.tipo === "adm"){
            next();
        } else {
            return res.status(401).json({
                erro: true,
                mensagem: "Você não tem permissão para acessar esse recurso!"
            });
        }
    }

}

module.exports = AuthController;