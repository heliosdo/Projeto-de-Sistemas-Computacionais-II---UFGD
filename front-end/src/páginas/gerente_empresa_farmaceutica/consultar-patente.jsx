import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoGerenteEmpresaFarmacêutica from "../../contextos/contexto-gerente_empresa_farmaceutica";
import { estilizarBotãoRetornar, estilizarCard, estilizarDivCampo,
    estilizarDivider, estilizarFlex, estilizarInlineFlex, estilizarInputText, estilizarLabel }
    from "../../utilitários/estilos";

export default function ConsultarPatente() {
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { patenteConsultada, patenteInteresse } = useContext(ContextoGerenteEmpresaFarmacêutica);
    const dados = {
        pesquisador: patenteConsultada?.pesquisador?.usuário?.nome
            || patenteInteresse?.pesquisador?.usuário?.nome,
        numero: patenteConsultada?.numero || patenteInteresse?.numero,
        categoria: patenteConsultada?.categoria || patenteInteresse?.categoria,
        ano_concessao: patenteConsultada?.ano_concessao || patenteInteresse?.ano_concessao,
        paises_abrangidos: patenteConsultada?.paises_abrangidos || patenteInteresse?.paises_abrangidos,
        data_inicio: patenteConsultada?.data_inicio || patenteInteresse?.data_inicio };
    const navegar = useNavigate();

    function retornar() {
        if (patenteConsultada) navegar("../pesquisar-patentes");
        else if (patenteInteresse) navegar("../cadastrar-interesse");
    };

    return (
        <div className={estilizarFlex()}>
            <Card title="Consultar Patente" className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Pesquisador*:</label>
                    <InputText name="nome_pesquisador"
                        className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
                        value={dados.pesquisador} disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Número*:</label>
                    <InputText name="numero" className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
                        value={dados.numero} disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Categoria*:</label>
                    <InputText name="categoria"
                        className={estilizarInputText(null, 200, usuárioLogado.cor_tema)}
                        value={dados.categoria} disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Ano de Concessão*:</label>
                    <InputText name="ano_concessao"
                        className={estilizarInputText(null, 350, usuárioLogado.cor_tema)}
                        value={dados.ano_concessao} disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Países Abrangidos*:</label>
                    <InputText name="paises_abrangidos"
                        className={estilizarInputText(null, 200, usuárioLogado.cor_tema)}
                        value={dados.paises_abrangidos} disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Data de Início*:</label>
                    <InputText name="data_inicio" type="date" value={dados.data_inicio}
                        className={estilizarInputText(null, usuárioLogado.cor_tema)} disabled/>
                </div>
                
                <Divider className={estilizarDivider()}/>
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={retornar}/>
                </div>
            </Card>
        </div>
    );
}