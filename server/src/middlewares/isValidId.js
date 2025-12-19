const formatResponse = require("../utils/formatResponse");

function isValidId(req, res, next) {
  // Проверяем разные возможные параметры
  const { id, albumId } = req.params;
  const checkId = id || albumId; // Проверяем оба варианта
  
  console.log('isValidId проверяет:', { id, albumId, checkId });
  
  if (!checkId) {
    return res.status(400).json(formatResponse(400, "ID не указан"));
  }
  
  if (Number.isNaN(+checkId)) {
    return res.status(400).json(formatResponse(400, "Введи id числом", null, "Не число"));
  }
  
  // Преобразуем в число
  if (id) req.params.id = +checkId;
  if (albumId) req.params.albumId = +checkId;
  
  next();
}

module.exports = isValidId;