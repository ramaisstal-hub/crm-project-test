1) Ставим зависимости для проекта

npm i @nestjs/typeorm typeorm pg
npm i @nestjs/jwt passport passport-jwt
npm i bcrypt
npm i class-validator class-transformer
npm i @nestjs/swagger swagger-ui-express


2) Поднять БД в постгрес

docker compose up -d

3) Проверить соедниение с БД
   jdbc:postgresql://localhost:5432/crm
4) 