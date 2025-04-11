// usuario.test.ts
import Usuario, { Perfil, Status, Cores } from '../entidades/usuário';
describe('Entidade Usuário', () => {
  it('deve instanciar um usuário e manter o status padrão como PENDENTE', () => {
    // Cria uma nova instância do Usuário
    const usuario = new Usuario();
    
    // Atribuição de valores obrigatórios
    usuario.cpf = '12345678901';
    usuario.perfil = Perfil.PESQUISADOR;  // ou Perfil.GERENTEEMPRESAFARMACEUTICA
    usuario.nome = 'Fulano de Tal';
    usuario.email = 'fulano@example.com';
    usuario.senha = 'senha123';
    usuario.questão = 'Qual o nome da sua cidade?';
    usuario.resposta = 'Cidade Exemplo';
    usuario.cor_tema = Cores.AZUL; // usando um valor do enum Cores
    
    // Aqui esperamos que o status padrão seja PENDENTE conforme definido no decorator
    expect(usuario.status).toBe(Status.PENDENTE);
  });

  it('deve permitir alterar o status do usuário para ATIVO', () => {
    const usuario = new Usuario();
    usuario.cpf = '10987654321';
    usuario.perfil = Perfil.GERENTEEMPRESAFARMACEUTICA;
    usuario.nome = 'Ciclano da Silva';
    usuario.email = 'ciclano@example.com';
    usuario.senha = 'senha321';
    usuario.questão = 'Qual sua cor favorita?';
    usuario.resposta = 'Azul';
    usuario.cor_tema = Cores.VERDE;
    
    // Altera o status após alguma operação ou lógica de negócio
    usuario.status = Status.ATIVO;
    
    expect(usuario.status).toBe(Status.ATIVO);
  });

});
