import { DataSource, MongoRepository } from "typeorm";
import { Appointment } from "@appointment/appointment.entity";
import { randomInt } from "node:crypto";

class AppointmentService {
  datasource: DataSource;
  appointmentRepository: MongoRepository<Appointment>;

  constructor(datasource: DataSource) {
    this.datasource = datasource;

    this.appointmentRepository =
      this.datasource.getMongoRepository(Appointment);
  }

  async findAppointments() {
    console.log("Start of AppointmentService: findAppointments");

    const appointments = await this.appointmentRepository.find({
      order: {
        schedule: 1,
      },
    });

    console.log("End of AppointmentService: findAppointments");
    return appointments;
  }

  async createAppointment(schedule: Date) {
    console.log("Start of AppointmentService: createAppointment");

    const appointment = new Appointment();

    const generatePin = () => {
      const num = randomInt(0, 10000);

      return num.toString().padStart(4, "0");
    };

    appointment.pin = generatePin();
    appointment.schedule = schedule;
    appointment.isConfirmed = false;

    await this.appointmentRepository.save(appointment);

    console.log("End of AppointmentService: createAppointment");
    return appointment;
  }
}

export default AppointmentService;
