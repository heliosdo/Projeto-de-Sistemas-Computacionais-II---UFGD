import { Router } from "express";

import verificarToken from "../middlewares/verificar-token";
import verificarPerfilPesquisador from "../middlewares/verificar-perfil-pesquisador";
import ServiçosPesquisador from "../serviços/serviços-pesquisador";

const RotasPesquisador = Router();
export default RotasPesquisador;

RotasPesquisador.post("/", ServiçosPesquisador.cadastrarPesquisador);
RotasPesquisador.get("/:cpf", verificarToken, verificarPerfilPesquisador,
  ServiçosPesquisador.buscarPesquisador);