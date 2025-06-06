import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import Usuário from "./usuário";
import Patente from "./patente";

export enum Titulação {
  MESTRADO = "mestrado",
  DOUTORADO = "doutorado",
}


@Entity()
export default class Pesquisador extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cnpj: string;

  @Column({ type: "enum", enum: Titulação })
  titulação: Titulação;

  @Column()
  anos_experiência_pesquisa: number;


  @OneToMany(() => Patente, (patente) => patente.pesquisador)
  patentes: Patente[];

  @OneToOne(() => Usuário, (usuário) => usuário.pesquisador, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  usuário: Usuário;
}
