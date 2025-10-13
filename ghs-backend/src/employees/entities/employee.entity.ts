import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
  import { Service } from '../../services/entities/service.entity';
  import { Account } from '../../accounts/entities/account.entity';
  import { Request } from '../../requests/entities/request.entity';
  
  export enum ContractType {
    CDI = 'CDI',
    CDD = 'CDD',
    INTERIM = 'Interim',
    STAGE = 'Stage',
    ALTERNANCE = 'Alternance',
    MOO = 'MOO',
  }
  
  @Entity('employees')
  export class Employee {
    @PrimaryGeneratedColumn({ name: 'employeeID', unsigned: true })
    employeeID: number;
  
    @Column({ name: 'employeeNumber', length: 20, unique: true })
    employeeNumber: string;
  
    @Column({ name: 'lastName', length: 20 })
    lastName: string;
  
    @Column({ name: 'firstName', length: 30 })
    firstName: string;
  
    @Column({ name: 'serviceID', unsigned: true })
    serviceID: number;
  
    @Column({
      name: 'contractType',
      type: 'enum',
      enum: ContractType,
      default: ContractType.CDI,
    })
    contractType: ContractType;
  
    @Column({ length: 20, nullable: true })
    contact: string;
  
    @Column({ type: 'date', nullable: true })
    birthdate: Date;
  
    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;
  
    // Relations
    @ManyToOne(() => Service, (service) => service.employees, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'serviceID' })
    service: Service;
  
    @OneToOne(() => Account, (account) => account.employee)
    account: Account;
  
    @OneToMany(() => Request, (request) => request.employee)
    requests: Request[];
  }
  