import servidor from "./servidor";

export function serviçoCadastrarGerenteEmpresaFarmacêutica(gerente_empresa_farmaceutica) { 
    return servidor.post("/gerentes_empresas_farmaceuticas", gerente_empresa_farmaceutica); 
};
export function serviçoAtualizarGerenteEmpresaFarmacêutica(gerente_empresa_farmaceutica) { 
    return servidor.patch("/gerentes_empresas_farmaceuticas", gerente_empresa_farmaceutica); 
};
export function serviçoBuscarGerenteEmpresaFarmacêutica(cpf) {
    return servidor.get(`/gerentes_empresas_farmaceuticas/${cpf}`); 
};