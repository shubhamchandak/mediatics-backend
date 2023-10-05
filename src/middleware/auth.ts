import { Request, Response, NextFunction } from 'express'
import { OAuth2Client } from 'google-auth-library'; 
import { isNullOrEmpty } from '../utils/utils.js';
const client = new OAuth2Client();

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const id_token = req.cookies["id_token"];
    verify(id_token)
    .then(data => {
        if(isNullOrEmpty(req.body)) {
            req.body = {};
        }
        req.body["session"] = data;
        req.body["session"]["firstName"] = data?.given_name;
        req.body["session"]["lastName"] = data?.family_name ? data?.family_name : "";
        next();
    })
    .catch(err => {
        console.log(err);
        res.status(401).json({
            message: "Authentication failed!"
        })
    });
}

async function verify(id_token: string) {
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
