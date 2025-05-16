import { Router } from "express";

import verificarToken from "../middlewares/verificar-token";
import verificarPerfilPesquisador from "../middlewares/verificar-perfil-pesquisador";
import ServiçosPesquisador from "../serviços/serviços-pesquisador";
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token";

const RotasPesquisador = Router();
export default RotasPesquisador;

RotasPesquisador.patch(
  "/", 
  verificarToken, 
  verificarPerfilPesquisador,
  ServiçosPesquisador.atualizarPesquisador
);
  
RotasPesquisador.post("/", ServiçosPesquisador.cadastrarPesquisador);
RotasPesquisador.get(
  "/:cpf",
  verificarToken,
  verificarPerfilPesquisador,
  ServiçosPesquisador.buscarPesquisador
);

RotasPesquisador.post("/patentes", verificarToken, verificarPerfilPesquisador,
  ServiçosPesquisador.cadastrarPatente
);

RotasPesquisador.patch("/patentes", verificarToken, verificarPerfilPesquisador,
  ServiçosPesquisador.alterarPatente
);

RotasPesquisador.delete("/patentes/:id", verificarToken, verificarPerfilPesquisador,
  ServiçosPesquisador.removerPatente
);

RotasPesquisador.get("/patentes/pesquisador/:cpf", verificarToken, verificarPerfilPesquisador,
  verificarErroConteúdoToken, ServiçosPesquisador.buscarPatentesPesquisador
);

RotasPesquisador.get("/patentes/areas", verificarToken, verificarPerfilPesquisador,
  ServiçosPesquisador.buscarPaisesAbrangidosPatentes
);