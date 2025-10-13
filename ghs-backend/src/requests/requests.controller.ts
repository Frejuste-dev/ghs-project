import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
  } from '@nestjs/swagger';
  import { RequestsService } from './requests.service';
  import { CreateRequestDto } from './dto/create-request.dto';
  import { UpdateRequestDto } from './dto/update-request.dto';
  import { UpdateStatusDto } from './dto/update-status.dto';
  import { ApproveRequestDto } from './dto/approve-request.dto';
  import { RejectRequestDto } from './dto/reject-request.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserProfile } from '../accounts/entities/account.entity';

  
  @ApiTags('Requests')
  @Controller('requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle demande d\'heures supplémentaires' })
    @ApiResponse({ status: 201, description: 'Demande créée avec succès' })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    create(@Body() createRequestDto: CreateRequestDto, @Request() req) {
      return this.requestsService.create(
        createRequestDto,
        req.user.employeeID,
      );
    }
  
    @Get()
    @ApiOperation({ summary: 'Obtenir toutes les demandes (selon le rôle)' })
    @ApiResponse({ status: 200, description: 'Liste des demandes' })
    findAll(@Request() req) {
      return this.requestsService.findAll(
        req.user.employeeID,
        req.user.profile,
      );
    }

    @Get('me')
    @ApiOperation({ summary: 'Obtenir les demandes de l’utilisateur connecté' })
    @ApiResponse({ status: 200, description: 'Liste des demandes personnelles' })
    findMine(@Request() req) {
      return this.requestsService.findMine(req.user.employeeID);
    }

    @Get('pending')
    @Roles(UserProfile.SUPERVISOR, UserProfile.ADMINISTRATOR)
    @ApiOperation({ summary: 'Obtenir les demandes en attente (superviseur/admin)' })
    @ApiResponse({ status: 200, description: 'Liste des demandes en attente' })
    findPending(@Request() req) {
      return this.requestsService.findPending(req.user.employeeID, req.user.profile);
    }
  
    @Get(':id')
    @ApiResponse({ status: 200, description: 'Demande trouvée' })
    @ApiResponse({ status: 404, description: 'Demande non trouvée' })
    @ApiResponse({ status: 403, description: 'Accès interdit' })
    findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
      return this.requestsService.findOne(
        id,
        req.user.employeeID,
        req.user.profile,
      );
    }

    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour une demande' })
    @ApiResponse({ status: 200, description: 'Demande mise à jour' })
    @ApiResponse({ status: 404, description: 'Demande non trouvée' })
    @ApiResponse({ status: 403, description: 'Accès interdit' })
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateRequestDto: UpdateRequestDto,
      @Request() req,
    ) {
      return this.requestsService.update(
        id,
        updateRequestDto,
        req.user.employeeID,
        req.user.profile,
      );
    }

    @Patch(':id/status')
    @Roles(UserProfile.SUPERVISOR, UserProfile.ADMINISTRATOR)
    @ApiOperation({ summary: 'Mettre à jour le statut d\'une demande' })
    @ApiResponse({ status: 200, description: 'Statut mis à jour' })
    @ApiResponse({ status: 403, description: 'Permission insuffisante' })
    updateStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateStatusDto: UpdateStatusDto,
      @Request() req,
    ) {
      return this.requestsService.updateStatus(
        id,
        updateStatusDto.status,
        req.user.employeeID,
        req.user.profile,
      );
    }

    @Post(':id/approve')
    @Roles(UserProfile.SUPERVISOR, UserProfile.ADMINISTRATOR)
    @ApiOperation({ summary: 'Approuver une demande (N1 ou N2)' })
    @ApiResponse({ status: 200, description: 'Demande approuvée' })
    approve(
      @Param('id', ParseIntPipe) id: number,
      @Body() approveDto: ApproveRequestDto,
      @Request() req,
    ) {
      return this.requestsService.approve(
        id,
        approveDto?.level,
        req.user.employeeID,
        req.user.profile,
      );
    }

    @Post(':id/reject')
    @Roles(UserProfile.SUPERVISOR, UserProfile.ADMINISTRATOR)
    @ApiOperation({ summary: 'Rejeter une demande' })
    @ApiResponse({ status: 200, description: 'Demande rejetée' })
    reject(
      @Param('id', ParseIntPipe) id: number,
      @Body() rejectDto: RejectRequestDto,
      @Request() req,
    ) {
      return this.requestsService.reject(
        id,
        rejectDto?.reason,
        req.user.employeeID,
        req.user.profile,
      );
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer une demande' })
    @ApiResponse({ status: 200, description: 'Demande supprimée' })
    @ApiResponse({ status: 404, description: 'Demande non trouvée' })
    @ApiResponse({ status: 403, description: 'Accès interdit' })
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
      return this.requestsService.remove(
        id,
        req.user.employeeID,
        req.user.profile,
      );
    }
  }