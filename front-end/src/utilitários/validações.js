import { estilizarErro } from "./estilos";

const ERRO_CAMPO_OBRIGATÓRIO = "Campo obrigatório não preenchido";
const ERRO_CONFIRMAÇÃO_SENHA = "Senha não confere";
const ERRO_FORMATO_INVÁLIDO = "Campo com formato inválido";
const ERRO_QUESTÃO = "Resposta sem questão";
const ERRO_CPF = "CPF inválido";
const ERRO_CPF_VAZIO = "Campo CPF vazio"; 

export function validarCpf(cpf) {
  cpf = cpf.replace(/[^\d]+/g, ''); // Tira tudo que não for número
  
  if (cpf.length !== 11) return false;

  // Impede CPFs com todos os dígitos iguais (tipo 111.111.111-11)
  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  // Calcula o primeiro dígito
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  // Calcula o segundo dígito
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

export function validarCampoCpf(cpf) {
  let erroCpf = {};

  if (!cpf || cpf.trim() === "") {
    erroCpf.cpf = ERRO_CPF_VAZIO;
  } else if (!validarCpf(cpf)) {
    erroCpf.cpf = ERRO_CPF;
  }

  return erroCpf;
};


export function validarCamposObrigatórios(campos) {
  let errosCamposObrigatórios = {};
  for (let nomeCampo in campos) {
    if (campos[nomeCampo] === "" || campos[nomeCampo] === null)
      errosCamposObrigatórios[nomeCampo] = ERRO_CAMPO_OBRIGATÓRIO;
  }
  return errosCamposObrigatórios;
}

export function validarConfirmaçãoSenha(senha, confirmação_senha) {
  let errosConfirmaçãoSenhaOpcional = {};
  if (senha !== confirmação_senha) {
    errosConfirmaçãoSenhaOpcional.confirmação_senha = ERRO_CONFIRMAÇÃO_SENHA;
  }
  return errosConfirmaçãoSenhaOpcional;
}

export function validarConfirmaçãoSenhaOpcional(senha, confirmação_senha) {
  let errosConfirmaçãoSenhaOpcional = {};
  if (senha && confirmação_senha && senha !== confirmação_senha) {
    errosConfirmaçãoSenhaOpcional.confirmaçãoSenha = ERRO_CONFIRMAÇÃO_SENHA;
  }
  return errosConfirmaçãoSenhaOpcional;
}

export function validarCampoEmail(email) {
  const FORMATO_EMAIL = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{3}(\.\w{2})?)$/;
  let erroEmail = {};
  if (!email) erroEmail.email = ERRO_CAMPO_OBRIGATÓRIO;
  else if (!FORMATO_EMAIL.test(email)) erroEmail.email = ERRO_FORMATO_INVÁLIDO;
  return erroEmail;
}

export function validarRecuperaçãoAcessoOpcional(questão, resposta) {
  let errosRecuperaçãoAcessoOpcional = {};
  if (resposta && !questão)
    errosRecuperaçãoAcessoOpcional.questão = ERRO_QUESTÃO;
  return errosRecuperaçãoAcessoOpcional;
}

export function checarListaVazia(listaErros) {
  return Object.keys(listaErros).length === 0;
}

export function MostrarMensagemErro({ mensagem }) {
  if (mensagem) return <small className={estilizarErro()}>{mensagem}</small>;
  else return null;
}
