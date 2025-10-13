import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Request, RequestStatus } from './entities/request.entity';
  import { Employee } from '../employees/entities/employee.entity';
  import { CreateRequestDto } from './dto/create-request.dto';
  import { UpdateRequestDto } from './dto/update-request.dto';
  import { UserProfile } from '../accounts/entities/account.entity';
  
  @Injectable()
  export class RequestsService {
    constructor(
      @InjectRepository(Request)
      private requestRepository: Repository<Request>,
      @InjectRepository(Employee)
      private employeeRepository: Repository<Employee>,
    ) {}
  
    async create(
      createRequestDto: CreateRequestDto,
      currentUserId: number,
    ): Promise<Request> {
      // Vérifier que l'employé existe
      const employee = await this.employeeRepository.findOne({
        where: { employeeID: createRequestDto.employeeID },
      });
  
      if (!employee) {
        throw new NotFoundException(
          `Employé avec ID ${createRequestDto.employeeID} non trouvé`,
        );
      }
  
      // Validation des heures
      this.validateWorkHours(
        createRequestDto.startAt,
        createRequestDto.endAt,
      );
  
      // Validation des heures précédentes si présentes
      if (createRequestDto.previousStart && createRequestDto.previousEnd) {
        this.validateWorkHours(
          createRequestDto.previousStart,
          createRequestDto.previousEnd,
        );
      }
  
      // Validation de la date (pas dans le passé)
      const requestDate = new Date(createRequestDto.requestDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      if (requestDate < today) {
        throw new BadRequestException(
          'La date de la demande ne peut pas être dans le passé',
        );
      }
  
      const request = this.requestRepository.create({
        ...createRequestDto,
        createdBy: currentUserId,
        status: RequestStatus.PENDING,
      });
  
      return this.requestRepository.save(request);
    }
  
    async findAll(
      currentUserId: number,
      userProfile: UserProfile,
    ): Promise<Request[]> {
      const queryBuilder = this.requestRepository
        .createQueryBuilder('request')
        .leftJoinAndSelect('request.employee', 'employee')
        .leftJoinAndSelect('employee.service', 'service')
        .leftJoinAndSelect('request.creator', 'creator');
  
      // Les validators ne voient que leurs propres demandes
      if (userProfile === UserProfile.VALIDATOR) {
        queryBuilder.where('request.employeeID = :currentUserId', {
          currentUserId,
        });
      }
      // Admin et Supervisor voient toutes les demandes
  
      return queryBuilder
        .orderBy('request.requestDate', 'DESC')
        .addOrderBy('request.createdAt', 'DESC')
        .getMany();
    }

    async findMine(currentUserId: number): Promise<Request[]> {
      return this.requestRepository.find({
        where: { employeeID: currentUserId },
        relations: ['employee', 'employee.service', 'creator'],
        order: { requestDate: 'DESC', createdAt: 'DESC' as any },
      });
    }

    async findPending(
      currentUserId: number,
      userProfile: UserProfile,
    ): Promise<Request[]> {
      if (!([UserProfile.SUPERVISOR, UserProfile.ADMINISTRATOR].includes(userProfile))) {
        return this.requestRepository.find({
          where: { employeeID: currentUserId, status: RequestStatus.PENDING },
          relations: ['employee', 'employee.service', 'creator'],
          order: { requestDate: 'DESC', createdAt: 'DESC' as any },
        });
      }

      const qb = this.requestRepository
        .createQueryBuilder('request')
        .leftJoinAndSelect('request.employee', 'employee')
        .leftJoinAndSelect('employee.service', 'service')
        .leftJoinAndSelect('request.creator', 'creator')
        .where('request.status IN (:...statuses)', {
          statuses: [
            RequestStatus.PENDING,
            RequestStatus.SUBMITTED,
            RequestStatus.IN_PROGRESS,
            RequestStatus.FIRST_LEVEL_APPROVED,
          ],
        })
        .orderBy('request.requestDate', 'DESC')
        .addOrderBy('request.createdAt', 'DESC');

      return qb.getMany();
    }

    async findOne(
      id: number,
      currentUserId: number,
      userProfile: UserProfile,
    ): Promise<Request> {
      const request = await this.requestRepository.findOne({
        where: { requestID: id },
        relations: ['employee', 'employee.service', 'creator'],
      });

      if (!request) {
        throw new NotFoundException(`Demande avec ID ${id} non trouvée`);
      }

      if (
        userProfile === UserProfile.VALIDATOR &&
        request.employeeID !== currentUserId
      ) {
        throw new ForbiddenException(
          'Vous n\'avez pas accès à cette demande',
        );
      }

      return request;
    }
  
    async update(
      id: number,
      updateRequestDto: UpdateRequestDto,
      currentUserId: number,
      userProfile: UserProfile,
    ): Promise<Request> {
      const request = await this.findOne(id, currentUserId, userProfile);
  
      // Seul le propriétaire ou un admin/supervisor peut modifier
      if (
        userProfile === UserProfile.VALIDATOR &&
        request.employeeID !== currentUserId
      ) {
        throw new ForbiddenException(
          'Vous n\'avez pas le droit de modifier cette demande',
        );
      }
  
      // Ne pas permettre la modification si la demande est déjà validée/acceptée
      if (
        [
          RequestStatus.ACCEPTED,
          RequestStatus.SECOND_LEVEL_APPROVED,
        ].includes(request.status)
      ) {
        throw new BadRequestException(
          'Impossible de modifier une demande déjà validée ou acceptée',
        );
      }
  
      // Validation des heures si modifiées
      if (updateRequestDto.startAt && updateRequestDto.endAt) {
        this.validateWorkHours(
          updateRequestDto.startAt,
          updateRequestDto.endAt,
        );
      }
  
      // Validation des heures précédentes si modifiées
      if (updateRequestDto.previousStart && updateRequestDto.previousEnd) {
        this.validateWorkHours(
          updateRequestDto.previousStart,
          updateRequestDto.previousEnd,
        );
      }
  
      // Validation de la date si modifiée
      if (updateRequestDto.requestDate) {
        const requestDate = new Date(updateRequestDto.requestDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
  
        if (requestDate < today) {
          throw new BadRequestException(
            'La date de la demande ne peut pas être dans le passé',
          );
        }
      }
  
      Object.assign(request, updateRequestDto);
      return this.requestRepository.save(request);
    }
  
    async updateStatus(
      id: number,
      status: RequestStatus,
      currentUserId: number,
      userProfile: UserProfile,
    ): Promise<Request> {
      const request = await this.requestRepository.findOne({
        where: { requestID: id },
        relations: ['employee'],
      });
  
      if (!request) {
        throw new NotFoundException(`Demande avec ID ${id} non trouvée`);
      }
  
      // Seuls les superviseurs et administrateurs peuvent changer le statut
      if (
        ![UserProfile.SUPERVISOR, UserProfile.ADMINISTRATOR].includes(
          userProfile,
        )
      ) {
        throw new ForbiddenException(
          'Vous n\'avez pas le droit de modifier le statut',
        );
      }
  
      // Mettre à jour les timestamps de validation
      if (status === RequestStatus.FIRST_LEVEL_APPROVED) {
        request.validatedN1At = new Date();
      } else if (
        [RequestStatus.ACCEPTED, RequestStatus.SECOND_LEVEL_APPROVED].includes(
          status,
        )
      ) {
        request.validatedN2At = new Date();
      }

      request.status = status;
      return this.requestRepository.save(request);
    }

    async approve(
      id: number,
      level: number | undefined,
      currentUserId: number,
      userProfile: UserProfile,
    ): Promise<Request> {
      const targetStatus = level === 2
        ? RequestStatus.ACCEPTED
        : RequestStatus.FIRST_LEVEL_APPROVED;
      return this.updateStatus(id, targetStatus, currentUserId, userProfile);
    }

    async reject(
      id: number,
      reason: string,
      currentUserId: number,
      userProfile: UserProfile,
    ): Promise<Request> {
      const request = await this.requestRepository.findOne({ where: { requestID: id } });
      if (!request) {
        throw new NotFoundException(`Demande avec ID ${id} non trouvée`);
      }
      if (!([UserProfile.SUPERVISOR, UserProfile.ADMINISTRATOR].includes(userProfile))) {
        throw new ForbiddenException('Vous n\'avez pas le droit de rejeter la demande');
      }
      request.status = RequestStatus.REJECTED;
      request.comment = reason;
      return this.requestRepository.save(request);
    }

    async remove(
      id: number,
      currentUserId: number,
      userProfile: UserProfile,
    ): Promise<void> {
      const request = await this.findOne(id, currentUserId, userProfile);

      // Seul l'admin ou le propriétaire peut supprimer
      if (
        userProfile !== UserProfile.ADMINISTRATOR &&
        request.employeeID !== currentUserId
      ) {
        throw new ForbiddenException(
          'Vous n\'avez pas le droit de supprimer cette demande',
        );
      }

      // Ne pas permettre la suppression si validée/acceptée
      if ([RequestStatus.ACCEPTED, RequestStatus.SECOND_LEVEL_APPROVED].includes(request.status)) {
        throw new BadRequestException('Impossible de supprimer une demande validée ou acceptée');
      }

      await this.requestRepository.remove(request);
    }

    // Méthode privée pour valider les heures de travail
    private validateWorkHours(startTime: string, endTime: string): void {
      const start = this.timeToMinutes(startTime);
      const end = this.timeToMinutes(endTime);
      const duration = (end - start) / 60;
  
      if (duration <= 0) {
        throw new BadRequestException(
          'L\'heure de fin doit être après l\'heure de début',
        );
      }
  
      if (duration > 12) {
        throw new BadRequestException(
          'La durée de travail ne peut pas excéder 12 heures',
        );
      }
    }
  
    private timeToMinutes(time: string): number {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    }
  }