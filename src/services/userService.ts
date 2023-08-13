import * as dbService from "../datalayer/db_service.js";
import { ICreateNewUserRequest } from "../models/apimodels.js";
import { IUserDetails } from "../models/dbmodels.js";
import { ServiceResponse } from "../models/serviceResponse.js";
import { isNullOrEmpty, validateEmail } from "../utils/utils.js";

export async function getUserByEmail(email: string): Promise<ServiceResponse> {
    email = email.trim();
    if(isNullOrEmpty(email) || !validateEmail(email)) {
        return errorResponse("Email is not valid!");
    }
    const userDetails = await dbService.getUserByEmail(email);
    if(isNullOrEmpty(userDetails)) {
        return errorResponse("User does not exist!");
    }
    return successResponse(userDetails);
}

export async function createNewUser(request: ICreateNewUserRequest): Promise<ServiceResponse> {
    if(isNullOrEmpty(request.firstName) || isNullOrEmpty(request.lastName)) {
        return errorResponse("First and Last Name cannot be empty!")
    }
    if(isNullOrEmpty(request.email) || !validateEmail(request.email)) {
        return errorResponse("Email is not valid!");
    }
    const userDetails: IUserDetails = {
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        createdOn: new Date(),
        updatedOn: new Date(),
        status: 1
    }
    const response = dbService.createNewUser(userDetails);
    return successResponse();
}

function errorResponse(error: string): ServiceResponse {
    return {error: error};
}

function successResponse(data?: any): ServiceResponse {
    return {data: isNullOrEmpty(data) ? {} : data};
}