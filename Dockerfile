FROM node:12.16.1

ARG SSH_KEY

RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64
RUN chmod +x /usr/local/bin/dumb-init

# Runs "/usr/bin/dumb-init -- /my/script --with --args"
ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]

# Create app directory
WORKDIR /usr/src/app

# Add github to known hosts
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

# Install source files
COPY . .

# Install app dependencies
RUN ssh-agent sh -c 'echo $SSH_KEY | base64 -d | ssh-add - ; npm install && npm run build'

ENV NODE_ENV=production

# Remove dev dependencies
RUN npm prune --production

CMD [ "npm", "run", "start" ]
