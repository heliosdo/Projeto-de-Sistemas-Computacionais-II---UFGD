import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Interesse from "./interesse";
import Pesquisador from "./pesquisador";

export enum PaisesAbrangidos {
  AFRICA = "África",
  AMERICA_NORTE = "América do Norte",
  AMERICA_SUL = "América do Sul",
  ANTARTIDA = "Antártida",
  ASIA = "Ásia",
  EUROPA = "Europa",
  OCEANIA = "Oceania",
  GLOBAL = "Global",
}

@Entity()
export default class Patente extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: "int" })
  numero: number;

  @Column("int")
  ano_concessao: number;

  @Column({ type: "enum", enum: PaisesAbrangidos })
  paises_abrangidos: PaisesAbrangidos;

  @ManyToOne(() => Pesquisador, (pesquisador) => pesquisador.patentes, {
    onDelete: "CASCADE",
  })
  pesquisador: Pesquisador;

  @OneToMany(() => Interesse, (interesse) => interesse.patente)
  interesses: Interesse[];
}
