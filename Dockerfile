# Etapa de build
FROM node:22-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos e roda o build
COPY . .
RUN npm run build

# Etapa final de produção
FROM node:22-alpine

WORKDIR /app

# Copia apenas os arquivos buildados da etapa anterior
COPY --from=builder /app ./

# Expondo porta padrão do frontend (caso use Vite, React ou similar)
EXPOSE 3000

# Comando para iniciar o frontend
CMD ["npm", "run", "start"]



