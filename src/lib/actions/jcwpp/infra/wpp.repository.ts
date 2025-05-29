import axios from "axios";

export class WppRepository {
  private url = process.env.JCWPP_URL;
  private sessionId = process.env.JCWPP_SESSION_ID;
  private wpp = axios.create({
    baseURL: this.url,
    headers: {
      ["secret"]: process.env.JCWPP_TOKEN,
    },
  });

  async sendMessageText(phone: string, message: string) {
    try {
      await this.wpp.post("/instance/" + this.sessionId + "/send-text", {
        number: phone,
        message,
      });
    } catch (error) {
      console.log("-------------------------");
      console.log("Error ao enviar mensagem.");
      console.log("-------------------------");
      throw new Error("Erro ao enviar mensagem.");
    }
  }

  async sendGroupMessageText(message: string) {
    try {
      await this.wpp.post("/instance/" + this.sessionId + "/send-group-text", {
        groupId: process.env.JCWPP_GROUP_JID,
        message,
      });
    } catch (error) {
      console.log("----------------------------------");
      console.log("Error ao enviar mensagem no grupo.");
      console.log("----------------------------------");
      throw new Error("Error ao enviar mensagem no grupo");
    }
  }
}
