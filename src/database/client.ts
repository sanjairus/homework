import { Appointment } from "@appointment/appointment.entity";
import { DataSource, DataSourceOptions } from "typeorm";

async function initDatasource(): Promise<DataSource> {
  console.log("Start of initDatasource");

  const env = process.env;

  const host: string = env.DATABASE_HOST!;
  const port: number = Number(env.DATABASE_PORT!);
  const username: string = env.DATABASE_USERNAME!;
  const password: string = env.DATABASE_PASSWORD!;
  const name: string = env.DATABASE_NAME!;

  const options: DataSourceOptions = {
    type: "mongodb",
    host,
    port,
    username,
    password,
    database: name,
    synchronize: false,
    logging: true,
    entities: [Appointment],
    subscribers: [],
    migrations: [],
  };

  const datasource: DataSource = new DataSource(options);
  await datasource.initialize();

  console.log("End of initDatasource");

  return datasource;
}

export default initDatasource;
