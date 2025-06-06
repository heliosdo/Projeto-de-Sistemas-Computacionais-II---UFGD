// src/test/RecuperarAcesso.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// ==============================================================================
// ⬇️⬇️⬇️ ESTA É A LINHA QUE FOI CORRIGIDA COM O CAMINHO CERTO ⬇️⬇️⬇️
import RecuperarAcesso from '../páginas/usuário/RecuperarAcesso';
// ==============================================================================
import ContextoUsuário from '../contextos/contexto-usuário';

// Mock do React Router para que o componente não quebre
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(), // Mock do useNavigate, se ele for usado
}));

describe('Página <RecuperarAcesso />', () => {
    const mockSetCpfVerificado = jest.fn();

    const renderizarComponente = () => {
        return render(
            <ContextoUsuário.Provider value={{ setCpfVerificado: mockSetCpfVerificado }}>
                <MemoryRouter>
                    <RecuperarAcesso />
                </MemoryRouter>
            </ContextoUsuário.Provider>
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('deve renderizar o formulário de recuperação corretamente', () => {
        renderizarComponente();

        expect(screen.getByRole('heading', { name: /Recuperar Acesso/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Resposta da Pergunta Secreta/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Recuperar/i })).toBeInTheDocument();
    });

    test('deve exibir mensagens de erro para campos vazios', async () => {
        const user = userEvent.setup();
        renderizarComponente();

        const botaoRecuperar = screen.getByRole('button', { name: /Recuperar/i });
        await user.click(botaoRecuperar);

        expect(await screen.findByText(/Informe o CPF/i)).toBeInTheDocument();
        expect(screen.getByText(/Informe a resposta/i)).toBeInTheDocument();
        expect(mockSetCpfVerificado).not.toHaveBeenCalled();
    });

    test('não deve exibir mensagens de erro quando os campos são válidos', async () => {
        const user = userEvent.setup();
        renderizarComponente();

        const inputCpf = screen.getByLabelText(/CPF/i);
        const inputResposta = screen.getByLabelText(/Resposta da Pergunta Secreta/i);
        const botaoRecuperar = screen.getByRole('button', { name: /Recuperar/i });

        await user.type(inputCpf, '123.456.789-00');
        await user.type(inputResposta, 'minha resposta secreta');
        await user.click(botaoRecuperar);

        expect(screen.queryByText(/Informe o CPF/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Informe a resposta/i)).not.toBeInTheDocument();
    });
});