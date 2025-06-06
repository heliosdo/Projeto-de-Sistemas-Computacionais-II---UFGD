import { useContext } from "react";

import { Card } from "primereact/card";
import { Image } from "primereact/image";

import ContextoUsuário from "../../contextos/contexto-usuário";
import imge from "../../imagens/image.png";
import {
  estilizarCard,
  estilizarCardHeaderCentralizado,
  estilizarFlex,
  estilizarPáginaÚnica,
}
  from "../../utilitários/estilos";

export default function PáginaInicial() {

  const { usuárioLogado } = useContext(ContextoUsuário);

  function HeaderCentralizado() {
    return (
      <div className={estilizarCardHeaderCentralizado()}>
        Patentes da Industria Farmacêutica
      </div>
    );
  }
  return (
    <div className={estilizarPáginaÚnica()}>
      <Card
        header={HeaderCentralizado}
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <Image src={imge} alt="Venha fazer a diferença!" width={1100} />
      </Card>
    </div>
  );
}
