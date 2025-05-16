import { createContext, useState } from "react";
const ContextoPesquisador = createContext();
export default ContextoPesquisador;
export function ProvedorPesquisador({ children }) {
const [patenteConsultada, setPatenteConsultada] = useState({});
return (
<ContextoPesquisador.Provider value={{ patenteConsultada, setPatenteConsultada
}}>{children}</ContextoPesquisador.Provider>
);
}