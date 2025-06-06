import React, { useState, useContext } from 'react';
import { Card } from 'primereact/card';
import { InputMask } from 'primereact/inputmask';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import ContextoUsuário from '../../contextos/contexto-usuário';
import { serviçoLogarUsuário } from '../../serviços/serviços-usuário';
import mostrarToast from '../../utilitários/mostrar-toast';

function limparMascaraCpf(cpf) {
  return cpf.replace(/[^\d]/g, '');
}

export default function LogarUsuário() {
  const navigate = useNavigate();
  const { setUsuárioLogado } = useContext(ContextoUsuário);

  const [nome_login, setNomeLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação simples
    let camposInvalidos = {};
    if (!nome_login) camposInvalidos.nome_login = 'Campo obrigatório';
    if (!senha) camposInvalidos.senha = 'Campo obrigatório';

    setErros(camposInvalidos);
    if (Object.keys(camposInvalidos).length > 0) return;

    try {
      const dadosParaLogin = {
        nome_login: limparMascaraCpf(nome_login),
        senha,
      };

      const resposta = await serviçoLogarUsuário(dadosParaLogin);
      const usuárioLogado = resposta.data.usuárioLogado;

      setUsuárioLogado({
        ...usuárioLogado,
        cpf: limparMascaraCpf(nome_login),
        cadastrado: true,
      });

      navigate('/pagina-inicial');
    } catch (erro) {
      mostrarToast(
        null,
        erro?.response?.data?.erro || 'Erro ao tentar logar',
        'error'
      );
    }
  };

  return (
    <div className="flex flex-column align-items-center justify-content-center h-screen">
      <h1 className="text-center text-2xl md:text-2xl mb-6 text-bluegray-700">
        Patentes da Industria Farmaceutica
      </h1>
      <Card className="w-10 lg:w-auto overflow-auto pt-2 pb-3 m-4 text-undefined-700 border-2 shadow-8">
        <form onSubmit={handleSubmit}>
          <div className="p-card-title">Login</div>
          <div className="p-card-content">
            <div className="mb-3 flex flex-column sm:align-items-start md:flex-row md:align-items-center">
              <label
                htmlFor="input-nome_login"
                className="w-auto text-md mr-4 md:text-base text-bluegray-700 font-bold"
              >
                Usuário
              </label>
              <InputMask
                id="input-nome_login"
                name="nome_login"
                mask="999.999.999-99"
                value={nome_login}
                onChange={(e) => setNomeLogin(e.target.value)}
                className="w-auto border-undefined-800"
                aria-label="Usuário"
                size={13}
              />
              {erros.nome_login && (
                <span style={{ color: 'red', marginLeft: 8 }}>{erros.nome_login}</span>
              )}
            </div>

            <div className="mb-3 flex flex-column sm:align-items-start md:flex-row md:align-items-center">
              <label
                htmlFor="input-senha"
                className="w-auto text-md mr-4 md:text-base text-bluegray-700 font-bold"
              >
                Senha
              </label>
              <Password
                id="input-senha"
                name="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-auto mr-2 mt-2 lg:mt-0"
                inputClassName="p-inputtext p-component p-filled p-password-input border-bluegray-800"
                aria-label="Senha"
                size={15}
                feedback={false}
                toggleMask
              />
              {erros.senha && (
                <span style={{ color: 'red', marginLeft: 8 }}>{erros.senha}</span>
              )}
            </div>

            <div className="flex flex-column align-items-center">
              <Button
                type="submit"
                label="Login"
                className="p-button-sm h-2rem text-base w-auto md:w-min mr-2 bg-green-600 border-green-800 shadow-6"
              />
              <Link
                to="/recuperar-acesso"
                className="font-bold text-md mt-4 md:text-sm text-undefined-800"
              >
                Recuperar Acesso de Usuário
              </Link>
              <Link
                to="/criar-usuario"
                className="font-bold text-md mt-4 md:text-sm text-undefined-800"
              >
                Cadastrar Usuário
              </Link>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
