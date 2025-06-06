import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuárioLogado from "./rotas-usuário-logado";
import LogarUsuário from "../páginas/usuário/logar-usuário";
import CadastrarUsuário from "../páginas/usuário/cadastrar-usuário";
import PáginaInicial from "../páginas/usuário/página-inicial";
import CadastrarPesquisador from "../páginas/pesquisador/cadastrar-pesquisador";
import RecuperarAcesso from "../páginas/usuário/recuperar-acesso";
import CadastrarGerenteEmpresaFarmacêutica from "../páginas/gerente_empresa_farmaceutica/cadastrar-gerente_empresa_farmaceutica";

import { ProvedorPesquisador } from "../contextos/contexto-pesquisador";
import { ProvedorGerenteEmpresaFarmacêutica } from "../contextos/contexto-gerente_empresa_farmaceutica";
import RotasPesquisador from "./rotas-pesquisador"
import RotasGerenteEmpresaFarmacêutica from "./rotas-gerente_empresa_farmaceutica"
import AdministrarPatentes from "../páginas/pesquisador/administrar-patentes";
import CadastrarPatente from "../páginas/pesquisador/cadastrar-patente";
import AdministrarInteresses from "../páginas/gerente_empresa_farmaceutica/administrar-interesses";
import CadastrarInteresse from "../páginas/gerente_empresa_farmaceutica/cadastrar-interesse";
import PesquisarPatentes from '../páginas/gerente_empresa_farmaceutica/pesquisar-patentes';
import ConsultarPatente from "../páginas/gerente_empresa_farmaceutica/consultar-patente";

import PesquisarInteresses from "../páginas/pesquisador/pesquisar-interesses";
import ConsultarInteresse from "../páginas/pesquisador/consultar-interesse";
import ConsultarGerenteEmpresaFarmacêutica from "../páginas/pesquisador/consultar-gerente_empresa_farmaceutica";
import ConsultarPesquisador from "../páginas/gerente_empresa_farmaceutica/consultar-pesquisador";


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
          
          <Route element={<ProvedorPesquisador><RotasPesquisador/></ProvedorPesquisador>}>
          <Route element={<CadastrarPesquisador/>} path="cadastrar-pesquisador"/>
          <Route element={<AdministrarPatentes/>} path="administrar-patentes"/>
          <Route element={<CadastrarPatente/>} path="cadastrar-patente"/>
          <Route element={<PesquisarInteresses/>} path="pesquisar-interesses"/>
          <Route element={<ConsultarInteresse/>} path="consultar-interesse"/>
          <Route element={<ConsultarGerenteEmpresaFarmacêutica/>} path="consultar-gerente_empresa_farmaceutica"/>
          </Route>
          <Route element={<ProvedorGerenteEmpresaFarmacêutica><RotasGerenteEmpresaFarmacêutica/></ProvedorGerenteEmpresaFarmacêutica>}>
          <Route element={<CadastrarGerenteEmpresaFarmacêutica/>} path="cadastrar-gerente_empresa_farmaceutica"/>
          <Route element={<AdministrarInteresses/>} path="administrar-interesses"/>
          <Route element={<CadastrarInteresse/>} path="cadastrar-interesse"/>
          <Route element={<PesquisarPatentes/>} path="pesquisar-patentes"/>
          <Route element={<ConsultarPatente/>} path="consultar-patente"/>
          <Route element={<ConsultarPesquisador/>} path="consultar-pesquisador"/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
