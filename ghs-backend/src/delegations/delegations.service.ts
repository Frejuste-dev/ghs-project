import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Delegation } from './entities/delegation.entity';
  import { Employee } from '../employees/entities/employee.entity';
  import { CreateDelegationDto } from './dto/create-delegation.dto';
  import { UpdateDelegationDto } from './dto/update-delegation.dto';
  
  @Injectable()
  export class DelegationsService {
    constructor(
      @InjectRepository(Delegation)
      private delegationRepository: Repository<Delegation>,
      @InjectRepository(Employee)
      private employeeRepository: Repository<Employee>,
    ) {}
  
    async create(createDelegationDto: CreateDelegationDto): Promise<Delegation> {
      // Vérifier que les deux employés existent
      const delegator = await this.employeeRepository.findOne({
        where: { employeeID: createDelegationDto.delegatedBy },
      });
  
      if (!delegator) {
        throw new NotFoundException(
          `Employé délégant avec ID ${createDelegationDto.delegatedBy} non trouvé`,
        );
      }
  
      const delegate = await this.employeeRepository.findOne({
        where: { employeeID: createDelegationDto.delegatedTo },
      });
  
      if (!delegate) {
        throw new NotFoundException(
          `Employé délégué avec ID ${createDelegationDto.delegatedTo} non trouvé`,
        );
      }
  
      // Validation: un employé ne peut pas se déléguer à lui-même
      if (createDelegationDto.delegatedBy === createDelegationDto.delegatedTo) {
        throw new BadRequestException(
          'Un employé ne peut pas se déléguer à lui-même',
        );
      }
  
      // Validation des dates
      const startDate = new Date(createDelegationDto.startAt);
      const endDate = new Date(createDelegationDto.endAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      if (startDate < today) {
        throw new BadRequestException(
          'La date de début ne peut pas être dans le passé',
        );
      }
  
      if (endDate <= startDate) {
        throw new BadRequestException(
          'La date de fin doit être après la date de début',
        );
      }
  
      // Vérifier les chevauchements de délégations
      const overlappingDelegation = await this.delegationRepository
        .createQueryBuilder('delegation')
        .where('delegation.delegatedBy = :delegatedBy', {
          delegatedBy: createDelegationDto.delegatedBy,
        })
        .andWhere(
          '(delegation.startAt <= :endAt AND delegation.endAt >= :startAt)',
          {
            startAt: createDelegationDto.startAt,
            endAt: createDelegationDto.endAt,
          },
        )
        .getOne();
  
      if (overlappingDelegation) {
        throw new BadRequestException(
          'Une délégation existe déjà pour cette période',
        );
      }
  
      const delegation = this.delegationRepository.create(createDelegationDto);
      return this.delegationRepository.save(delegation);
    }
  
    async findAll(): Promise<Delegation[]> {
      return this.delegationRepository.find({
        relations: ['delegator', 'delegate'],
        order: { startAt: 'DESC' },
      });
    }
  
    async findOne(id: number): Promise<Delegation> {
      const delegation = await this.delegationRepository.findOne({
        where: { delegationID: id },
        relations: ['delegator', 'delegate'],
      });
  
      if (!delegation) {
        throw new NotFoundException(`Délégation avec ID ${id} non trouvée`);
      }
  
      return delegation;
    }
  
    async update(
      id: number,
      updateDelegationDto: UpdateDelegationDto,
    ): Promise<Delegation> {
      const delegation = await this.findOne(id);
  
      // Validation des dates si modifiées
      if (updateDelegationDto.startAt || updateDelegationDto.endAt) {
        const startDate = new Date(
          updateDelegationDto.startAt || delegation.startAt,
        );
        const endDate = new Date(
          updateDelegationDto.endAt || delegation.endAt,
        );
  
        if (endDate <= startDate) {
          throw new BadRequestException(
            'La date de fin doit être après la date de début',
          );
        }
      }
  
      Object.assign(delegation, updateDelegationDto);
      return this.delegationRepository.save(delegation);
    }
  
    async remove(id: number): Promise<void> {
      const delegation = await this.findOne(id);
      await this.delegationRepository.remove(delegation);
    }
  
    // Obtenir les délégations actives pour un employé
    async getActiveDelegations(employeeID: number): Promise<Delegation[]> {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      return this.delegationRepository
        .createQueryBuilder('delegation')
        .leftJoinAndSelect('delegation.delegator', 'delegator')
        .leftJoinAndSelect('delegation.delegate', 'delegate')
        .where('delegation.delegatedBy = :employeeID', { employeeID })
        .andWhere('delegation.startAt <= :today', { today })
        .andWhere('delegation.endAt >= :today', { today })
        .getMany();
    }
  }