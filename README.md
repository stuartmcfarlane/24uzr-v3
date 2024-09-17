# 24uzr development

## Quick start

You'll need a `.env` file in the project root containing the following keys

```env
MYSQL_ROOT_PASSWORD=realy-secret-thing
MYSQL_USER=24uzr
MYSQL_PASSWORD=another-good-secret-thing
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB_NAME=24uzr
MYSQL_CONTAINER_NAME=24uzr-mysql
WEB_PORT=80
API_PORT=3000
```

The api and web servers also need a bit of environment to work properly. Make sure you
have the following two files

`api/.env`

```env
DATABASE_URL="mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DB_NAME}"
```

`web/.env`

```env
PORT="${WEB_PORT}"
```

Now `npm i` all the things and create the database by executing the following

```bash
. .source
quick-start
```

## Running the development servers

The api and the web client shoud be run in separate terminals.

The servers will automatically recompile and restart when you edit the source.

Start a terminal for the api and run the dev task. You can kill it with ctrl-c

```bash
cd api
mysql-start
npm run dev
```

Start a terminal for the web client and run the dev task. You can kill it with ctrl-c

```bash
cd web
npm run dev
```

## Migrations

Database migrations are generated from the schema definition using the following command

```bash
cd api
npx prisma migrate dev --name new-migration-name
```

Database migrations are applied with the following command

```bash
cd api
npx prisma migrate dev
```

Schema type definitions will need to be (re)generated sometimes. Do this with

```bash
cd api
npx prisma generate
```
