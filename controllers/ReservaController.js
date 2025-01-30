const prisma = require("../prisma/prismaClient");

class ReservaController {
    static async registrarReserva(req, res) {
        const { mesa_id, n_pessoas } = req.body;
        const data = new Date(req.body.data);

        // Verificar se o ID da mesa foi fornecido
    if (!mesa_id) {
        return res.status(400).json({
            erro: true,
            mensagem: "ID da mesa não fornecido."
        });
    }

        const mesa = await prisma.mesa.findUnique({
            where: { id: mesa_id },
            include: {
                reservas: {
                    where: {
                        data: data,
                        status: true,
                    }
                }
            }
        })

        // Verificar se a mesa está livre para a data selecionada

        if (mesa.reservas.length > 0) {
            return res.status(400).json({
                erro: true,
                mensagem: "A mesa selecionada já está reservada para esta data.",
            });
        }

        // Verificar se a data da reserva é >= hoje

        const today = new Date();
        if (data < today) {
            return res.status(400).json({
                erro: true,
                mensagem: "Insira uma data que seja igual ou posterior ao dia de hoje."
            });
        }

        // Verificar se a mesa comporta o número de pessoas indicado

        if (mesa.n_lugares < n_pessoas) {
            return res.status(422).json({
                erro: true,
                mensagem: "O número de pessoas ultrapassou a capacidade da mesa."
            });
        }

        prisma.reserva.create({
            data: {
                data: data,
                n_pessoas: n_pessoas,
                usuario: {
                    connect: {
                        id: req.usuarioId,
                    },
                },
                mesa: {
                    connect: {
                        id: mesa_id,
                    },
                },
            },
        }).then(() => {
            return res.status(200).json({
                erro: false,
                mensagem: "Reserva realizada com sucesso",
            })
        })
            .catch((error) => {
                return res.status(201).json({
                    erro: true,
                    mensagem: "Ocorreu um erro ao cadastrar reserva." + error,
                })
            });

    }

    static async getReservas(req, res) {
        try {
            const quantReservas = await prisma.reserva.findMany({
                where: {
                    usuarioId: req.usuarioId, 
                },
                include: {
                    mesa: true,
                },
            });

            if (quantReservas.length == 0) {
                return res.status(222).json({
                    erro: true,
                    mensagem: "O usuario não possui nenhuma reserva.",
                })
            }


            return res.status(200).json({
                erro: false,
                mensagem: "Reservas visualizadas com sucesso!",
                reservas: quantReservas,
            });
        } catch (error) {
            return res.status(500).json({
                erro: true,
                mensagem: "Ocorreu um erro, tente novamente mais tarde! " + error.message,
            });
        }
    }

    static async cancelarReserva(req, res) {
        const reservaId = req.body.reservaId;

        console.log(reservaId)

        if (!reservaId) {
            return res.status(401).json({
                erro: true,
                mensagem: "O usuário não possui nenhuma reserva para cancelar",
            })
        }

        try {
            const deletar = await prisma.reserva.delete({
                where: {
                    id: reservaId,
                },
            });

            console.log(JSON.stringify(deletar));

            return res.status(200).json({
                erro: false,
                mensagem: "Reserva cancelada com sucesso!",
            });
        } catch (error) {
            return res.status(500).json({
                erro: true,
                mensagem: "Ocorreu um erro ao cancelar a reserva. " + error.message,
            });
        }
    }

    static async buscarReservasData(req, res) {
        const data = new Date(req.body.data);

        try {
            const reservasData = await prisma.reserva.findMany({
                where: {
                    data: data
                },
                include: {
                    usuario: true,
                    mesa: true,
                }
            })

            if (reservasData.length == 0) {
                return res.status(222).json({
                    erro: true,
                    mensagem: "Não existe nenhuma reserva cadastrada nesta data.",
                });
            }

            return res.status(201).json({
                erro: false,
                mensagem: `Busca de reserva por data realizada com sucesso!`,
                reservas: reservasData,
            });

        } catch (error) {
            return res.status(500).json({
                erro: true,
                mensagem: "Ocorreu um erro, tente novamente mais tarde! " + error.message,
            });
        }


    }

}

module.exports = ReservaController;