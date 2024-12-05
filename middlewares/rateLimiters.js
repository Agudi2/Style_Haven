const rateLimit = require('express-rate-limit');

exports.logInLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login requests per `window` (here, per 1 minute)
    handler: (req, res, next) => {
        let err = new Error('Too many login requests. Try again later');
        err.status = 429;
        return next(err);
    }
});
