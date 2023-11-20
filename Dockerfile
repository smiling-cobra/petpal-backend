# Use an official Node runtime as a parent image
FROM node:16.20.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

RUN npm install

# Make port 3000 available to the world outside this container
EXPOSE 3001

# Define environment variable
ENV NODE_ENV=production

# Run app.js when the container launches
CMD ["node", "index.js"]