import { Perfil } from "../entidades/usuário";

export default function verificarPerfilPesquisador(request, response, next) {
  if (request.perfil === Perfil.PESQUISADOR) return next();
  else return response.status(401).json({ erro: "Acesso não autorizado." });
}
