import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LogarUsuário from '../páginas/usuário/logar-usuário';
import ContextoUsuário from '../contextos/contexto-usuário';

describe('LogarUsuário', () => {
    it('renderiza os campos de login corretamente', () => {
      render(
        <BrowserRouter>
          <ContextoUsuário.Provider value={{ setUsuárioLogado: jest.fn() }}>
            <LogarUsuário />
          </ContextoUsuário.Provider>
        </BrowserRouter>
      );
  
      // Verifica se os campos de entrada estão na tela
      const inputs = screen.getAllByDisplayValue('');
      expect(inputs.length).toBeGreaterThanOrEqual(2);
  
      // Verifica se o botão de login está presente
      expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });
  
    it('mostra mensagens de erro se tentar logar sem preencher os campos', () => {
      render(
        <BrowserRouter>
          <ContextoUsuário.Provider value={{ setUsuárioLogado: jest.fn() }}>
            <LogarUsuário />
          </ContextoUsuário.Provider>
        </BrowserRouter>
      );
  
      const botão = screen.getByRole('button', { name: /Login/i });
      fireEvent.click(botão);
  
      // Verifica se aparecem mensagens de erro para os dois campos
      const mensagens = screen.getAllByText(/Campo obrigatório/i);
      expect(mensagens.length).toBeGreaterThanOrEqual(2);
    });

    it('não aceita letras no campo CPF', () => {
        render(
          <BrowserRouter>
            <ContextoUsuário.Provider value={{ setUsuárioLogado: jest.fn() }}>
              <LogarUsuário />
            </ContextoUsuário.Provider>
          </BrowserRouter>
        );
      
        const cpfInput = screen.getByRole('textbox');
        fireEvent.change(cpfInput, { target: { value: 'abc' } });
      
        // Valida se o campo ficou vazio ou parcialmente preenchido
        expect(cpfInput.value).toMatch(/[^a-zA-Z]/); // não deve conter letras
      });
      
      
      it('aceita CPF válido no campo de login', () => {
        render(
          <BrowserRouter>
            <ContextoUsuário.Provider value={{ setUsuárioLogado: jest.fn() }}>
              <LogarUsuário />
            </ContextoUsuário.Provider>
          </BrowserRouter>
        );
      
        const cpfInput = screen.getByRole('textbox');
      
        fireEvent.change(cpfInput, { target: { value: '12345678900' } });
      
        // Simula perda de foco (às vezes é necessário para aplicar a máscara)
        fireEvent.blur(cpfInput);
      
        // Verifica se o valor contém os pontos e traço da máscara
        expect(cpfInput.value).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
      });
      
      
      
  });
  