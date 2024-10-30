# Use uma imagem base do Node.js
FROM node:20

# Crie e defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e package-lock.json para o container
COPY package*.json ./

# Instale as dependências usando npm ci para garantir a instalação correta
RUN npm ci

RUN npm install bcrypt

# Copie o restante dos arquivos do aplicativo
COPY . .

# Exponha a porta que o app usará
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]