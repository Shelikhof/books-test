FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY .env .env

# RUN npx prisma migrate dev
RUN apt-get update -y && apt-get install -y openssl
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD [ "npm", "run","start:dev" ]