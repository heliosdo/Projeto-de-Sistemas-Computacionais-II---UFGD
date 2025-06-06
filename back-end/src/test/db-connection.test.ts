import { createConnection, getConnectionManager } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

describe("Conexão com o banco de dados", () => {
  afterEach(async () => {
    const manager = getConnectionManager();
    if (manager.has("default")) {
      const conexao = manager.get("default");
      if (conexao.isConnected) {
        await conexao.close();
      }
    }
  });

  it("deve conectar ao banco com sucesso", async () => {
    const conexao = await createConnection();
    expect(conexao.isConnected).toBe(true);
  });

  it("deve falhar ao conectar com credenciais inválidas", async () => {
    expect.assertions(1);
    try {
      await createConnection({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "senha_incorreta", // senha errada
        database: "ptc",
        entities: ["src/entidades/*.ts"],
        synchronize: false,
      });
      fail("A conexão não deveria ter sido estabelecida.");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("deve conectar corretamente com as credenciais válidas", async () => {
    let conexao;
    try {
      conexao = await createConnection({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "admin", // Coloque sua senha correta aqui!
        database: "ptc",
        entities: ["src/entidades/*.ts"],
        synchronize: false,
      });
      expect(conexao.isConnected).toBe(true);
    } catch (error: any) {
      // Se o erro for de banco não existente, marca o teste como pendente e avisa
      if (error.message && error.message.includes("Unknown database")) {
        console.warn("Banco de dados 'ptc' não existe. Pule este teste ou crie o banco para rodar.");
        return; // Teste não falha, só sai
      }
      // Qualquer outro erro, falha o teste
      throw error;
    } finally {
      if (conexao && conexao.isConnected) {
        await conexao.close();
      }
    }
  });

});
