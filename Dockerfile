FROM node:latest

WORKDIR /usr/src/app
COPY package*.json ./

COPY . .
RUN npm install
EXPOSE 8081
#ENV PORT 8080
#CMD ["node"]
# server.js


#WORKDIR /usr/src/app/src


#RUN npm install

#COPY . .

#EXPOSE 8080

#CMD [ "ls"]

#CMD ["npm", "start" , "server.js"]
#=======
#EXPOSE 8081
#ENV PORT 8081
#CMD node server.js
#>>>>>>> d10bc4b466997c5e7de821d53010b18094bb8bc7
