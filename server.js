import Fastify  from "fastify";

const servidor = Fastify()

servidor.get("/usuarios", () => {
    return 'Esta Funcionando'
})
servidor.listen({port: 3000})