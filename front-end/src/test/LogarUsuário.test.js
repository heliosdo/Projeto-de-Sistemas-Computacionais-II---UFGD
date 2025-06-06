import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import LogarUsuário from '../páginas/usuário/logar-usuário';
import ContextoUsuário from '../contextos/contexto-usuário';
import { serviçoLogarUsuário } from '../serviços/serviços-usuário';
import mostrarToast from '../utilitários/mostrar-toast';

// MOCK DO INPUTMASK PARA EVITAR ERRO DO JSDOM
jest.mock('primereact/inputmask', () => ({
    InputMask: (props) => <input {...props} />,
}));

// MOCK DE OUTRAS DEPENDÊNCIAS
const mockNavegar = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavegar,
}));

jest.mock('../serviços/serviços-usuário', () => ({
    serviçoLogarUsuário: jest.fn(),
}));

jest.mock('../utilitários/mostrar-toast', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('Página <LogarUsuário />', () => {
    const mockSetUsuárioLogado = jest.fn();

    const renderizarComponente = () => {
        return render(
            <ContextoUsuário.Provider value={{ setUsuárioLogado: mockSetUsuárioLogado }}>
                <MemoryRouter>
                    <LogarUsuário />
                </MemoryRouter>
            </ContextoUsuário.Provider>
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('deve renderizar o formulário de login corretamente', () => {
        renderizarComponente();
        expect(screen.getByLabelText(/Usuário/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Recuperar Acesso de Usuário/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Cadastrar Usuário/i })).toBeInTheDocument();
    });

    test('deve mostrar erros de validação se os campos estiverem vazios', async () => {
        const user = userEvent.setup();
        renderizarComponente();

        const botaoLogin = screen.getByRole('button', { name: /Login/i });
        await user.click(botaoLogin);

        const mensagensDeErro = await screen.findAllByText(/Campo obrigatório/i);
        expect(mensagensDeErro).toHaveLength(2);

        expect(serviçoLogarUsuário).not.toHaveBeenCalled();
        expect(mockNavegar).not.toHaveBeenCalled();
    });

    test('deve logar o usuário e navegar para a página inicial em caso de sucesso', async () => {
        const user = userEvent.setup();
        const dadosFakeDoUsuário = { nome: 'Usuário Teste' };

        serviçoLogarUsuário.mockResolvedValue({
            data: { usuárioLogado: dadosFakeDoUsuário },
        });

        renderizarComponente();

        // O usuário digita o CPF com máscara, mas o sistema deve remover antes de chamar o serviço
        await user.type(screen.getByLabelText(/Usuário/i), '123.456.789-00');
        await user.type(screen.getByLabelText(/Senha/i), 'senha123');
        await user.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(serviçoLogarUsuário).toHaveBeenCalledWith({ nome_login: '12345678900', senha: 'senha123' });

            expect(mockSetUsuárioLogado).toHaveBeenCalledWith({
                ...dadosFakeDoUsuário,
                cpf: '12345678900',
                cadastrado: true,
            });

            expect(mockNavegar).toHaveBeenCalledWith('/pagina-inicial');
        });
    });

    test('deve mostrar um toast de erro se as credenciais forem inválidas', async () => {
        const user = userEvent.setup();
        const erroApi = { response: { data: { erro: 'Credenciais inválidas' } } };

        serviçoLogarUsuário.mockRejectedValue(erroApi);

        renderizarComponente();

        await user.type(screen.getByLabelText(/Usuário/i), '111.111.111-11');
        await user.type(screen.getByLabelText(/Senha/i), 'senhaErrada');
        await user.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(mostrarToast).toHaveBeenCalledWith(expect.any(Object), 'Credenciais inválidas', 'error');
        });

        expect(mockNavegar).not.toHaveBeenCalled();
        expect(mockSetUsuárioLogado).not.toHaveBeenCalled();
    });
});
