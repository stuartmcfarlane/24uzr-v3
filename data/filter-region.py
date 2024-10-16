#!/usr/bin/env python3

import sys
import json

outputFile = sys.stdout
if (len(sys.argv) > 2):
    outputFile = open(sys.argv[2], 'w')

inputFile = sys.stdin
if (len(sys.argv) > 1):
    inputFile = open(sys.argv[1], 'r')

targetRegion = {
    'lat1': 52,
    'lon1': 4,
    'lat2': 54,
    'lon2': 6,
}
# targetRegion = {
#     'lat1': 52.308817,
#     'lon1': 4.777908,
#     'lat2': 53.250845,
#     'lon2': 5.797875,
# }
inputGeoJson = json.load(inputFile)

def isInRegion(targetRegion, feature):
    for point in feature['geometry']['coordinates']:
        if targetRegion['lon1'] < point[0] and point[0] < targetRegion['lon2'] and targetRegion['lat1'] < point[1] and point[1] < targetRegion['lat2']:
            return True
    return False

filtered = {
    'features': [
        feature
        for feature
        in inputGeoJson['features']
        if (isInRegion(targetRegion, feature))
    ]
}

json.dump(filtered, outputFile)