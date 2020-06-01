import { getMongoRepository, MongoRepository } from 'typeorm';

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Notification from '../schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    recipient_id,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const appointment = this.ormRepository.create({
      recipient_id,
      content,
    });
    await this.ormRepository.save(appointment);
    return appointment;
  }
}
export default NotificationsRepository;
