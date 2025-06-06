import request from "supertest";
import express from "express";
import RotasUsuario from "../rotas/rotas-usuario";
import * as ServiçosUsuário from "../serviços/serviços-usuário";

// ⬇️ Mocks dos middlewares corrigidos
jest.mock("../middlewares/verificar-token", () => ({
    __esModule: true,
    default: (req: any, res: any, next: any) => next(),
}));
jest.mock("../middlewares/verificar-erro-conteúdo-token", () => ({
    __esModule: true,
    default: (req: any, res: any, next: any) => next(),
}));

// Cria uma app só para teste das rotas
const app = express();
app.use(express.json());
app.use("/usuarios", RotasUsuario);

// Mocks dos serviços
jest.mock("../serviços/serviços-usuário");

describe("RotasUsuario", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("POST /usuarios/login deve chamar ServiçosUsuário.logarUsuário", async () => {
        (ServiçosUsuário.logarUsuário as jest.Mock).mockImplementation((req, res) =>
            res.status(200).json({ token: "abc" })
        );
        const res = await request(app).post("/usuarios/login").send({ cpf: "123", senha: "senha" });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(ServiçosUsuário.logarUsuário).toHaveBeenCalled();
    });

    it("POST /usuarios/verificar-cpf/:cpf deve chamar ServiçosUsuário.verificarCpfExistente", async () => {
        (ServiçosUsuário.verificarCpfExistente as jest.Mock).mockImplementation((req, res) =>
            res.status(200).json({ existe: true })
        );
        const res = await request(app).post("/usuarios/verificar-cpf/12345678900");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("existe", true);
        expect(ServiçosUsuário.verificarCpfExistente).toHaveBeenCalled();
    });

    it("PATCH /usuarios/alterar-usuario deve chamar ServiçosUsuário.alterarUsuário (com token)", async () => {
        (ServiçosUsuário.alterarUsuário as jest.Mock).mockImplementation((req, res) =>
            res.status(200).json({ ok: true })
        );
        const res = await request(app)
            .patch("/usuarios/alterar-usuario")
            .set("Authorization", "Bearer fakeToken")
            .send({ cpf: "123", nome: "Novo Nome" });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("ok", true);
        expect(ServiçosUsuário.alterarUsuário).toHaveBeenCalled();
    });

    it("DELETE /usuarios/:cpf deve chamar ServiçosUsuário.removerUsuário (com token e verificação de conteúdo do token)", async () => {
        (ServiçosUsuário.removerUsuário as jest.Mock).mockImplementation((req, res) =>
            res.status(200).json({ removido: true })
        );
        const res = await request(app)
            .delete("/usuarios/12345678900")
            .set("Authorization", "Bearer fakeToken");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("removido", true);
        expect(ServiçosUsuário.removerUsuário).toHaveBeenCalled();
    });

    it("GET /usuarios/questao/:cpf deve chamar ServiçosUsuário.buscarQuestãoSegurança", async () => {
        (ServiçosUsuário.buscarQuestãoSegurança as jest.Mock).mockImplementation((req, res) =>
            res.status(200).json({ questao: "Qual sua cor favorita?" })
        );
        const res = await request(app).get("/usuarios/questao/12345678900");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("questao");
        expect(ServiçosUsuário.buscarQuestãoSegurança).toHaveBeenCalled();
    });

    it("POST /usuarios/verificar-resposta deve chamar ServiçosUsuário.verificarRespostaCorreta", async () => {
        (ServiçosUsuário.verificarRespostaCorreta as jest.Mock).mockImplementation((req, res) =>
            res.status(200).json({ correta: true })
        );
        const res = await request(app).post("/usuarios/verificar-resposta").send({ cpf: "123", resposta: "azul" });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("correta", true);
        expect(ServiçosUsuário.verificarRespostaCorreta).toHaveBeenCalled();
    });
});
