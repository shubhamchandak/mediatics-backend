import { isValidVideoId } from "../utils/youtubeUtils.js";
import { ServiceResponse } from "../models/serviceResponse.js";
import * as dbService from "../datalayer/db_service.js";
import { isNullOrEmpty } from "../utils/utils.js";

export async function getSentimentCount(videoId: string, email: string): Promise<ServiceResponse>  {
    videoId = videoId.trim();
    const response = dbService.getSentimentCountByVideoId(videoId, email);
    if(isNullOrEmpty(response)) {
        return errorResponse("Data not found!", 404);
    }
    return successResponse(response)
}

export async function getIntentCount(videoId: string, email: string): Promise<ServiceResponse>  {
    videoId = videoId.trim();
    const response = dbService.getIntentCountByVideoId(videoId, email);
    if(isNullOrEmpty(response)) {
        return errorResponse("Data not found!", 404);
    }
    return successResponse(response)
}

export async function getOffensiveCount(videoId: string, email: string): Promise<ServiceResponse>  {
    videoId = videoId.trim();
    const response = dbService.getOffensiveCountByVideoId(videoId, email);
    if(isNullOrEmpty(response)) {
        return errorResponse("Data not found!", 404);
    }
    return successResponse(response)
}

export async function getVideoDetails(videoId: string, email: string): Promise<ServiceResponse>  {
    videoId = videoId.trim();
    const response = dbService.getVideoDetails(videoId, email);
    if(isNullOrEmpty(response)) {
        return errorResponse("Data not found!", 404);
    }
    return successResponse(response)
}

export async function getUserVideos(email: string): Promise<ServiceResponse>  {
    const response = dbService.getUserVideosByEmail(email);
    if(isNullOrEmpty(response)) {
        return errorResponse("Data not found!", 404);
    }
    return successResponse(response)
}

function errorResponse(message: string, errorCode: number): ServiceResponse {
    return {error: {
        message: message,
        errorCode: errorCode
    }};
}

function successResponse(data?: any): ServiceResponse {
    return {data: isNullOrEmpty(data) ? {} : data};
}
