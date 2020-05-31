import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IListAllProvidersDTO from '../dtos/IListAllProvidersDTO';

export default interface IUsersRepository {
  findAllProviders(data?: IListAllProvidersDTO): Promise<User[] | undefined>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(data: ICreateUserDTO): Promise<User>;
}
