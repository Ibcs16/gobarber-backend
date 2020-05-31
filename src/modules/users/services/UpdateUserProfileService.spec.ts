import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateUserProfileService from './UpdateUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserProfile: UpdateUserProfileService;

describe('Updateprofile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateUserProfile = new UpdateUserProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Iago',
      email: 'iago@mail.com',
      password: '123456',
    });

    const updatedUser = await updateUserProfile.execute({
      user_id: user.id,
      name: 'Iago Doe',
      email: 'iago-outro@mail.com',
      // password: '123456',
    });

    expect(updatedUser.name).toBe('Iago Doe');
    expect(updatedUser.email).toBe('iago-outro@mail.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Iago',
      email: 'iago@mail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Doe',
      email: 'doe@mail.com',
      password: '123456',
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        name: 'Doe O.',
        email: 'iago@mail.com',
        // password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Iago',
      email: 'iago@mail.com',
      password: '123456',
    });

    const updatedUser = await updateUserProfile.execute({
      user_id: user.id,
      name: 'Iago Doe',
      email: 'iago-outro@mail.com',
      old_password: '123456',
      password: '444444',
    });

    expect(updatedUser.password).toBe('444444');
  });

  it('should not be able to update password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Iago',
      email: 'iago@mail.com',
      password: '123456',
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        name: 'Iago Doe',
        email: 'iago-outro@mail.com',
        password: '444444',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Iago',
      email: 'iago@mail.com',
      password: '123456',
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        name: 'Iago Doe',
        email: 'iago-outro@mail.com',
        old_password: 'wrong-old-password',
        password: '444444',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update profile from non existing user', async () => {
    await expect(
      updateUserProfile.execute({
        user_id: 'non-existing',
        name: 'Iago',
        email: 'iago@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
