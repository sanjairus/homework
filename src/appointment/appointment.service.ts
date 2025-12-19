import { DataSource } from "typeorm";
import { Appointment } from "@appointment/appointment.entity";

class AppointmentService {
  datasource: DataSource;

  constructor(datasource: DataSource) {
    this.datasource = datasource;
  }

  async findAppointments() {
    console.log("Start of AppointmentService: findAppointments");

    const appointmentRepository =
      this.datasource.getMongoRepository(Appointment);

    const appointments = await appointmentRepository.find({
      order: {
        schedule: 1,
      },
    });

    console.log("End of AppointmentService: findAppointments");
    return appointments;
  }
}

export default AppointmentService;
