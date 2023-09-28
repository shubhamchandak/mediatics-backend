import { ServiceResponse } from "../models/serviceResponse.js";
import { isNullOrEmpty } from "./utils.js";

export function errorResponse(message: string, errorCode: number): ServiceResponse {
    return {error: {
        message: message,
        errorCode: errorCode
    }};
}

export function successResponse(data?: any, statusCode?: number): ServiceResponse {
    return {
        data: isNullOrEmpty(data) ? {} : data, 
        statusCode: statusCode
    };
}