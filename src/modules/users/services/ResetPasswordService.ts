import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {

  constructor (
    @inject('UserTokensRepository') private userTokensRepository: IUserTokensRepository,
    @inject('UsersRepository') private usersRepository: IUsersRepository) {};

  public async execute({ password, token }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exist')
    }

    const user = await this.usersRepository.findById(userToken.user_id)

    if (!user) {
      throw new AppError('User does not exist')
    }

    user.password = password;

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
