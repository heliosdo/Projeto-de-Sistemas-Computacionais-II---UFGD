import servidor from "./servidor";

export function serviçoCadastrarPesquisador(pesquisador) {
  return servidor.post("/pesquisadores", pesquisador);
}

export function serviçoBuscarPesquisador(cpf) {
  return servidor.get(`/pesquisadores/${cpf}`);
}

export function serviçoAtualizarPesquisador(pesquisador) { 
  return servidor.patch("/pesquisadores", pesquisador); 
};

export function serviçoCadastrarPatente(patente) {
  return servidor.post("/pesquisadores/patentes", patente); 
};

export function serviçoAlterarPatente(patente) {
  return servidor.patch("/pesquisadores/patentes", patente); 
};

export function serviçoRemoverPatente(id) {
  return servidor.delete(`/pesquisadores/patentes/${id}`); 
};
  
export function serviçoBuscarPatentesPesquisador(cpf) {
  return servidor.get(`/pesquisadores/patentes/pesquisador/${cpf}`); 
};
  
export function serviçoBuscarPaisesAbrangidosPatentes() {
  return servidor.get("/pesquisadores/patentes/areas"); 
};