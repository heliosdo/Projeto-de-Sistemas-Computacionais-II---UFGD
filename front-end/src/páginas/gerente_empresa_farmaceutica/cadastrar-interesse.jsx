import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoGerenteEmpresaFarmacêutica from "../../contextos/contexto-gerente_empresa_farmaceutica";
import { serviçoCadastrarInteresse, serviçoRemoverInteresse } from "../../serviços/serviços-gerente_empresa_farmaceutica";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios }
    from "../../utilitários/validações";
import { estilizarBotão, estilizarBotãoRetornar, estilizarBotãoRemover, estilizarCard,
    estilizarDivCampo, estilizarDivider, estilizarFlex, estilizarInlineFlex,
    estilizarInputText, estilizarInputTextarea, estilizarLabel } from "../../utilitários/estilos";

export default function CadastrarInteresse() {

    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { interesseConsultado, patenteSelecionada } = useContext(ContextoGerenteEmpresaFarmacêutica);
    const [dados, setDados] = useState({ id_patente: patenteSelecionada?.id || "",
        justificativa: interesseConsultado?.justificativa || "" });
    const [erros, setErros] = useState({});
    const navegar = useNavigate();
    
    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        let valor = event.target.value || event.checked;
        setDados({ ...dados, [chave]: valor });
    };

    function validarCampos() {
        const { justificativa } = dados;
        let errosCamposObrigatórios = validarCamposObrigatórios({ justificativa });
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    };

    function patenteLabel() {
        if (interesseConsultado?.numero_patente || patenteSelecionada)
            return "Patente Selecionada*:";
        else return "Selecione uma Patente*:";
    };
    
    function pesquisarPatentes() { navegar("../pesquisar-patentes"); };
    
    function retornarAdministrarInteresses() { navegar("../administrar-interesses"); };
    
    async function cadastrarInteresse() {
        if (validarCampos()) {
            try {
                await serviçoCadastrarInteresse({ ...dados, cpf: usuárioLogado.cpf });
                mostrarToast(referênciaToast, "Interesse cadastrado com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
        }
    };

    async function removerInteresse() {
        try {
            await serviçoRemoverInteresse(interesseConsultado.id);
            mostrarToast(referênciaToast, "Interesse removido com sucesso!", "sucesso");
        } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
    };
    
    function BotõesAções() {
        if (interesseConsultado) {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                        onClick={retornarAdministrarInteresses}/>
                    <Button className={estilizarBotãoRemover()} label="Remover" onClick={removerInteresse}/>
                </div>
            );
        } else {
        return (
            <div className={estilizarInlineFlex()}>
                <Button className={estilizarBotãoRetornar()} label="Retornar"
                    onClick={retornarAdministrarInteresses}/>
                <Button className={estilizarBotão()} label="Cadastrar" onClick={cadastrarInteresse}/>
            </div>
        );
        }
    };

    function títuloFormulário() {
        if (interesseConsultado) return "Remover Interesse";
        else return "Cadastrar Interesse";
    };
    
    function PatenteInputText() {
        if (patenteSelecionada?.numero) {
            return <InputText name="numero_patente"
                className={estilizarInputText(erros.numero_patente, 400, usuárioLogado.cor_tema)}
                value={patenteSelecionada?.numero} disabled/>
        } else if (interesseConsultado?.patente?.numero) {
            return <InputText name="numero_patente"
                className={estilizarInputText(erros.numero_patente, 400, usuárioLogado.cor_tema)}
                value={interesseConsultado?.patente?.numero} disabled/>
        } else return null;
    };

    function BotãoSelecionar() {
        if (!patenteSelecionada && !interesseConsultado) {
            return <Button className={estilizarBotão()} label="Selecionar" onClick={pesquisarPatentes}/>
        } else if (patenteSelecionada) {
            return <Button className={estilizarBotão()} label="Substituir" onClick={pesquisarPatentes}/>;
        } else return null;
    };
    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} onHide={retornarAdministrarInteresses} position="bottom-center"/>
            <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>{patenteLabel()}</label>
                    <BotãoSelecionar/>
                    <PatenteInputText/>
                    <MostrarMensagemErro mensagem={erros.id}/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Justificativa*:</label>
                    <InputTextarea name="justificativa" value={dados.justificativa}
                        className={estilizarInputTextarea(erros.descrição, usuárioLogado.cor_tema)}
                        onChange={alterarEstado} autoResize cols={40}/>
                    <MostrarMensagemErro mensagem={erros.justificativa}/>
                </div>
                <Divider className={estilizarDivider()}/>
                <BotõesAções/>
            </Card>
        </div>
    );
}