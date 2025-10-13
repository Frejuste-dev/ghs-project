import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
  import { Employee } from '../../employees/entities/employee.entity';
  
  export enum UserProfile {
    VALIDATOR = 'Validator',
    SUPERVISOR = 'Supervisor',
    ADMINISTRATOR = 'Administrator',
    COORDINATOR = 'Coordinator',
  }
  
  @Entity('accounts')
  export class Account {
    @PrimaryGeneratedColumn({ name: 'accountID', unsigned: true })
    accountID: number;
  
    @Column({ name: 'employeeID', unsigned: true, unique: true })
    employeeID: number;
  
    @Column({ length: 50, unique: true })
    username: string;
  
    @Column({ length: 255 })
    password: string;
  
    @Column({
      type: 'enum',
      enum: UserProfile,
      default: UserProfile.VALIDATOR,
    })
    profile: UserProfile;
  
    @Column({ name: 'isActive', type: 'tinyint', default: 1 })
    isActive: boolean;
  
    @Column({ name: 'lastLogin', type: 'timestamp', nullable: true })
    lastLogin: Date;
  
    @Column({ name: 'resetToken', length: 100, nullable: true })
    resetToken: string;
  
    @Column({ name: 'resetTokenExpiry', type: 'timestamp', nullable: true })
    resetTokenExpiry: Date;
  
    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;
  
    // Relations
    @OneToOne(() => Employee, (employee) => employee.account, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'employeeID' })
    employee: Employee;
  }
  