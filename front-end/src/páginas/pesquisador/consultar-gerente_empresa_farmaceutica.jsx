import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoPesquisador from "../../contextos/contexto-pesquisador";
import { ANO_MÁSCARA, TELEFONE_MÁSCARA } from "../../utilitários/máscaras";
import {TAMANHOS, estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider,
estilizarFlex, estilizarInlineFlex, estilizarInputMask, estilizarInputText, estilizarLabel }
from "../../utilitários/estilos";

export default function ConsultarGerenteEmpresaFarmacêutica() {
const { usuárioLogado } = useContext(ContextoUsuário);
const { gerente_empresa_farmaceuticaInteressado } = useContext(ContextoPesquisador);
const dados = { nome: gerente_empresa_farmaceuticaInteressado?.usuário?.nome,
ano_ingresso: gerente_empresa_farmaceuticaInteressado?.ano_ingresso,
data_nascimento: gerente_empresa_farmaceuticaInteressado?.data_nascimento,
telefone: gerente_empresa_farmaceuticaInteressado?.telefone };
const navegar = useNavigate();

function retornarConsultarInteresse() { navegar("../consultar-interesse"); };
    return (
    <div className={estilizarFlex()}>
        <Card title="Consultar Gerente" className={estilizarCard(usuárioLogado.cor_tema)}>
    <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Nome*:</label>
            <InputText name="nome" className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
                value={dados.nome} disabled/>
    </div>
    <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Ano de Ingresso*:</label>
            <InputMask name="ano_ingresso" autoClear size={TAMANHOS.ANO} mask={ANO_MÁSCARA}
                value={dados.ano_ingresso}
                className={estilizarInputMask(null, usuárioLogado.cor_tema)} disabled/>
    </div>
    <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Data de Nascimento*:</label>
            <InputText name="data_nascimento" type="date" value={dados.data_nascimento}
                className={estilizarInputText(null, usuárioLogado.cor_tema)} disabled/>
    </div>
    <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(dados.cor_tema)}>Telefone*:</label>
            <InputMask name="telefone" autoClear size={TAMANHOS.TELEFONE} mask={TELEFONE_MÁSCARA}
            className={estilizarInputMask(null, dados.cor_tema)} value={dados.telefone} disabled/>
    </div>
        <Divider className={estilizarDivider(dados.cor_tema)}/>
    <div className={estilizarInlineFlex()}>
        <Button className={estilizarBotãoRetornar()} label="Retornar"
            onClick={retornarConsultarInteresse}/>
    </div>
    </Card>
    </div>
    );
};