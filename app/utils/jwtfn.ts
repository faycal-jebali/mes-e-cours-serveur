const permissions = require("./permssions.ts");
const jwt = require("jsonwebtoken");
const accessTokenSecret =
  "qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq";

const authenticateJWT = (mustAuth) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      console.log("authHeader :: ", token);

      jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
          if (!mustAuth) {
            req.user = { role: ["guest"] };
            return next();
          } else {
            return res.sendStatus(403);
          }
        }
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };
};

const minimumPermissionLevelRequired = (apiName, required_permission_level) => {
  return (req, res, next) => {
    // console.log("req :: ", req);
    console.log("User minimumPermissionLevelRequired :: ", req.user);
    const guards = permissions.permissions.filter((item) =>
      req.user.role.includes(item.role)
    );
    const listGuards = guards[0][apiName];
    // console.log("Req :: ", req.method);
    console.log("guards :: ", guards);
    console.log("listGuards :: ", listGuards);
    if (listGuards.includes(required_permission_level)) {
      req.restrictionData = false;
      return next();
    } else {
      req.restrictionData = true;
      return next();
      // return res.status(403).send();
    }
  };
};
module.exports = { authenticateJWT, minimumPermissionLevelRequired };
