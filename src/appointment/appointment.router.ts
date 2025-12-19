import BaseRouter from "@core/router";
import { DataSource } from "typeorm";
import AppointmentService from "@appointment/appointment.service";
import { Request, Response } from "express";
import { CreateAppointmentParams } from "./appointment.type";
import { HttpError } from "@core/error";

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
    try {
      console.log("Start of AppointmentRouter: getAppointments");

      const appointments = await this.service.findAppointments();

      console.log("End of AppointmentRouter: getAppointments");
      return response.status(200).json({ appointments });
    } catch (error: unknown) {
      if (error instanceof HttpError) {
        const code = error.code;
        const message = error.message;
        response.status(code).json({ message });
      }
    }
  };

  public createAppointment = async (request: Request, response: Response) => {
    try {
      console.log("Start of AppointmentRouter: createAppointment");

      const rawSchedule = request.body.schedule || new Date().toUTCString();

      const schedule = new Date(rawSchedule);

      const customerEmail = request.body.customerEmail;
      const customerPhone = request.body.customerPhone;
      const customerName = request.body.customerName;

      const params: CreateAppointmentParams = {
        schedule,
        customerEmail,
        customerName,
        customerPhone,
      };

      const appointment = await this.service.createAppointment(params);

      console.log("End of AppointmentRouter: createAppointment");
      return response.status(200).json({ appointment });
    } catch (error: unknown) {
      if (error instanceof HttpError) {
        const code = error.code;
        const message = error.message;
        response.status(code).json({ message });
      }
    }
  };

  public validateAppointment = async (request: Request, response: Response) => {
    try {
      console.log("Start of AppointmentRouter: validateAppointment");

      const pin = request.body.pin;

      const appointment = await this.service.validateAppointment(pin);

      console.log("End of AppointmentRouter: validateAppointment");
      return response.status(200).json({
        appointment,
      });
    } catch (error: unknown) {
      if (error instanceof HttpError) {
        const code = error.code;
        const message = error.message;
        response.status(code).json({ message });
      }
    }
  };
}

export default AppointmenRouter;
