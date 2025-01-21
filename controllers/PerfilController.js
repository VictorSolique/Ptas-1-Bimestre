const prisma = require("../prisma/prismaClient");

class PerfilController {
    static async getPerfil(req, res) {
        const perfil = await prisma.usuario.findUnique({
            where: { id: req.usuarioId },
            omit: { password: true },
        });

        return res.status(200).json({
            erro: false,
            mensagem: "Mostrando perfil do usuário",
            usuario: perfil,
        })
    }

    static async atualizarPerfil(req, res) {
        const { nome, email } = req.body;

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

        try {
            prisma.usuario.update({
                where: {
                    id: req.usuarioId
                },
                data: {
                    email: email,
                    nome: nome,
                }
            })

            return res.status(201).json({
                erro: false,
                mensagem: "Usuário atualizado com sucesso!",
            });

        } catch (error) {
            return res.status(500).json({
                erro: true,
                mensagem: "Ocorreu um erro, tente novamente mais tarde! " + error,
            });
        }
    }

    static async buscarUsuarios(req, res) {
        try {
            const buscados = await prisma.usuario.findMany({
                omit: { password: true },
            });
    
            return res.status(200).json({
                erro: false,
                mensagem: "Usuários buscados com sucesso!",
                usuarios: buscados,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                erro: true,
                mensagem: "Erro ao buscar usuários.",
            });
        }
    }
}

module.exports = PerfilController;