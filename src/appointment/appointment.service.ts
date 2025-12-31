import { DataSource, MongoRepository } from "typeorm";
import { Appointment } from "@appointment/appointment.entity";
import { randomInt } from "node:crypto";
import { CreateAppointmentParams } from "@appointment/appointment.type";
import { HttpError } from "@core/error";

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

    // Only fetch appointments for today's date

    const today = new Date();

    const start = new Date(today);
    start.setHours(0, 0, 0, 0);

    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    const appointments = await this.appointmentRepository.find({
      where: {
        schedule: {
          $gt: start,
          $lt: end,
        },
      },
      order: {
        schedule: 1,
      },
    });

    console.log("End of AppointmentService: findAppointments");
    return appointments;
  }

  async createAppointment({
    schedule,
    customerName,
    customerEmail,
    customerPhone,
  }: CreateAppointmentParams) {
    console.log("Start of AppointmentService: createAppointment");

    const appointment = new Appointment();

    const generatePin = () => {
      const num = randomInt(0, 10000);

      return num.toString().padStart(4, "0");
    };

    appointment.customerEmail = customerEmail;
    appointment.customerName = customerName;
    appointment.customerPhone = customerPhone;

    appointment.pin = generatePin();
    appointment.schedule = schedule;
    appointment.isConfirmed = false;

    await this.appointmentRepository.save(appointment);

    console.log("End of AppointmentService: createAppointment");
    return appointment;
  }

  private calculateMillisExtension(peopleAhead: number) {
    console.log("Start of AppointmentService: calculateMillisExtension");

    // amount of time a unit of work needs to be processed (in minutes)
    const baseMinutes: number = 10;

    // value between 1 and 1.5, so that things don't escalate too quickly
    // 1.3 here so when we multiply it with a number, we get 100% of the original value + 30% of it
    // will exponentially rise but not too drastically
    const multiplier: number = 1.3;

    // maximum amount of time that we can use as an extension (we can change this to whatever is realistic relative to the task)
    const maxMinutes: number = 30;

    if (peopleAhead < 0) {
      throw new HttpError(500, `Num people ahead should be >= 0`);
    }

    if (peopleAhead === 0) {
      return 0;
    }

    const MS_PER_SECOND = 1000;
    const SECONDS_PER_MINUTE = 60;
    const MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;

    const baseMs = MS_PER_MINUTE * baseMinutes;
    const maxMs = MS_PER_MINUTE * maxMinutes;

    const extension = baseMs * Math.pow(multiplier, peopleAhead);

    console.log("End of AppointmentService: calculateMillisExtension");

    return Math.min(extension, maxMs);
  }

  async validateAppointment(pin: string) {
    console.log("Start of AppointmentService: validateAppointment");

    // Only fetch appointments for today's date

    const today = new Date();

    const start = new Date(today);
    start.setHours(0, 0, 0, 0);

    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    const appointments = await this.appointmentRepository.find({
      where: {
        schedule: {
          $gt: start,
          $lt: end,
        },
      },
      order: {
        schedule: 1,
      },
    });

    const index = appointments.findIndex((e) => e.pin === pin);
    const appointment = appointments[index];

    if (!appointment) {
      throw new HttpError(404, `Invalid Appointment`);
    }

    const extension = this.calculateMillisExtension(index);

    const schedule = appointment.schedule;
    const time = schedule.getTime();

    // Requirement: Allow pin usage 15 minutes prior
    const MS_IN_FIFTEEN_MINUTES = 1000 * 60 * 15;
    const validFrom = new Date(time - MS_IN_FIFTEEN_MINUTES);

    // Calculate pin extended validity (no db operations needed)
    const validUntil = new Date(time + extension);

    const now = new Date();

    // check if within range
    const isValid = now >= validFrom && now <= validUntil;

    console.log({
      originalSchedule: schedule.toLocaleString(),
      currentTime: now.toLocaleString(),
      validFrom: validFrom.toLocaleString(),
      validUntil: validUntil.toLocaleString(),
      isValid,
    });

    console.log({
      appointments,
      position: index,
      extensionInMinutes: extension / 1000 / 60,
    });

    if (!isValid) {
      throw new HttpError(404, `Appointment with pin: ${pin} is invalid`);
    }

    const updatedDoc = await this.appointmentRepository.findOneAndUpdate(
      { pin },
      {
        $set: {
          isConfirmed: true,
        },
      },
      { returnDocument: "after" }
    );

    console.log("End of AppointmentService: validateAppointment");
    return updatedDoc;
  }
}

export default AppointmentService;
