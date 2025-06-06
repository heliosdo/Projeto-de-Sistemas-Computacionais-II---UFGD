import Pesquisador, { Titulação } from '../entidades/pesquisador';
import Usuário from '../entidades/usuário';
import Patente, { PaisesAbrangidos } from '../entidades/patente';

describe('Entidade Pesquisador', () => {
  it('deve instanciar um Pesquisador com os valores corretos e configurar suas relações', () => {
    // Criação da instância de Pesquisador
    const pesquisador = new Pesquisador();
    pesquisador.id = 1; // Simulação de valor gerado automaticamente
    pesquisador.titulação = Titulação.DOUTORADO;
    pesquisador.anos_experiência_pesquisa = 10;

    // Simulação da relação OneToOne com Usuário
    const usuario = new Usuário();
    usuario.cpf = '12345678901';
    usuario.email = 'usuario@exemplo.com';
    usuario.senha = 'senhaSegura';
    usuario.questão = 'Qual o nome da sua cidade?';
    usuario.resposta = 'Cidade Exemplo';
    // Atribua as demais propriedades obrigatórias da entidade Usuário conforme a sua implementação
    pesquisador.usuário = usuario;

    // Simulação da relação OneToMany com Patente
    const patente = new Patente();
    patente.id = 1; // Valor simulado, pois em ambiente real seria gerado automaticamente
    patente.numero = "101010"; // Corrigido para string
    patente.ano_concessao = "2020"; // Corrigido para string
    patente.paises_abrangidos = PaisesAbrangidos.GLOBAL;
    pesquisador.patentes = [patente];

    // Asserções para verificar os valores atribuídos
    expect(pesquisador.titulação).toBe(Titulação.DOUTORADO);
    expect(pesquisador.anos_experiência_pesquisa).toBe(10);
    expect(pesquisador.usuário).toBeDefined();
    expect(pesquisador.usuário.cpf).toBe('12345678901');

    // Verifica se a relação com patentes foi configurada corretamente
    expect(Array.isArray(pesquisador.patentes)).toBe(true);
    expect(pesquisador.patentes).toHaveLength(1);
    expect(pesquisador.patentes[0]).toBeInstanceOf(Patente);
    expect(pesquisador.patentes[0].numero).toBe("101010"); // Corrigido para string
  });
});
