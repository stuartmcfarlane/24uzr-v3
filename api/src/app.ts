import buildServer from "./server";

const server = buildServer();

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, async () => {
    await server.close()
    process.exit(0)
  })
})

async function main() {
  try {
    await server.listen({
      port: parseInt(process.env.API_PORT || '3000'),
      host: '0.0.0.0',
    });
    
    server.log.info(`Server ready at http://localhost:3000`);
  } catch (e) {
    server.log.error(e);
    process.exit(1);
  }
}

export default function start() {
  main()
}