/***
 * install jsonwebtoken
 * jwt.sign(payload,secret,{expireIn:})
 * token client side to sent
 * 
 */

/**
 * how to stroe token in the client side 
 * 1. memory --> ok type
 * 2. local storage --> ok type (XSS)
 * (help: express cokie purser, express set cokies)
 * 3. cookies: http only
 * 
 */


/**
 * 1. set cookies http only
 * 2. use cors: app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
 ***
 3. client side axios setting
 4. in axios set withCredentials true;



 */

 /**
  * 1. to send cookies from the client make sure you added withcredentials true for the api call using axios 
  * 2. use cookieParse as middlewear
  */