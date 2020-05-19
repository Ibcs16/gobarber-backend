import IMailProvider from "../models/IMailProvider";

interface Message {
  to: string;
  body: string;
}

export default class FakeMailprovider implements IMailProvider {
  private messages: Message[] = [];

  public async sendMail(to: string, body: string): Promise<void> {
    this,this.messages.push({
      to,
      body,
    })
  }

}
