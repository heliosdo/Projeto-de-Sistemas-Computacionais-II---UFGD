// serviços-usuario.test.ts

// Mock do módulo "typeorm", sobrescrevendo o getManager
jest.mock('typeorm', () => {
  const actualTypeorm = jest.requireActual('typeorm');
  return {
    ...actualTypeorm,
    getManager: jest.fn(), // getManager agora é uma função mock
  };
});

import ServiçosUsuário from '../serviços/serviços-usuário';
import Usuário from '../entidades/usuário';
import Pesquisador from '../entidades/pesquisador';
import GerenteEmpresaFarmacêutica from '../entidades/gerente_empresa_farmaceutica';
import bcrypt from 'bcrypt';
import md5 from 'md5';
import { sign } from 'jsonwebtoken';
import * as typeorm from 'typeorm';

// Cria mocks para as entidades para evitar acesso real ao BD.
jest.mock('../entidades/usuário');
jest.mock('../entidades/pesquisador');
jest.mock('../entidades/gerente_empresa_farmaceutica');

describe('ServiçosUsuário', () => {

  describe('verificarCpfExistente', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('deve retornar 400 se o CPF já estiver cadastrado', async () => {
      const cpf = '12345678901';
      const cpf_encriptado = md5(cpf);
      (Usuário.findOne as jest.Mock).mockResolvedValue({ cpf: cpf_encriptado });

      const request = { params: { cpf } };
      const jsonMock = jest.fn();
      const statusMock = jest.fn(() => ({ json: jsonMock }));
      const response = { status: statusMock, json: jsonMock };

      await ServiçosUsuário.verificarCpfExistente(request as any, response as any);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ erro: 'CPF já cadastrado.' });
    });

    it('deve retornar json vazio se o CPF não estiver cadastrado', async () => {
      const cpf = '12345678901';
      (Usuário.findOne as jest.Mock).mockResolvedValue(null);
      const request = { params: { cpf } };
      const jsonMock = jest.fn();
      const response = { status: jest.fn(), json: jsonMock };

      await ServiçosUsuário.verificarCpfExistente(request as any, response as any);

      expect(jsonMock).toHaveBeenCalled();
    });
  });

  describe('cadastrarUsuário', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('deve cadastrar o usuário e retornar token, com senha e resposta encriptadas', async () => {
      const usuario_informado = {
        cpf: '12345678901',
        nome: 'Usuário Teste',
        perfil: 'pesquisador', // valor compatível com o enum Perfil
        email: 'teste@example.com',
        senha: 'senha123',
        questão: 'Qual sua cor favorita?',
        resposta: 'azul',
        cor_tema: 'blue'
      };

      (Usuário.create as jest.Mock).mockImplementation((data) => data);

      const result = await ServiçosUsuário.cadastrarUsuário(usuario_informado);

      expect(result.usuário.cpf).toBe(md5(usuario_informado.cpf));
      expect(result.usuário.senha).not.toBe(usuario_informado.senha);
      expect(result.token).toBeDefined();
      expect(result.senha).toBe(usuario_informado.senha);
    });
  });

  describe('logarUsuário', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('deve retornar 404 se o usuário não for encontrado', async () => {
      const request = { body: { nome_login: '12345678901', senha: 'senha123' } };
      (Usuário.findOne as jest.Mock).mockResolvedValue(null);

      const jsonMock = jest.fn();
      const statusMock = jest.fn(() => ({ json: jsonMock }));
      const response = { status: statusMock, json: jsonMock };

      await ServiçosUsuário.logarUsuário(request as any, response as any);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ erro: 'Nome de usuário não cadastrado.' });
    });
  });

  describe('alterarUsuário', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('deve alterar os dados do usuário e retornar o usuário atualizado com token quando email for alterado', async () => {
      const request = {
        body: {
          cpf: '12345678901',
          senha: 'novaSenha',
          questão: 'Nova questão',
          resposta: 'Nova resposta',
          cor_tema: 'red',
          email: 'novoemail@example.com'
        }
      };

      const oldUser = {
        cpf: md5('12345678901'),
        nome: 'Nome Original',
        perfil: 'pesquisador',
        email: 'oldemail@example.com',
        senha: 'senhaAntiga',
        questão: 'Questão antiga',
        resposta: 'respostaAntiga',
        cor_tema: 'blue',
        status: 'ativo'
      };

      (Usuário.findOne as jest.Mock).mockResolvedValue(oldUser);
      (Usuário.save as jest.Mock) = jest.fn().mockImplementation((user) => Promise.resolve(user));

      const jsonMock = jest.fn();
      const statusMock = jest.fn(() => ({ json: jsonMock }));
      const response = { status: statusMock, json: jsonMock };

      await ServiçosUsuário.alterarUsuário(request as any, response as any);

      expect(oldUser.email).toBe('novoemail@example.com');
      expect(oldUser.cor_tema).toBe('red');
      expect(oldUser.senha).not.toBe('senhaAntiga');
      expect(oldUser.questão).toBe('Nova questão');
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        nome: oldUser.nome,
        perfil: oldUser.perfil,
        email: oldUser.email,
        questão: oldUser.questão,
        status: oldUser.status,
        cor_tema: oldUser.cor_tema,
        token: expect.any(String)
      }));
    });
  });

  describe('removerUsuário', () => {
    // Dados para o teste
    const cpf = '12345678901';
    const cpf_encriptado = md5(cpf);
    const user = { cpf: cpf_encriptado, nome: 'User' };

    const mockTransactionManager = {
      findOne: jest.fn().mockResolvedValue(user),
      remove: jest.fn().mockResolvedValue(user),
    };

    const mockManager = {
      transaction: jest.fn((callback: any) => callback(mockTransactionManager)),
    };

    beforeEach(() => {
      // Aqui usamos o mock de getManager (definido no jest.mock do 'typeorm' acima)
      (typeorm.getManager as jest.Mock).mockReturnValue(mockManager);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('deve remover o usuário e retornar resposta json com sucesso', async () => {
      const request = { params: { cpf } };
      const jsonMock = jest.fn();
      const statusMock = jest.fn(() => ({ json: jsonMock }));
      const response = { status: statusMock, json: jsonMock };

      await ServiçosUsuário.removerUsuário(request as any, response as any);

      expect(mockTransactionManager.findOne).toHaveBeenCalledWith(Usuário, cpf_encriptado);
      expect(mockTransactionManager.remove).toHaveBeenCalledWith(user);
      expect(jsonMock).toHaveBeenCalled();
    });
  });
});