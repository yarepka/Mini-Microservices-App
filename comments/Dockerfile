# setting base image
FROM node

# setting working directory for application
WORKDIR /app

# copying package.json file from *your machine*relative
# to build context
# to ./ inside a container (it'll actually copy the file
# to the /app directory because we specified working
# directory above)
COPY package.json ./

# install dependencies specified in package.json file 
RUN npm install

# copy all other files from ./ on *your machine* to
# the ./ (will copy to the /app in the container, because
# workdirectory was specified)
COPY ./ ./

# command which should be run whenever container is starting
CMD ["npm", "start"]
