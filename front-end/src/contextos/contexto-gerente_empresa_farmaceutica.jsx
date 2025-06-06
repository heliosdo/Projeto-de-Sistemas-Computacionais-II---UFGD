import { createContext, useState } from "react";

const ContextoGerenteEmpresaFarmacêutica = createContext();
export default ContextoGerenteEmpresaFarmacêutica;

export function ProvedorGerenteEmpresaFarmacêutica({ children }) {
    const [interesseConsultado, setInteresseConsultado] = useState({});
    const [patenteConsultada, setPatenteConsultada] = useState({});
    const [patenteSelecionada, setPatenteSelecionada] = useState({});
    const [patenteInteresse, setPatenteInteresse] = useState({});
    const [pesquisadorProponente, setPesquisadorProponente] = useState({});
    return (
        <ContextoGerenteEmpresaFarmacêutica.Provider value={{
        interesseConsultado, setInteresseConsultado, patenteConsultada, setPatenteConsultada,
        patenteSelecionada, setPatenteSelecionada, patenteInteresse, setPatenteInteresse,
        pesquisadorProponente, setPesquisadorProponente
        }}>{children}</ContextoGerenteEmpresaFarmacêutica.Provider>
    );
}