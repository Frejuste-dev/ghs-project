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
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
  } from '@nestjs/swagger';
  import { AccountsService } from './accounts.service';
  import { CreateAccountDto } from './dto/create-account.dto';
  import { UpdateAccountDto } from './dto/update-account.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserProfile } from './entities/account.entity';
  
  @ApiTags('Accounts')
  @Controller('accounts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserProfile.ADMINISTRATOR)
  export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Créer un nouveau compte (Admin uniquement)' })
    @ApiResponse({ status: 201, description: 'Compte créé avec succès' })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    @ApiResponse({ status: 409, description: 'Compte ou username existant' })
    create(@Body() createAccountDto: CreateAccountDto) {
      return this.accountsService.create(createAccountDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Obtenir tous les comptes (Admin uniquement)' })
    @ApiResponse({ status: 200, description: 'Liste des comptes' })
    findAll() {
      return this.accountsService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Obtenir un compte par ID (Admin uniquement)' })
    @ApiResponse({ status: 200, description: 'Compte trouvé' })
    @ApiResponse({ status: 404, description: 'Compte non trouvé' })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.accountsService.findOne(id);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour un compte (Admin uniquement)' })
    @ApiResponse({ status: 200, description: 'Compte mis à jour' })
    @ApiResponse({ status: 404, description: 'Compte non trouvé' })
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateAccountDto: UpdateAccountDto,
    ) {
      return this.accountsService.update(id, updateAccountDto);
    }
  
    @Patch(':id/toggle-active')
    @ApiOperation({
      summary: 'Activer/Désactiver un compte (Admin uniquement)',
    })
    @ApiResponse({ status: 200, description: 'Statut du compte modifié' })
    @ApiResponse({ status: 404, description: 'Compte non trouvé' })
    toggleActive(@Param('id', ParseIntPipe) id: number) {
      return this.accountsService.toggleActive(id);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un compte (Admin uniquement)' })
    @ApiResponse({ status: 200, description: 'Compte supprimé' })
    @ApiResponse({ status: 404, description: 'Compte non trouvé' })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.accountsService.remove(id);
    }
  }