export interface ServiceResponse {
    data?: any;
    error?: ServiceError   
}

export interface ServiceError {
    message: string;
    errorCode: number;
}