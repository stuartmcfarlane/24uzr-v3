import { IApiShipOutput } from "@/types/api";
import { fieldIs } from "tslib";

export const isActive = fieldIs<IApiShipOutput, 'isActive'>('isActive')(true)