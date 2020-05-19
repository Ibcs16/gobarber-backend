import { inject, injectable } from 'tsyringe';
import path from 'path';
import fs from 'fs';
import updateConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor (
    @inject('StorageProvider') private storageProvider: IStorageProvider,
    @inject('UsersRepository') private usersRepository: IUsersRepository) {};

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only existing user can update avatar', 401);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = fileName;

    this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
