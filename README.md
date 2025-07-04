# CookBook — Backend Setup

## Описание

Инструкция по установке и настройке backend для проекта **CookBook** - сервис для хранения и управления рецептами

Фронтенд репозиторий: [github.com/Rorrian/CookBook](https://github.com/Rorrian/CookBook)

## Технологии:
* NestJS
* GraphQL(Apollo Driver)(code-first)
* Prisma (ORM)
* TypeScript
* PostgreSQL
* Zod

* OAuth

## Установка и настройка

### 1. Установка PostgreSQL и создание базы данных

1. Установить PostgreSQL и pgAdmin: [Скачать PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
2. Создать базу данных через pgAdmin.
3. Обновить файл `.env` следующими настройками:
   ```plaintext
   DATABASE_URL=postgresql://postgres:<PASSWORD>@localhost:5432/cookbook?schema=public
   ```

#### Параметры подключения к БД:

- Name: cookbook
- Host: localhost
- Port: 5432
- Username: postgres
- Password: <PASSWORD>


### 2. Установка зависимостей и запуск проекта

1. Установить зависимости:
   ```plaintext
   yarn install
   ```
2. Инициализация проекта:

	2.1.Выполнить миграцию:
   ```plaintext
	 npx prisma migrate dev --name init
   ```
	2.2. Сгенеририровать Prisma Client::
   ```plaintext
   npx prisma generate
   ```
________________________________
________________________________
________________________________

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.