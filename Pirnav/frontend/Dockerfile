# Step 1: Build Vite app
FROM node:18 AS build

WORKDIR /app

# Copy only app folder
COPY ../app/package*.json ./
RUN npm install

COPY ../app ./
RUN npm run build   # creates /dist

# Step 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Fix React routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
