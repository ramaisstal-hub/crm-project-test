1) Ставим зависимости для проекта

npm i @nestjs/typeorm typeorm pg
npm i @nestjs/jwt passport passport-jwt
npm i bcrypt
npm i class-validator class-transformer
npm i @nestjs/swagger swagger-ui-express
npm install @nestjs/passport passport passport-jwt
npm install @nestjs/config
npm i bcrypt
npm i -D @types/bcrypt @types/ms



2) Поднять БД в постгрес

docker compose up -d

3) Проверить соедниение с БД
   jdbc:postgresql://localhost:5432/crm
4) API будет на http://localhost:3000
5) Swagger — http://localhost:3000/docs
6) npm run start:dev запуск