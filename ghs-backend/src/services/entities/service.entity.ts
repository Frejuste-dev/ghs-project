import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
  import { Employee } from '../../employees/entities/employee.entity';
  
  @Entity('services')
  export class Service {
    @PrimaryGeneratedColumn({ name: 'serviceID', unsigned: true })
    serviceID: number;
  
    @Column({ name: 'serviceCode', length: 10, unique: true })
    serviceCode: string;
  
    @Column({ name: 'serviceName', length: 100 })
    serviceName: string;
  
    @Column({ name: 'parentServiceID', unsigned: true, nullable: true })
    parentServiceID: number;
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @Column({ length: 100, nullable: true })
    manager: string;
  
    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;
  
    // Relations
    @ManyToOne(() => Service, { nullable: true })
    @JoinColumn({ name: 'parentServiceID' })
    parentService: Service;
  
    @OneToMany(() => Employee, (employee) => employee.service)
    employees: Employee[];
  }