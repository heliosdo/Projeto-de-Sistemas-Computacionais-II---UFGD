import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import UsuárioContext from "../contextos/contexto-usuário";

export default function RotasPesquisador() {
    const { usuárioLogado } = useContext(UsuárioContext);
    if (usuárioLogado.perfil === "pesquisador") return <Outlet/>
    else return <Navigate to="/"/>;
}