import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('User creation', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeHashProvider, fakeUsersRepository);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Iago',
      email: 'iago@email.com',
      password: '123',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two users with same email', async () => {
    await createUser.execute({
      name: 'Iago',
      email: 'iago@email.com',
      password: '123',
    });

    await expect(
      createUser.execute({
        name: 'Diego',
        email: 'iago@email.com',
        password: '321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
