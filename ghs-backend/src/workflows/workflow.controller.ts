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
  import { WorkflowsService } from './workflows.service';
  import { CreateWorkflowDto } from './dto/create-workflow.dto';
  import { UpdateWorkflowDto } from './dto/update-workflow.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserProfile } from '../accounts/entities/account.entity';
  
  @ApiTags('Workflows')
  @Controller('workflows')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(UserProfile.ADMINISTRATOR, UserProfile.SUPERVISOR)
  export class WorkflowsController {
    constructor(private readonly workflowsService: WorkflowsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Créer un nouveau workflow' })
    @ApiResponse({ status: 201, description: 'Workflow créé' })
    create(@Body() createWorkflowDto: CreateWorkflowDto) {
      return this.workflowsService.create(createWorkflowDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Obtenir tous les workflows' })
    @ApiResponse({ status: 200, description: 'Liste des workflows' })
    findAll() {
      return this.workflowsService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Obtenir un workflow par ID' })
    @ApiResponse({ status: 200, description: 'Workflow trouvé' })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.workflowsService.findOne(id);
    }
  
    @Get('request/:requestID')
    @ApiOperation({ summary: 'Obtenir les workflows d\'une demande' })
    @ApiResponse({ status: 200, description: 'Workflows de la demande' })
    findByRequest(@Param('requestID', ParseIntPipe) requestID: number) {
      return this.workflowsService.findByRequest(requestID);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour un workflow' })
    @ApiResponse({ status: 200, description: 'Workflow mis à jour' })
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateWorkflowDto: UpdateWorkflowDto,
    ) {
      return this.workflowsService.update(id, updateWorkflowDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un workflow' })
    @ApiResponse({ status: 200, description: 'Workflow supprimé' })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.workflowsService.remove(id);
    }
  }
  