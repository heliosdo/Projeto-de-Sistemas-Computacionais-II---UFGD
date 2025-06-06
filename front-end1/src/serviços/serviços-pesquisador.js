import servidor from "./servidor";

export function serviçoCadastrarPesquisador(pesquisador) {
  return servidor.post("/pesquisadores", pesquisador);
}

export function serviçoBuscarPesquisador(cpf) {
  return servidor.get(`/pesquisadores/${cpf}`);
}
