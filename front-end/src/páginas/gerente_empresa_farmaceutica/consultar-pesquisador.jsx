import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";

import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoGerenteEmpresaFarmacêutica from "../../contextos/contexto-gerente_empresa_farmaceutica";
import { estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider, estilizarFlex,
estilizarInlineFlex, estilizarInputText, estilizarLabel } from "../../utilitários/estilos";

export default function ConsultarPesquisador() {
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { pesquisadorProponente } = useContext(ContextoGerenteEmpresaFarmacêutica);
    const dados = { nome_pesquisador: pesquisadorProponente?.usuário?.nome,
        titulação: pesquisadorProponente?.titulação,
        anos_experiência_pesquisa: pesquisadorProponente?.anos_experiência_pesquisa };
    const navegar = useNavigate();

    function retornarConsultarPatente() { navegar("/consultar-patente"); };
    return (
        <div className={estilizarFlex()}>
            <Card title="Consultar Pesquisador" className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Pesquisador*:</label>
                    <InputText name="nome_pesquisador"
                        className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
                        value={dados.nome_pesquisador} disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Titulação*:</label>
                    <InputText name="titulação"
                        className={estilizarInputText(null, 150, usuárioLogado.cor_tema)}
                        value={dados.titulação} autoResize disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>
                        Anos de Experiência na Pesquisa*:</label>
                        <InputNumber name="anos_experiência_pesquisa" size={5}
                            value={dados.anos_experiência_pesquisa}
                            inputClassName={estilizarInputText(null, usuárioLogado.cor_tema)}
                            mode="decimal" min={1} disabled/>
                </div>
                <Divider className={estilizarDivider(dados.cor_tema)}/>
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                        onClick={retornarConsultarPatente}/>
                </div>
            </Card>
        </div>
    );
}