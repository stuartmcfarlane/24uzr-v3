import sys
import pygrib
import json

inputFilename = sys.argv[1]

grbs = pygrib.open(inputFilename)

u = grbs.select(indicatorOfParameter=33)
v = grbs.select(indicatorOfParameter=34)

# time 
uData = [ uu.data() for uu in u ]
vData = [ vv.data() for vv in v ]

json.dump(
    [
        {
            "timestamp": f"{u[iTime].dataDate} {int(u[iTime].validityTime / 100)}:00",
            "data" : [
                {
                    "lat": "%.4f" % uData[iTime][1][iLat][iLon],
                    "lon": "%.4f" % uData[iTime][2][iLat][iLon],
                    "u": "%.4f" % uData[iTime][0][iLat][iLon],
                    "v": "%.4f" % vData[iTime][0][iLat][iLon],
                }
                for iLat in range(len(uData[iTime][0]))
                for iLon in range(len(uData[iTime][0][0]))
            ]
        }
        for iTime in range(len(u))
    ],
    sys.stdout
)
