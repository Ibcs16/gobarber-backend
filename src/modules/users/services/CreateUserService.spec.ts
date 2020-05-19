
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('User creation', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(fakeHashProvider, fakeUsersRepository);

    const user = await createUser.execute({
      name: 'Iago',
      email: 'iago@email.com',
      password: '123'
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two users with same email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(fakeHashProvider, fakeUsersRepository);

    await createUser.execute({
      name: 'Iago',
      email: 'iago@email.com',
      password: '123'
    });

    await expect(createUser.execute({
      name: 'Diego',
      email: 'iago@email.com',
      password: '321'
    })).rejects.toBeInstanceOf(AppError);
  })
})
