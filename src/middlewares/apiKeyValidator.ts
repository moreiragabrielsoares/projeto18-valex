import { Request, Response, NextFunction } from 'express';



export function validateApiKey (req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey === "") {
        res.status(401).send('Invalid header');
        return;
    }

    res.locals.apiKey = apiKey;

    next();
}