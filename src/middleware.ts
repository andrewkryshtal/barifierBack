export const applyMiddleware = (req, res, next) => {
  console.log({ dataMiddleware: req.body });

  next();
};
