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
    const resultado = await sql.query('INSERT INTO usuario (nome, senha) VALUES ($1, $2)',  [nome, senha]);
    return 'Usuario Cadastrado'
})

servidor.put('/usuarios/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id;
    const resultado = await sql.query('UPDATE usuario SET nome = $1, senha = $2 WHERE id = $3', [body.nome, body.senha, id])
    return 'Usuario Alterado!';
})

servidor.listen({port: 3000})
