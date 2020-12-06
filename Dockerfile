FROM alpine:3.7

MAINTAINER VinnyVynce (https://github.com/VinnyVynce)

# Updating container
RUN apk add --no-cache npm nodejs git

# Setting workdir
WORKDIR /ws-input-api

# Changing user to root
USER root

# Creating user and downloading files
RUN git clone https://github.com/VinnyVynce/ws-input-api.git && \
	npm install && \
	echo "#!/bin/sh" > start.sh && \
	echo "cd /ws-input-api && npm start >> start.sh && \
	chmod u+x start.sh

# Expose ws-input-api ports
EXPOSE 80/tcp
EXPOSE 443/tcp
EXPOSE 5000/tcp

# Start ws-input-api
CMD ["/bin/sh", "/ws-input-api/start.sh"]
