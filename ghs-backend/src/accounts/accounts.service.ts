import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Account, UserProfile } from './entities/account.entity';
  import { Employee } from '../employees/entities/employee.entity';
  import { CreateAccountDto } from './dto/create-account.dto';
  import { UpdateAccountDto } from './dto/update-account.dto';
  import { AuthService } from '../auth/auth.service';
  
  @Injectable()
  export class AccountsService {
    constructor(
      @InjectRepository(Account)
      private accountRepository: Repository<Account>,
      @InjectRepository(Employee)
      private employeeRepository: Repository<Employee>,
      private authService: AuthService,
    ) {}
  
    async create(createAccountDto: CreateAccountDto): Promise<Account> {
      // Vérifier si l'employé existe
      const employee = await this.employeeRepository.findOne({
        where: { employeeID: createAccountDto.employeeID },
        relations: ['account'],
      });
  
      if (!employee) {
        throw new NotFoundException(
          `Employé avec ID ${createAccountDto.employeeID} non trouvé`,
        );
      }
  
      // Vérifier si l'employé a déjà un compte
      if (employee.account) {
        throw new ConflictException(
          'Cet employé possède déjà un compte',
        );
      }
  
      // Vérifier si le nom d'utilisateur existe déjà
      const existingAccount = await this.accountRepository.findOne({
        where: { username: createAccountDto.username },
      });
  
      if (existingAccount) {
        throw new ConflictException(
          `Le nom d'utilisateur "${createAccountDto.username}" existe déjà`,
        );
      }
  
      // Validation du nom d'utilisateur
      if (!/^[a-zA-Z0-9_-]{3,50}$/.test(createAccountDto.username)) {
        throw new BadRequestException(
          'Le nom d\'utilisateur doit contenir entre 3 et 50 caractères (lettres, chiffres, tirets et underscores)',
        );
      }
  
      // Hacher le mot de passe
      const hashedPassword = await this.authService.hashPassword(
        createAccountDto.password,
      );
  
      const account = this.accountRepository.create({
        ...createAccountDto,
        password: hashedPassword,
      });
  
      return this.accountRepository.save(account);
    }
  
    async findAll(): Promise<Account[]> {
      return this.accountRepository.find({
        relations: ['employee', 'employee.service'],
        select: {
          accountID: true,
          employeeID: true,
          username: true,
          profile: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
        order: { createdAt: 'DESC' },
      });
    }
  
    async findOne(id: number): Promise<Account> {
      const account = await this.accountRepository.findOne({
        where: { accountID: id },
        relations: ['employee', 'employee.service'],
        select: {
          accountID: true,
          employeeID: true,
          username: true,
          profile: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      });
  
      if (!account) {
        throw new NotFoundException(`Compte avec ID ${id} non trouvé`);
      }
  
      return account;
    }
  
    async update(
      id: number,
      updateAccountDto: UpdateAccountDto,
    ): Promise<Account> {
      const account = await this.accountRepository.findOne({
        where: { accountID: id },
      });
  
      if (!account) {
        throw new NotFoundException(`Compte avec ID ${id} non trouvé`);
      }
  
      // Vérifier l'unicité du nom d'utilisateur si modifié
      if (
        updateAccountDto.username &&
        updateAccountDto.username !== account.username
      ) {
        const existingAccount = await this.accountRepository.findOne({
          where: { username: updateAccountDto.username },
        });
  
        if (existingAccount) {
          throw new ConflictException(
            `Le nom d'utilisateur "${updateAccountDto.username}" existe déjà`,
          );
        }
  
        // Validation du nom d'utilisateur
        if (!/^[a-zA-Z0-9_-]{3,50}$/.test(updateAccountDto.username)) {
          throw new BadRequestException(
            'Le nom d\'utilisateur doit contenir entre 3 et 50 caractères',
          );
        }
      }
  
      // Si le mot de passe est modifié, le hacher
      if (updateAccountDto.password) {
        updateAccountDto.password = await this.authService.hashPassword(
          updateAccountDto.password,
        );
      }
  
      Object.assign(account, updateAccountDto);
      return this.accountRepository.save(account);
    }
  
    async toggleActive(id: number): Promise<Account> {
      const account = await this.accountRepository.findOne({
        where: { accountID: id },
      });
  
      if (!account) {
        throw new NotFoundException(`Compte avec ID ${id} non trouvé`);
      }
  
      account.isActive = !account.isActive;
      return this.accountRepository.save(account);
    }
  
    async remove(id: number): Promise<void> {
      const account = await this.accountRepository.findOne({
        where: { accountID: id },
      });
  
      if (!account) {
        throw new NotFoundException(`Compte avec ID ${id} non trouvé`);
      }
  
      await this.accountRepository.remove(account);
    }
  }
  