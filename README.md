# Capybara Organizer

## Navegação rápida

- [Sobre o projeto](#sobre-o-projeto)
- [Tecnologias usadas](#tecnologias-usadas)
- [Arquitetura](#arquitetura)
- [Como rodar](#como-rodar)
- [Observações](#observacoes)

## Sobre o projeto

Este projeto é um gerenciador de tarefas e boards com APIs REST, autenticação e interface web.

Ele permite criar/atualizar/excluir usuários, boards, tarefas e estatísticas, além de oferecer comunicação em tempo real via WebSocket para atualização de tarefas em boards.

<img width="1920" height="1080" alt="capybara organizer" src="https://github.com/user-attachments/assets/54c1c100-1a71-44b4-bef0-8003b6a1f8ef" />


### O que ele soluciona

- Facilita o gerenciamento de tarefas em múltiplos boards.
- Organiza equipes e membros por tarefas.
- Permite visualizar estatísticas de progresso.
- Oferece um backend acessível via API e um frontend integrado em Next.js.

## Tecnologias usadas

- **Node.js**
- **Express**
- **TypeORM**
- **PostgreSQL**
- **Next.js**
- **Socket.IO**
- **Docker / Docker Compose**

## Arquitetura

O projeto está dividido em dois serviços principais:

- `backend`: API Express + TypeORM que se conecta ao banco PostgreSQL.
- `frontend`: aplicação Next.js que consome a API backend.

O serviço `database` é um container PostgreSQL que armazena os dados do sistema.

### Fluxo básico

1. O frontend faz requisições para o backend em `http://localhost:8080`.
2. O backend usa `DATABASE_URL` para conectar ao container `database`.
3. O backend cria um usuário admin inicial usando variáveis de ambiente.
4. O frontend consome rotas e também se conecta ao websocket para atualizações em tempo real.

## Como rodar

No diretório raiz do projeto (`projectGerenciador`), execute:

```bash
sudo docker compose down -v
sudo docker compose up -d --build
```

Isso irá:

- parar e remover containers e volumes existentes
- recriar imagens e containers
- iniciar o banco de dados, backend e frontend

### URLs locais

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`

### Variáveis de ambiente padrão

O projeto utiliza variáveis de ambiente para configuração sensível. Copie o arquivo de exemplo e edite os valores antes de rodar:

```bash
cp .env.example .env
```

O Docker Compose carregará o arquivo `.env` automaticamente.

O `docker-compose.yml` espera as variáveis abaixo:

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `NEXT_PUBLIC_API_URL`

## Observações

- Caso a porta `8080` já esteja ocupada, pare o processo ou altere o mapeamento de portas em `docker-compose.yml`.
- Se quiser usar outra porta no frontend, ajuste `3000:3000` em `docker-compose.yml`.
- Para desenvolvimento local, mantenha o volume `pgdata` para persistência de dados.
