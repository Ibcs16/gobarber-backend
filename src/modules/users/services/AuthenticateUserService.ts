import { inject, injectable } from 'tsyringe';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor (@inject('HashProvider') private hashProvider: IHashProvider, @inject('UsersRepository') private usersRepository: IUsersRepository) {};

  public async execute({ email, password }: IRequest): Promise<Response> {

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const passwordIsMatch = await this.hashProvider.compareHash(password, user.password);

    if (!passwordIsMatch) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
