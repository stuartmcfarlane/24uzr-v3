#!/usr/bin/env python3

import sys
import pygrib
import json
import datetime

inputFilename = sys.argv[1]

grbs = pygrib.open(inputFilename)

u = grbs.select(indicatorOfParameter=33)
v = grbs.select(indicatorOfParameter=34)

# time 
uData = [ uu.data() for uu in u ]
vData = [ vv.data() for vv in v ]

#  20241004 5:00
def makeTimestamp(u):
    timestamp = u.validDate + datetime.timedelta(hours=u.startStep)
    return timestamp.isoformat() + 'Z'

outputFile = sys.stdout
if (len(sys.argv) > 2):
    outputFile = open(sys.argv[2], "w")

json.dump(
    [
        {
            "timestamp": makeTimestamp(u[iTime]),
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
