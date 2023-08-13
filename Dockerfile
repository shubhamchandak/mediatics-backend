# #prod setup
# # stage 1 
# FROM node:20-alpine3.17 AS build
# WORKDIR /app
# COPY . .
# RUN npm install 
# RUN npm run build --prod

# # stage 2
# FROM nginx:1.25.1
# COPY --from=build /app/dist/web /usr/share/nginx/html



# dev setup
FROM node:20-alpine3.17 AS build
WORKDIR /app
COPY . .
RUN npm install 
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]