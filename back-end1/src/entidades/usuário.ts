import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
} from "typeorm";

import Pesquisador from "./pesquisador";
import EmpresaFarmacêutica from "./empresa_farmaceutica";

export enum Perfil {
  EMPRESAFARMACEUTICA = "empresa_farmaceutica",
  PESQUISADOR = "pesquisador",
}

export enum Status {
  PENDENTE = "pendente",
  ATIVO = "ativo",
  INATIVO = "inativo",
}

export enum Cores {
  AMARELO = "yellow",
  ANIL = "indigo",
  AZUL = "blue",
  AZUL_PISCINA = "cyan",
  CINZA_ESCURO = "bluegray",
  LARANJA = "orange",
  ROSA = "pink",
  ROXO = "purple",
  VERDE = "green",
  VERDE_AZULADO = "teal",
}

@Entity()
export default class Usuário extends BaseEntity {
  @PrimaryColumn()
  cpf: string;

  @Column({ type: "enum", enum: Perfil })
  perfil: Perfil;

  @Column({ type: "enum", enum: Status, default: Status.PENDENTE })
  status: Status;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column()
  questão: string;

  @Column()
  resposta: string;

  @Column({ type: "enum", enum: Cores })
  cor_tema: string;

  @OneToOne(() => Pesquisador, (pesquisador) => pesquisador.usuário)
  pesquisador: Pesquisador;

  @OneToOne(() => EmpresaFarmacêutica, (empresa_farmaceutica) => empresa_farmaceutica.usuário)
  empresa_farmaceutica: EmpresaFarmacêutica;

  @CreateDateColumn()
  data_criação: Date;
}