import Fastify from 'fastify'
import { userRoutes } from './user.route'
import { userSchemas } from './user.schema'

const app = Fastify({ logger: true })

for (let schema of [...userSchemas]) {
  app.addSchema(schema)
}

// routes
app.register(userRoutes, { prefix: 'users' })

app.get('/healthcheck', (req, res) => {
  res.send({ message: 'Success' })
})

// graceful shutdown
const listeners = ['SIGINT', 'SIGTERM']
listeners.forEach((signal) => {
  process.on(signal, async () => {
    await app.close()
    process.exit(0)
  })
})

async function main() {
  await app.listen({
    port: process.env.API_PORT,
    host: '0.0.0.0',
  })
}

process.on('SIGTERM', function onSigterm () {  
  console.log('SIGTERM')
})
process.on('SIGINT', function onSigterm () {  
  console.log('SIGINT')
})

export default function start() {
    main()
}