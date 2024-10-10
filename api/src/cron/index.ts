import { FastifyInstance } from "fastify";
import { getGribs } from "./getGribs";
import fastifyCron from 'fastify-cron';

export const createCronJobs = (server: FastifyInstance) => {
    
    server.register(fastifyCron, {
        jobs: [
            {
                name: 'get gribs',
                cronTime: '*/15 * * * *',
                onTick: (server: FastifyInstance) => {
                    getGribs(server)
                },
                start: true,
            }
        ]
    }).then(() => {
        server.cron.startAllJobs()
    })
}