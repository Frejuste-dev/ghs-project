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
  import { ServicesService } from './services.service';
  import { CreateServiceDto } from './dto/create-service.dto';
  import { UpdateServiceDto } from './dto/update-service.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { Public } from '../auth/decorators/public.decorator';
  import { UserProfile } from '../accounts/entities/account.entity';
  
  @ApiTags('Services')
  @Controller('services')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}
  
    @Post()
    @ApiBearerAuth('JWT-auth')
    @Roles(UserProfile.ADMINISTRATOR, UserProfile.SUPERVISOR)
    @ApiOperation({ summary: 'Créer un nouveau service' })
    @ApiResponse({ status: 201, description: 'Service créé avec succès' })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    @ApiResponse({ status: 409, description: 'Code service déjà existant' })
    create(@Body() createServiceDto: CreateServiceDto) {
      return this.servicesService.create(createServiceDto);
    }
  
    @Get()
    @Public()
    @ApiOperation({ summary: 'Obtenir tous les services' })
    @ApiResponse({ status: 200, description: 'Liste des services' })
    findAll() {
      return this.servicesService.findAll();
    }
  
    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Obtenir un service par ID' })
    @ApiResponse({ status: 200, description: 'Service trouvé' })
    @ApiResponse({ status: 404, description: 'Service non trouvé' })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.servicesService.findOne(id);
    }
  
    @Put(':id')
    @ApiBearerAuth('JWT-auth')
    @Roles(UserProfile.ADMINISTRATOR, UserProfile.SUPERVISOR)
    @ApiOperation({ summary: 'Mettre à jour un service' })
    @ApiResponse({ status: 200, description: 'Service mis à jour' })
    @ApiResponse({ status: 404, description: 'Service non trouvé' })
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateServiceDto: UpdateServiceDto,
    ) {
      return this.servicesService.update(id, updateServiceDto);
    }
  
    @Delete(':id')
    @ApiBearerAuth('JWT-auth')
    @Roles(UserProfile.ADMINISTRATOR)
    @ApiOperation({ summary: 'Supprimer un service' })
    @ApiResponse({ status: 200, description: 'Service supprimé' })
    @ApiResponse({ status: 404, description: 'Service non trouvé' })
    @ApiResponse({
      status: 400,
      description: 'Service contient des employés',
    })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.servicesService.remove(id);
    }
  }