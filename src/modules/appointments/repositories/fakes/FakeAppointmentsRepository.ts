import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findByDateAppointment = this.appointments.find(appointment => isEqual(appointment.date, date));
    return findByDateAppointment;
  }

  public async create({ date, provider_id }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), provider_id, date});

    this.appointments.push(appointment);

    return appointment;
  }

}

export default AppointmentsRepository;
