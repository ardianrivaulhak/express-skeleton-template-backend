FROM node:16-alpine

RUN apk add --no-cache tzdata
ENV TZ Asia/Jakarta

WORKDIR /app
ADD ./ ./
# RUN yarn add bcrypt

EXPOSE $PORT
CMD ["yarn", "start"]
#
