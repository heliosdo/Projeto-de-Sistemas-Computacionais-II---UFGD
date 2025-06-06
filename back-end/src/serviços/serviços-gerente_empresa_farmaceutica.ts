import md5 from "md5";
import { getManager } from "typeorm";
import { Request, Response } from "express";
import Usuário, { Status } from "../entidades/usuário";
import GerenteEmpresaFarmacêutica from '../entidades/gerente_empresa_farmaceutica';
import ServiçosUsuário from "./serviços-usuário";
import Patente from "../entidades/patente";
import Interesse from "../entidades/interesse";

export default class ServiçosGerenteEmpresaFarmacêutica {
    constructor() {}

    static async cadastrarGerenteEmpresaFarmacêutica(request, response) {
        try {
            const { usuário_info, ano_ingresso, data_nascimento, telefone } = request.body;
            const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(usuário_info);
            const entityManager = getManager();
            await entityManager.transaction(async (transactionManager) => {
                await transactionManager.save(usuário);
                const gerente_empresa_farmaceutica = GerenteEmpresaFarmacêutica.create({ usuário, ano_ingresso, data_nascimento, telefone });
                await transactionManager.save(gerente_empresa_farmaceutica);
                await transactionManager.update(Usuário, usuário.cpf, { status: Status.ATIVO });
                return response.json({ status: Status.ATIVO, token });
            });
        } catch (error) { return response.status(500).json({ erro: error }); }
    }

static async atualizarGerenteEmpresaFarmacêutica(request, response) {
    try {
        const { cpf, ano_ingresso, data_nascimento, telefone } = request.body;
        const cpf_encriptado = md5(cpf);
        await GerenteEmpresaFarmacêutica.update({ usuário: { cpf: cpf_encriptado } }, { ano_ingresso,
            data_nascimento, telefone });
        return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD: atualizarGerenteEmpresaFarmacêutica" }); }
}

static async buscarGerenteEmpresaFarmacêutica(request, response) {
    try {
        const cpf_encriptado = md5(request.params.cpf);
        const gerente_empresa_farmaceutica = await GerenteEmpresaFarmacêutica.findOne({ where: { usuário: cpf_encriptado },
            relations: ["usuário"] });
        if (!gerente_empresa_farmaceutica) return response.status(404).json({ erro: "Gerente não encontrado." });
        return response.json({ nome: gerente_empresa_farmaceutica.usuário.nome, email: gerente_empresa_farmaceutica.usuário.email,
            ano_ingresso: gerente_empresa_farmaceutica.ano_ingresso,
            data_nascimento: gerente_empresa_farmaceutica.data_nascimento, telefone: gerente_empresa_farmaceutica.telefone });
        } catch (error) { return response.status(500).json({ erro: "Erro BD: buscarGerenteEmpresaFarmacêutica" }); }
    }

static async cadastrarInteresse(request, response) {
    try {
        const { id_patente, exclusividade_mercado, justificativa, cpf } = request.body;
        const cpf_encriptado = md5(cpf);
        const gerente_empresa_farmaceutica = await GerenteEmpresaFarmacêutica.findOne({ where: { usuário: cpf_encriptado } });
        const patente = await Patente.findOne(id_patente);
        const interesses = await Interesse.find({ where: { gerente_empresa_farmaceutica, patente }});
        if (interesses.length > 0) return response.status(404).json
            ({ erro: "O gerente já cadastrou interesse para a patente." });
        await Interesse.create({ justificativa, gerente_empresa_farmaceutica, patente }).save();
        return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD: cadastrarInteresse" }); }
}

static async removerInteresse(request, response) {
    try {
    const id = request.params.id;
    await Interesse.delete(id);
    return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD: removerInteresse" }); }
}
    
static async buscarInteressesGerenteEmpresaFarmacêutica(request: Request, response: Response) {
    try {
        const cpf_encriptado = md5(request.params.cpf);
        const interesses = await Interesse.find({ 
            where: { gerente_empresa_farmaceutica: { usuário: cpf_encriptado } },
            relations: [
                "gerente_empresa_farmaceutica", 
                "gerente_empresa_farmaceutica.usuário", 
                "patente", 
                "patente.pesquisador",
                "patente.pesquisador.usuário"
            ] 
        });
        return response.json(interesses);
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return response.status(401).json({ erro: "Token expirado" });
        }
        return response.status(500).json({ 
            erro: "Erro BD: buscarInteressesGerenteEmpresaFarmacêutica",
            detalhes: error.message 
        });
    }
}

static async buscarPatentes(request, response) {
    try {
    const patentes = await Patente.find({ relations: ["pesquisador", "pesquisador.usuário"] });
    return response.json(patentes);
    } catch (error) { return response.status(500).json({ erro: "Erro BD: buscarPatentes" }); }
    };

}