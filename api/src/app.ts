import buildServer from "./server";

const server = buildServer();

process.on('SIGTERM', function onSigterm() {  
  console.log('SIGTERM')
})
process.on('SIGINT', function onSigint () {  
  console.log('SIGINT')
})

async function main() {
  try {
    await server.listen({
    port: parseInt(process.env.API_PORT || '3000'),
    host: '0.0.0.0',
    });

    console.log(`Server ready at http://localhost:3000`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

export default function start() {
    main()
}