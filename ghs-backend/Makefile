# Makefile pour GHS Backend NestJS

.PHONY: help install dev build start test clean docker-up docker-down init-db lint format

# Variables
APP_NAME=ghs-backend
DOCKER_COMPOSE=docker-compose
NPM=npm

# Couleurs pour les messages
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m # No Color

## help: Afficher l'aide
help:
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(GREEN)               GHS Backend NestJS - Commandes Disponibles                      $(NC)"
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo ""
	@echo "$(YELLOW)Installation & Configuration:$(NC)"
	@echo "  make install          - Installer toutes les dépendances"
	@echo "  make setup            - Configuration initiale complète"
	@echo "  make init-db          - Initialiser la base de données avec données de test"
	@echo ""
	@echo "$(YELLOW)Développement:$(NC)"
	@echo "  make dev              - Démarrer en mode développement (watch)"
	@echo "  make start            - Démarrer normalement"
	@echo "  make debug            - Démarrer en mode debug"
	@echo "  make build            - Compiler le projet"
	@echo ""
	@echo "$(YELLOW)Tests:$(NC)"
	@echo "  make test             - Exécuter les tests unitaires"
	@echo "  make test-watch       - Tests en mode watch"
	@echo "  make test-cov         - Tests avec coverage"
	@echo "  make test-e2e         - Tests end-to-end"
	@echo ""
	@echo "$(YELLOW)Qualité du code:$(NC)"
	@echo "  make lint             - Linter le code"
	@echo "  make format           - Formatter le code"
	@echo "  make check            - Vérifier le code (lint + format)"
	@echo ""
	@echo "$(YELLOW)Docker:$(NC)"
	@echo "  make docker-up        - Démarrer avec Docker Compose"
	@echo "  make docker-down      - Arrêter Docker Compose"
	@echo "  make docker-build     - Construire l'image Docker"
	@echo "  make docker-logs      - Voir les logs Docker"
	@echo "  make docker-clean     - Nettoyer Docker (volumes, images)"
	@echo ""
	@echo "$(YELLOW)Base de données:$(NC)"
	@echo "  make db-create        - Créer la base de données"
	@echo "  make db-migrate       - Exécuter les migrations"
	@echo "  make db-seed          - Remplir avec données de test"
	@echo "  make db-reset         - Réinitialiser la base de données"
	@echo ""
	@echo "$(YELLOW)Utilitaires:$(NC)"
	@echo "  make clean            - Nettoyer les fichiers générés"
	@echo "  make clean-all        - Nettoyage complet (node_modules, dist, etc.)"
	@echo "  make logs             - Voir les logs de l'application"
	@echo "  make health           - Vérifier l'état de l'API"
	@echo ""
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"

## install: Installer les dépendances
install:
	@echo "$(GREEN)📦 Installation des dépendances...$(NC)"
	$(NPM) install
	@echo "$(GREEN)✅ Dépendances installées!$(NC)"

## setup: Configuration initiale complète
setup: install
	@echo "$(GREEN)🔧 Configuration initiale...$(NC)"
	@if [ ! -f .env ]; then \
		echo "$(YELLOW)⚠️  Fichier .env non trouvé. Copie de .env.example...$(NC)"; \
		cp .env.example .env; \
		echo "$(YELLOW)⚠️  Pensez à éditer le fichier .env avec vos paramètres!$(NC)"; \
	else \
		echo "$(GREEN)✅ Fichier .env déjà présent$(NC)"; \
	fi
	@echo "$(GREEN)✅ Configuration terminée!$(NC)"

## dev: Démarrer en mode développement
dev:
	@echo "$(GREEN)🚀 Démarrage en mode développement...$(NC)"
	$(NPM) run start:dev

## start: Démarrer l'application
start:
	@echo "$(GREEN)🚀 Démarrage de l'application...$(NC)"
	$(NPM) run start

