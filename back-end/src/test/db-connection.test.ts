import { createConnection, getConnection, getConnectionManager } from "typeorm";
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
    expect.assertions(1); // Garante que ao menos uma asserção será executada

    try {
      await createConnection({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "senha_incorreta", // <- senha errada
        database: "ptc",
        entities: ["src/entidades/*.ts"],
        synchronize: false,
      });

      // Se a conexão funcionar, falha o teste
      fail("A conexão não deveria ter sido estabelecida.");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("deve conectar corretamente com as credenciais válidas", async () => {
    const conexao = await createConnection({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "admin", // Incorreta pra teste Falhar. 
      database: "ptc",
      entities: ["src/entidades/*.ts"],
      synchronize: false,
    });

    expect(conexao.isConnected).toBe(true);
  });
  
});
