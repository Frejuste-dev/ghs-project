import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Workflow } from './entities/workflow.entity';
  import { Request } from '../requests/entities/request.entity';
  import { Employee } from '../employees/entities/employee.entity';
  import { CreateWorkflowDto } from './dto/create-workflow.dto';
  import { UpdateWorkflowDto } from './dto/update-workflow.dto';
  
  @Injectable()
  export class WorkflowsService {
    constructor(
      @InjectRepository(Workflow)
      private workflowRepository: Repository<Workflow>,
      @InjectRepository(Request)
      private requestRepository: Repository<Request>,
      @InjectRepository(Employee)
      private employeeRepository: Repository<Employee>,
    ) {}
  
    async create(createWorkflowDto: CreateWorkflowDto): Promise<Workflow> {
      // Vérifier que la demande existe
      const request = await this.requestRepository.findOne({
        where: { requestID: createWorkflowDto.requestID },
      });
  
      if (!request) {
        throw new NotFoundException(
          `Demande avec ID ${createWorkflowDto.requestID} non trouvée`,
        );
      }
  
      // Vérifier que le validateur existe
      const validator = await this.employeeRepository.findOne({
        where: { employeeID: createWorkflowDto.validator },
      });
  
      if (!validator) {
        throw new NotFoundException(
          `Validateur avec ID ${createWorkflowDto.validator} non trouvé`,
        );
      }
  
      // Vérifier le délégué s'il existe
      if (createWorkflowDto.delegate) {
        const delegate = await this.employeeRepository.findOne({
          where: { employeeID: createWorkflowDto.delegate },
        });
  
        if (!delegate) {
          throw new NotFoundException(
            `Délégué avec ID ${createWorkflowDto.delegate} non trouvé`,
          );
        }
      }
  
      const workflow = this.workflowRepository.create({
        ...createWorkflowDto,
        assignDate: new Date(),
      });
  
      return this.workflowRepository.save(workflow);
    }
  
    async findAll(): Promise<Workflow[]> {
      return this.workflowRepository.find({
        relations: ['request', 'validatorEmployee', 'delegateEmployee'],
        order: { assignDate: 'DESC' },
      });
    }
  
    async findOne(id: number): Promise<Workflow> {
      const workflow = await this.workflowRepository.findOne({
        where: { workflowID: id },
        relations: ['request', 'validatorEmployee', 'delegateEmployee'],
      });
  
      if (!workflow) {
        throw new NotFoundException(`Workflow avec ID ${id} non trouvé`);
      }
  
      return workflow;
    }
  
    async findByRequest(requestID: number): Promise<Workflow[]> {
      return this.workflowRepository.find({
        where: { requestID },
        relations: ['validatorEmployee', 'delegateEmployee'],
        order: { assignDate: 'ASC' },
      });
    }
  
    async update(
      id: number,
      updateWorkflowDto: UpdateWorkflowDto,
    ): Promise<Workflow> {
      const workflow = await this.findOne(id);
  
      // Si le statut est mis à jour et qu'il y a une validation, enregistrer la date
      if (updateWorkflowDto.status && updateWorkflowDto.status > 0) {
        workflow.validationDate = new Date();
      }
  
      Object.assign(workflow, updateWorkflowDto);
      return this.workflowRepository.save(workflow);
    }
  
    async remove(id: number): Promise<void> {
      const workflow = await this.findOne(id);
      await this.workflowRepository.remove(workflow);
    }
  }
  