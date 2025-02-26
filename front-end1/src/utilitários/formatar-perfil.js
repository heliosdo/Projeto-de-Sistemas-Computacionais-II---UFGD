export default function formatarPerfil(perfil) {
  switch (perfil) {
    case "pesquisador":
      return "Pesquisador";
    case "empresa_farmaceutica":
      return "EmpresaFarmacêutica";
    default:
      return;
  }
}
