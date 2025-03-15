
FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./

COPY . .
RUN npm install

CMD ["node", "src/index.js", "people-sample.xlsx"]