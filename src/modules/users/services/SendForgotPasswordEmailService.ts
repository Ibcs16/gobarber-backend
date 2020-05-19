import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/providers/MailProvider/models/IMailProvider'
import FakeMailprovider from '@shared/providers/MailProvider/fakes/FakeMailProvider';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {

  constructor (
    @inject('UserTokensRepository') private userTokensRepository: IUserTokensRepository,
    @inject('MailProvider') private mailprovider: IMailProvider,
    @inject('UsersRepository') private usersRepository: IUsersRepository) {};

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User does not exist.');
    }

    await this.userTokensRepository.generate(user.id)

    this.mailprovider.sendMail(email, 'Pedido de recuperação de senha recebido');
  }
}

export default SendForgotPasswordEmailService;
