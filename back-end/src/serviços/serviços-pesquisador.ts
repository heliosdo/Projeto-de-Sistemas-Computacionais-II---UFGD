import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import ServiçosUsuário from "./serviços-usuário";
import Pesquisador from "../entidades/pesquisador";

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
    await Pesquisador.update({ usuário: { cpf: cpf_encriptado } },
    { titulação, anos_experiência_pesquisa });
    return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD : atualizarPesquisador" }); }
    };
}
