import { createContext, useState } from "react";
const ContextoPesquisador = createContext();
export default ContextoPesquisador;
export function ProvedorPesquisador({ children }) {
const [patenteConsultada, setPatenteConsultada] = useState({});
const [interesseConsultado, setInteresseConsultado] = useState(null);
const [gerente_empresa_farmaceuticaInteressado, setGerenteEmpresaFarmacêuticaInteressado] = useState(null);

return (
<ContextoPesquisador.Provider value={{ patenteConsultada, setPatenteConsultada, interesseConsultado, setInteresseConsultado, gerente_empresa_farmaceuticaInteressado, setGerenteEmpresaFarmacêuticaInteressado
}}>{children}</ContextoPesquisador.Provider>
);
}