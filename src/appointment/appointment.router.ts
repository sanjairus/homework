import BaseRouter from "@core/router";
import { DataSource } from "typeorm";
import AppointmentService from "@appointment/appointment.service";
import { Request, Response } from "express";

class AppointmenRouter extends BaseRouter {
  datasource: DataSource;
  service: AppointmentService;

  constructor(datasource: DataSource) {
    super();

    this.datasource = datasource;
    this.service = new AppointmentService(datasource);

    this.addGetRoute("/", this.getAppointments);
    this.addPostRoute("/", this.createAppointment);
    this.addPostRoute("/validate", this.validateAppointment);
  }

  public getAppointments = async (request: Request, response: Response) => {
    console.log("Start of AppointmentRouter: getAppointments");

    const appointments = await this.service.findAppointments();

    console.log("End of AppointmentRouter: getAppointments");
    return response.status(200).json({ appointments });
  };

  public createAppointment = async (request: Request, response: Response) => {
    console.log("Start of AppointmentRouter: createAppointment");

    const rawSchedule = request.body.schedule || new Date().toUTCString();

    const schedule = new Date(rawSchedule);

    const appointment = await this.service.createAppointment(schedule);

    console.log("End of AppointmentRouter: createAppointment");
    return response.status(200).json({ appointment });
  };

  public validateAppointment = async (request: Request, response: Response) => {
    console.log("Start of AppointmentRouter: validateAppointment");

    const pin = request.body.pin;

    const appointment = await this.service.validateAppointment(pin);

    console.log("End of AppointmentRouter: validateAppointment");
    return response.status(200).json({
      appointment,
    });
  };
}

export default AppointmenRouter;
