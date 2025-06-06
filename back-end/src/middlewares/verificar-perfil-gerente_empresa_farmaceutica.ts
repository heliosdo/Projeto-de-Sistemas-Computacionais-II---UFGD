import { Perfil } from '../entidades/usuário';

export default function verificarPerfilGerenteEmpresaFarmacêutica(request, response, next) {
    if (request.perfil === Perfil.GERENTEEMPRESAFARMACEUTICA) return next();
    else return response.status(401).json({ erro: "Acesso não autorizado." });
};