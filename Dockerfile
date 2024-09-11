FROM node:20

RUN npm install -g pnpm
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
ENV DATABASE_URL="postgresql://amazontech:amazontech@postgres:5432/amazontech_db?schema=public"

RUN pnpm install
COPY . .
EXPOSE 3000

RUN npx prisma generate

RUN apt-get update -y && apt-get install -y openssl
CMD ["pnpm", "start:dev"]