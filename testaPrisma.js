const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    // Insire um usuário
    const usuario = await prisma.usuario.create({
        data: {
            nome: "Maria",
            email: "maria@example.com",
            password: "senha123",
            tipo: "cliente",
        },
    });

    console.log("Novo Usuário: " + JSON.stringify(usuario));

    // Busca usuários
    const usuarios = await prisma.usuario.findMany();
    console.log("Todos os usuários: " + JSON.stringify(usuarios));
    console.log(usuario);
    

}

main();
