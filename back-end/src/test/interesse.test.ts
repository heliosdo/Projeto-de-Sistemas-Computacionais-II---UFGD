// interesse.test.ts
import Interesse from '../entidades/interesse';
import Patente, { PaisesAbrangidos } from '../entidades/patente';
import GerenteEmpresaFarmacêutica from '../entidades/gerente_empresa_farmaceutica';

describe('Entidade Interesse', () => {
  it('deve instanciar um Interesse com os valores corretos e configurar suas relações', () => {
    // Criação de uma instância de Patente
    const patente = new Patente();
    patente.id = 1; // Para teste, atribuímos manualmente
    patente.numero = 2020;
    patente.ano_concessao = 2020;
    patente.paises_abrangidos = PaisesAbrangidos.GLOBAL;
    
    // Criação de uma instância de GerenteEmpresaFarmacêutica
    const gerente = new GerenteEmpresaFarmacêutica();
    gerente.id = 1;
    gerente.ano_ingresso = 2021;
    gerente.data_nascimento = new Date('1980-01-01');
    gerente.telefone = '123456789';
    
    // Criação da instância de Interesse
    const interesse = new Interesse();
    interesse.id = 1; // Atribuição manual para teste; em ambiente real, seria gerado automaticamente
    interesse.justificativa = 'Interesse em cooperação';
    interesse.patente = patente;
    interesse.gerente_empresa_farmaceutica = gerente;
    
    // Asserções para verificar se os valores foram atribuídos corretamente
    expect(interesse.justificativa).toBe('Interesse em cooperação');
    expect(interesse.patente).toBe(patente);
    expect(interesse.gerente_empresa_farmaceutica).toBe(gerente);
    
    // Observação: Como estamos criando a instância diretamente, o valor de "data_manifestação"
    // (gerado automaticamente por @CreateDateColumn) não será atribuído.
    // Dessa forma, neste teste unitário, esperamos que seja undefined.
    expect(interesse.data_manifestação).toBeUndefined();
  });
});
