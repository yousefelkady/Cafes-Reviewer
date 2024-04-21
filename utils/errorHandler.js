module.exports.asyncErrorHandler = function (fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};
