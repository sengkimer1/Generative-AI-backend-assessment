import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn, CreateDateColumn } from "typeorm";
import { UserInfo } from "./user.entity";

@Entity()
export class Certificate {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => UserInfo, (user) => user.certificates, { eager: true })
    @JoinColumn({ name: "userId" })  // Specify the name of the foreign key column
    user: UserInfo;

    @Column()
    courseName: string;

    @CreateDateColumn()
    createdAt: Date;
}
