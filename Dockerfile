FROM nginx:alpine

# Удаляем дефолтную конфигурацию NGINX
RUN rm /etc/nginx/conf.d/default.conf

# Копируем нашу безопасную конфигурацию NGINX
COPY nginx.conf /etc/nginx/conf.d/zps.conf

# Копируем статические файлы приложения
COPY . /usr/share/nginx/html

# Удаляем чувствительные файлы из контейнера
RUN rm -rf /usr/share/nginx/html/.git \
    /usr/share/nginx/html/.agents \
    /usr/share/nginx/html/.dockerignore \
    /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/docker-compose.yml \
    /usr/share/nginx/html/nginx.conf \
    /usr/share/nginx/html/firestore.rules \
    /usr/share/nginx/html/antigravity_debug.log \
    /usr/share/nginx/html/build-env.js \
    /usr/share/nginx/html/.env

# Запуск от непривилегированного пользователя (hardening)
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
