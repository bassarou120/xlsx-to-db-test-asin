
FROM node:22
WORKDIR /app
COPY package.json package-lock.json ./

COPY . .
RUN npm install

CMD ["node", "src/index.js", "people-sample.xlsx"]