const jwt = require("jsonwebtoken");
require('dotenv').config();
module.exports= {
    verifyTokenAdmin: async (req, res, next) => {
    const accessToken = req.headers["x-access-token"];

    if (!accessToken) {
      return res.status(401).json({ message: "Missing token" });
    }

    jwt.verify(accessToken,  process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token/Token expired" });
      }
     
      req.user = decoded;
      if(decoded.role == "ADMIN") {
        req.user["ADMIN"] = true;
      } else {
        req.user["ADMIN"] = false;
      }
      next();
      
    });
  }
}