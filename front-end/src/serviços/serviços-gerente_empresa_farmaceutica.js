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

export function serviçoCadastrarInteresse(interesse) {
    return servidor.post("/gerentes_empresas_farmaceuticas/interesses", interesse); 
};

export function serviçoRemoverInteresse(id) { 
    return servidor.delete(`/gerentes_empresas_farmaceuticas/interesses/${id}`); 
};
    
export function serviçoBuscarInteressesGerenteEmpresaFarmacêutica(cpf) {
    return servidor.get(`/gerentes_empresas_farmaceuticas/interesses/gerente_empresa_farmaceutica/${cpf}`); 
};

export function serviçoBuscarPatentes() { 
    return servidor.get("/gerentes_empresas_farmaceuticas/interesses/patentes"); 
};