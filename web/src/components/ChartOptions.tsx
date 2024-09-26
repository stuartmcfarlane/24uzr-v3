import { IApiBuoyInput, IApiBuoyOutput, IApiLeg, IApiLegInput, IApiLegOutput, IApiMapOutput } from "@/types/api"
import EditBuoyForm from "./EditBuoyForm"
import AddBuoyForm from "./AddBuoyForm"
import { ChangeEvent, useState } from "react"
import { parseBuoys, parseLegs } from "@/lib/parsers"
import { useChange } from '../hooks/useChange';
import { createBuoys, createLegs, getBuoys, getLegs, updateBuoy, updateBuoyWithForm, updateLeg } from "@/actions/map"
import { fieldIs, nameIs, withField } from "@/lib/fp"
import { uniqueHash } from '../lib/fp';

type ChartOptionsProps = {
    map: IApiMapOutput
}
const ChartOptions = (props: ChartOptionsProps) => {
    const {
        map,
    } = props

    const [buoys, setBuoys] = useState<IApiBuoyInput[]>([])
    const [legs, setLegs] = useState<IApiLegInput[]>([])
    const [bulkData, setBulkData] = useState<string>('')
    const [unparsedData, setUnparsedData] = useState<string>('')

    useChange(
        async () => {
            if (!unparsedData) return
            const { parsed: parsedBuoys, unparsed: unparsedBuoys } = parseBuoys(unparsedData)
            const buoys = uniqueHash(
                (buoy => buoy.name),
                parsedBuoys.map(
                    nameLatLng => ({
                        mapId: map.id,
                        ...nameLatLng
                    } as IApiBuoyInput)
                )
            )
            if (buoys.length) {
                const mapBuoys = await getBuoys(map.id)
                const mapBuoysByName = mapBuoys.reduce(
                    (buoysByName, buoy) => {
                        buoysByName.set(buoy.name, buoy)
                        return buoysByName
                    },
                    new Map<string, IApiBuoyOutput>()
                )
                const creatingBuoys = buoys.filter(
                    buoy => !mapBuoys.find(nameIs(buoy.name))
                )
                const updatingBuoys = mapBuoys.filter(
                    buoy => buoys.find(nameIs(buoy.name))
                )
                await createBuoys(creatingBuoys)
                await Promise.all(updatingBuoys.map(
                    buoy => {
                        const id = mapBuoysByName.get(buoy.name)?.id
                        return updateBuoy(id!, buoy)
                    }
                ))
            }
            const mapBuoys = await getBuoys(map.id)
            const { parsed: parsedLegs, unparsed: unparsedLegs } = parseLegs(mapBuoys, unparsedBuoys)
            if (parsedLegs.length) {
                const mapLegs = await getLegs(map.id)
                const legName = (leg: IApiLeg) => `${leg.startBuoyId}:${leg.endBuoyId}`
                const isSameLeg = (needle: IApiLeg) => (haystack: IApiLeg) => (
                    legName(needle) === legName(haystack)
                )
                const legs = uniqueHash(legName, parsedLegs)
                const creatingLegs = legs.filter(
                    leg => !mapLegs.find(isSameLeg(leg))
                )
                await createLegs(creatingLegs)
            }
            setBulkData(unparsedLegs)
        },
        [unparsedData]
    )
    useChange(
        async () => {
            if (buoys.length) {
                const createdBuoys = await createBuoys(buoys)
                const { parsed: legs, unparsed } = parseLegs(createdBuoys, unparsedData)
                setUnparsedData(unparsed)
                setLegs(legs)
                setBuoys([])
            }
        },
        [buoys]
    )
    useChange(
        async () => {
            if (legs.length) {
                const createdLegs = await createLegs(legs)
                setLegs([])
                setBulkData(unparsedData)
                setUnparsedData('')
            }
        },
        [legs]
    )
    const onImportData = () => {
        setUnparsedData(bulkData)
    }
    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const bulkData = e.target.value
        setBulkData(bulkData)        
    }
    return (
        <div className="flex flex-col gap-4 flex-grow">
            {bulkData && <button
                onClick={onImportData}
                className="bg-24uzr text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed"
            >
                Import data
            </button>}
            <div className="flex-grow">
                <textarea
                    name="bulkAdd"
                    placeholder="paste buoy and/or legs"
                    className="ring-2 ring-gray-300 rounded-md p-4 h-full min-h-full"
                    rows={1}
                    onChange={onChange}
                    value={bulkData}
                />
            </div>
        </div>
    )
}

export default ChartOptions