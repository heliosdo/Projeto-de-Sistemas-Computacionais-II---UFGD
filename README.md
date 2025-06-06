# Projeto-de-Sistemas-Computacionais-II---UFGD


##Rodar o projeto
Pré-requisitos
    
    Node.js instalado (v22)
    Yarn instalado

##Instalando o Node.js v22
Para instalar a versão 22 do Node.js, execute o seguinte comando:
    
    nvm install 22

Para usar a versão 22 do Node.js, execute:
    
    nvm use 22

##Instalando o Yarn globalmente
Para instalar o Yarn globalmente, execute o seguinte comando:
  
    npm install -g yarn

##Passos
Abra os dois diretórios do projeto e instale as dependências:
cd /c:/LPIII/front-end1
cd /c:/LPIII/back-end1

Instale as dependências do projeto (em cada diretório, um por vez):
  
    yarn install

Execute o comando para iniciar a aplicação web (esteja no diretório do backend):
    
    yarn web

Abra o navegador e acesse:
    
    http://localhost:3000


# Testes Unitários com Jest + TypeScript

Este projeto utiliza **Jest** para testes unitários com suporte a **TypeScript**.

## 1. Instalação das dependências

```bash
npm install --save-dev jest ts-jest @types/jest

2. Inicie a configuração do Jest

npx ts-jest config:init

3. Adicione o script de teste no package.json

"scripts": {
  "test": "jest"
}