## debug: Démarrer en mode debug
debug:
	@echo "$(GREEN)🐛 Démarrage en mode debug...$(NC)"
	$(NPM) run start:debug

## build: Compiler le projet
build:
	@echo "$(GREEN)🔨 Compilation du projet...$(NC)"
	$(NPM) run build
	@echo "$(GREEN)✅ Compilation terminée!$(NC)"

## test: Exécuter les tests unitaires
test:
	@echo "$(GREEN)🧪 Exécution des tests unitaires...$(NC)"
	$(NPM) run test

## test-watch: Tests en mode watch
test-watch:
	@echo "$(GREEN)🧪 Tests en mode watch...$(NC)"
	$(NPM) run test:watch

## test-cov: Tests avec coverage
test-cov:
	@echo "$(GREEN)🧪 Tests avec coverage...$(NC)"
	$(NPM) run test:cov

## test-e2e: Tests end-to-end
test-e2e:
	@echo "$(GREEN)🧪 Exécution des tests e2e...$(NC)"
	$(NPM) run test:e2e

## lint: Linter le code
lint:
	@echo "$(GREEN)🔍 Analyse du code...$(NC)"
	$(NPM) run lint

## format: Formatter le code
format:
	@echo "$(GREEN)✨ Formatage du code...$(NC)"
	$(NPM) run format

## check: Vérifier le code
check: lint
	@echo "$(GREEN)✅ Vérification du code terminée!$(NC)"

## docker-up: Démarrer avec Docker Compose
docker-up:
	@echo "$(GREEN)🐳 Démarrage avec Docker Compose...$(NC)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✅ Services démarrés!$(NC)"
	@echo "$(YELLOW)📚 Documentation: http://localhost:8000/docs$(NC)"
	@echo "$(YELLOW)❤️  Health check: http://localhost:8000/health$(NC)"

## docker-down: Arrêter Docker Compose
docker-down:
	@echo "$(GREEN)🐳 Arrêt de Docker Compose...$(NC)"
	$(DOCKER_COMPOSE) down
	@echo "$(GREEN)✅ Services arrêtés!$(NC)"

## docker-build: Construire l'image Docker
docker-build:
	@echo "$(GREEN)🐳 Construction de l'image Docker...$(NC)"
	$(DOCKER_COMPOSE) build
	@echo "$(GREEN)✅ Image construite!$(NC)"

## docker-logs: Voir les logs Docker
docker-logs:
	@echo "$(GREEN)🐳 Logs Docker...$(NC)"
	$(DOCKER_COMPOSE) logs -f

## docker-clean: Nettoyer Docker
docker-clean:
	@echo "$(RED)🧹 Nettoyage Docker...$(NC)"
	$(DOCKER_COMPOSE) down -v
	docker system prune -f
	@echo "$(GREEN)✅ Nettoyage Docker terminé!$(NC)"

## init-db: Initialiser la base de données
init-db:
	@echo "$(GREEN)🗄️  Initialisation de la base de données...$(NC)"
	$(NPM) run build
	node dist/scripts/init-db.js
	@echo "$(GREEN)✅ Base de données initialisée!$(NC)"

## db-create: Créer la base de données
db-create:
	@echo "$(GREEN)🗄️  Création de la base de données...$(NC)"
	@. ./.env && mysql -h$$DB_HOST -u$$DB_USER -p$$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $$DB_NAME;"
	@echo "$(GREEN)✅ Base de données créée!$(NC)"

## db-migrate: Exécuter les migrations
db-migrate:
	@echo "$(GREEN)🗄️  Exécution des migrations...$(NC)"
	$(NPM) run typeorm migration:run
	@echo "$(GREEN)✅ Migrations exécutées!$(NC)"

## db-seed: Remplir avec données de test
db-seed: init-db
	@echo "$(GREEN)✅ Données de test insérées!$(NC)"

