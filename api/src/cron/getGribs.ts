import { FastifyInstance } from 'fastify'
import { spawn } from 'node:child_process'
import { readFile, writeFile, rm } from 'node:fs/promises'
import { Readable } from 'node:stream'
import { ReadableStream } from 'node:stream/web'
import { createWind, deleteOldWind } from '../modules/wind/wind.service'
import { CreateBulkWindInput, createWindSchema } from '../modules/wind/wind.schema';

const SOURCE_URL = 'https://www.euroszeilen.utwente.nl/weer/grib/download/harmonie_xy_ijmg_wind.grb'
const TMP_GRB_FILE = '/tmp/harmony.grb'
const TMP_JSON_FILE = '/tmp/harmony.json'
const PARSE_GRIB_CMD = process.env.PARSE_GRIB_CMD

export const getGribs = async (server: FastifyInstance) => {
    try {
        await fetchGribsFile(server)
        await parseGribsToJson(server)

        const jsonFile = await readFile(TMP_JSON_FILE)
        const json = jsonFile.toString('utf8')
        if (!json) throw new Error('Failed to convert GRIBS to JSON')

        const wind = JSON.parse(json)
        const windInput = wind.map((w: CreateBulkWindInput) => {
            const ww = createWindSchema.parse(w)
            return ww
        })
        await createWind(windInput)

        await deleteOldWind()
        await rm(TMP_JSON_FILE)
        await rm(TMP_GRB_FILE)
    }
    catch (err) {
        server.log.error(err)
    }
}

const fetchGribsFile = async (server: FastifyInstance) => {
    const response = await fetch(SOURCE_URL)
    if (!response.ok) {
        throw new Error(`Failed to fetch GRBS data, ${response.status}`)
    }
    if (response.body === null) {
        throw new Error('Failed to fetch GRBS data: no data')
    }
    const stream = Readable.fromWeb(response.body as ReadableStream<any>)
    await writeFile(TMP_GRB_FILE, stream)   
}
const parseGribsToJson = async (server: FastifyInstance) => {
    if (!PARSE_GRIB_CMD) throw new Error('PARSE_GRIB_CMD is missing from env')

    const child = spawn(PARSE_GRIB_CMD, [TMP_GRB_FILE, TMP_JSON_FILE])
    
    const promise = new Promise((resolve, reject) => {
        child.on('error', err => {
            reject(err)
        })
        
        child.on('close', code => {
            if (code === 0) {
                resolve(child.stdout)
            } else {
                const err = new Error(`child exited with code ${code}`)
                reject(err)
            }
        })
    })
    
    return promise
}
