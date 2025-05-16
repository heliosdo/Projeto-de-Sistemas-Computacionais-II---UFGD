// serviços-pesquisador.test.ts

import ServiçosPesquisador from '../serviços/serviços-pesquisador';
import ServiçosUsuário from '../serviços/serviços-usuário';
import Pesquisador from '../entidades/pesquisador';
import Usuário, { Status } from '../entidades/usuário';
import md5 from 'md5';
import * as typeorm from 'typeorm';

// Como o serviço de pesquisador depende do serviço de usuário,
// mockamos esse módulo também
jest.mock('../serviços/serviços-usuário');
// Mock da entidade Pesquisador para os métodos create, findOne e update
jest.mock('../entidades/pesquisador');

describe('ServiçosPesquisador', () => {

  describe('cadastrarPesquisador', () => {
    let originalGetManager: any;
    const mockTransactionManager = {
      // Simula que o método save resolve com o objeto recebido
      save: jest.fn().mockImplementation((entity: any) => Promise.resolve(entity)),
      // Simula update (não precisa de retorno específico)
      update: jest.fn().mockResolvedValue(undefined),
    };
    const mockManager = {
      transaction: jest.fn((callback: any) => callback(mockTransactionManager)),
    };

    beforeEach(() => {
      // Salva a implementação original de getManager (caso seja utilizada em outros testes)
      originalGetManager = typeorm.getManager;
      // Faz o spy e força o retorno do mockManager (convertido para any para contornar o erro de tipo)
      jest.spyOn(typeorm, 'getManager').mockReturnValue(mockManager as any);
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
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

      // Simula o retorno de ServiçosUsuário.cadastrarUsuário:
      const usuarioRetornado = { ...usuário_info, cpf: md5(usuário_info.cpf) };
      const tokenFake = 'test-token';
      (ServiçosUsuário.cadastrarUsuário as jest.Mock).mockResolvedValue({
        usuário: usuarioRetornado,
        token: tokenFake
      });
      // Simula Pesquisador.create para retornar um objeto pesquisador com os dados passados
      (Pesquisador.create as jest.Mock).mockImplementation((data) => data);

      // Act
      await ServiçosPesquisador.cadastrarPesquisador(request, response);

      // Assert
      // Verifica se o usuário foi salvo na transação
      expect(mockTransactionManager.save).toHaveBeenCalledWith(usuarioRetornado);
      // Verifica se Pesquisador.create foi chamado com os dados esperados
      expect(Pesquisador.create).toHaveBeenCalledWith({
        usuário: usuarioRetornado,
        titulação,
        anos_experiência_pesquisa,
      });
      // Verifica se transactionManager.save foi chamado para salvar o pesquisador
      expect(mockTransactionManager.save).toHaveBeenCalled();
      // Verifica se transactionManager.update foi chamado para atualizar o status do usuário para ATIVO
      expect(mockTransactionManager.update).toHaveBeenCalledWith(Usuário, usuarioRetornado.cpf, { status: Status.ATIVO });
      // Por fim, espera que o response.json seja chamado com { status: Status.ATIVO, token: tokenFake }
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
      await ServiçosPesquisador.buscarPesquisador(request, response);

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
      await ServiçosPesquisador.buscarPesquisador(request, response);

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
      await ServiçosPesquisador.atualizarPesquisador(request, response);

      // Assert
      expect(Pesquisador.update).toHaveBeenCalledWith(
        { usuário: { cpf: md5(request.body.cpf) } },
        { titulação: request.body.titulação, anos_experiência_pesquisa: request.body.anos_experiência_pesquisa }
      );
      expect(jsonMock).toHaveBeenCalled();
    });
  });
});
