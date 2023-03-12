import dotenv from "dotenv";
dotenv.config();
// jeton authentification jwt
import pkg from "jsonwebtoken";
const jwt = pkg;

//
//
// JWT authentification create token
export function createToken(user) {
    const payload = {
        username: user.username,
        id: user.id,
    };
    const options = {
        expiresIn: "10h",
    };
    return jwt.sign(payload, process.env.JWT_SECRET, options);
}

// check if token is valid
export function checkToken(req, res, next) {
    const token = req.body.token;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.status(401).json({ message: "Invalid token" });
            } else {
                req.decodedToken = decodedToken;
                res.status(200).json({ message: "Valid token" });
                next();
            }
        });
    } else {
        res.status(401).json({ message: "No token provided" });
    }
}

// check if token is valid when user GET data
export function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];


    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }

        req.decodedToken = decodedToken;
        next();
    });
}
