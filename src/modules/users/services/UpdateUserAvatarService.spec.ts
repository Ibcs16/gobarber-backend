
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeStorageProvider from '@shared/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to update user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(fakeStorageProvider, fakeUsersRepository);

    const user = await fakeUsersRepository.create({
      name: 'Iago',
      email: 'iago@mail.com',
      password: '123456'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg'
    })

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar of non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(fakeStorageProvider, fakeUsersRepository);


    await expect(updateUserAvatar.execute({
      user_id: '0',
      avatarFilename: 'avatar.jpg'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should should delete old avatar when updating avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(fakeStorageProvider, fakeUsersRepository);

    const user = await fakeUsersRepository.create({
      name: 'Iago',
      email: 'iago@mail.com',
      password: '123456'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg'
    })

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

    expect(user.avatar).toBe('avatar2.jpg');
  });
})
