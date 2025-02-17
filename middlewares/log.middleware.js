import { loggerService } from "../services/logger.service.js";

export function log(req, res, next) {
    const { method, url, params, query, body } = req;
    const nextFunctionName = next.name || 'anonymous function';
    if (next.name) console.log(next.name);
    
    loggerService.info(
        `Visited route ${req.route.path}. Calling next function: ${nextFunctionName} with parameters:`,
        { method, url, params, query, body }
    );
    next();
}