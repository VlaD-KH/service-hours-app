FROM nginx:alpine

# Копируем статические файлы приложения
COPY . /usr/share/nginx/html

# Удаляем лишние папки
RUN rm -rf /usr/share/nginx/html/.git /usr/share/nginx/html/.agents

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
