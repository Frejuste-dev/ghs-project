import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Employee } from './entities/employee.entity';
  import { Service } from '../services/entities/service.entity';
  import { CreateEmployeeDto } from './dto/create-employee.dto';
  import { UpdateEmployeeDto } from './dto/update-employee.dto';
  
  @Injectable()
  export class EmployeesService {
    constructor(
      @InjectRepository(Employee)
      private employeeRepository: Repository<Employee>,
      @InjectRepository(Service)
      private serviceRepository: Repository<Service>,
    ) {}
  
    async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
      // Vérifier si le numéro d'employé existe déjà
      const existingEmployee = await this.employeeRepository.findOne({
        where: { employeeNumber: createEmployeeDto.employeeNumber },
      });
  
      if (existingEmployee) {
        throw new ConflictException(
          `Le numéro d'employé "${createEmployeeDto.employeeNumber}" existe déjà`,
        );
      }
  
      // Validation du numéro d'employé (format EMP suivi de chiffres)
      if (!/^EMP\d{4,}$/.test(createEmployeeDto.employeeNumber)) {
        throw new BadRequestException(
          'Le numéro d\'employé doit suivre le format EMP suivi de 4 chiffres minimum (ex: EMP0001)',
        );
      }
  
      // Vérifier que le service existe
      const service = await this.serviceRepository.findOne({
        where: { serviceID: createEmployeeDto.serviceID },
      });
  
      if (!service) {
        throw new NotFoundException(
          `Service avec ID ${createEmployeeDto.serviceID} non trouvé`,
        );
      }
  
      // Validation de la date de naissance
      if (createEmployeeDto.birthdate) {
        const birthdate = new Date(createEmployeeDto.birthdate);
        const today = new Date();
        const age = today.getFullYear() - birthdate.getFullYear();
  
        if (age < 16) {
          throw new BadRequestException(
            'L\'employé doit avoir au moins 16 ans',
          );
        }
  
        if (birthdate > today) {
          throw new BadRequestException(
            'La date de naissance ne peut pas être dans le futur',
          );
        }
      }
  
      const employee = this.employeeRepository.create(createEmployeeDto);
      return this.employeeRepository.save(employee);
    }
  
    async findAll(): Promise<Employee[]> {
      return this.employeeRepository.find({
        relations: ['service'],
        order: { lastName: 'ASC', firstName: 'ASC' },
      });
    }
  
    async findOne(id: number): Promise<Employee> {
      const employee = await this.employeeRepository.findOne({
        where: { employeeID: id },
        relations: ['service', 'account'],
      });
  
      if (!employee) {
        throw new NotFoundException(`Employé avec ID ${id} non trouvé`);
      }
  
      return employee;
    }
  
    async update(
      id: number,
      updateEmployeeDto: UpdateEmployeeDto,
    ): Promise<Employee> {
      const employee = await this.findOne(id);
  
      // Vérifier l'unicité du numéro d'employé si modifié
      if (
        updateEmployeeDto.employeeNumber &&
        updateEmployeeDto.employeeNumber !== employee.employeeNumber
      ) {
        const existingEmployee = await this.employeeRepository.findOne({
          where: { employeeNumber: updateEmployeeDto.employeeNumber },
        });
  
        if (existingEmployee) {
          throw new ConflictException(
            `Le numéro d'employé "${updateEmployeeDto.employeeNumber}" existe déjà`,
          );
        }
  
        // Validation du format
        if (!/^EMP\d{4,}$/.test(updateEmployeeDto.employeeNumber)) {
          throw new BadRequestException(
            'Le numéro d\'employé doit suivre le format EMP suivi de 4 chiffres minimum',
          );
        }
      }
  
      // Vérifier le service s'il est modifié
      if (updateEmployeeDto.serviceID) {
        const service = await this.serviceRepository.findOne({
          where: { serviceID: updateEmployeeDto.serviceID },
        });
  
        if (!service) {
          throw new NotFoundException(
            `Service avec ID ${updateEmployeeDto.serviceID} non trouvé`,
          );
        }
      }
  
      // Validation de la date de naissance si modifiée
      if (updateEmployeeDto.birthdate) {
        const birthdate = new Date(updateEmployeeDto.birthdate);
        const today = new Date();
        const age = today.getFullYear() - birthdate.getFullYear();
  
        if (age < 16) {
          throw new BadRequestException(
            'L\'employé doit avoir au moins 16 ans',
          );
        }
  
        if (birthdate > today) {
          throw new BadRequestException(
            'La date de naissance ne peut pas être dans le futur',
          );
        }
      }
  
      Object.assign(employee, updateEmployeeDto);
      return this.employeeRepository.save(employee);
    }
  
    async remove(id: number): Promise<void> {
      const employee = await this.findOne(id);
      await this.employeeRepository.remove(employee);
    }
  }