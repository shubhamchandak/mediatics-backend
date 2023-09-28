export interface ServiceResponse {
    data?: any;
    statusCode?: number;
    error?: ServiceError;   
}

export interface ServiceError {
    message: string;
    errorCode: number;
}