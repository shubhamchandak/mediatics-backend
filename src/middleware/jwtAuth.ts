import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { isNullOrEmpty } from '../utils/utils.js';
import { ACCESS_TOKEN_EXPIRY_MS } from '../constants.js';

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const access_token = req.cookies["access_token"];
    if(isNullOrEmpty(access_token)) {
        return res.sendStatus(401);
    }
    const data = verifyToken(access_token);
    if(isNullOrEmpty(data)) {
        return res.sendStatus(401);
    }
    if(isNullOrEmpty(req.body)) {
        req.body = {};
    }
    req.body["session"] = data;
    next();
}

export function generateAccessToken(data: any) {
    delete data['exp'];
    // data['iat'] = Date.now();
    data['iss'] = 'https://mediatics.net'
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY_MS });
}

function verifyToken(token: string) {
    return jwt.verify(token, process.env.TOKEN_SECRET);
}