import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from
"typeorm";

import Patente from "./patente";
import GerenteEmpresaFarmacêutica from "./gerente_empresa_farmaceutica";

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

  @ManyToOne(() => GerenteEmpresaFarmacêutica, (gerente_empresa_farmaceutica) => gerente_empresa_farmaceutica.interesses, {
    onDelete: "CASCADE",
  })
  gerente_empresa_farmaceutica: GerenteEmpresaFarmacêutica;
}
