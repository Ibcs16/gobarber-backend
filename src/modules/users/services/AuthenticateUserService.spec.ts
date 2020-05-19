import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeHashProvider, fakeUsersRepository);
    const authenticateUser = new AuthenticateUserService(fakeHashProvider, fakeUsersRepository);

    const user = await createUser.execute({
      name: 'Iago',
      email: 'iago@email.com',
      password: '123',
    });

    const response = await authenticateUser.execute({
      email: 'iago@email.com',
      password: '123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(fakeHashProvider, fakeUsersRepository);

    await expect(authenticateUser.execute({
      email: 'iago@email.com',
      password: '123',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeHashProvider, fakeUsersRepository);
    const authenticateUser = new AuthenticateUserService(fakeHashProvider, fakeUsersRepository);

    await createUser.execute({
      name: 'Iago',
      email: 'iago@email.com',
      password: '123',
    })

    await expect(authenticateUser.execute({
      email: 'iago@email.com',
      password: 'wrong',
    })).rejects.toBeInstanceOf(AppError);
  });
})
