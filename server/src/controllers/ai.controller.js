const { GigaChat } = require("gigachat");
const { Agent } = require("node:https");
const formatResponse = require("../utils/formatResponse");
require("dotenv").config();

class ChatController {
  static async getChats(req, res) {
    try {
      const { title } = req.body;
      if (!title)
        return res.status(400).json(formatResponse(400, "Заполни данные"));

      const httpsAgent = new Agent({
        rejectUnauthorized: false, // Отключает проверку корневого сертификата
        // Читайте ниже как можно включить проверку сертификата НУЦ Минцифры
      });

      const client = new GigaChat({
        model: "GigaChat-2",
        credentials: process.env.GIGACHAT_API_KEY,
        httpsAgent: httpsAgent,
      });

      const response = await client.chat({
        messages: [
          {
            role: "user",
            content: `Твоя задача сгенерировать фото на основе промта ${title}`,
          },
        ],
      });
      const poem = response.choices[0].message.content;
      return res.status(200).json(formatResponse(200, "Успешно", poem));
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ChatController;