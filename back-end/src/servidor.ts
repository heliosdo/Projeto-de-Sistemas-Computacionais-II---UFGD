import cors from "cors";
import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import RotasUsuário from "./rotas/rotas-usuário";
import RotasPesquisador from "./rotas/rotas-pesquisador";
import RotasGerenteEmpresaFarmacêutica from "./rotas/rotas-gerente_empresa_farmaceutica"

const app = express();
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use("/usuarios", RotasUsuário);
app.use("/pesquisadores", RotasPesquisador);
app.use("/gerentes_empresas_farmaceuticas", RotasGerenteEmpresaFarmacêutica);

app.listen(PORT || 3333);
const conexão = createConnection();
export default conexão;
