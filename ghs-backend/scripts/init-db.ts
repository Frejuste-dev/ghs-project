// scripts/init-db.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Service } from '../src/services/entities/service.entity';
import { Employee, ContractType } from '../src/employees/entities/employee.entity';
import { Account, UserProfile } from '../src/accounts/entities/account.entity';
import { Request, RequestStatus } from '../src/requests/entities/request.entity';

async function bootstrap() {
  console.log('🚀 Initialisation de la base de données...\n');

  const app = await NestFactory.createApplicationContext(AppModule);

  const serviceRepo = app.get(getRepositoryToken(Service));
  const employeeRepo = app.get(getRepositoryToken(Employee));
  const accountRepo = app.get(getRepositoryToken(Account));
  const requestRepo = app.get(getRepositoryToken(Request));

  try {
    // 1. Créer les services
    console.log('📁 Création des services...');
    
    const services = [
      {
        serviceCode: 'DIR',
        serviceName: 'Direction Générale',
        description: 'Direction et administration',
        manager: 'Jean Directeur',
      },
      {
        serviceCode: 'IT',
        serviceName: 'Service Informatique',
        description: 'Gestion de l\'infrastructure IT',
        manager: 'Marie Tech',
      },
      {
        serviceCode: 'RH',
        serviceName: 'Ressources Humaines',
        description: 'Gestion du personnel',
        manager: 'Pierre RH',
      },
      {
        serviceCode: 'COMPTA',
        serviceName: 'Comptabilité',
        description: 'Gestion financière',
        manager: 'Sophie Compta',
      },
    ];

    const createdServices = [];
    for (const serviceData of services) {
      const service = serviceRepo.create(serviceData);
      const saved = await serviceRepo.save(service);
      createdServices.push(saved);
      console.log(`  ✅ Service créé: ${saved.serviceName}`);
    }

    // 2. Créer les employés
    console.log('\n👥 Création des employés...');
    
    const employees = [
      {
        employeeNumber: 'EMP0001',
        lastName: 'Admin',
        firstName: 'Super',
        serviceID: createdServices[0].serviceID,
        contractType: ContractType.CDI,
        contact: '+225 01 00 00 01',
        birthdate: new Date('1980-01-15'),
      },
      {
        employeeNumber: 'EMP0002',
        lastName: 'Supervisor',
        firstName: 'Chef',
        serviceID: createdServices[1].serviceID,
        contractType: ContractType.CDI,
        contact: '+225 01 00 00 02',
        birthdate: new Date('1985-05-20'),
      },
      {
        employeeNumber: 'EMP0003',
        lastName: 'Dupont',
        firstName: 'Jean',
        serviceID: createdServices[1].serviceID,
        contractType: ContractType.CDI,
        contact: '+225 01 00 00 03',
        birthdate: new Date('1990-03-10'),
      },
      {
        employeeNumber: 'EMP0004',
        lastName: 'Martin',
        firstName: 'Alice',
        serviceID: createdServices[2].serviceID,
        contractType: ContractType.CDD,
        contact: '+225 01 00 00 04',
        birthdate: new Date('1992-07-25'),
      },
      {
        employeeNumber: 'EMP0005',
        lastName: 'Bernard',
        firstName: 'Paul',
        serviceID: createdServices[3].serviceID,
        contractType: ContractType.CDI,
        contact: '+225 01 00 00 05',
        birthdate: new Date('1988-11-30'),
      },
    ];

    const createdEmployees = [];
    for (const employeeData of employees) {
      const employee = employeeRepo.create(employeeData);
      const saved = await employeeRepo.save(employee);
      createdEmployees.push(saved);
      console.log(`  ✅ Employé créé: ${saved.firstName} ${saved.lastName}`);
    }

    // 3. Créer les comptes
    console.log('\n🔐 Création des comptes...');
    
    const accounts = [
      {
        employeeID: createdEmployees[0].employeeID,
        username: 'admin',
        password: 'admin123',
        profile: UserProfile.ADMINISTRATOR,
        isActive: true,
      },
      {
        employeeID: createdEmployees[1].employeeID,
        username: 'supervisor',
        password: 'super123',
        profile: UserProfile.SUPERVISOR,
        isActive: true,
      },
      {
        employeeID: createdEmployees[2].employeeID,
        username: 'user',
        password: 'user123',
        profile: UserProfile.VALIDATOR,
        isActive: true,
      },
      {
        employeeID: createdEmployees[3].employeeID,
        username: 'alice',
        password: 'alice123',
        profile: UserProfile.VALIDATOR,
        isActive: true,
      },
      {
        employeeID: createdEmployees[4].employeeID,
        username: 'paul',
        password: 'paul123',
        profile: UserProfile.VALIDATOR,
        isActive: true,
      },
    ];

    const createdAccounts = [];
    for (const accountData of accounts) {
      const hashedPassword = await bcrypt.hash(accountData.password, 10);
      const account = accountRepo.create({
        ...accountData,
        password: hashedPassword,
      });
      const saved = await accountRepo.save(account);
      createdAccounts.push(saved);
      console.log(`  ✅ Compte créé: ${accountData.username} (${accountData.profile})`);
    }

    // 4. Créer des demandes d'heures supplémentaires
    console.log('\n📋 Création de demandes d\'heures supplémentaires...');
    
    const requests = [
      {
        employeeID: createdEmployees[2].employeeID,
        requestDate: new Date('2025-10-05'),
        startAt: '08:00',
        endAt: '20:00',
        status: RequestStatus.PENDING,
        comment: 'Projet urgent client XYZ',
        createdBy: createdEmployees[2].employeeID,
      },
      {
        employeeID: createdEmployees[3].employeeID,
        requestDate: new Date('2025-10-06'),
        previousStart: '08:00',
        previousEnd: '17:00',
        startAt: '08:00',
        endAt: '19:00',
        status: RequestStatus.SUBMITTED,
        comment: 'Préparation audit annuel',
        createdBy: createdEmployees[3].employeeID,
      },
      {
        employeeID: createdEmployees[4].employeeID,
        requestDate: new Date('2025-10-07'),
        startAt: '09:00',
        endAt: '18:00',
        status: RequestStatus.FIRST_LEVEL_APPROVED,
        comment: 'Clôture comptable',
        createdBy: createdEmployees[4].employeeID,
        validatedN1At: new Date(),
      },
    ];

    const createdRequests = [];
    for (const requestData of requests) {
      const request = requestRepo.create(requestData);
      const saved = await requestRepo.save(request);
      createdRequests.push(saved);
      console.log(`  ✅ Demande créée: ${saved.requestID} (${saved.status})`);
    }

    console.log('\n✨ Initialisation terminée avec succès!\n');
    console.log('📊 Résumé:');
    console.log(`  - ${createdServices.length} services créés`);
    console.log(`  - ${createdEmployees.length} employés créés`);
    console.log(`  - ${createdAccounts.length} comptes créés`);
    console.log(`  - ${createdRequests.length} demandes créées\n`);
    
    console.log('🔑 Comptes de test:');
    console.log('  - admin / admin123 (Administrator)');
    console.log('  - supervisor / super123 (Supervisor)');
    console.log('  - user / user123 (Validator)');
    console.log('  - alice / alice123 (Validator)');
    console.log('  - paul / paul123 (Validator)\n');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    await app.close();
  }
}

bootstrap();