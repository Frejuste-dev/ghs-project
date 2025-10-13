import {
    Injectable,
    UnauthorizedException,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
  import { Account } from '../accounts/entities/account.entity';
  import { Employee } from '../employees/entities/employee.entity';
  import { LoginDto } from './dto/login.dto';
  
  @Injectable()
  export class AuthService {
    constructor(
      @InjectRepository(Account)
      private accountRepository: Repository<Account>,
      @InjectRepository(Employee)
      private employeeRepository: Repository<Employee>,
      private jwtService: JwtService,
    ) {}
  
    async validateUser(username: string, password: string): Promise<any> {
      const account = await this.accountRepository.findOne({
        where: { username },
        relations: ['employee', 'employee.service'],
      });
  
      if (!account) {
        throw new UnauthorizedException('Identifiants invalides');
      }
  
      if (!account.isActive) {
        throw new UnauthorizedException('Compte désactivé');
      }
  
      const isPasswordValid = await bcrypt.compare(password, account.password);
  
      if (!isPasswordValid) {
        throw new UnauthorizedException('Identifiants invalides');
      }
  
      // Update last login
      account.lastLogin = new Date();
      await this.accountRepository.save(account);
  
      const { password: _, ...result } = account;
      return result;
    }
  
    async login(loginDto: LoginDto) {
      const account = await this.validateUser(
        loginDto.username,
        loginDto.password,
      );
  
      const payload = {
        sub: account.employeeID,
        username: account.username,
        accountID: account.accountID,
        profile: account.profile,
      };
  
      return {
        access_token: this.jwtService.sign(payload),
        token_type: 'bearer',
        user: {
          accountID: account.accountID,
          employeeID: account.employeeID,
          username: account.username,
          profile: account.profile,
          employee: {
            employeeID: account.employee.employeeID,
            employeeNumber: account.employee.employeeNumber,
            firstName: account.employee.firstName,
            lastName: account.employee.lastName,
            service: account.employee.service,
          },
        },
      };
    }
  
    async getMe(employeeID: number) {
      const account = await this.accountRepository.findOne({
        where: { employeeID },
        relations: ['employee', 'employee.service'],
      });
  
      if (!account) {
        throw new NotFoundException('Compte non trouvé');
      }
  
      const { password, resetToken, resetTokenExpiry, ...accountData } = account;
  
      return {
        ...accountData,
        employee: {
          employeeID: account.employee.employeeID,
          employeeNumber: account.employee.employeeNumber,
          firstName: account.employee.firstName,
          lastName: account.employee.lastName,
          contact: account.employee.contact,
          service: account.employee.service,
        },
      };
    }
  
    async hashPassword(password: string): Promise<string> {
      const saltRounds = 10;
      return bcrypt.hash(password, saltRounds);
    }
  }