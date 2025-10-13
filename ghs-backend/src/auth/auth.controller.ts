import {
    Controller,
    Post,
    Get,
    Body,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { AuthService } from './auth.service';
  import { JwtAuthGuard } from './guards/jwt-auth.guard';
  import { LocalAuthGuard } from './guards/local-auth.guard';
  import { LoginDto } from './dto/login.dto';
  
  @ApiTags('Auth')
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiOperation({ summary: 'Connexion utilisateur' })
    @ApiResponse({ status: 200, description: 'Connexion réussie' })
    @ApiResponse({ status: 401, description: 'Identifiants invalides' })
    async login(@Body() loginDto: LoginDto) {
      return this.authService.login(loginDto);
    }
  
    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Obtenir les informations de l\'utilisateur connecté' })
    @ApiResponse({ status: 200, description: 'Informations utilisateur' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    async getMe(@Request() req) {
      return this.authService.getMe(req.user.employeeID);
    }
  }
  