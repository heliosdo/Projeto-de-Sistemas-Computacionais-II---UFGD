import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import ServiçosUsuário from "./serviços-usuário";
import Pesquisador from "../entidades/pesquisador";
import Patente from "../entidades/patente";


export default class ServiçosPesquisador {
  constructor() {}

  static async cadastrarPesquisador(request, response) {
    try {
      const { usuário_info, titulação, anos_experiência_pesquisa } =
        request.body;
      const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(
        usuário_info
      );
      const entityManager = getManager();
      await entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(usuário);
        const pesquisador = Pesquisador.create({
          usuário,
          titulação,
          anos_experiência_pesquisa,
        });
        await transactionManager.save(pesquisador);
        await transactionManager.update(Usuário, usuário.cpf, {
          status: Status.ATIVO,
        });
        return response.json({ status: Status.ATIVO, token });
      });
    } catch (error) {
      return response.status(500).json({ erro: error });
    }
  }
  static async buscarPesquisador(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const pesquisador = await Pesquisador.findOne({
        where: { usuário: cpf_encriptado },
        relations: ["usuário"],
      });
  
      if (!pesquisador)
        return response.status(404).json({ erro: "Pesquisador não encontrado." });
      return response.json({
        nome: pesquisador.usuário.nome,
        email: pesquisador.usuário.email,
        titulação: pesquisador.titulação,
        anos_experiência_pesquisa: pesquisador.anos_experiência_pesquisa,
      });
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD: buscarPesquisador" });
    }
  }

  static async atualizarPesquisador(request, response) {
    try {
        const { cpf, titulação, anos_experiência_pesquisa } = request.body;
        const cpf_encriptado = md5(cpf);
        
        await Pesquisador.update(
            { usuário: { cpf: cpf_encriptado } },
            { titulação, anos_experiência_pesquisa }
        );
        
        return response.json();
    } catch (error) {
        return response.status(500).json({ erro: "Erro BD: atualizarPesquisador" });
    }
}

static async cadastrarPatente (request, response) {
  try {
    const {numero, categoria, ano_concessao, paises_abrangidos, data_inicio,
      cpf} = request.body;
    const cpf_encriptado = md5(cpf);
    const pesquisador = await Pesquisador.findOne({ 
      where: { usuário: cpf_encriptado },
      relations: ["usuário" ] 
    });
    await Patente.create({
      numero, categoria, ano_concessao, paises_abrangidos, data_inicio,
      pesquisador}).save();
    return response.json();
    } catch (error) { return response.status(500)
      .json({ erro: "Erro BD: cadastrarPatente" }); 
    }
  }


  static async alterarPatente(request, response) {
    try {
      const {id, numero, categoria, ano_concessao, paises_abrangidos, data_inicio} = request.body;
    await Patente.update(id, {numero, categoria, ano_concessao, paises_abrangidos, data_inicio});
    return response.json();
    } catch (error) { 
      return response.status(500).json({ erro: "Erro BD: alterarPatente" }); 
    }
  }
  
  static async removerPatente(request, response) {
    try {
      const id_patente = request.params.id;
      const patente = await Patente.findOne(id_patente);
    await Patente.remove(patente);
    return response.json();
    } catch (error) { 
      return response.status(500).json({ erro: "Erro BD: removerPatente" }); 
    }
  }
  
  static async buscarPatentesPesquisador(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const patentes = await Patente.find({ 
        where: { pesquisador: { usuário: cpf_encriptado } },
        relations: ["pesquisador", "pesquisador.usuário"], 
      });
    return response.json(patentes);
    } catch (error) { return response.status(500)
      .json ({ erro: "Erro BD: buscarPatentesPesquisador" }); 
    }
  }
  
  static filtrarPaisesAbrangidosEliminandoRepetição(patentes: Patente[]) {
    let paises_abrangidos: { label: string, value: string }[];
      paises_abrangidos = patentes
      .filter(
        (patente, índice, patentes_antes_filtrar) =>
            patentes_antes_filtrar.findIndex
              (patente_anterior => patente_anterior.paises_abrangidos === patente.paises_abrangidos) === índice)
    .map(patente => ({ 
      label: patente.paises_abrangidos, value: patente.paises_abrangidos,
    }));
    return paises_abrangidos;
  }
  
  static async buscarPaisesAbrangidosPatentes(request, response) {
    try {
      const patentes = await Patente.find();
      const paises_abrangidos = 
        ServiçosPesquisador.filtrarPaisesAbrangidosEliminandoRepetição(patentes);
    return response.json(paises_abrangidos.sort());
    } catch (error) { 
      return response.status(500)
      .json ({ erro: "Erro BD: buscarPaisesAbrangidosPatentes" }); 
    }
  }
}