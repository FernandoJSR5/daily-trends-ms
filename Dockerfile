FROM node:18-alpine

# Change the work directory app
WORKDIR /app

# Move both package.json and package-lock.json
COPY ./package*.json ./

RUN npm install --no-optional && npm cache clean --force
ENV PATH /app/node_modules/.bin:$PATH

COPY . .

# Compile files in the dist folder
RUN npm run build

EXPOSE 8080

# # Run the server
CMD ["npm","run","start"]
