import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
  GLOBAL = "Vários países",
}

export enum CategoriaPatente {
  PRODUTO = "Produto",
  PROCESSO = "Processo",
  FORMULACAO = "Formulação",
  COMBINACAO = "Combinação",
  BIOTECNOLOGIA = "Biotecnologia"
}

@Entity()
export default class Patente extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero: string;

  @Column({ type: "enum", enum: CategoriaPatente })
  categoria: CategoriaPatente;

  @Column()
  ano_concessao: string;

  @Column({ type: "enum", enum: PaisesAbrangidos })
  paises_abrangidos: PaisesAbrangidos;

  @Column({ type: "date" })
  data_inicio: Date;

  @ManyToOne(() => Pesquisador, (pesquisador) => pesquisador.patentes, {
    onDelete: "CASCADE",
  })
  pesquisador: Pesquisador;

  @OneToMany(() => Interesse, (interesse) => interesse.patente)
  interesses: Interesse[];
}