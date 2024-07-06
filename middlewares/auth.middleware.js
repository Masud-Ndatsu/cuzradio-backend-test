const { verifyAccessToken } = require("../utils/encryption");
const userRepo = require("../repository/user.repository");

const authenticate = async (req, res, next) => {
     try {
          const authHeader = req.headers.authorization;
          if (!authHeader) {
               return res.status(401).json({
                    status: false,
                    data: null,
                    message: "No token provided",
               });
          }

          const token = authHeader.split(" ")[1];
          const decodedToken = verifyAccessToken(token);
          const user = await userRepo.GetUserById(decodedToken.userId);

          if (!user) {
               return res.status(401).json({
                    status: false,
                    data: null,
                    message: "Unauthorized",
               });
          }

          if (user.status === "inactive") {
               return res.status(401).json({
                    status: false,
                    data: null,
                    message: "You have been deactivated!",
               });
          }

          req.user = user;
          next();
     } catch (error) {
          res.status(401).json({
               status: false,
               data: null,
               message: "Unauthorized",
          });
     }
};

const checkPermission = (roles) => {
     return (req, res, next) => {
          try {
               if (!req.user || !req.user.hasPermission(roles)) {
                    return res.status(403).json({
                         status: false,
                         data: null,
                         message: "Forbidden",
                    });
               }
               next();
          } catch (error) {
               res.status(401).json({
                    status: false,
                    data: null,
                    message: "Unauthorized",
               });
          }
     };
};

module.exports = { checkPermission, authenticate };
