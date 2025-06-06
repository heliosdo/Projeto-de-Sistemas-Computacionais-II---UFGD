import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Usuário from "./usuário";
import Interesse from "./interesse";

export enum PaisOrigem {
  BRASIL = "Brasil",
  EUA = "Estados Unidos",
  ALEMANHA = "Alemanha",
  INDIA = "Índia",
  CHINA = "China",
  OUTROS = "Outros",
}

@Entity()
export default class EmpresaFarmacêutica extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 14, unique: true })
  cnpj: string;

  @Column({ type: "enum", enum: PaisOrigem })
  pais_origem: PaisOrigem;

  @Column({ type: "boolean" })
  fabrica_brasil: boolean;

  @OneToMany(() => Interesse, (interesse) => interesse.empresa_farmaceutica)
  interesses: Interesse[];

  @OneToOne(() => Usuário, (usuário) => usuário.empresa_farmaceutica, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  usuário: Usuário;
}
