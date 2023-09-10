import { Response } from "express";
import { ServiceResponse } from "../models/serviceResponse.js";

export function sendResponse(response: ServiceResponse, res: Response) {
    if(response.error) {
      return res.status(response.error.errorCode).json({message: response.error});
    }
    res.status(200).json({data: response.data});
  }