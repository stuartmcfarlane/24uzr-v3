import { FastifyInstance } from 'fastify'
import { spawn } from 'node:child_process'
import { readFile, writeFile, rm } from 'node:fs/promises'
import { Readable } from 'node:stream'
import { ReadableStream } from 'node:stream/web'
import { createWind, deleteOldWind } from '../modules/wind/wind.service'
import { CreateBulkWindInput, CreateSingleBulkWindInput, createWindSchema } from '../modules/wind/wind.schema';
import { CreateSingleWindContoursInput, CreateWindContoursInput, createWindContoursSchema } from '../modules/windContours/windContours.schema'
import { createWindContours, deleteWindContoursByTimestamp, findWindContoursByRegion } from '../modules/windContours/windContours.service'
import { makeRegion, project, timestamp2date } from 'tslib'

const SOURCE_URL = 'https://www.euroszeilen.utwente.nl/weer/grib/download/harmonie_xy_ijmg_wind.grb'
const TMP_GRB_FILE = '/tmp/harmony.grb'
const TMP_VECTORS_JSON_FILE = '/tmp/harmonyVectors.json'
const TMP_CONTOURS_JSON_FILE = '/tmp/harmonyContours.json'
const PARSE_GRIB_VECTORS_CMD = process.env.PARSE_GRIB_VECTORS_CMD
const PARSE_GRIB_CONTOURS_CMD = process.env.PARSE_GRIB_CONTOURS_CMD

export const getGribs = async (server: FastifyInstance) => {
    try {
        await fetchGribsFile(server)
        await parseGribsToVectorsJson(server)
        await parseGribsToContoursJson(server)

        const [oldest, newest] = await createWindVectorsFromJson()
        await createWindContoursFromJson()

        server.log.info(`Updated wind ${oldest}...${newest}`)
        
        await Promise.all([
            deleteOldWind(),
            rm(TMP_VECTORS_JSON_FILE),
            rm(TMP_CONTOURS_JSON_FILE),
            rm(TMP_GRB_FILE),
        ])
    }
    catch (err) {
        server.log.error(err)
    }
}

const fetchGribsFile = async (server: FastifyInstance) => {
    const response = await fetch(SOURCE_URL)
    if (!response.ok) {
        throw new Error(`Failed to fetch GRIBS data, ${response.status}`)
    }
    if (response.body === null) {
        throw new Error('Failed to fetch GRIBS data: no data')
    }
    const stream = Readable.fromWeb(response.body as ReadableStream<any>)
    await writeFile(TMP_GRB_FILE, stream)   
}
const parseGribsToVectorsJson = async (server: FastifyInstance) => {
    if (!PARSE_GRIB_VECTORS_CMD) throw new Error('PARSE_GRIB_VECTORS_CMD is missing from env')

    const child = spawn(PARSE_GRIB_VECTORS_CMD, [TMP_GRB_FILE, TMP_VECTORS_JSON_FILE])
    
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
const parseGribsToContoursJson = async (server: FastifyInstance) => {
    if (!PARSE_GRIB_CONTOURS_CMD) throw new Error('PARSE_GRIB_CONTOURS_CMD is missing from env')

    const child = spawn(PARSE_GRIB_CONTOURS_CMD, [TMP_GRB_FILE, TMP_CONTOURS_JSON_FILE])
    
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

const createWindVectorsFromJson = async () => {
    const jsonFile = await readFile(TMP_VECTORS_JSON_FILE)
    const json = jsonFile.toString('utf8')
    if (!json) throw new Error('Failed to read GRIBS vectors JSON')

    const wind = JSON.parse(json)
    const windInput = wind.map((w: CreateBulkWindInput) => {
        const ww = createWindSchema.parse(w)
        return ww
    }) as CreateSingleBulkWindInput[]
    await createWind(windInput)

    const timestamps = windInput.map(wind => wind.timestamp).sort()
    const oldest = timestamps[0]
    const newest = timestamps[timestamps.length - 1]
    
    return [oldest, newest]
}

const createWindContoursFromJson = async () => {
    const jsonFile = await readFile(TMP_CONTOURS_JSON_FILE)
    const json = jsonFile.toString('utf8')
    if (!json) throw new Error('Failed to read GRIBS contours JSON')

    const contours = JSON.parse(json)
    const windContoursInput = contours.map((c: CreateWindContoursInput) => {
        const cc = createWindContoursSchema.parse(c)
        return cc
    }) as CreateSingleWindContoursInput[]
    if (contours.length === 0) return
    const timestamps = windContoursInput.map(project('timestamp')).map(timestamp2date)
    await Promise.all(timestamps.map(deleteWindContoursByTimestamp))
    await createWindContours(windContoursInput)
}