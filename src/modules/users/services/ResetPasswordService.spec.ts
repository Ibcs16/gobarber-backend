
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailprovider from '@shared/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailprovider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;
let resetPassword: ResetPasswordService;
describe('ResetPassword', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(fakeUserTokensRepository, fakeMailProvider, fakeUsersRepository);
    resetPassword = new ResetPasswordService(fakeUserTokensRepository, fakeUsersRepository);
  });

  it('should be able to reset password', async () => {

    const user = await fakeUsersRepository.create({
      name: 'Iago',
      email: 'iago@mail.com',
      password: '123'
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await resetPassword.execute({
      password: '123123',
      token
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.password).toBe('123123')
  });

  // Hash
  // 2h expiração
  // user token inexistente
  // user inexistente

})
