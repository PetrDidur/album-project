const formatResponse = require("../utils/formatResponse");

function isValidId(req, res, next) {
  const { id } = req.params;
  if (Number.isNaN(+id))
    return res
      .status(400)
      .json(formatResponse(400, "Введи id числом", null, "Не число"));
  next();
}

module.exports = isValidId;
