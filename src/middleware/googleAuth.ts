import { Request, Response, NextFunction } from 'express'
import { OAuth2Client } from 'google-auth-library'; 
import { isNullOrEmpty } from '../utils/utils.js';
import { ACCESS_TOKEN_EXPIRY_MS } from '../constants.js';
import * as jwtAuth from './jwtAuth.js'
const client = new OAuth2Client();

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const id_token = req.cookies["id_token"];
    if (isNullOrEmpty(id_token)) {
        return res.sendStatus(401);
    }
    let payload;
    try {
        payload = await verify(id_token);
    } catch(err) {
        return res.status(401).json({
            message: "Cannot verify Google Account Credentials!"
        });
    };

    const access_token = jwtAuth.generateAccessToken(payload);
    res.cookie('access_token', access_token, {
        httpOnly: true,
        maxAge: ACCESS_TOKEN_EXPIRY_MS, // (optional)
        secure: true, // Set to true if using HTTPS
    });
    next();
}
    

export async function verify(id_token: string) {
    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: '841355690055-kbh38gpf8c04bk8v6dd6amh50cpsqqpf.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return payload;
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}
