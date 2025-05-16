import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UsuárioContext from "../contextos/contexto-usuário";
export default function RotasGerenteEmpresaFarmacêutica() {
const { usuárioLogado } = useContext(UsuárioContext);
if (usuárioLogado.perfil === "gerente_empresa_farmaceutica") return <Outlet/>
else return <Navigate to="/"/>;
}