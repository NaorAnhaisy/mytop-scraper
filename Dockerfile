FROM node:16

# Create app directory
WORKDIR /var/www/mytor-docker

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
RUN npm install pm2 -g

# Bundle app source
COPY . .

EXPOSE 4000
CMD ["pm2-runtime", "./bin/www"]