import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class Appointment {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  pin!: string;

  @Column()
  schedule!: Date;

  @Column()
  isConfirmed!: boolean;
}
