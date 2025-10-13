import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Request } from '../../requests/entities/request.entity';
  import { Employee } from '../../employees/entities/employee.entity';
  
  @Entity('workflows')
  export class Workflow {
    @PrimaryGeneratedColumn({ name: 'workflowID', unsigned: true })
    workflowID: number;
  
    @Column({ name: 'requestID', unsigned: true })
    requestID: number;
  
    @Column({ name: 'validator', unsigned: true })
    validator: number;
  
    @Column({ name: 'delegate', unsigned: true, nullable: true })
    delegate: number;
  
    @Column({ name: 'assignDate', type: 'datetime' })
    assignDate: Date;
  
    @Column({ name: 'validationDate', type: 'datetime', nullable: true })
    validationDate: Date;
  
    @Column({ unsigned: true })
    status: number;
  
    // Relations
    @ManyToOne(() => Request, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'requestID' })
    request: Request;
  
    @ManyToOne(() => Employee, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'validator' })
    validatorEmployee: Employee;
  
    @ManyToOne(() => Employee, {
      nullable: true,
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'delegate' })
    delegateEmployee: Employee;
  }