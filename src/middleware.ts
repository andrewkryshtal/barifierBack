import jwt from "jsonwebtoken";

export const applyMiddleware = (req, res, next) => {
  console.log({ dataMiddleware: req.body });

  next();
};

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token.split(" ")[1], "secret", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};
