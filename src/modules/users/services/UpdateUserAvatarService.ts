import { inject, injectable } from 'tsyringe';
import path from 'path';
import fs from 'fs';
import updateConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatar {
  constructor (@inject('UsersRepository') private usersRepository: IUsersRepository) {};

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only existing user can update avatar', 401);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(updateConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatar;
