import { getVideoIdFromUrl } from "../utils/youtubeUtils.js";
import { ServiceResponse } from "../models/serviceResponse.js";
import * as dbService from "../datalayer/db_service.js";
import { isNullOrEmpty } from "../utils/utils.js";
import { errorResponse, successResponse } from "../utils/serviceUtils.js";
import assert from "assert";
import { IGetCommentsRequest } from "../models/apimodels.js";

export async function getSentimentCount(videoId: string, email: string): Promise<ServiceResponse>  {
    if(isNullOrEmpty(videoId)) {
        return errorResponse("videoId is required!", 400);
    }
    const response = await dbService.getSentimentCountByVideoId(videoId, email);
    if(isNullOrEmpty(response)) {
        return errorResponse("Data not found!", 404);
    }
    return successResponse(response)
}

export async function getIntentCount(videoId: string, email: string): Promise<ServiceResponse>  {
    if(isNullOrEmpty(videoId)) {
        return errorResponse("videoId is required!", 400);
    }
    const response = await dbService.getIntentCountByVideoId(videoId, email);
    if(isNullOrEmpty(response)) {
        return errorResponse("Data not found!", 404);
    }
    return successResponse(response)
}

export async function getOffensiveCount(videoId: string, email: string): Promise<ServiceResponse>  {
    if(isNullOrEmpty(videoId)) {
        return errorResponse("videoId is required!", 400);
    }
    const response = await dbService.getOffensiveCountByVideoId(videoId, email);
    if(isNullOrEmpty(response)) {
        return errorResponse("Data not found!", 404);
    }
    return successResponse(response)
}

export async function getVideoDetails(videoId: string, email: string): Promise<ServiceResponse>  {
    if(isNullOrEmpty(videoId)) {
        return errorResponse("videoId is required!", 400);
    }
    const response = await dbService.getVideoDetails(videoId, email);
    if(isNullOrEmpty(response)) {
        return errorResponse("Data not found!", 404);
    }
    return successResponse(response)
}

export async function getUserVideos(email: string): Promise<ServiceResponse>  {
    const response = await dbService.getUserVideosByEmail(email);
    if(isNullOrEmpty(response)) {
        return errorResponse("Data not found!", 404);
    }
    return successResponse(response)
}

export async function getPendingVideoIds(email: string) {
    const response = await dbService.getPendingVideoIdsByUser(email);
    return successResponse(response);
}

export async function getComments(request: IGetCommentsRequest, email: string) {
    if(isNullOrEmpty(request.videoId) || isNullOrEmpty(request.pageNumber) || isNullOrEmpty(request.recordsPerPage)) {
        return errorResponse("videoId, pageNumber and recordsPerPage are required!", 400);
    }
    if(!(Number.isInteger(request.pageNumber) && Number.isInteger(request.recordsPerPage))) {
        return errorResponse("pageNumber and recordsPerPage should be valid integers!", 400);
    }
    if(pageNumber < 1 || recordsPerPage < 1) {
        return errorResponse("pageNumber and recordsPerPage should be greater than zero!", 400);
    }
    const response = await dbService.getCommentsByVideoId(videoId, pageNumber, recordsPerPage, email);
    if(isNullOrEmpty(response)) {
        return errorResponse("Data not found!", 404);
    }
    return successResponse(response);
}

export async function processVideo(videoUrl: string, email: string): Promise<ServiceResponse>  {
    if(isNullOrEmpty(videoUrl)) {
        return errorResponse("Video url is required!", 400);
    }
    const videoId = await getVideoIdFromUrl(videoUrl);
    if(isNullOrEmpty(videoId)) {
        return errorResponse("Video url is not valid!", 400);
    }
    assert (videoId != null);
    const processVideo = await dbService.processVideoByVideoId(videoId, new Date(), email);
    if(processVideo) {
        // call queueService to process videoId by MLService 
    }
    return successResponse();
}
