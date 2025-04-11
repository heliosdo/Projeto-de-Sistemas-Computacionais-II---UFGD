import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuárioLogado from "./rotas-usuário-logado";
import LogarUsuário from "../páginas/usuário/logar-usuário";
import CadastrarUsuário from "../páginas/usuário/cadastrar-usuário";
import PáginaInicial from "../páginas/usuário/página-inicial";
import CadastrarPesquisador from "../páginas/pesquisador/cadastrar-pesquisador";
import RecuperarAcesso from "../páginas/usuário/recuperar-acesso";
import CadastrarGerenteEmpresaFarmacêutica from "../páginas/gerente_empresa_farmaceutica/cadastrar-gerente_empresa_farmaceutica";

export default function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LogarUsuário />} path="/" />
        <Route element={<CadastrarUsuário />} path="criar-usuario" />
        <Route element={<RecuperarAcesso/>} path="recuperar-acesso"/>

        <Route element={<RotasUsuárioLogado />}>
          <Route element={<PáginaInicial />} path="pagina-inicial" />
          <Route element={<CadastrarUsuário />} path="atualizar-usuario" />
          <Route element={<CadastrarPesquisador />} path="cadastrar-pesquisador" />
          <Route element={<CadastrarGerenteEmpresaFarmacêutica />} path="cadastrar-gerente_empresa_farmaceutica"
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
