import ServiçosPesquisador from '../serviços/serviços-pesquisador';
import ServiçosUsuário from '../serviços/serviços-usuário';
import Pesquisador from '../entidades/pesquisador';
import Interesse from "../entidades/interesse";
import Usuário, { Status } from '../entidades/usuário';
import md5 from 'md5';
import * as typeorm from 'typeorm';

// Mock dos módulos dependentes
jest.mock('../serviços/serviços-usuário');
jest.mock('../entidades/pesquisador');

// CORREÇÃO: Mock do módulo 'typeorm' para evitar o erro de redefinição de propriedade.
jest.mock('typeorm', () => ({
  // Mantém todas as outras exportações reais do typeorm que não queremos mockar
  ...jest.requireActual('typeorm'),
  // Substituímos apenas a função getManager por um mock.
  getManager: jest.fn(),
}));

describe('ServiçosPesquisador', () => {

  describe('cadastrarPesquisador', () => {
    // Mocks do manager e transaction
    const mockTransactionManager = {
      save: jest.fn().mockImplementation((entity: any) => Promise.resolve(entity)),
      update: jest.fn().mockResolvedValue(undefined),
    };
    const mockManager = {
      transaction: jest.fn((callback: any) => callback(mockTransactionManager)),
    };

    // CORREÇÃO: beforeEach ajustado para usar o getManager mockado
    beforeEach(() => {
      // Pega a referência da função mockada e a tipa corretamente
      const getManagerMock = typeorm.getManager as jest.Mock;
      // Define o que ela deve retornar para este conjunto de testes
      getManagerMock.mockReturnValue(mockManager as any);
    });

    // CORREÇÃO: afterEach simplificado
    afterEach(() => {
      // Limpa todos os mocks para não interferir em outros testes
      jest.clearAllMocks();
    });

    it('deve cadastrar o pesquisador e retornar status ATIVO e token', async () => {
      // Arrange
      const usuário_info = {
        cpf: '12345678901',
        nome: 'Usuário Teste',
        perfil: 'pesquisador',
        email: 'teste@example.com',
        senha: 'senha123',
        questão: 'Qual sua cor favorita?',
        resposta: 'azul',
        cor_tema: 'blue'
      };
      const titulação = 'doutorado';
      const anos_experiência_pesquisa = 10;

      const request = {
        body: { usuário_info, titulação, anos_experiência_pesquisa }
      };

      const jsonMock = jest.fn();
      const statusMock = jest.fn(() => ({ json: jsonMock }));
      const response = { status: statusMock, json: jsonMock };

      const usuarioRetornado = { ...usuário_info, cpf: md5(usuário_info.cpf) };
      const tokenFake = 'test-token';
      (ServiçosUsuário.cadastrarUsuário as jest.Mock).mockResolvedValue({
        usuário: usuarioRetornado,
        token: tokenFake
      });
      (Pesquisador.create as jest.Mock).mockImplementation((data) => data);

      // Act
      await ServiçosPesquisador.cadastrarPesquisador(request as any, response as any);

      // Assert
      expect(mockTransactionManager.save).toHaveBeenCalledWith(usuarioRetornado);
      expect(Pesquisador.create).toHaveBeenCalledWith({
        usuário: usuarioRetornado,
        titulação,
        anos_experiência_pesquisa,
      });
      expect(mockTransactionManager.save).toHaveBeenCalled();
      expect(mockTransactionManager.update).toHaveBeenCalledWith(Usuário, usuarioRetornado.cpf, { status: Status.ATIVO });
      expect(jsonMock).toHaveBeenCalledWith({ status: Status.ATIVO, token: tokenFake });
    });
  });

  describe('buscarPesquisador', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('deve retornar os dados do pesquisador quando encontrado', async () => {
      // Arrange
      const cpf = '12345678901';
      const cpf_encriptado = md5(cpf);
      const pesquisadorRetornado = {
        usuário: {
          nome: 'Nome do Pesquisador',
          email: 'pesquisador@example.com'
        },
        titulação: 'doutorado',
        anos_experiência_pesquisa: 15
      };
      (Pesquisador.findOne as jest.Mock).mockResolvedValue(pesquisadorRetornado);

      const request = { params: { cpf } };
      const jsonMock = jest.fn();
      const statusMock = jest.fn(() => ({ json: jsonMock }));
      const response = { status: statusMock, json: jsonMock };

      // Act
      await ServiçosPesquisador.buscarPesquisador(request as any, response as any);

      // Assert
      expect(Pesquisador.findOne).toHaveBeenCalledWith({
        where: { usuário: cpf_encriptado },
        relations: ["usuário"]
      });
      expect(jsonMock).toHaveBeenCalledWith({
        nome: pesquisadorRetornado.usuário.nome,
        email: pesquisadorRetornado.usuário.email,
        titulação: pesquisadorRetornado.titulação,
        anos_experiência_pesquisa: pesquisadorRetornado.anos_experiência_pesquisa,
      });
    });

    it('deve retornar 404 se o pesquisador não for encontrado', async () => {
      // Arrange
      const cpf = '12345678901';
      (Pesquisador.findOne as jest.Mock).mockResolvedValue(null);
      const request = { params: { cpf } };
      const jsonMock = jest.fn();
      const statusMock = jest.fn(() => ({ json: jsonMock }));
      const response = { status: statusMock, json: jsonMock };

      // Act
      await ServiçosPesquisador.buscarPesquisador(request as any, response as any);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ erro: "Pesquisador não encontrado." });
    });
  });

  describe('atualizarPesquisador', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('deve atualizar os dados do pesquisador e retornar resposta json', async () => {
      // Arrange
      const request = {
        body: {
          cpf: '12345678901',
          titulação: 'doutorado',
          anos_experiência_pesquisa: 20
        }
      };
      (Pesquisador.update as jest.Mock).mockResolvedValue({});
      const jsonMock = jest.fn();
      const response = { json: jsonMock };

      // Act
      await ServiçosPesquisador.atualizarPesquisador(request as any, response as any);

      // Assert
      expect(Pesquisador.update).toHaveBeenCalledWith(
        { usuário: { cpf: md5(request.body.cpf) } },
        { titulação: request.body.titulação, anos_experiência_pesquisa: request.body.anos_experiência_pesquisa }
      );
      expect(jsonMock).toHaveBeenCalled();
    });
  });
});