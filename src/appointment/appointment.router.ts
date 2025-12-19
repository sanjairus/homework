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
  }

  public getAppointments = async (request: Request, response: Response) => {
    console.log("Start of AppointmentRouter: getAppointments");

    const appointments = await this.service.findAppointments();

    console.log("End of AppointmentRouter: getAppointments");
    return response.status(200).json({ appointments });
  };
}

export default AppointmenRouter;
