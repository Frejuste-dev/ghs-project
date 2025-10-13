# GHS Backend - NestJS

API REST complète pour la gestion des heures supplémentaires, construite avec NestJS, TypeORM et MySQL.

## 🚀 Fonctionnalités

### Architecture
- ✅ **NestJS** - Framework Node.js progressif
- ✅ **TypeORM** - ORM TypeScript pour MySQL
- ✅ **JWT Authentication** - Authentification sécurisée
- ✅ **Role-based Access Control** - Gestion des permissions
- ✅ **Swagger/OpenAPI** - Documentation API automatique
- ✅ **Validation** - Validation des données avec class-validator
- ✅ **Logging** - Système de logs structuré
- ✅ **Error Handling** - Gestion centralisée des erreurs

### Modules
- 🔐 **Auth** - Authentification JWT
- 👥 **Employees** - Gestion des employés
- 📁 **Services** - Gestion des services
- 🔑 **Accounts** - Gestion des comptes utilisateurs
- 📋 **Requests** - Demandes d'heures supplémentaires
- 🔄 **Delegations** - Gestion des délégations
- 📊 **Workflows** - Gestion des workflows de validation

## 📋 Prérequis

- Node.js 18+
- MySQL 8.0+
- npm ou yarn

## 🛠️ Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd ghs/backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration

Créer un fichier `.env` à la racine :

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ghs

# Application
NODE_ENV=development
APP_HOST=0.0.0.0
APP_PORT=8000

# JWT
SECRET_KEY=your-super-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:80
```

### 4. Créer la base de données

```bash
mysql -u root -p
CREATE DATABASE ghs;
USE ghs;
SOURCE ../ghs.sql;
```

### 5. Initialiser avec des données de test

```bash
npm run init-db
```

## 🚀 Démarrage

### Mode développement

```bash
npm run start:dev
```

### Mode production

```bash
npm run build
npm run start:prod
```

### Avec Docker

```bash
docker-compose up --build
```

## 📚 Documentation API

Une fois l'application démarrée, accédez à :

- **Swagger UI** : http://localhost:8000/docs
- **Health Check** : http://localhost:8000/health

## 🔑 Authentification

### Endpoints

#### POST /api/v1/auth/login
Connexion utilisateur

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "accountID": 1,
    "employeeID": 1,
    "username": "admin",
    "profile": "Administrator",
    "employee": {...}
  }
}
```

#### GET /api/v1/auth/me
Obtenir les informations de l'utilisateur connecté

**Headers:**
```
Authorization: Bearer <token>
```

## 📊 Structure du Projet

```
backend/
├── src/
│   ├── auth/                    # Module d'authentification
│   │   ├── decorators/         # Décorateurs personnalisés
│   │   ├── guards/             # Guards JWT et rôles
│   │   ├── strategies/         # Stratégies Passport
│   │   ├── dto/                # DTOs
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.module.ts
│   │
│   ├── services/               # Module Services
│   │   ├── entities/
│   │   ├── dto/
│   │   ├── services.service.ts
│   │   ├── services.controller.ts
│   │   └── services.module.ts
│   │
│   ├── employees/              # Module Employés
│   ├── accounts/               # Module Comptes
│   ├── requests/               # Module Demandes
│   ├── delegations/            # Module Délégations
│   ├── workflows/              # Module Workflows
│   │
│   ├── common/                 # Utilitaires communs
│   │   ├── decorators/         # Décorateurs
│   │   ├── filters/            # Filtres d'exception
│   │   ├── guards/             # Guards
│   │   ├── interceptors/       # Interceptors
│   │   ├── middleware/         # Middlewares
│   │   ├── pipes/              # Pipes de validation
│   │   └── validators/         # Validateurs métier
│   │
│   ├── app.module.ts           # Module principal
│   └── main.ts                 # Point d'entrée
│
├── scripts/
│   └── init-db.ts              # Script d'initialisation
│
├── test/                       # Tests
├── .env                        # Variables d'environnement
├── .env.example
├── tsconfig.json
├── nest-cli.json
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## 🔒 Sécurité

### Protection des endpoints

Les endpoints sont protégés par :
- **JWT Guard** - Vérifie le token JWT
- **Roles Guard** - Vérifie les permissions

### Exemples d'utilisation

```typescript
// Endpoint public
@Public()
@Get()
findAll() {
  return this.service.findAll();
}

// Endpoint protégé (authentification requise)
@UseGuards(JwtAuthGuard)
@Get()
findAll() {
  return this.service.findAll();
}

// Endpoint avec rôles spécifiques
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserProfile.ADMINISTRATOR, UserProfile.SUPERVISOR)
@Post()
create() {
  return this.service.create();
}
```

## 📝 Validation

### Validations automatiques

Les DTOs incluent des validations automatiques :

```typescript
export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^EMP\d{4,}$/)
  employeeNumber: string;

  @IsString()
  @MaxLength(20)
  lastName: string;

  @IsEnum(ContractType)
  contractType: ContractType;
}
```

### Validations métier

Des validateurs personnalisés pour les règles métier :

- **MaxWorkHours** - Limite à 12h de travail
- **IsFutureDate** - Date dans le futur uniquement
- Validation des plages horaires
- Validation des délégations

## 🧪 Tests

### Tests unitaires

```bash
npm run test
```

### Tests e2e

```bash
npm run test:e2e
```

### Coverage

```bash
npm run test:cov
```

## 📦 Scripts NPM

```bash
# Développement
npm run start:dev      # Mode watch
npm run start:debug    # Mode debug

# Production
npm run build          # Compiler
npm run start:prod     # Démarrer

# Tests
npm run test           # Tests unitaires
npm run test:watch     # Tests en mode watch
npm run test:cov       # Coverage
npm run test:e2e       # Tests e2e

# Qualité code
npm run lint           # Linter
npm run format         # Formatter

# Base de données
npm run init-db        # Initialiser avec données de test
```

## 🔧 Configuration avancée

### TypeORM

La configuration TypeORM se trouve dans `app.module.ts` :

```typescript
TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: configService.get('NODE_ENV') === 'development',
  }),
})
```

### JWT

Configuration JWT dans `auth.module.ts` :

```typescript
JwtModule.registerAsync({
  useFactory: (configService: ConfigService) => ({
    secret: configService.get('SECRET_KEY'),
    signOptions: {
      expiresIn: `${configService.get('ACCESS_TOKEN_EXPIRE_MINUTES')}m`,
    },
  }),
})
```

## 🐳 Docker

### Development

```bash
docker-compose up
```

### Production

```bash
docker build -t ghs-backend:latest .
docker run -p 8000:8000 --env-file .env ghs-backend:latest
```

## 🔍 Monitoring & Logging

### Logs

Les logs sont automatiquement générés pour :
- Toutes les requêtes HTTP
- Les erreurs
- Les opérations de base de données

### Health Check

```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-03T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT

## 👥 Comptes de test

Après avoir exécuté `npm run init-db` :

| Username   | Password   | Profil         |
|------------|------------|----------------|
| admin      | admin123   | Administrator  |
| supervisor | super123   | Supervisor     |
| user       | user123    | Validator      |
| alice      | alice123   | Validator      |
| paul       | paul123    | Validator      |

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation Swagger
- Vérifier les logs de l'application

## 📈 Roadmap

- [ ] Tests unitaires complets
- [ ] Tests e2e
- [ ] Migration système
- [ ] WebSockets pour notifications temps réel
- [ ] Export PDF des rapports
- [ ] Notifications par email
- [ ] Tableau de bord analytics
- [ ] API rate limiting avancé