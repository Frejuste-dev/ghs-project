import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Service } from './entities/service.entity';
  import { CreateServiceDto } from './dto/create-service.dto';
  import { UpdateServiceDto } from './dto/update-service.dto';
  
  @Injectable()
  export class ServicesService {
    constructor(
      @InjectRepository(Service)
      private serviceRepository: Repository<Service>,
    ) {}
  
    async create(createServiceDto: CreateServiceDto): Promise<Service> {
      // Vérifier si le code service existe déjà
      const existingService = await this.serviceRepository.findOne({
        where: { serviceCode: createServiceDto.serviceCode },
      });
  
      if (existingService) {
        throw new ConflictException(
          `Le code service "${createServiceDto.serviceCode}" existe déjà`,
        );
      }
  
      // Validation du code service (alphanumerique)
      if (!/^[A-Z0-9]+$/.test(createServiceDto.serviceCode)) {
        throw new BadRequestException(
          'Le code service doit être alphanumérique (majuscules et chiffres uniquement)',
        );
      }
  
      // Vérifier le service parent s'il existe
      if (createServiceDto.parentServiceID) {
        const parentService = await this.serviceRepository.findOne({
          where: { serviceID: createServiceDto.parentServiceID },
        });
  
        if (!parentService) {
          throw new NotFoundException(
            `Service parent avec ID ${createServiceDto.parentServiceID} non trouvé`,
          );
        }
      }
  
      const service = this.serviceRepository.create(createServiceDto);
      return this.serviceRepository.save(service);
    }
  
    async findAll(): Promise<Service[]> {
      return this.serviceRepository.find({
        relations: ['parentService', 'employees'],
        order: { serviceName: 'ASC' },
      });
    }
  
    async findOne(id: number): Promise<Service> {
      const service = await this.serviceRepository.findOne({
        where: { serviceID: id },
        relations: ['parentService', 'employees'],
      });
  
      if (!service) {
        throw new NotFoundException(`Service avec ID ${id} non trouvé`);
      }
  
      return service;
    }
  
    async update(
      id: number,
      updateServiceDto: UpdateServiceDto,
    ): Promise<Service> {
      const service = await this.findOne(id);
  
      // Vérifier l'unicité du code service si modifié
      if (
        updateServiceDto.serviceCode &&
        updateServiceDto.serviceCode !== service.serviceCode
      ) {
        const existingService = await this.serviceRepository.findOne({
          where: { serviceCode: updateServiceDto.serviceCode },
        });
  
        if (existingService) {
          throw new ConflictException(
            `Le code service "${updateServiceDto.serviceCode}" existe déjà`,
          );
        }
  
        // Validation du code service
        if (!/^[A-Z0-9]+$/.test(updateServiceDto.serviceCode)) {
          throw new BadRequestException(
            'Le code service doit être alphanumérique (majuscules et chiffres uniquement)',
          );
        }
      }
  
      // Vérifier le service parent s'il existe
      if (updateServiceDto.parentServiceID) {
        const parentService = await this.serviceRepository.findOne({
          where: { serviceID: updateServiceDto.parentServiceID },
        });
  
        if (!parentService) {
          throw new NotFoundException(
            `Service parent avec ID ${updateServiceDto.parentServiceID} non trouvé`,
          );
        }
  
        // Empêcher la création de boucle (un service ne peut pas être son propre parent)
        if (updateServiceDto.parentServiceID === id) {
          throw new BadRequestException(
            'Un service ne peut pas être son propre parent',
          );
        }
      }
  
      Object.assign(service, updateServiceDto);
      return this.serviceRepository.save(service);
    }
  
    async remove(id: number): Promise<void> {
      const service = await this.findOne(id);
  
      // Vérifier s'il y a des employés dans ce service
      if (service.employees && service.employees.length > 0) {
        throw new BadRequestException(
          `Impossible de supprimer le service car ${service.employees.length} employé(s) y sont rattachés`,
        );
      }
  
      await this.serviceRepository.remove(service);
    }
  }