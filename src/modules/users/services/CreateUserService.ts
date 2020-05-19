import { inject, injectable } from 'tsyringe';
import { hash } from 'bcryptjs';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {

  constructor (@inject('HashProvider') private hashProvider: IHashProvider,@inject('UsersRepository') private usersRepository: IUsersRepository) {};

  public async execute({ name, email, password }: IRequest): Promise<User> {

    const checkIfUserExists = await this.usersRepository.findByEmail(email);

    if (checkIfUserExists) {
      throw new AppError('Email adress already in use.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
