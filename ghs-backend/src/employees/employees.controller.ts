import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
  } from '@nestjs/swagger';
  import { EmployeesService } from './employees.service';
  import { CreateEmployeeDto } from './dto/create-employee.dto';
  import { UpdateEmployeeDto } from './dto/update-employee.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { Public } from '../auth/decorators/public.decorator';
  import { UserProfile } from '../accounts/entities/account.entity';
  
  @ApiTags('Employees')
  @Controller('employees')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}
  
    @Post()
    @ApiBearerAuth('JWT-auth')
    @Roles(UserProfile.ADMINISTRATOR, UserProfile.SUPERVISOR)
    @ApiOperation({ summary: 'Créer un nouvel employé' })
    @ApiResponse({ status: 201, description: 'Employé créé avec succès' })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    @ApiResponse({ status: 409, description: 'Numéro d\'employé déjà existant' })
    create(@Body() createEmployeeDto: CreateEmployeeDto) {
      return this.employeesService.create(createEmployeeDto);
    }
  
    @Get()
    @Public()
    @ApiOperation({ summary: 'Obtenir tous les employés' })
    @ApiResponse({ status: 200, description: 'Liste des employés' })
    findAll() {
      return this.employeesService.findAll();
    }
  
    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Obtenir un employé par ID' })
    @ApiResponse({ status: 200, description: 'Employé trouvé' })
    @ApiResponse({ status: 404, description: 'Employé non trouvé' })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.employeesService.findOne(id);
    }
  
    @Put(':id')
    @ApiBearerAuth('JWT-auth')
    @Roles(UserProfile.ADMINISTRATOR, UserProfile.SUPERVISOR)
    @ApiOperation({ summary: 'Mettre à jour un employé' })
    @ApiResponse({ status: 200, description: 'Employé mis à jour' })
    @ApiResponse({ status: 404, description: 'Employé non trouvé' })
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateEmployeeDto: UpdateEmployeeDto,
    ) {
      return this.employeesService.update(id, updateEmployeeDto);
    }
  
    @Delete(':id')
    @ApiBearerAuth('JWT-auth')
    @Roles(UserProfile.ADMINISTRATOR)
    @ApiOperation({ summary: 'Supprimer un employé' })
    @ApiResponse({ status: 200, description: 'Employé supprimé' })
    @ApiResponse({ status: 404, description: 'Employé non trouvé' })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.employeesService.remove(id);
    }
  }
  