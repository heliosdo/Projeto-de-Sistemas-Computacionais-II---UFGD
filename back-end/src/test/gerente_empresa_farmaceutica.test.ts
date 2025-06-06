// gerente_empresa_farmacêutica.test.ts
import GerenteEmpresaFarmacêutica from '../entidades/gerente_empresa_farmaceutica';
import Usuario, { Perfil, Status, Cores } from '../entidades/usuário';
import Interesse from '../entidades/interesse';

describe('Entidade GerenteEmpresaFarmacêutica', () => {
  it('deve instanciar a entidade com os valores corretos e configurar suas relações', () => {
    // Cria uma instância da entidade GerenteEmpresaFarmacêutica
    const gerente = new GerenteEmpresaFarmacêutica();
    gerente.ano_ingresso = 2020;
    gerente.data_nascimento = new Date('1990-01-01');
    gerente.telefone = '123456789';

    // Simulando a relação OneToOne com Usuário
    const usuario = new Usuario();
    usuario.cpf = '11122233344';
    usuario.perfil = Perfil.GERENTEEMPRESAFARMACEUTICA;
    usuario.nome = 'Gerente Exemplo';
    usuario.email = 'gerente@example.com';
    usuario.senha = 'senhaSegura';
    usuario.questão = 'Nome da sua cidade?';
    usuario.resposta = 'ExemploCidade';
    usuario.cor_tema = Cores.AZUL;
    usuario.status = Status.ATIVO; 

    gerente.usuário = usuario;

    // Simulando a relação OneToMany com Interesse
    const interesse1 = new Interesse();
    // Preencha os campos obrigatórios de Interesse conforme sua definição
    interesse1.id = 1; // supondo que o Interesse possua, por exemplo, uma propriedade id
    // Você pode atribuir outros valores de acordo com a estrutura da entidade Interesse

    // Se houver mais interesses, você pode criar outros mocks
    gerente.interesses = [interesse1];

    // Asserções para verificar se os valores foram atribuídos corretamente:
    expect(gerente.ano_ingresso).toBe(2020);
    expect(gerente.data_nascimento).toEqual(new Date('1990-01-01'));
    expect(gerente.telefone).toBe('123456789');

    // Verificando a relação OneToOne com Usuário
    expect(gerente.usuário).toBeDefined();
    expect(gerente.usuário.nome).toBe('Gerente Exemplo');
    expect(gerente.usuário.perfil).toBe(Perfil.GERENTEEMPRESAFARMACEUTICA);

    // Verificando a relação OneToMany com Interesse
    expect(gerente.interesses).toBeInstanceOf(Array);
    expect(gerente.interesses).toHaveLength(1);
    expect(gerente.interesses[0]).toBeInstanceOf(Interesse);
  });
});
