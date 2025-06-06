import Patente, { PaisesAbrangidos } from '../entidades/patente';
import Pesquisador from '../entidades/pesquisador';
import Interesse from '../entidades/interesse';

describe('Entidade Patente', () => {
  it('deve instanciar uma Patente com os valores corretos e configurar suas relações', () => {
    // Instancia a patente
    const patente = new Patente();
    patente.numero = "123456"; // Corrigido para string
    patente.ano_concessao = "2022"; // Corrigido para string
    patente.paises_abrangidos = PaisesAbrangidos.AMERICA_SUL;

    // Simulação da relação ManyToOne com Pesquisador
    const pesquisador = new Pesquisador();
    pesquisador.id = 1;
    patente.pesquisador = pesquisador;

    // Simulação da relação OneToMany com Interesse
    const interesse1 = new Interesse();
    interesse1.id = 1;
    interesse1.justificativa = 'Interesse Teste';
    patente.interesses = [interesse1];

    // Asserções para verificar a consistência dos dados
    expect(patente.numero).toBe("123456"); // Corrigido para string
    expect(patente.ano_concessao).toBe("2022"); // Corrigido para string
    expect(patente.paises_abrangidos).toBe(PaisesAbrangidos.AMERICA_SUL);

    // Verificar a relação ManyToOne com Pesquisador
    expect(patente.pesquisador).toBeDefined();
    // Se necessário, você pode testar outras propriedades que realmente existem no objeto Pesquisador.

    // Verificar a relação OneToMany com Interesse
    expect(Array.isArray(patente.interesses)).toBe(true);
    expect(patente.interesses).toHaveLength(1);
    expect(patente.interesses[0]).toBeInstanceOf(Interesse);
    expect(patente.interesses[0].justificativa).toBe('Interesse Teste');
  });
});
