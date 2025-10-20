FROM node:slim

COPY *.json .

COPY table_creation.sql .

RUN npm install

CMD ["npm", "start"]