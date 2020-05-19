import { getRepository, Repository } from 'typeorm';


import User from '@modules/users/infra/typeorm/entities/User';
import { uuid } from 'uuidv4';
import IUserTokensRepository from '../IUserTokensRepository';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];


  public async generate( user_id: string): Promise<UserToken> {
    const user_token = new UserToken();

    Object.assign(user_token, {id: uuid(), token: uuid(), user_id})

    this.userTokens.push(user_token);

    return user_token;
  }

  public async findByToken( token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(findToken => findToken.token === token);

    return userToken;
  }

}
export default FakeUserTokensRepository;
