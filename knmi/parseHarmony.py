#!/usr/bin/env python3

import sys
import pygrib
import json
from datetime import datetime

inputFilename = sys.argv[1]

grbs = pygrib.open(inputFilename)

u = grbs.select(indicatorOfParameter=33)
v = grbs.select(indicatorOfParameter=34)

# time 
uData = [ uu.data() for uu in u ]
vData = [ vv.data() for vv in v ]

#  20241004 5:00
def makeTimestamp(dataDate, validityTime):
    year = int(dataDate[:4])
    month = int(dataDate[4:6])
    day = int(dataDate[6:8])
    hour = int(validityTime/100)
    min = 0
    return datetime(year, month, day, hour, min).isoformat() + 'Z'

outputFile = sys.stdout
if (len(sys.argv) > 2):
    outputFile = open(sys.argv[2], "w")

json.dump(
    [
        {
            "timestamp": makeTimestamp(f"{u[iTime].dataDate}", u[iTime].validityTime),
            "data" : [
                {
                    "lat": "%.4f" % uData[iTime][1][iLat][iLon],
                    "lng": "%.4f" % uData[iTime][2][iLat][iLon],
                    "u": "%.4f" % uData[iTime][0][iLat][iLon],
                    "v": "%.4f" % vData[iTime][0][iLat][iLon],
                }
                for iLat in range(len(uData[iTime][0]))
                for iLon in range(len(uData[iTime][0][0]))
            ]
        }
        for iTime in range(len(u))
    ],
    outputFile
)
