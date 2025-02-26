import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown} from "primereact/dropdown";

import ContextoUsuário from "../../contextos/contexto-usuário";
import {
  serviçoCadastrarPesquisador,
  serviçoBuscarPesquisador,
} from "../../serviços/serviços-pesquisador";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios,
} from "../../utilitários/validações";

import {
  estilizarBotão,
  estilizarBotãoRetornar,
  estilizarCard,
  estilizarDivCampo,
  estilizarDivider,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputNumber,
  estilizarLabel,
  estilizarInputText,
} from "../../utilitários/estilos";

export default function CadastrarPesquisador() {
  
  const referênciaToast = useRef(null);
  const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
  const [dados, setDados] = useState({
    cnpj: "", // Adicionado campo CNPJ
    titulação: "",
    anos_experiência_pesquisa: "",
  });
  const [erros, setErros] = useState({});
  const [cpfExistente, setCpfExistente] = useState(false);
  const navegar = useNavigate();

  const opçõesTitulação = [
    { label: "Mestrado", value: "mestrado" },
    { label: "Doutorado", value: "doutorado" },
  ];

  function alterarEstado(event) {
    const { name, value } = event.target;
    setDados((prevDados) => ({ ...prevDados, [name]: value }));
  }

  function validarCampos() {
    let errosCamposObrigatórios = validarCamposObrigatórios(dados);
    setErros(errosCamposObrigatórios);
    return checarListaVazia(errosCamposObrigatórios);
  }

  async function cadastrarPesquisador() {
    if (validarCampos()) {
      try {
        const response = await serviçoCadastrarPesquisador({
          ...dados,
          usuário_info: usuárioLogado,
        });

        if (response.data)
          setUsuárioLogado((usuário) => ({
            ...usuário,
            status: response.data.status,
            token: response.data.token,
          }));

        mostrarToast(
          referênciaToast,
          "Pesquisador cadastrado com sucesso!",
          "sucesso"
        );
      } catch (error) {
        setCpfExistente(true);
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  }

  function redirecionar() {
    if (cpfExistente) {
      setUsuárioLogado(null);
      navegar("/criar-usuario");
    } else {
      setUsuárioLogado((usuárioLogado) => ({
        ...usuárioLogado,
        cadastrado: true,
      }));
      navegar("/pagina-inicial");
    }
  }

  useEffect(() => {
    let desmontado = false;
    async function buscarDadosPesquisador() {
      try {
        const response = await serviçoBuscarPesquisador(usuárioLogado.cpf);
        if (!desmontado && response.data) {
          setDados({
            cnpj: response.data.cnpj || "",
            titulação: response.data.titulação || "",
            anos_experiência_pesquisa: response.data.anos_experiência_pesquisa || "",
          });
        }
      } catch (error) {
        const erro = error.response?.data?.erro;
        if (erro) mostrarToast(referênciaToast, erro, "erro");
      }
    }

    if (usuárioLogado?.cadastrado) buscarDadosPesquisador();
    return () => (desmontado = true);
  }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);

  return (
    <div className={estilizarFlex()}>
      <Toast
        ref={referênciaToast}
        onHide={redirecionar}
        position="bottom-center"
      />
      <Card
        title={usuárioLogado?.cadastrado ? "Consultar Pesquisador" : "Cadastrar Pesquisador"}
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Titulação*:</label>
          <Dropdown
            name="titulação"
            className={estilizarInputText(erros.titulação, usuárioLogado.cor_tema)}
            value={dados.titulação}
            options={opçõesTitulação}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
          />
          <MostrarMensagemErro mensagem={erros.titulação} />
        </div>

        {}
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>CNPJ*:</label>
          <InputText
            name="cnpj"
            className={estilizarInputText(erros.cnpj, usuárioLogado.cor_tema)}
            value={dados.cnpj}
            onChange={alterarEstado}
            placeholder="Digite o CNPJ"
          />
          <MostrarMensagemErro mensagem={erros.cnpj} />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Anos de Experiência de Pesquisa*:</label>
          <InputNumber
            name="anos_experiência_pesquisa"
            size={5}
            value={dados.anos_experiência_pesquisa}
            onValueChange={alterarEstado}
            mode="decimal"
            inputClassName={estilizarInputNumber(erros.anos_experiência_pesquisa, usuárioLogado.cor_tema)}
          />
          <MostrarMensagemErro mensagem={erros.anos_experiência_pesquisa} />
        </div>

        <Divider className={estilizarDivider(usuárioLogado.cor_tema)} />
        <div className={estilizarInlineFlex()}>
          <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={redirecionar} />
          <Button className={estilizarBotão()} label={usuárioLogado?.cadastrado ? "Consultar" : "Cadastrar"} onClick={cadastrarPesquisador} />
        </div>
      </Card>
    </div>
  );
}

