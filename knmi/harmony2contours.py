#!/usr/bin/env python3

import json
from json import encoder
import sys
import pygrib
import math
import datetime
import matplotlib.pyplot as plt
import numpy as np

from contourpy import contour_generator, LineType

bft = [0.2, 1.5, 3.3, 5.4, 7.9, 10.7, 13.8, 17.1, 20.7, 24.2, 28.4, 32.6]

inputFilename = '../data/harmony.grb'
# inputFilename = sys.argv[1]

gribs = pygrib.open(inputFilename)

u = gribs.select(indicatorOfParameter=33)
v = gribs.select(indicatorOfParameter=34)

# time 
uData = [ uu.data() for uu in u ]
vData = [ vv.data() for vv in v ]

#  20241004 5:00
def makeTimestamp(u):
    timestamp = u.validDate + datetime.timedelta(hours=u.startStep)
    return timestamp.isoformat() + 'Z'

timeSlices = [
    {
        "timestamp": makeTimestamp(u[iTime]),
        "x" : [
            uData[iTime][1][iLat][iLon]
            for iLat in range(len(uData[iTime][0]))
            for iLon in range(len(uData[iTime][0][0]))
        ],
        "y" : [
            uData[iTime][2][iLat][iLon]
            for iLat in range(len(uData[iTime][0]))
            for iLon in range(len(uData[iTime][0][0]))
        ],
        "v" : [
            [
                uData[iTime][0][iLat][iLon],
                vData[iTime][0][iLat][iLon]
            ]
            for iLat in range(len(uData[iTime][0]))
            for iLon in range(len(uData[iTime][0][0]))
        ],
        "data" : [
            {
                "y": uData[iTime][1][iLat][iLon],
                "x": uData[iTime][2][iLat][iLon],
                "u": uData[iTime][0][iLat][iLon],
                "v": vData[iTime][0][iLat][iLon],
            }
            for iLat in range(len(uData[iTime][0]))
            for iLon in range(len(uData[iTime][0][0]))
        ]
    }
    for iTime in range(len(u))
]

timeSlice = timeSlices[0]

def makeContours(timeSlice):
    xSet = set()
    ySet = set()
    m = dict()
    uv = dict()
    for d in timeSlice.get('data'):
        x = d['x']
        y = d['y']
        u = d['u']
        v = d['v']
        xSet.add(x)
        ySet.add(y)
        m.setdefault(x, dict())
        m[x][y] = math.sqrt(u*u + v*v)
        uv.setdefault(x, dict())
        uv[x][y] = (u, v)

    xs = np.sort(list(xSet))
    ys = np.sort(list(ySet))
    Z = [
        [
            math.sqrt(uv[x][y][0] ** 2 + uv[x][y][1] ** 2)
            for y in ys
        ]
        for x in xs
    ]


    X, Y = np.meshgrid(xs, ys, indexing='ij')

    cont_gen = contour_generator(X, Y, Z, line_type=LineType.Separate)

    contours = [
        cont_gen.lines(level)
        for level in bft
    ]
    return contours

def encodeForJson(contour):
    encoded = [
        [
            [
                [round(line[0], 5), round(line[1], 5)]
                for line in polygon
            ]
            for polygon in lineSet
        ]
        for lineSet in contour
    ]
    return encoded

outputFile = sys.stdout
if (len(sys.argv) > 2):
    outputFile = open(sys.argv[2], "w")

json.dump(
    [
        {
            "timestamp": timeSlice['timestamp'],
            "levels" : bft,
            "contours": encodeForJson(makeContours(timeSlice)),
        }
        for timeSlice in timeSlices
    ],
    outputFile
)
