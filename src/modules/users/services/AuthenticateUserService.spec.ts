import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeHashProvider, fakeUsersRepository);
    authenticateUser = new AuthenticateUserService(
      fakeHashProvider,
      fakeUsersRepository,
    );
  });

  it('should be able to authenticate', async () => {
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
    await expect(
      authenticateUser.execute({
        email: 'iago@email.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'Iago',
      email: 'iago@email.com',
      password: '123',
    });

    await expect(
      authenticateUser.execute({
        email: 'iago@email.com',
        password: 'wrong',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
