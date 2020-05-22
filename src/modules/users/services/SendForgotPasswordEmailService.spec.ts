import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeMailprovider from '@shared/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailprovider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailprovider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserTokensRepository,
      fakeMailProvider,
      fakeUsersRepository,
    );
  });

  it('should be able to recover password using an email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Iago',
      email: 'iago@mail.com',
      password: '123',
    });

    await sendForgotPasswordEmail.execute({
      email: 'iago@mail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover password of non existing user', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'iago@mail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Iago',
      email: 'iago@mail.com',
      password: '123',
    });

    await sendForgotPasswordEmail.execute({
      email: 'iago@mail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
