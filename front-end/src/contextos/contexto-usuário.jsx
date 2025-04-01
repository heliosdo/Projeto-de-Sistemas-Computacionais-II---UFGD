import { createContext, useState } from "react";

const ContextoUsuário = createContext();

export default ContextoUsuário;

export function ProvedorUsuário({ children }) {
  const [usuárioLogado, setUsuárioLogado] = useState({});
  const [confirmaçãoUsuário, setConfirmaçãoUsuário] = useState({});
  const [mostrarModalConfirmação, setMostrarModalConfirmação] = useState(false);
  const [cpfVerificado, setCpfVerificado] = useState(null);
  const [novaSenha, setNovaSenha] = useState({});
  const [tokenRecuperação, setTokenRecuperação] = useState(null)



  return (
    <ContextoUsuário.Provider
      value={{
        usuárioLogado,
        setUsuárioLogado,
        confirmaçãoUsuário,
        setConfirmaçãoUsuário,
        mostrarModalConfirmação,
        setMostrarModalConfirmação,
        cpfVerificado, 
        setCpfVerificado,
        novaSenha, 
        setNovaSenha,
        tokenRecuperação,
        setTokenRecuperação
      }}
    >
      {children}
    </ContextoUsuário.Provider>
  );
}
