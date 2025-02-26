import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import Patente from "./patente";
import EmpresaFarmacêutica from "./empresa_farmaceutica";

@Entity()
export default class Interesse extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  data_manifestação: Date;

  @Column()
  justificativa: string;


  @ManyToOne(() => Patente, (patente) => patente.interesses, {
    onDelete: "CASCADE",
  })
  patente: Patente;

  @ManyToOne(() => EmpresaFarmacêutica, (empresa_farmaceutica) => empresa_farmaceutica.interesses, {
    onDelete: "CASCADE",
  })
  empresa_farmaceutica: EmpresaFarmacêutica;
}
