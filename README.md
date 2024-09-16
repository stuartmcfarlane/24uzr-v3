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
