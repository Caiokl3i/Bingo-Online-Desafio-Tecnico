# 🎲 Bingo Live System

Aplicação Fullstack para gerenciamento de partidas de Bingo em tempo real.

## 📋 Sobre o Projeto

O **Bingo Live System** é uma plataforma web multiplayer que digitaliza a experiência do Bingo clássico. O sistema conta com dois perfis de acesso:
* **Administrador:** Cria salas, gerencia o sorteio das bolas (manual ou automático) e monitora o status da partida.
* **Jogador:** Entra nas salas, recebe cartelas geradas aleatoriamente e marca os números em tempo real.
O sistema valida automaticamente as condições de vitória (linhas, colunas e diagonais) e anuncia o vencedor para todos os participantes.

## 🛠 Tecnologias

* **Frontend:** React, Vite, React Router, CSS Modules (Glassmorphism).
* **Backend:** Node.js, Express, JWT (Auth).
* **Database:** SQLite (Arquivo local).
* **Infraestrutura:** Docker, Docker Compose.

## 🐳 Execução com Docker

Não é necessário instalar Node.js ou Banco de Dados localmente.

1.  **Clone e entre na pasta:**
    ```bash
    git clone <url-do-repo>
    cd <nome-da-pasta>
    ```

2.  **Suba os containers:**
    ```bash
    docker-compose up --build
    ```

3.  **Acesse:**
    * **Frontend:** [http://localhost:5173](http://localhost:5173)
    * **API:** [http://localhost:3000](http://localhost:3000)

## ⚙️ Variáveis de Ambiente

O projeto já vem com configurações padrão no `docker-compose.yml` para facilitar a execução. Porém, para personalização ou execução local, utilize o arquivo de exemplo fornecido.

1.  **Duplique o arquivo de exemplo:**
    ```bash
    cp .env.example .env
    ```

2.  **Ajuste as variáveis conforme necessário:**

    ```ini
    # Porta do Servidor
    PORT=3000

    # Chave para assinatura dos Tokens JWT (Segurança)
    JWT_SECRET=sua_chave_secreta_aqui

    # Email que terá permissões de ADMIN automaticamente
    ADMIN_EMAIL=admin@email.com
    ```

> **Nota:** Para funcionalidades de Admin (Criar salas/Sorteio), registre um usuário com o email: **`admin@email.com`**.

## 🧠 Decisões Técnicas

1.  **Banco de Dados (SQLite):** Escolhido pela portabilidade e simplicidade (serverless). Utilizado armazenamento em formato JSON para suportar arrays (cartelas/números sorteados) em colunas de texto.
2.  **Sincronização (Polling):** Utilização de *Short Polling* (requisições a cada 5s) para atualização do jogo, reduzindo a complexidade de implementação de WebSockets sem sacrificar a experiência do usuário.
3.  **Docker Build:** A imagem do Backend (`node:22-alpine`) inclui dependências de compilação (`python3`, `make`, `g++`) para garantir a compatibilidade nativa do driver `sqlite3` no Linux.
4.  **Validação Dupla:** A lógica de vitória (linhas, colunas, diagonais) é verificada no Frontend (feedback visual) e revalidada estritamente no Backend antes de declarar um vencedor.