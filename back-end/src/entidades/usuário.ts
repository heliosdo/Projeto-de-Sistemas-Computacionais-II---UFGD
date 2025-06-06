import {
  BaseEntity, Column, CreateDateColumn, Entity, OneToOne,
  PrimaryColumn
} from "typeorm";

import Pesquisador from "./pesquisador";
import GerenteEmpresaFarmacêutica from "./gerente_empresa_farmaceutica";


export enum Perfil {
  GERENTEEMPRESAFARMACEUTICA = "gerente_empresa_farmaceutica",
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
  status: Status = Status.PENDENTE;

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

  @OneToOne(() => GerenteEmpresaFarmacêutica, (gerente_empresa_farmaceutica) => gerente_empresa_farmaceutica.usuário)
  gerente_empresa_farmaceutica: GerenteEmpresaFarmacêutica;

  @CreateDateColumn()
  data_criação: Date;
}