## db-reset: Réinitialiser la base de données
db-reset:
	@echo "$(RED)⚠️  Réinitialisation de la base de données...$(NC)"
	@. ./.env && mysql -h$$DB_HOST -u$$DB_USER -p$$DB_PASSWORD -e "DROP DATABASE IF EXISTS $$DB_NAME; CREATE DATABASE $$DB_NAME;"
	@. ./.env && mysql -h$$DB_HOST -u$$DB_USER -p$$DB_PASSWORD $$DB_NAME < ../ghs.sql
	@echo "$(GREEN)✅ Base de données réinitialisée!$(NC)"
	@make db-seed

## clean: Nettoyer les fichiers générés
clean:
	@echo "$(GREEN)🧹 Nettoyage des fichiers générés...$(NC)"
	rm -rf dist
	rm -rf coverage
	rm -rf .nyc_output
	@echo "$(GREEN)✅ Nettoyage terminé!$(NC)"

## clean-all: Nettoyage complet
clean-all: clean
	@echo "$(RED)🧹 Nettoyage complet...$(NC)"
	rm -rf node_modules
	rm -rf package-lock.json
	@echo "$(GREEN)✅ Nettoyage complet terminé!$(NC)"

## logs: Voir les logs de l'application
logs:
	@echo "$(GREEN)📋 Logs de l'application...$(NC)"
	tail -f logs/*.log

## health: Vérifier l'état de l'API
health:
	@echo "$(GREEN)❤️  Vérification de l'état de l'API...$(NC)"
	@curl -s http://localhost:8000/health | jq '.' || echo "$(RED)❌ API non disponible$(NC)"

## prod-build: Compiler pour la production
prod-build:
	@echo "$(GREEN)🚀 Compilation pour la production...$(NC)"
	NODE_ENV=production $(NPM) run build
	@echo "$(GREEN)✅ Build de production terminé!$(NC)"

## prod-start: Démarrer en production
prod-start:
	@echo "$(GREEN)🚀 Démarrage en mode production...$(NC)"
	NODE_ENV=production $(NPM) run start:prod

## status: Afficher l'état des services
status:
	@echo "$(GREEN)📊 État des services:$(NC)"
	@echo ""
	@echo "$(YELLOW)Docker Compose:$(NC)"
	@$(DOCKER_COMPOSE) ps || echo "$(RED)Docker Compose non actif$(NC)"
	@echo ""
	@echo "$(YELLOW)API Health:$(NC)"
	@make health

## update: Mettre à jour les dépendances
update:
	@echo "$(GREEN)🔄 Mise à jour des dépendances...$(NC)"
	$(NPM) update
	@echo "$(GREEN)✅ Dépendances mises à jour!$(NC)"

## generate: Générer un module (usage: make generate MODULE=nom)
generate:
	@if [ -z "$(MODULE)" ]; then \
		echo "$(RED)❌ Erreur: MODULE non spécifié$(NC)"; \
		echo "$(YELLOW)Usage: make generate MODULE=nom$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)🏗️  Génération du module $(MODULE)...$(NC)"
	nest generate module $(MODULE)
	nest generate controller $(MODULE)
	nest generate service $(MODULE)
	@echo "$(GREEN)✅ Module $(MODULE) généré!$(NC)"

## docs: Ouvrir la documentation
docs:
	@echo "$(GREEN)📚 Ouverture de la documentation...$(NC)"
	@open http://localhost:8000/docs || xdg-open http://localhost:8000/docs || start http://localhost:8000/docs

## shell: Ouvrir un shell dans le container
shell:
	@echo "$(GREEN)🐚 Ouverture d'un shell...$(NC)"
	$(DOCKER_COMPOSE) exec backend sh

## db-shell: Ouvrir un shell MySQL
db-shell:
	@echo "$(GREEN)🗄️  Ouverture d'un shell MySQL...$(NC)"
	$(DOCKER_COMPOSE) exec mysql mysql -uroot -p$$DB_PASSWORD $$DB_NAME