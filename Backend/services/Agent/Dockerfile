FROM node
WORKDIR  /app
#  root user
COPY package*.json ./ 
RUN npm install
COPY ./services/Agent/package*.json ./services/Agent/
RUN cd services/Agent && npm install
COPY services/Agent  ./services/Agent
COPY shared ./shared
WORKDIR /app/services/Agent

EXPOSE 8003

CMD ["npm", "start"]