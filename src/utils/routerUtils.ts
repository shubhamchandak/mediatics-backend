import { Response } from "express";
import { ServiceResponse } from "../models/serviceResponse.js";

export function sendResponse(response: ServiceResponse, res: Response) {
    if(response.error) {
      return res.status(response.error.errorCode).json(response.error);
    }
    res.status(response.statusCode || 200).json({data: response.data});
  }