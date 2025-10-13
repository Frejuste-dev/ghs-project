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
  import { DelegationsService } from './delegations.service';
  import { CreateDelegationDto } from './dto/create-delegation.dto';
  import { UpdateDelegationDto } from './dto/update-delegation.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserProfile } from '../accounts/entities/account.entity';
  
  @ApiTags('Delegations')
  @Controller('delegations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserProfile.ADMINISTRATOR, UserProfile.SUPERVISOR)
  export class DelegationsController {
    constructor(private readonly delegationsService: DelegationsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle délégation' })
    @ApiResponse({ status: 201, description: 'Délégation créée' })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    create(@Body() createDelegationDto: CreateDelegationDto) {
      return this.delegationsService.create(createDelegationDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Obtenir toutes les délégations' })
    @ApiResponse({ status: 200, description: 'Liste des délégations' })
    findAll() {
      return this.delegationsService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Obtenir une délégation par ID' })
    @ApiResponse({ status: 200, description: 'Délégation trouvée' })
    @ApiResponse({ status: 404, description: 'Délégation non trouvée' })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.delegationsService.findOne(id);
    }
  
    @Get('employee/:id/active')
    @ApiOperation({ summary: 'Obtenir les délégations actives d\'un employé' })
    @ApiResponse({ status: 200, description: 'Délégations actives' })
    getActiveDelegations(@Param('id', ParseIntPipe) id: number) {
      return this.delegationsService.getActiveDelegations(id);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour une délégation' })
    @ApiResponse({ status: 200, description: 'Délégation mise à jour' })
    @ApiResponse({ status: 404, description: 'Délégation non trouvée' })
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateDelegationDto: UpdateDelegationDto,
    ) {
      return this.delegationsService.update(id, updateDelegationDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer une délégation' })
    @ApiResponse({ status: 200, description: 'Délégation supprimée' })
    @ApiResponse({ status: 404, description: 'Délégation non trouvée' })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.delegationsService.remove(id);
    }
  }
  