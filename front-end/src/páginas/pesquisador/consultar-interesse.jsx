import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoPesquisador from "../../contextos/contexto-pesquisador";
import { estilizarBotão, estilizarBotãoRetornar, estilizarCard,
estilizarDivCampo, estilizarDivider, estilizarFlex, estilizarInlineFlex, estilizarInputText,
estilizarLabel } from "../../utilitários/estilos";
export default function ConsultarInteresse() {

    const { usuárioLogado } = useContext(ContextoUsuário);
    const { interesseConsultado, setGerenteEmpresaFarmacêuticaInteressado } = useContext(ContextoPesquisador);
    const dados = { nome_gerente_empresa_farmaceutica: interesseConsultado?.gerente_empresa_farmaceutica?.usuário?.nome,
        justificativa: interesseConsultado?.justificativa,
        numero_patente: interesseConsultado?.patente.numero };
    const navegar = useNavigate();

    function retornarPesquisarInteresses() { navegar("../pesquisar-interesses"); };
        function consultarGerenteEmpresaFarmacêuticaInteressado() {
        setGerenteEmpresaFarmacêuticaInteressado(interesseConsultado.gerente_empresa_farmaceutica);
        navegar("../consultar-gerente_empresa_farmaceutica");
        };
    
        return (
        <div className={estilizarFlex()}>
            <Card title="Consultar Interesse" className={estilizarCard(usuárioLogado.cor_tema)}>
        <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Gerente*:</label>
            <InputText name="nome_gerente_empresa_farmaceutica"
                className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
                value={dados.nome_gerente_empresa_farmaceutica} disabled/>
        </div>
        <div className={estilizarDivCampo()}>
            <label className={estilizarLabel(usuárioLogado.cor_tema)}>Justificativa*:</label>
                <InputTextarea name="justificativa"
                className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
                value={dados.justificativa} disabled/>
        </div>
        <div className={estilizarDivCampo()}>
            <label className={estilizarLabel(usuárioLogado.cor_tema)}>Patente*</label>
            <InputText name="numero_patente"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.numero_patente} disabled/>
        </div>
            <Divider className={estilizarDivider()}/>
        <div className={estilizarInlineFlex()}>
            <Button className={estilizarBotãoRetornar()} label="Retornar"
            onClick={retornarPesquisarInteresses}/>
            <Button className={estilizarBotão()} label="Gerente" onClick={consultarGerenteEmpresaFarmacêuticaInteressado}/>
        </div>
            </Card>
        </div>
    );
}