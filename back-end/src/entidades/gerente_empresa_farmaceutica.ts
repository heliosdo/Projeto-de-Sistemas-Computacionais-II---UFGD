import {BaseEntity, Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Usuário from "./usuário";
import Interesse from "./interesse";

@Entity()
export default class GerenteEmpresaFarmacêutica extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ano_ingresso: number;

  @Column({ type: "date" })
  data_nascimento: Date;

  @Column()
  telefone: string;

  @OneToMany(() => Interesse, (interesse) => interesse.gerente_empresa_farmaceutica)
  interesses: Interesse[];

  @OneToOne(() => Usuário, (usuário) => usuário.gerente_empresa_farmaceutica, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  usuário: Usuário;
}
