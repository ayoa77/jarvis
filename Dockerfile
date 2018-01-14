#use the LTS version 6 of node
FROM nodesource/jessie:6.3.1
# make group nodejs and user nodejs
RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs
# Specify the user for Docker to use	
USER nodejs  	
# create a directory to put the node app
RUN mkdir -p /home/nodejs/app
# Specify the work directory
WORKDIR /home/nodejs/app
# Copy package.json into the container first, this will speed up the npm install process because Docker will cache this “layer” and will run it only if it has been changed.  
COPY package.json /home/nodejs/app/package.json
# install the package.json…. IF the package.json has been changed :D
RUN npm install --production
# copy current directory into the appdirectory
COPY . /home/nodejs/app
# setup environment.  Only set env variables that you know will be constant throughout the container’s lifecycle.  Ie: setting the database URL as an environment flag… bc if run in staging, it will look for the production db. Pass these variables in during Runtime.   
ENV NODE_ENV production
# run command to start node
CMD ["npm","start"]