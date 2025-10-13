import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Check,
  } from 'typeorm';
  import { Employee } from '../../employees/entities/employee.entity';
  
  export enum RequestStatus {
    PENDING = 'pending',
    SUBMITTED = 'submitted',
    FIRST_LEVEL_APPROVED = 'firstLevelApproved',
    IN_PROGRESS = 'inProgress',
    SECOND_LEVEL_APPROVED = 'secondLevelApproved',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
  }
  
  @Entity('requests')
  @Check('"endAt" > "startAt"')
  @Check('"previousEnd" > "previousStart"')
  export class Request {
    @PrimaryGeneratedColumn({ name: 'requestID', unsigned: true })
    requestID: number;
  
    @Column({ name: 'employeeID', unsigned: true })
    employeeID: number;
  
    @Column({ name: 'requestDate', type: 'date' })
    requestDate: Date;
  
    @Column({ name: 'previousStart', type: 'time', nullable: true })
    previousStart: string;
  
    @Column({ name: 'previousEnd', type: 'time', nullable: true })
    previousEnd: string;
  
    @Column({ name: 'startAt', type: 'time' })
    startAt: string;
  
    @Column({ name: 'endAt', type: 'time' })
    endAt: string;
  
    @Column({
      type: 'enum',
      enum: RequestStatus,
      default: RequestStatus.PENDING,
    })
    status: RequestStatus;
  
    @Column({ type: 'text', nullable: true })
    comment: string;
  
    @Column({ name: 'createdBy', unsigned: true, nullable: true })
    createdBy: number;
  
    @Column({ name: 'validatedN1At', type: 'timestamp', nullable: true })
    validatedN1At: Date;
  
    @Column({ name: 'validatedN2At', type: 'timestamp', nullable: true })
    validatedN2At: Date;
  
    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;
  
    // Relations
    @ManyToOne(() => Employee, (employee) => employee.requests, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'employeeID' })
    employee: Employee;
  
    @ManyToOne(() => Employee, { nullable: true })
    @JoinColumn({ name: 'createdBy' })
    creator: Employee;
  }
  