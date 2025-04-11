import { Router } from "express";

import verificarToken from "../middlewares/verificar-token";
import verificarPerfilGerenteEmpresaFarmacêutica from "../middlewares/verificar-perfil-gerente_empresa_farmaceutica";
import ServiçosGerenteEmpresaFarmacêutica from "../serviços/serviços-gerente_empresa_farmaceutica";

const RotasGerenteEmpresaFarmacêutica = Router();
export default RotasGerenteEmpresaFarmacêutica;

RotasGerenteEmpresaFarmacêutica.post("/", ServiçosGerenteEmpresaFarmacêutica.cadastrarGerenteEmpresaFarmacêutica);
RotasGerenteEmpresaFarmacêutica.patch("/", verificarToken, verificarPerfilGerenteEmpresaFarmacêutica, ServiçosGerenteEmpresaFarmacêutica.atualizarGerenteEmpresaFarmacêutica);
RotasGerenteEmpresaFarmacêutica.get("/:cpf", verificarToken, verificarPerfilGerenteEmpresaFarmacêutica, ServiçosGerenteEmpresaFarmacêutica.buscarGerenteEmpresaFarmacêutica);