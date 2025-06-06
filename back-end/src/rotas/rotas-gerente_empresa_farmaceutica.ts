import { Router } from "express";

import verificarToken from "../middlewares/verificar-token";
import verificarPerfilGerenteEmpresaFarmacêutica from "../middlewares/verificar-perfil-gerente_empresa_farmaceutica";
import ServiçosGerenteEmpresaFarmacêutica from "../serviços/serviços-gerente_empresa_farmaceutica";
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token";

const RotasGerenteEmpresaFarmacêutica = Router();
export default RotasGerenteEmpresaFarmacêutica;

RotasGerenteEmpresaFarmacêutica.post("/", ServiçosGerenteEmpresaFarmacêutica.cadastrarGerenteEmpresaFarmacêutica);
RotasGerenteEmpresaFarmacêutica.patch("/", verificarToken, verificarPerfilGerenteEmpresaFarmacêutica, ServiçosGerenteEmpresaFarmacêutica.atualizarGerenteEmpresaFarmacêutica);
RotasGerenteEmpresaFarmacêutica.get("/:cpf", verificarToken, verificarPerfilGerenteEmpresaFarmacêutica, ServiçosGerenteEmpresaFarmacêutica.buscarGerenteEmpresaFarmacêutica);


RotasGerenteEmpresaFarmacêutica.post("/interesses/", verificarToken, verificarPerfilGerenteEmpresaFarmacêutica,
    ServiçosGerenteEmpresaFarmacêutica.cadastrarInteresse);

RotasGerenteEmpresaFarmacêutica.delete("/interesses/:id", verificarToken, verificarPerfilGerenteEmpresaFarmacêutica,
    ServiçosGerenteEmpresaFarmacêutica.removerInteresse);

RotasGerenteEmpresaFarmacêutica.get("/interesses/gerente_empresa_farmaceutica/:cpf", verificarToken, verificarPerfilGerenteEmpresaFarmacêutica,
    verificarErroConteúdoToken, ServiçosGerenteEmpresaFarmacêutica.buscarInteressesGerenteEmpresaFarmacêutica);

RotasGerenteEmpresaFarmacêutica.get("/interesses/patentes/", verificarToken, verificarPerfilGerenteEmpresaFarmacêutica,
    ServiçosGerenteEmpresaFarmacêutica.buscarPatentes);