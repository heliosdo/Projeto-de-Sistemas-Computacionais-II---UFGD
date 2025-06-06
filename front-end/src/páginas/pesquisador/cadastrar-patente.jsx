import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";

import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoPesquisador from "../../contextos/contexto-pesquisador";
import { serviçoAlterarPatente, serviçoCadastrarPatente, serviçoRemoverPatente } from "../../serviços/serviços-pesquisador";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios } from "../../utilitários/validações";

import { estilizarBotão, estilizarBotãoRemover, estilizarBotãoRetornar, estilizarCard, estilizarCheckbox,
    estilizarDivCampo, estilizarDivider, estilizarDropdown, estilizarFlex,
    estilizarInlineFlex, estilizarInputText, estilizarLabel } from "../../utilitários/estilos";


    const OPÇÕES_PAISES_ABRANGIDOS = [
        { label: "África", value: "África" },
        { label: "América do Norte", value: "América do Norte" },
        { label: "América do Sul", value: "América do Sul" },
        { label: "Antártida", value: "Antártida" },
        { label: "Ásia", value: "Ásia" },
        { label: "Europa", value: "Europa" },
        { label: "Oceania", value: "Oceania" },
        { label: "Vários países", value: "Vários países" }
    ];

export default function CadastrarPatente() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { patenteConsultada } = useContext(ContextoPesquisador);
    const [dados, setDados] = useState({ 
        numero: patenteConsultada?.numero || "",
        categoria: patenteConsultada?.categoria || "",
        ano_concessao: patenteConsultada?.ano_concessao || "",
        paises_abrangidos: patenteConsultada?.paises_abrangidos || "",
        data_inicio: patenteConsultada?.data_inicio || "",
        exclusividade_mercado: patenteConsultada?.exclusividade_mercado || "",
    });
    
    
    const [erros, setErros] = useState({});
    const navegar = useNavigate();

    const opçõesCategoria = [
        { label: "Produto", value: "Produto" },
        { label: "Processo", value: "Processo" },
        { label: "Formulação", value: "Formulação" },
        { label: "Combinação", value: "Combinação" },
        { label: "Biotecnologia", value: "Biotecnologia" }
    ];

    function alterarEstado(event) {
        const { name, value, checked, type } = event.target;
        const valor = type === 'checkbox' ? checked : value;
        setDados(prev => ({ ...prev, [name]: valor }));
    };

    function validarCampos() {
        const errosCamposObrigatórios = validarCamposObrigatórios(dados);
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    };

    function retornarAdministrarPatentes() { navegar("../administrar-patentes"); };
    function mostrarInteresses() { navegar("../pesquisar-interesses"); };

    async function cadastrarPatente() {
        if (validarCampos()) {
            try {
                await serviçoCadastrarPatente({ ...dados, cpf: usuárioLogado.cpf });
                mostrarToast(referênciaToast, "Patente cadastrada com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        }
    };


    async function alterarPatente() {
        if (validarCampos()) {
        try {
        await serviçoAlterarPatente({ ...dados, id: patenteConsultada.id });
        mostrarToast(referênciaToast, "Patente alterada com sucesso!", "sucesso");
        } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        }
};
    
    async function removerPatente() {
        try {
            await serviçoRemoverPatente(patenteConsultada.id);
            mostrarToast(
                referênciaToast, 
                "Patente excluída com sucesso!", 
                "sucesso"
            );
        } catch (error) { 
            mostrarToast(referênciaToast, error.response.data.erro, "error");
        }
    };

    function BotõesAções() {
    if (patenteConsultada) {
        return (
            <div className={estilizarInlineFlex()}>
                <Button className={estilizarBotãoRetornar()} label="Retornar"
                    onClick={retornarAdministrarPatentes}/>
                <Button className={estilizarBotãoRemover()} label="Remover" onClick={removerPatente}/>
                <Button className={estilizarBotão()} label="Alterar" onClick={alterarPatente}/>
                <Button className={estilizarBotão()} label="Interesses" onClick={mostrarInteresses}/>
            </div>
        );
    } else {
        return (
            <div className={estilizarInlineFlex()}>
                <Button className={estilizarBotãoRetornar()} label="Retornar"
                    onClick={retornarAdministrarPatentes}/>
                <Button className={estilizarBotão()} label="Cadastrar" onClick={cadastrarPatente}/>
            </div>
            );
        }
    };

        function títuloFormulário() {
            if (patenteConsultada) return "Alterar Patente";
            else return "Cadastrar Patente";
        };

        return (
            <div className={estilizarFlex()}>
                <Toast ref={referênciaToast} position="bottom-center"/>
                <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
                    <div className={estilizarDivCampo()}>
                        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Número*:</label>
                        <InputText name="numero"
                            className={estilizarInputText(erros.numero, 400, usuárioLogado.cor_tema)}
                            value={dados.numero} onChange={alterarEstado}/>
                        <MostrarMensagemErro mensagem={erros.numero}/>
                    </div>
                    
                    <div className={estilizarDivCampo()}>
                        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Categoria*:</label>
                        <Dropdown name="categoria"
                            className={estilizarDropdown(erros.categoria, usuárioLogado.cor_tema)}
                            value={dados.categoria} options={opçõesCategoria} onChange={alterarEstado}
                            placeholder="-- Selecione --"/>
                        <MostrarMensagemErro mensagem={erros.categoria}/>
                    </div>
                    
                    <div className={estilizarDivCampo()}>
                        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Ano de Concessão*:</label>
                        <InputText name="ano_concessao"
                            className={estilizarInputText(erros.ano_concessao, 400, usuárioLogado.cor_tema)}
                            value={dados.ano_concessao} onChange={alterarEstado}/>
                        <MostrarMensagemErro mensagem={erros.ano_concessao}/>
                    </div>
                    
                    <div className={estilizarDivCampo()}>
                        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Países Abrangidos*:</label>
                        <Dropdown name="paises_abrangidos" 
                            className={estilizarDropdown(erros.paises_abrangidos, usuárioLogado.cor_tema)}
                            value={dados.paises_abrangidos} options={OPÇÕES_PAISES_ABRANGIDOS}
                            onChange={alterarEstado} placeholder="-- Selecione --" showClear filter
                            emptyMessage="Nenhum país abrangido cadastrado."/>
                        <MostrarMensagemErro mensagem={erros.paises_abrangidos}/>
                    </div>
                    
                    <div className={estilizarDivCampo()}>
                        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Data de Início*:</label>
                        <InputText name="data_inicio" type="date" 
                            className={estilizarInputText(erros.data_inicio, 400, usuárioLogado.cor_tema)}
                            value={dados.data_inicio} onChange={alterarEstado}/>
                        <MostrarMensagemErro mensagem={erros.data_inicio}/>
                    </div>
                    <div className={estilizarDivCampo()}>
                        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Exclusividade no Mercado*:</label>
                        <Checkbox name="exclusividade_mercado" checked={dados.exclusividade_mercado}
                        className={estilizarCheckbox()} onChange={alterarEstado} autoResize/>
                    </div>
                    <Divider className={estilizarDivider()}/>
                    <BotõesAções/>
                </Card>
            </div>
        );
    }