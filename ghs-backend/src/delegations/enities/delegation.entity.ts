import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Employee } from '../../employees/entities/employee.entity';
  
  @Entity('delegations')
  export class Delegation {
    @PrimaryGeneratedColumn({ name: 'delegationID', unsigned: true })
    delegationID: number;
  
    @Column({ name: 'delegatedBy', unsigned: true })
    delegatedBy: number;
  
    @Column({ name: 'delegatedTo', unsigned: true })
    delegatedTo: number;
  
    @Column({ name: 'startAt', type: 'date' })
    startAt: Date;
  
    @Column({ name: 'endAt', type: 'date' })
    endAt: Date;
  
    // Relations
    @ManyToOne(() => Employee, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'delegatedBy' })
    delegator: Employee;
  
    @ManyToOne(() => Employee, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'delegatedTo' })
    delegate: Employee;
  }