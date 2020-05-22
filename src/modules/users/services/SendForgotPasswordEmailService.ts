import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('MailProvider') private mailprovider: IMailProvider,
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User does not exist.');
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    await this.mailprovider.sendMail(
      email,
      `Pedido de recuperação de senha recebido ${token}`,
    );
  }
}

export default SendForgotPasswordEmailService;
