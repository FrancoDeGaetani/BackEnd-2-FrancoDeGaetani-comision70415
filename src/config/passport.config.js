import passport from "passport";
import jwt from "passport-jwt"; 

const JWTStrategy = jwt.Strategy; 
const ExtractJwt = jwt.ExtractJwt; 

const initializePassport = () => {
    passport.use("current", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), 
        secretOrKey: "coderhouse"
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload); 
        } catch (error) {
            return done(error);
        }
    }))
}

const cookieExtractor = (req) => {
    console.log("Cookies recibidas:", req.cookies);
    let token = null; 
    if(req && req.cookies) {
        token = req.cookies["CookieToken"]; 
    }
    console.log("Token extraído:", token);
    return token; 
}

export default initializePassport; 