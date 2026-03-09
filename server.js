import Fastify  from "fastify";
import { Pool } from "pg";

const sql = new Pool({
    user: "postgres",
    password: "1234",
    host: "localhost",
    port: 5432,
    database: "receitas"
})

const servidor = Fastify()

servidor.get("/usuarios", async () => {
    const result = await sql.query('SELECT * FROM usuario')
    return result.rows
})

servidor.post('/usuarios', async (request, reply) => {
    const nome = request.body.nome;
    const senha = request.body.senha;
    
    if (!nome || !senha) {
    reply.status(400).send({ error : 'Nome ou senha Invalidos!'})
    }
    const resultado = await sql.query('INSERT INTO usuario (nome, senha) VALUES ($1, $2)',  [nome, senha]);
    reply.status(201).send({message: 'Usuario Cadastrado!'})
})

servidor.put('/usuarios/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id;

    if (!body.nome || !body.senha) {
        reply.status(400).send({ error : 'Nome ou senha Invalidos!'})
    } else if (!id) {
        reply.status(400).send({ error : 'Faltou o ID!'})
    }

    const existe = await sql.query('SELECT * FROM usuario WHERE id = $1', [id])
    if (existe.rows.length === 0) {
        reply.status(400).send({ error : 'Usuario Não Existe no Banco!'})
    }
    const resultado = await sql.query('UPDATE usuario SET nome = $1, senha = $2 WHERE id = $3', [body.nome, body.senha, id])
    return 'Usuario Alterado!';
})

servidor.delete('/usuarios/:id', async (request, reply) => {
    const id = request.params.id

        const existe = await sql.query('SELECT * FROM usuario WHERE id = $1', [id])
    if (existe.rows.length === 0) {
        reply.status(400).send({ error : 'Usuario Não Existe no Banco!'})
    }

    const resultado = await sql.query('DELETE FROM usuario WHERE id = $1', [id])
    reply.status(204)

})

servidor.listen({port: 3000})
