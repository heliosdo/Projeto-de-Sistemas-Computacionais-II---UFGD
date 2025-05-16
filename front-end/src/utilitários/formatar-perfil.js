export default function formatarPerfil(perfil) {
  switch (perfil) {
    case "pesquisador":
      return "Pesquisador";
    case "gerente_empresa_farmaceutica":
      return "GerenteEmpresaFarmacêutica";
    default:
      return;
  }
}
