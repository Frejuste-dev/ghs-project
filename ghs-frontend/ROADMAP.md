# 🗺️ ROADMAP - Frontend GHS (Gestion des Heures Supplémentaires)

## 📋 Analyse du Système

### Vue d'ensemble
Application web de gestion des heures supplémentaires avec :
- **4 profils utilisateurs** : Validator, Supervisor, Administrator, Coordinator
- **Workflow de validation** à plusieurs niveaux (N1, N2)
- **Système de délégations** de pouvoir temporaire
- **Gestion complète** des employés, services et comptes

### Modules Backend Disponibles
- ✅ Auth - Authentification JWT
- ✅ Employees - Gestion des employés
- ✅ Services - Gestion des services
- ✅ Accounts - Gestion des comptes utilisateurs
- ✅ Requests - Demandes d'heures supplémentaires
- ✅ Delegations - Gestion des délégations
- ✅ Workflows - Gestion des workflows de validation

---

## 🏗️ Architecture Technique Recommandée

### Stack Frontend
- **Framework** : React 19 avec TypeScript ou Next.js 14+
- **UI Library** : Tailwind CSS/Vite + shadcn/ui (ou Material-UI)
- **State Management** : Redux Toolkit ou Zustand + React Query
- **Routing** : React Router v6 (ou Next.js App Router)
- **Forms** : React Hook Form + Zod validation
- **HTTP Client** : Axios avec intercepteurs JWT
- **Charts** : Recharts ou Chart.js
- **Date/Time** : date-fns ou Day.js
- **Icons** : Lucide React ou Heroicons
- **Notifications** : React Hot Toast ou Sonner

### Structure de Projet
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/              # Composants UI de base
│   │   ├── layout/          # Header, Sidebar, Footer
│   │   ├── forms/           # Composants formulaires
│   │   └── shared/          # Composants métier partagés
│   ├── pages/               # Pages/Routes
│   ├── features/            # Modules métier
│   │   ├── auth/
│   │   ├── employees/
│   │   ├── services/
│   │   ├── requests/
│   │   ├── delegations/
│   │   └── workflows/
│   ├── hooks/               # Custom hooks
│   ├── services/            # API services
│   ├── store/               # State management
│   ├── utils/               # Utilitaires
│   ├── types/               # TypeScript types
│   ├── constants/           # Constantes
│   └── App.tsx
├── .env
└── package.json
```

---

## 🎨 Design System

### Couleurs Principales
```
Primary: #3B82F6 (Bleu) - Actions principales
Secondary: #6B7280 (Gris) - Actions secondaires
Success: #10B981 (Vert) - Validations
Warning: #F59E0B (Orange) - Alertes
Danger: #EF4444 (Rouge) - Rejets
Info: #06B6D4 (Cyan) - Informations
```

### Status Colors
```
pending: gris           # Brouillon
submitted: bleu         # Soumise
firstLevelApproved: indigo  # Validée N1
inProgress: jaune       # En cours
secondLevelApproved: violet # Validée N2
accepted: vert          # Acceptée
rejected: rouge         # Rejetée
```

---

## 📱 Pages et Écrans par Module

## 1. 🔐 MODULE AUTHENTIFICATION

### 1.1 Page Connexion (`/login`)
**Éléments :**
- Logo + Titre application
- Formulaire :
  - Input username (icône user)
  - Input password (icône lock, toggle visibility)
  - Checkbox "Se souvenir de moi"
  - Bouton "Se connecter"
- Lien "Mot de passe oublié ?"
- Messages d'erreur

**Fonctionnalités :**
- Validation frontend des champs requis
- Appel API `POST /api/v1/auth/login`
- Stockage token JWT
- Redirection selon profil utilisateur
- Gestion erreurs (401, 403, 500)

**Design :**
- Split screen : Illustration (40%) / Formulaire (60%)
- Responsive mobile : Formulaire plein écran

---

### 1.2 Page Mot de Passe Oublié (`/forgot-password`)
**Éléments :**
- Input email/username
- Bouton "Envoyer le lien"
- Message de confirmation

**Fonctionnalités :**
- Génération resetToken
- Envoi email avec lien
- Message de succès

---

### 1.3 Page Réinitialisation (`/reset-password/:token`)
**Éléments :**
- Input nouveau mot de passe
- Input confirmation mot de passe
- Indicateur force du mot de passe
- Bouton "Réinitialiser"

**Validations :**
- Min 8 caractères
- 1 majuscule, 1 minuscule, 1 chiffre
- Mots de passe identiques
- Token valide et non expiré

---

## 2. 🏠 LAYOUT PRINCIPAL (Authentifié)

### 2.1 Sidebar
**Navigation adaptée au profil :**
- 🏠 Tableau de bord (tous)
- 📋 Mes Demandes (tous)
- ➕ Créer une demande (tous)
- ✅ Validations N1 (Supervisor, Administrator)
- ✅ Validations N2 (Coordinator, Administrator)
- 👥 Employés (Administrator)
- 🏢 Services (Administrator)
- 🔐 Comptes (Administrator)
- 🔄 Délégations (Supervisor+)
- 📊 Rapports (tous)
- 🔔 Notifications (tous)
- ⚙️ Paramètres (tous)

**États :**
- Collapsed/Expanded (toggle)
- Active item highlight
- Responsive (drawer mobile)

---

### 2.2 Header
**Éléments :**
- Logo/Titre (si sidebar collapsed)
- Breadcrumb
- Search bar (recherche globale)
- Notifications bell (badge count)
- User dropdown :
  - Avatar + Nom
  - Mon profil
  - Paramètres
  - Déconnexion

---

### 2.3 NotificationBell
**Fonctionnalités :**
- Badge avec nombre non lues
- Dropdown liste (5 dernières)
- Click → redirection page concernée
- Bouton "Voir toutes"
- Marquer comme lue
- WebSocket pour temps réel (optionnel)

---

## 3. 📊 DASHBOARDS PAR PROFIL

### 3.1 Dashboard VALIDATOR (`/dashboard`)

**Section 1 : Statistiques Personnelles**
- Card "Heures ce mois" (valeur + tendance)
- Card "Demandes en attente" (nombre)
- Card "Demandes validées" (nombre)
- Card "Taux d'approbation" (pourcentage)

**Section 2 : Mes Demandes Récentes**
- Table avec colonnes :
  - Date
  - Horaires (début-fin)
  - Durée
  - Statut (badge coloré)
  - Actions (selon statut)
- Filtres : Statut, Date range
- Pagination

**Section 3 : Bouton Flottant**
- FAB "Nouvelle demande" (bottom-right)

**API Endpoints :**
```
GET /api/v1/requests?employeeID={currentUser.employeeID}
GET /api/v1/requests/stats?employeeID={currentUser.employeeID}
```

---

### 3.2 Dashboard SUPERVISOR (`/dashboard`)

**Section 1 : Vue Service**
- Card "Employés du service"
- Card "À valider (N1)" (avec alerte si > 0)
- Card "Heures totales (mois)"
- Card "Budget HS"

**Section 2 : Demandes à Valider (Prioritaire)**
- Table avec colonnes :
  - Employé (avatar + nom)
  - Date demandée
  - Horaires
  - Durée
  - Soumise il y a (avec badge urgent si > 24h)
  - Actions (Valider/Rejeter)
- Filtres : Employé, Date range

**Section 3 : Employés du Service**
- Vue grille ou liste
- Chaque carte :
  - Avatar
  - Nom complet
  - Matricule
  - Heures du mois
  - Badge statut contrat
- Click → Détails employé

**Section 4 : Actions Rapides**
- Bouton "Ajouter un employé"
- Bouton "Créer une délégation"
- Bouton "Exporter rapport"

**API Endpoints :**
```
GET /api/v1/requests?serviceID={userService}&status=submitted
GET /api/v1/employees?serviceID={userService}
GET /api/v1/services/{serviceID}/stats
```

---

### 3.3 Dashboard ADMINISTRATOR (`/dashboard`)

**Section 1 : Vue Globale**
- Card "Total employés" (+ évolution)
- Card "Services"
- Card "Demandes actives"
- Card "Alertes système"

**Section 2 : Onglets de Gestion**
- Onglet "Services" → Gestion services
- Onglet "Employés" → Gestion employés
- Onglet "Comptes" → Gestion comptes
- Onglet "Toutes les demandes" → Vue globale

**Section 3 : Graphiques Analytics**
- Chart "Heures par service" (bar)
- Chart "Évolution mensuelle" (line)
- Chart "Types de contrat" (pie)

**API Endpoints :**
```
GET /api/v1/services
GET /api/v1/employees
GET /api/v1/accounts
GET /api/v1/requests
GET /api/v1/stats/global
```

---

### 3.4 Dashboard COORDINATOR (`/dashboard`)

**Section 1 : Validation N2**
- Table demandes en attente validation N2
- Colonnes :
  - Employé
  - Service
  - Date demandée
  - Horaires
  - Validée N1 le (date)
  - Validée N1 par (nom)
  - Actions (Valider N2/Rejeter)
- Filtres : Service, Date range

**Section 2 : Vue Multi-Services**
- Sélecteur de services (multi-select)
- Graphiques comparatifs :
  - Heures par service
  - Taux de validation
  - Tendances

**Section 3 : Timeline Workflows**
- Liste workflows actifs
- Actions : Réassigner, Voir détails
- Historique des validations

**API Endpoints :**
```
GET /api/v1/requests?status=firstLevelApproved
GET /api/v1/workflows?status=active
GET /api/v1/stats/multi-service
```

---

## 4. 📝 MODULE DEMANDES (REQUESTS)

### 4.1 Liste Mes Demandes (`/my-requests`)

**Éléments :**
- Header avec titre et bouton "Nouvelle demande"
- Barre de filtres :
  - Select "Statut"
  - DateRangePicker "Période"
  - Input "Rechercher"
- Table avec pagination
- EmptyState si aucune demande

**API Endpoint :**
```
GET /api/v1/requests?employeeID={currentUser.employeeID}
  &status={filter.status}
  &startDate={filter.startDate}
  &endDate={filter.endDate}
```

---

### 4.2 Créer/Modifier Demande (`/requests/new` ou `/requests/:id/edit`)

**Formulaire en 4 étapes (Wizard) :**

**Step 1 : Informations**
- Sélection employé (si Supervisor+ crée pour quelqu'un)
- Date de la demande (date picker)
- Service (auto-rempli)

**Step 2 : Horaires**
- Card "Horaire habituel (optionnel)" :
  - TimeRangePicker (previousStart - previousEnd)
- Card "Nouvel horaire *" :
  - TimeRangePicker (startAt - endAt)
  - Calcul automatique durée
  - Validation : max 12h

**Step 3 : Détails**
- Textarea "Commentaire / Justification" (max 500 caractères)
- FileUpload "Pièces jointes" (optionnel, PDF/DOC/IMG, max 5MB)

**Step 4 : Récapitulatif**
- Affichage de toutes les infos
- Calcul heures supplémentaires
- Alert info sur le workflow

**Actions Footer :**
- Bouton "Annuler"
- Bouton "Enregistrer comme brouillon" (status: pending)
- Bouton "Soumettre" (status: submitted)

**Validations Frontend :**
- Tous les champs obligatoires remplis
- Date dans le futur ou aujourd'hui
- endAt > startAt
- Durée ≤ 12h

**API Endpoints :**
```
POST /api/v1/requests
PATCH /api/v1/requests/:id
```

---

### 4.3 Détails Demande (`/requests/:id`)

**Layout :**

**En-tête :**
- Titre "Demande #ID"
- Status Banner (badge coloré)
- Actions selon contexte (Modifier, Supprimer, Valider/Rejeter)

**Card "Employé Concerné" :**
- Avatar
- Nom complet
- Matricule
- Service (badge)
- Type contrat (badge)

**Card "Détails de la Demande" :**
- Date demandée
- Horaire habituel (si renseigné)
- Nouvel horaire (highlight)
- Durée totale (badge grande taille)
- Heures supplémentaires (si applicable)
- Commentaire
- Créée par
- Date de création

**Card "Processus de Validation" :**
- Timeline verticale (stepper) :
  1. Création (date, user)
  2. Soumission (date)
  3. Validation N1 (date, validateur, commentaire)
  4. Validation N2 (date, validateur, commentaire)
  5. Statut final (Acceptée/Rejetée)

**Card "Workflows Associés" :**
- Table validateurs assignés
- Statut de chaque étape
- Délégations actives

**Modal de Validation** (si user a les droits) :
- Bouton "Approuver"
- Bouton "Rejeter"
- Textarea commentaire (obligatoire si rejet)
- Confirmation

**API Endpoint :**
```
GET /api/v1/requests/:id
```

---

### 4.4 Validation N1 (`/validations/n1`)
**Accès :** Supervisor, Administrator

**Éléments :**
- Header "Demandes à Valider - Niveau 1"
- Filtres : Service, Employé, Date
- Table demandes status=submitted
- Badge urgent si > 24h sans action
- Actions : Valider, Rejeter, Voir détails

**API Endpoint :**
```
GET /api/v1/requests?status=submitted&serviceID={userService}
```

---

### 4.5 Validation N2 (`/validations/n2`)
**Accès :** Coordinator, Administrator

**Éléments :**
- Header "Demandes à Valider - Niveau 2"
- Filtres : Service, Date
- Table demandes status=firstLevelApproved
- Affichage info validation N1 (date, validateur)
- Actions : Valider, Rejeter, Demander complément

**API Endpoint :**
```
GET /api/v1/requests?status=firstLevelApproved
```

---

## 5. 👥 MODULE EMPLOYÉS

### 5.1 Liste des Employés (`/employees`)
**Accès :** Administrator (CRUD), Supervisor (lecture service)

**Éléments :**
- Header avec bouton "Ajouter un employé"
- Filtres sidebar/topbar :
  - Recherche globale (nom, matricule)
  - Service (multi-select)
  - Type de contrat (checkboxes)
  - Statut (actif/inactif)
- Table responsive avec colonnes :
  - Avatar
  - Matricule
  - Nom Prénom
  - Service
  - Contrat
  - Contact
  - Actions
- Pagination (20 items/page)
- Tri par colonnes
- Actions globales :
  - Export Excel/CSV
  - Import en masse

**Actions par ligne :**
- Voir profil (eye icon)
- Modifier (edit icon)
- Désactiver/Activer (toggle)
- Supprimer (trash icon + confirmation)

**API Endpoint :**
```
GET /api/v1/employees?serviceID={filter}&contractType={filter}
```

---

### 5.2 Profil Employé (`/employees/:id`)

**En-tête Profil :**
- Photo/Avatar grande taille
- Nom complet
- Matricule
- Badge statut (Actif/Inactif)
- Bouton "Modifier"

**Card "Informations Personnelles" :**
- Date de naissance
- Contact
- Email

**Card "Informations Professionnelles" :**
- Service (lien vers service)
- Type de contrat
- Date d'embauche
- Manager direct

**Card "Compte Utilisateur" :**
- Username
- Profil (rôle)
- Dernière connexion
- Statut compte
- Bouton "Réinitialiser mot de passe"

**Cards "Statistiques Heures Sup" :**
- Total heures ce mois
- Total heures cette année
- Moyenne mensuelle
- Graphique évolution 6 derniers mois

**Table "Historique des Demandes" :**
- Liste demandes avec filtres
- Statut, date, heures, actions

**Onglets Supplémentaires :**
- Délégations (reçues/données)
- Documents (contrat, etc.)

**API Endpoint :**
```
GET /api/v1/employees/:id
```

---

### 5.3 Formulaire Employé (`/employees/new` ou `/employees/:id/edit`)

**Formulaire en 4 étapes (Stepper) :**

**Step 1 : Informations de Base**
- Input Matricule * (format: EMP0001, validation regex)
- Input Nom *
- Input Prénom *
- DatePicker Date de naissance
- Input Contact

**Step 2 : Affectation**
- Select Service * (dropdown avec recherche)
- Select Type de contrat *
- DatePicker Date d'embauche

**Step 3 : Photo**
- Upload avatar (optionnel)
- Crop/resize

**Step 4 : Création Compte (optionnel)**
- Checkbox "Créer un compte utilisateur"
- Si coché :
  - Input Username * (auto-généré, éditable)
  - Select Profil *
  - Input Mot de passe temporaire (auto-généré)
  - Checkbox "Envoyer par email"

**Validations :**
- Matricule unique, format correct
- Nom/Prénom obligatoires
- Service existe
- Si compte : username unique

**Actions :**
- Bouton "Précédent/Suivant"
- Bouton "Annuler"
- Bouton "Enregistrer"

**API Endpoints :**
```
POST /api/v1/employees
PATCH /api/v1/employees/:id
```

---

## 6. 🏢 MODULE SERVICES

### 6.1 Liste des Services (`/services`)
**Accès :** Administrator (CRUD), autres (lecture)

**Affichage :**
- Toggle entre 2 vues :
  - **Vue Arborescence** (par défaut)
    - Structure hiérarchique expandable
    - Indentation visuelle
    - Icônes folder/subfolder
    - Actions par nœud
  - **Vue Table** (alternative)
    - Colonnes : Code, Nom, Parent, Manager, Nb Employés, Actions

**Fonctionnalités :**
- Recherche dans l'arborescence
- Drag & drop pour réorganiser (optionnel)
- Bouton "Ajouter un service"
- Export structure organisationnelle

**Actions par service :**
- Voir détails
- Modifier
- Ajouter sous-service
- Supprimer (si pas d'employés)

**API Endpoint :**
```
GET /api/v1/services
```

---

### 6.2 Détails Service (`/services/:id`)

**En-tête :**
- Code service
- Nom service
- Badge hiérarchie (ex: "Service de niveau 2")
- Bouton "Modifier"

**Card "Informations" :**
- Description
- Manager
- Service parent (lien)
- Sous-services (liste avec liens)
- Dates création/modification

**Card "Employés du Service" :**
- Table complète
- Statistiques : Total, par type contrat
- Filtres intégrés

**Card "Statistiques Heures Sup" :**
- Charts :
  - Total heures ce mois
  - Évolution 6 mois
  - Comparaison avec autres services

**Card "Organigramme" :**
- Arbre visuel du service avec manager et employés

**API Endpoint :**
```
GET /api/v1/services/:id
```

---

### 6.3 Formulaire Service (`/services/new` ou `/services/:id/edit`)

**Champs :**
- Input Code service * (format: SVC-XXX, validation unique)
- Input Nom service *
- Select Service parent (dropdown arborescence, optionnel)
- Autocomplete Manager (employés)
- Textarea Description

**Validations :**
- Code unique
- Pas de référence circulaire (un service ne peut pas être son propre parent)

**API Endpoints :**
```
POST /api/v1/services
PATCH /api/v1/services/:id
```

---

## 7. 🔐 MODULE COMPTES

### 7.1 Liste des Comptes (`/accounts`)
**Accès :** Administrator uniquement

**Éléments :**
- Header avec bouton "Créer un compte"
- Filtres :
  - Profil (Validator, Supervisor, Administrator, Coordinator)
  - Statut (Actif/Inactif)
  - Recherche (username, employé)
- Table avec colonnes :
  - Username
  - Employé (nom + matricule)
  - Profil (badge coloré)
  - Dernière connexion
  - Statut (toggle actif/inactif)
  - Actions

**Actions par ligne :**
- Modifier profil
- Réinitialiser mot de passe
- Activer/Désactiver
- Supprimer

**API Endpoint :**
```
GET /api/v1/accounts?profile={filter}&isActive={filter}
```

---

### 7.2 Formulaire Compte (`/accounts/new` ou `/accounts/:id/edit`)

**Champs :**
- Autocomplete Employé * (sans compte existant)
- Input Username * (validation unique)
- Input Mot de passe * (si création)
- Select Profil *
- Toggle "Compte actif"

**Validations :**
- Username unique
- Employé n'a pas déjà un compte
- Mot de passe sécurisé

**API Endpoints :**
```
POST /api/v1/accounts
PATCH /api/v1/accounts/:id
```

---

## 8. 🔄 MODULE DÉLÉGATIONS

### 8.1 Liste des Délégations (`/delegations`)
**Accès :** Supervisor, Administrator, Coordinator

**Onglets :**

**1. Délégations Actives** (par défaut)
- Table avec colonnes :
  - Délégant (nom + profil)
  - Délégué (nom + profil)
  - Date début
  - Date fin
  - Statut (badge "En cours" si actif)
  - Actions
- Badge "En cours" si aujourd'hui entre startAt et endAt

**2. Délégations à Venir**
- Même structure, filtrées par date future

**3. Historique**
- Délégations terminées

**Filtres :**
- Par délégant
- Par délégué
- Par période

**API Endpoint :**
```
GET /api/v1/delegations
```

---

### 8.2 Formulaire Délégation (`/delegations/new`)

**Champs :**
- Autocomplete Délégant * (employés avec profil Supervisor+)
- Autocomplete Délégué * (employés, exclude le délégant)
- DatePicker Date début *
- DatePicker Date fin *
- Textarea Raison (optionnel)

**Validations :**
- Date fin > date début
- Pas de chevauchement pour le même délégant
- Délégué doit avoir un compte actif
- Vérification des permissions

**Prévisualisation :**
- Affichage des demandes qui seront affectées
- Workflows impactés

**API Endpoint :**
```
POST /api/v1/delegations
```

---

## 9. 🔔 MODULE NOTIFICATIONS

### 9.1 Page Notifications (`/notifications`)

**Section 1 : Notifications Non Lues**
- Card par notification :
  - Icône selon type
  - Titre
  - Message court
  - Date/heure
  - Bouton action (selon contexte)
  - Bouton "Marquer comme lu"

**Section 2 : Toutes les Notifications**
- Liste scrollable infinie
- Filtres : Type, Date, Lue/Non lue

**Types de notifications :**
- 📝 Nouvelle demande à valider
- ✅ Demande validée
- ❌ Demande rejetée
- 🔄 Délégation reçue
- ⏰ Rappel demande en attente
- 🔧 Système (maintenance)

---

## 10. ⚙️ MODULE PARAMÈTRES

### 10.1 Page Paramètres (`/settings`)

**Onglets :**

**A. Mon Profil**
- Modifier informations personnelles
- Changer mot de passe
- Upload photo de profil
- Préférences de notification :
  - Email
  - In-app
  - Push (si PWA)

**B. Paramètres Système** (Admin uniquement)
- Règles métier :
  - Nombre max d'heures par demande (default: 12)
  - Délai de soumission (en jours)
  - Niveaux de validation par profil
- Configuration email (SMTP)
- Sauvegardes automatiques

**C. Apparence**
- Toggle Thème (clair/sombre)
- Select Langue (FR/EN)
- Select Format date/heure

---

## 11. 📊 MODULE RAPPORTS

### 11.1 Page Rapports (`/reports`)

**Section 1 : Générateur de Rapports**
- Select Type de rapport :
  - Par employé
  - Par service
  - Global
- Filtres :
  - Période (date range)
  - Services (multi-select)
  - Statuts demandes
- Select Format export :
  - PDF
  - Excel
  - CSV
- Bouton "Générer"

**Section 2 : Rapports Prédéfinis (Templates)**
- Card "Rapport mensuel service"
- Card "Rapport annuel employé"
- Card "Tableau de bord RH"
- Card "Analyse budgétaire"

**Section 3 : Tableaux de Bord Interactifs**
- Graphiques dynamiques :
  - Heures par mois (line chart)
  - Heures par service (bar chart)
  - Heures par type contrat (pie chart)
  - Tendances annuelles
- Indicateurs clés (KPIs) :
  - Total heures sup mois
  - Taux de validation
  - Délai moyen de traitement
  - Budget consommé

**API Endpoint :**
```
GET /api/v1/reports?type={type}&filters={...}
```

---

## 🧩 COMPOSANTS RÉUTILISABLES À CRÉER

### Composants UI de Base
1. **DataTable** - Table avec tri, pagination, filtres
2. **StatusBadge** - Badge coloré selon statut demande
3. **ConfirmDialog** - Modal de confirmation d'action
4. **DateRangePicker** - Sélection plage de dates
5. **EmployeeAutocomplete** - Recherche employé avec avatar
6. **ServiceTreeSelect** - Sélecteur arborescence services
7. **TimeRangePicker** - Sélection heures début/fin avec validation
8. **ValidationTimeline** - Timeline visuelle workflow validation
9. **StatCard** - Card statistique avec icône, valeur, tendance
10. **NotificationBell** - Cloche avec badge et dropdown
11. **FloatingButton** - FAB pour actions principales
12. **EmptyState** - État vide avec illustration et CTA
13. **LoadingSpinner** - Indicateur de chargement
14. **ErrorBoundary** - Gestion erreurs React
15. **Breadcrumb** - Fil d'Ariane navigation

### Composants Métier
1. **RequestCard** - Card résumé demande (liste)
2. **EmployeeCard** - Card profil employé avec stats
3. **ServiceCard** - Card service avec stats et actions
4. **DelegationCard** - Card délégation active avec dates
5. **ValidationActions** - Boutons Valider/Rejeter avec modal
6. **WorkflowStepper** - Stepper état validation (création → acceptation)
7. **HoursCalculator** - Calcul automatique durée et heures sup
8. **RequestFilters** - Filtres réutilisables pour listes demandes
9. **EmployeeProfile** - Composant profil compact (avatar + infos)
10. **ServiceBreadcrumb** - Fil d'Ariane hiérarchie services

### Composants Layout
1. **MainLayout** - Layout principal avec sidebar + header
2. **AuthLayout** - Layout pages authentification
3. **PageHeader** - En-tête page avec titre, breadcrumb, actions
4. **Sidebar** - Navigation latérale avec menu adaptatif
5. **Header** - En-tête avec recherche, notifications, profil
6. **Footer** - Pied de page (optionnel)

### Composants Forms
1. **FormWizard** - Formulaire multi-étapes avec stepper
2. **FormField** - Wrapper champ avec label, error, helper
3. **Select** - Select amélioré avec recherche
4. **MultiSelect** - Select multiple avec chips
5. **FileUpload** - Upload fichiers avec preview et validation
6. **RichTextEditor** - Éditeur texte riche (optionnel)

---

## 🔐 GESTION DES PERMISSIONS PAR PAGE

| Page/Action | Validator | Supervisor | Administrator | Coordinator |
|-------------|-----------|------------|---------------|-------------|
| **Dashboard** | ✅ Personnel | ✅ Service | ✅ Global | ✅ Multi-services |
| **Mes Demandes** | ✅ | ✅ | ✅ | ✅ |
| **Créer Demande** | ✅ Pour soi | ✅ Pour équipe | ✅ Pour tous | ✅ Pour tous |
| **Modifier Demande** | ✅ Si pending + proprio | ✅ Si pending + service | ✅ Toutes | ✅ Toutes |
| **Supprimer Demande** | ✅ Si pending + proprio | ✅ Si pending + service | ✅ Toutes | ❌ |
| **Valider N1** | ❌ | ✅ | ✅ | ❌ |
| **Valider N2** | ❌ | ❌ | ✅ | ✅ |
| **Employés - Liste** | 👁️ Lecture | 👁️ Service | ✅ CRUD | 👁️ Lecture |
| **Employés - Créer** | ❌ | ❌ | ✅ | ❌ |
| **Employés - Modifier** | ❌ | 👁️ Service | ✅ | ❌ |
| **Employés - Supprimer** | ❌ | ❌ | ✅ | ❌ |
| **Services - Liste** | 👁️ Lecture | 👁️ Lecture | ✅ CRUD | 👁️ Lecture |
| **Services - Créer/Modifier** | ❌ | ❌ | ✅ | ❌ |
| **Comptes - Liste** | ❌ | ❌ | ✅ CRUD | ❌ |
| **Délégations - Liste** | 👁️ Les siennes | ✅ Créer | ✅ Toutes | ✅ Créer |
| **Délégations - Créer** | ❌ | ✅ | ✅ | ✅ |
| **Rapports - Personnel** | ✅ | ✅ | ✅ | ✅ |
| **Rapports - Service** | ❌ | ✅ | ✅ | ✅ |
| **Rapports - Global** | ❌ | ❌ | ✅ | ✅ |
| **Paramètres - Profil** | ✅ | ✅ | ✅ | ✅ |
| **Paramètres - Système** | ❌ | ❌ | ✅ | ❌ |

**Légende :**
- ✅ Accès complet
- 👁️ Lecture seule
- ❌ Pas d'accès

---

## 📱 NAVIGATION ET STRUCTURE DU MENU

### Menu Sidebar (Navigation Principale)

```
┌─────────────────────────────────┐
│ [LOGO] GHS Application          │
├─────────────────────────────────┤
│ 🏠 Tableau de Bord              │ → /dashboard
│                                 │
│ 📋 MES DEMANDES                 │
│   └─ Mes demandes               │ → /my-requests
│   └─ Créer une demande          │ → /requests/new
│   └─ Historique                 │ → /my-requests?tab=history
│                                 │
│ [Si Supervisor ou Admin]        │
│ ✅ VALIDATIONS                  │
│   └─ En attente N1              │ → /validations/n1
│                                 │
│ [Si Coordinator ou Admin]       │
│   └─ En attente N2              │ → /validations/n2
│                                 │
│ [Si Administrator]              │
│ 👥 GESTION                      │
│   └─ Employés                   │ → /employees
│   └─ Services                   │ → /services
│   └─ Comptes                    │ → /accounts
│                                 │
│ [Si Supervisor+]                │
│ 🔄 DÉLÉGATIONS                  │
│   └─ Actives                    │ → /delegations?status=active
│   └─ Créer une délégation       │ → /delegations/new
│                                 │
│ 📊 Rapports                     │ → /reports
│ 🔔 Notifications                │ → /notifications
│ ⚙️ Paramètres                   │ → /settings
│                                 │
├─────────────────────────────────┤
│ [Avatar] Nom Utilisateur ▼      │
│   └─ Mon profil                 │
│   └─ Paramètres                 │
│   └─ Déconnexion                │
└─────────────────────────────────┘
```

### Routing Structure

```typescript
const routes = [
  // Public routes
  { path: '/login', component: LoginPage, public: true },
  { path: '/forgot-password', component: ForgotPasswordPage, public: true },
  { path: '/reset-password/:token', component: ResetPasswordPage, public: true },
  
  // Protected routes
  { path: '/dashboard', component: Dashboard, roles: ['all'] },
  
  // Requests
  { path: '/my-requests', component: MyRequestsPage, roles: ['all'] },
  { path: '/requests/new', component: CreateRequestPage, roles: ['all'] },
  { path: '/requests/:id', component: RequestDetailsPage, roles: ['all'] },
  { path: '/requests/:id/edit', component: EditRequestPage, roles: ['all'] },
  
  // Validations
  { path: '/validations/n1', component: ValidationN1Page, 
    roles: ['Supervisor', 'Administrator'] },
  { path: '/validations/n2', component: ValidationN2Page, 
    roles: ['Coordinator', 'Administrator'] },
  
  // Employees
  { path: '/employees', component: EmployeesListPage, 
    roles: ['Supervisor', 'Administrator', 'Coordinator'] },
  { path: '/employees/new', component: CreateEmployeePage, 
    roles: ['Administrator'] },
  { path: '/employees/:id', component: EmployeeProfilePage, 
    roles: ['Supervisor', 'Administrator', 'Coordinator'] },
  { path: '/employees/:id/edit', component: EditEmployeePage, 
    roles: ['Administrator'] },
  
  // Services
  { path: '/services', component: ServicesListPage, roles: ['all'] },
  { path: '/services/new', component: CreateServicePage, 
    roles: ['Administrator'] },
  { path: '/services/:id', component: ServiceDetailsPage, roles: ['all'] },
  { path: '/services/:id/edit', component: EditServicePage, 
    roles: ['Administrator'] },
  
  // Accounts
  { path: '/accounts', component: AccountsListPage, 
    roles: ['Administrator'] },
  { path: '/accounts/new', component: CreateAccountPage, 
    roles: ['Administrator'] },
  { path: '/accounts/:id/edit', component: EditAccountPage, 
    roles: ['Administrator'] },
  
  // Delegations
  { path: '/delegations', component: DelegationsListPage, 
    roles: ['Supervisor', 'Administrator', 'Coordinator'] },
  { path: '/delegations/new', component: CreateDelegationPage, 
    roles: ['Supervisor', 'Administrator', 'Coordinator'] },
  
  // Reports
  { path: '/reports', component: ReportsPage, roles: ['all'] },
  
  // Notifications
  { path: '/notifications', component: NotificationsPage, roles: ['all'] },
  
  // Settings
  { path: '/settings', component: SettingsPage, roles: ['all'] },
  
  // 404
  { path: '*', component: NotFoundPage }
];
```

---

## 🔌 API SERVICES À CRÉER

### Structure des Services

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirection vers login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Services par Module

**1. AuthService** (`src/services/auth.service.ts`)
```typescript
login(username, password)
logout()
getCurrentUser()
forgotPassword(email)
resetPassword(token, newPassword)
changePassword(oldPassword, newPassword)
```

**2. RequestsService** (`src/services/requests.service.ts`)
```typescript
getAll(filters)
getById(id)
getMyRequests(employeeId)
create(data)
update(id, data)
delete(id)
submit(id)
validate(id, level, comment)
reject(id, level, comment)
getStats(employeeId)
```

**3. EmployeesService** (`src/services/employees.service.ts`)
```typescript
getAll(filters)
getById(id)
getByService(serviceId)
create(data)
update(id, data)
delete(id)
getStats(id)
getRequests(id)
```

**4. ServicesService** (`src/services/services.service.ts`)
```typescript
getAll()
getById(id)
getTree()
create(data)
update(id, data)
delete(id)
getEmployees(id)
getStats(id)
```

**5. AccountsService** (`src/services/accounts.service.ts`)
```typescript
getAll(filters)
getById(id)
create(data)
update(id, data)
delete(id)
activate(id)
deactivate(id)
resetPassword(id)
```

**6. DelegationsService** (`src/services/delegations.service.ts`)
```typescript
getAll(filters)
getById(id)
getActive()
getUpcoming()
getHistory()
create(data)
update(id, data)
delete(id)
```

**7. WorkflowsService** (`src/services/workflows.service.ts`)
```typescript
getAll(filters)
getById(id)
getByRequest(requestId)
getActive()
reassign(id, newValidator)
```

**8. ReportsService** (`src/services/reports.service.ts`)
```typescript
generate(type, filters)
exportPDF(reportId)
exportExcel(reportId)
getTemplates()
getStats(filters)
```

**9. NotificationsService** (`src/services/notifications.service.ts`)
```typescript
getAll()
getUnread()
markAsRead(id)
markAllAsRead()
getCount()
```

---

## 🗂️ TYPES TYPESCRIPT À DÉFINIR

### Types Principaux

```typescript
// src/types/user.types.ts
export enum UserProfile {
  VALIDATOR = 'Validator',
  SUPERVISOR = 'Supervisor',
  ADMINISTRATOR = 'Administrator',
  COORDINATOR = 'Coordinator',
}

export interface User {
  accountID: number;
  employeeID: number;
  username: string;
  profile: UserProfile;
  isActive: boolean;
  lastLogin?: Date;
  employee: Employee;
}

// src/types/employee.types.ts
export enum ContractType {
  CDI = 'CDI',
  CDD = 'CDD',
  INTERIM = 'Interim',
  STAGE = 'Stage',
  ALTERNANCE = 'Alternance',
  MOO = 'MOO',
}

export interface Employee {
  employeeID: number;
  employeeNumber: string;
  lastName: string;
  firstName: string;
  fullName?: string;
  serviceID: number;
  service?: Service;
  contractType: ContractType;
  contact?: string;
  birthdate?: Date;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// src/types/service.types.ts
export interface Service {
  serviceID: number;
  serviceCode: string;
  serviceName: string;
  parentServiceID?: number;
  parentService?: Service;
  description?: string;
  manager?: string;
  children?: Service[];
  employeesCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

// src/types/request.types.ts
export enum RequestStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  FIRST_LEVEL_APPROVED = 'firstLevelApproved',
  IN_PROGRESS = 'inProgress',
  SECOND_LEVEL_APPROVED = 'secondLevelApproved',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface Request {
  requestID: number;
  employeeID: number;
  employee?: Employee;
  requestDate: Date;
  previousStart?: string;
  previousEnd?: string;
  startAt: string;
  endAt: string;
  status: RequestStatus;
  comment?: string;
  createdBy?: number;
  creator?: Employee;
  validatedN1At?: Date;
  validatedN2At?: Date;
  workflows?: Workflow[];
  duration?: number;
  extraHours?: number;
  createdAt: Date;
  updatedAt: Date;
}

// src/types/delegation.types.ts
export interface Delegation {
  delegationID: number;
  delegatedBy: number;
  delegatedByEmployee?: Employee;
  delegatedTo: number;
  delegatedToEmployee?: Employee;
  startAt: Date;
  endAt: Date;
  isActive?: boolean;
}

// src/types/workflow.types.ts
export interface Workflow {
  workflowID: number;
  requestID: number;
  request?: Request;
  validator: number;
  validatorEmployee?: Employee;
  delegate?: number;
  delegateEmployee?: Employee;
  assignDate: Date;
  validationDate?: Date;
  status: number;
  comment?: string;
}

// src/types/notification.types.ts
export enum NotificationType {
  NEW_REQUEST = 'new_request',
  REQUEST_VALIDATED = 'request_validated',
  REQUEST_REJECTED = 'request_rejected',
  DELEGATION_RECEIVED = 'delegation_received',
  REMINDER = 'reminder',
  SYSTEM = 'system',
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: number;
  relatedType?: string;
  isRead: boolean;
  createdAt: Date;
}
```

---

## 🎯 PLAN DE DÉVELOPPEMENT PAR PHASES

### Phase 1 : Foundation (Semaine 1-2)
**Objectif :** Mettre en place l'infrastructure de base

**Tâches :**
- [ ] Setup projet (React/Next.js + TypeScript)
- [ ] Installer dépendances (UI lib, routing, state management)
- [ ] Créer structure de dossiers
- [ ] Configurer Tailwind CSS + thème
- [ ] Setup Axios + intercepteurs
- [ ] Créer types TypeScript de base
- [ ] Implémenter système de routing
- [ ] Créer composants UI de base :
  - [ ] Button
  - [ ] Input
  - [ ] Select
  - [ ] Card
  - [ ] Badge
  - [ ] Modal
  - [ ] Toast/Notifications

**Livrables :**
- Projet initialisé et configurationé
- Design system de base opérationnel

---

### Phase 2 : Authentification (Semaine 2-3)
**Objectif :** Système d'authentification complet

**Tâches :**
- [ ] Créer AuthService
- [ ] Implémenter AuthContext/Store
- [ ] Page de connexion
  - [ ] Formulaire avec validation
  - [ ] Gestion erreurs
  - [ ] Remember me
- [ ] Page mot de passe oublié
- [ ] Page réinitialisation
- [ ] Protected routes (HOC/Guard)
- [ ] Gestion token JWT
- [ ] Auto-logout sur expiration
- [ ] Redirection après login selon profil

**Livrables :**
- Authentification fonctionnelle
- Routes protégées

---

### Phase 3 : Layout Principal (Semaine 3-4)
**Objectif :** Interface de navigation

**Tâches :**
- [ ] Créer MainLayout
- [ ] Implémenter Sidebar
  - [ ] Menu adaptatif par profil
  - [ ] Active state
  - [ ] Collapse/Expand
  - [ ] Responsive mobile
- [ ] Implémenter Header
  - [ ] Breadcrumb
  - [ ] Search bar
  - [ ] Notifications bell
  - [ ] User dropdown
- [ ] Créer NotificationBell component
- [ ] Implémenter système de notifications
- [ ] Page Notifications

**Livrables :**
- Layout principal fonctionnel
- Navigation complète

---

### Phase 4 : Module Demandes (Semaine 4-6)
**Objectif :** Gestion des demandes d'heures sup

**Tâches :**
- [ ] Créer RequestsService
- [ ] Dashboard Validator
  - [ ] Stats cards
  - [ ] Table mes demandes
  - [ ] FAB créer demande
- [ ] Page liste mes demandes
  - [ ] DataTable avec filtres
  - [ ] Pagination
  - [ ] Actions par ligne
- [ ] Formulaire création demande
  - [ ] Wizard 4 étapes
  - [ ] Validation frontend
  - [ ] HoursCalculator component
  - [ ] TimeRangePicker component
- [ ] Page détails demande
  - [ ] Informations complètes
  - [ ] ValidationTimeline component
  - [ ] Actions selon droits
- [ ] Modal validation/rejet

**Livrables :**
- Module demandes complet pour Validator
- Formulaire création/édition

---

### Phase 5 : Validation Workflows (Semaine 6-7)
**Objectif :** Systèmes de validation N1 et N2

**Tâches :**
- [ ] Dashboard Supervisor
  - [ ] Stats service
  - [ ] Table demandes à valider N1
  - [ ] Liste employés service
- [ ] Page validations N1
  - [ ] Table avec filtres
  - [ ] Badge urgent
  - [ ] Actions validation
- [ ] Dashboard Coordinator
  - [ ] Stats multi-services
  - [ ] Table demandes à valider N2
- [ ] Page validations N2
  - [ ] Timeline validation N1
  - [ ] Actions validation N2
- [ ] ValidationActions component
- [ ] WorkflowsService

**Livrables :**
- Validation N1 et N2 fonctionnelles
- Dashboards Supervisor et Coordinator

---

### Phase 6 : Module Employés (Semaine 7-8)
**Objectif :** Gestion des employés

**Tâches :**
- [ ] Créer EmployeesService
- [ ] Page liste employés
  - [ ] DataTable avec filtres avancés
  - [ ] Export CSV/Excel
  - [ ] Actions CRUD
- [ ] Formulaire employé
  - [ ] Wizard 4 étapes
  - [ ] Upload avatar
  - [ ] Création compte optionnelle
- [ ] Page profil employé
  - [ ] Informations complètes
  - [ ] Stats heures sup
  - [ ] Historique demandes
  - [ ] Onglets délégations
- [ ] EmployeeCard component
- [ ] EmployeeAutocomplete component

**Livrables :**
- CRUD employés complet
- Profil employé détaillé

---

### Phase 7 : Module Services (Semaine 8-9)
**Objectif :** Gestion hiérarchique des services

**Tâches :**
- [ ] Créer ServicesService
- [ ] Page liste services
  - [ ] Vue arborescence
  - [ ] Vue table
  - [ ] Toggle entre vues
  - [ ] Recherche arborescence
- [ ] ServiceTreeSelect component
- [ ] Formulaire service
  - [ ] Validation pas de référence circulaire
  - [ ] Select parent service (arbre)
- [ ] Page détails service
  - [ ] Informations
  - [ ] Liste employés
  - [ ] Stats heures sup
  - [ ] Organigramme visuel

**Livrables :**
- Gestion services avec hiérarchie
- Visualisation arborescence

---

### Phase 8 : Module Comptes (Semaine 9)
**Objectif :** Gestion des comptes utilisateurs

**Tâches :**
- [ ] Créer AccountsService
- [ ] Page liste comptes
  - [ ] Table avec filtres
  - [ ] Toggle actif/inactif
  - [ ] Actions CRUD
- [ ] Formulaire compte
  - [ ] Association employé
  - [ ] Sélection profil
  - [ ] Génération mot de passe
- [ ] Action réinitialisation mot de passe
- [ ] Dashboard Administrator
  - [ ] Vue globale
  - [ ] Onglets gestion
  - [ ] Analytics

**Livrables :**
- CRUD comptes complet
- Dashboard Administrator

---

### Phase 9 : Module Délégations (Semaine 10)
**Objectif :** Système de délégations

**Tâches :**
- [ ] Créer DelegationsService
- [ ] Page liste délégations
  - [ ] Onglets : Actives, À venir, Historique
  - [ ] Filtres
  - [ ] Badge "En cours"
- [ ] Formulaire délégation
  - [ ] Validation dates
  - [ ] Validation pas de chevauchement
  - [ ] Prévisualisation impact
- [ ] DelegationCard component
- [ ] Intégration dans workflows

**Livrables :**
- Système de délégations fonctionnel
- Gestion dans workflows

---

### Phase 10 : Module Rapports (Semaine 11)
**Objectif :** Analytics et exports

**Tâches :**
- [ ] Créer ReportsService
- [ ] Page rapports
  - [ ] Générateur de rapports
  - [ ] Templates prédéfinis
  - [ ] Tableaux de bord interactifs
- [ ] Intégration Charts (Recharts)
  - [ ] Line charts
  - [ ] Bar charts
  - [ ] Pie charts
- [ ] Export PDF/Excel
- [ ] KPIs dashboard
- [ ] Comparaisons multi-services

**Livrables :**
- Module rapports complet
- Exports fonctionnels

---

### Phase 11 : Paramètres & Finalisation (Semaine 12)
**Objectif :** Paramètres et polish

**Tâches :**
- [ ] Page paramètres
  - [ ] Onglet Mon profil
  - [ ] Onglet Apparence
  - [ ] Onglet Système (Admin)
- [ ] Thème clair/sombre
- [ ] Internationalisation (i18n) optionnel
- [ ] Page 404
- [ ] EmptyStates partout
- [ ] LoadingSpinners
- [ ] ErrorBoundaries
- [ ] Toast notifications
- [ ] Responsive mobile final
- [ ] Optimisations performance
- [ ] Tests E2E critiques

**Livrables :**
- Application complète et polie
- Responsive tous devices
- Performance optimisée

---

### Phase 12 : Fonctionnalités Avancées (Semaine 13-14)
**Objectif :** Features additionnelles

**Tâches Optionnelles :**
- [ ] WebSockets pour notifications temps réel
- [ ] PWA (Progressive Web App)
- [ ] Notifications push
- [ ] Upload en masse (CSV import)
- [ ] Historique des modifications (audit log)
- [ ] Recherche globale avancée
- [ ] Favoris/Raccourcis personnalisés
- [ ] Mode hors ligne (offline)
- [ ] Drag & drop réorganisation
- [ ] Calendrier visuel demandes
- [ ] Suggestions intelligentes
- [ ] Chatbot support (optionnel)

**Livrables :**
- Features avancées selon priorités
- Expérience utilisateur enrichie

---

## ✅ CHECKLIST QUALITÉ

### Code Quality
- [ ] TypeScript strict mode
- [ ] ESLint configuré et respecté
- [ ] Prettier pour formatting
- [ ] Pas de console.log en production
- [ ] Gestion erreurs complète
- [ ] Types explicites partout
- [ ] Composants réutilisables
- [ ] Code splitting/lazy loading
- [ ] Memoization (React.memo, useMemo)

### UX/UI
- [ ] Responsive tous breakpoints
- [ ] Loading states partout
- [ ] Error states explicites
- [ ] Empty states avec CTA
- [ ] Animations fluides (transitions)
- [ ] Feedback utilisateur (toasts)
- [ ] Confirmations actions critiques
- [ ] Accessibilité (a11y) de base
- [ ] Keyboard navigation
- [ ] Focus management

### Performance
- [ ] Lazy loading routes
- [ ] Images optimisées
- [ ] Bundle size optimisé
- [ ] API caching (React Query)
- [ ] Debounce sur recherches
- [ ] Pagination grandes listes
- [ ] Virtual scrolling si nécessaire
- [ ] Lighthouse score > 90

### Sécurité
- [ ] Validation frontend + backend
- [ ] Protection XSS
- [ ] Protection CSRF
- [ ] Pas de données sensibles dans localStorage
- [ ] Token refresh automatique
- [ ] Logout auto sur inactivité
- [ ] HTTPS uniquement en prod
- [ ] Content Security Policy

### Tests
- [ ] Tests unitaires composants critiques
- [ ] Tests intégration flows principaux
- [ ] Tests E2E parcours utilisateur
- [ ] Coverage > 70%

---

## 📚 RESSOURCES ET OUTILS

### Documentation
- **React** : https://react.dev
- **TypeScript** : https://www.typescriptlang.org/docs
- **Tailwind CSS** : https://tailwindcss.com/docs
- **React Router** : https://reactrouter.com
- **React Query** : https://tanstack.com/query
- **Axios** : https://axios-http.com/docs

### UI Libraries
- **shadcn/ui** : https://ui.shadcn.com
- **Material-UI** : https://mui.com
- **Ant Design** : https://ant.design
- **Chakra UI** : https://chakra-ui.com

### Charts
- **Recharts** : https://recharts.org
- **Chart.js** : https://www.chartjs.org
- **ApexCharts** : https://apexcharts.com

### Icons
- **Lucide React** : https://lucide.dev
- **Heroicons** : https://heroicons.com
- **React Icons** : https://react-icons.github.io/react-icons

### Tools
- **Figma** : Design/prototyping
- **Postman** : Test API
- **React DevTools** : Debug
- **Redux DevTools** : State debugging

---

## 🚀 COMMANDES UTILES

### Setup Initial
```bash
# Créer le projet
npx create-react-app ghs-frontend --template typescript
# ou
npx create-next-app@latest ghs-frontend --typescript

# Installer dépendances
npm install axios react-router-dom react-hook-form zod
npm install @tanstack/react-query zustand
npm install date-fns recharts lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# shadcn/ui
npx shadcn-ui@latest init
```

### Development
```bash
npm run dev          # Démarrer dev server
npm run build        # Build production
npm run lint         # Linter
npm run format       # Formatter
npm run test         # Tests
npm run test:coverage # Coverage
```

---

## 📞 SUPPORT ET CONTRIBUTION

### Questions Fréquentes
- **Comment ajouter un nouveau profil ?**
  - Modifier enum UserProfile
  - Ajouter dans permissions matrix
  - Adapter sidebar menu
  - Créer dashboard spécifique

- **Comment ajouter une nouvelle page ?**
  - Créer composant dans /pages
  - Ajouter route dans routing config
  - Ajouter item menu si nécessaire
  - Définir permissions

- **Comment personnaliser le thème ?**
  - Modifier tailwind.config.js
  - Adapter CSS variables
  - Mettre à jour composants

### Git Workflow
```bash
# Feature branch
git checkout -b feature/nom-feature
git commit -m "feat: description"
git push origin feature/nom-feature

# Merge dans develop
git checkout develop
git merge feature/nom-feature

# Release
git checkout main
git merge develop
git tag v1.0.0
```

---

## 🎯 OBJECTIFS FINAUX

### Fonctionnels
- ✅ Authentification sécurisée multi-profils
- ✅ Gestion complète demandes heures sup
- ✅ Workflow validation à 2 niveaux
- ✅ Système de délégations temporaires
- ✅ Gestion employés et services
- ✅ Rapports et analytics
- ✅ Notifications en temps réel
- ✅ Permissions granulaires par profil

### Techniques
- ✅ Code TypeScript strict
- ✅ Architecture modulaire et scalable
- ✅ Performance optimisée
- ✅ Responsive mobile-first
- ✅ Tests coverage > 70%
- ✅ Documentation complète
- ✅ CI/CD pipeline

### Utilisateurs
- ✅ Interface intuitive et moderne
- ✅ Expérience fluide sans friction
- ✅ Feedback visuel permanent
- ✅ Accessibilité de base respectée
- ✅ Temps de chargement < 3s

---

## 📊 MÉTRIQUES DE SUCCÈS

### Performance
- **Lighthouse Score** : > 90
- **First Contentful Paint** : < 1.5s
- **Time to Interactive** : < 3s
- **Bundle Size** : < 500KB (gzipped)

### Qualité Code
- **TypeScript Coverage** : 100%
- **Test Coverage** : > 70%
- **ESLint Errors** : 0
- **Code Duplications** : < 3%

### Utilisabilité
- **Taux de conversion signup** : > 80%
- **Taux d'abandon formulaires** : < 10%
- **Temps moyen création demande** : < 2 min
- **Satisfaction utilisateurs** : > 4/5

---

## 🔄 CYCLE DE VIE DU DÉVELOPPEMENT

### 1. Planning (Avant développement)
- [ ] Définir user stories
- [ ] Créer wireframes/mockups
- [ ] Valider avec stakeholders
- [ ] Estimer charges
- [ ] Prioriser features

### 2. Développement (Phase active)
- [ ] Setup environnement
- [ ] Développement itératif par module
- [ ] Code reviews quotidiennes
- [ ] Tests unitaires en continu
- [ ] Documentation inline

### 3. Testing (Avant déploiement)
- [ ] Tests unitaires (Jest)
- [ ] Tests intégration (React Testing Library)
- [ ] Tests E2E (Cypress/Playwright)
- [ ] Tests cross-browser
- [ ] Tests accessibilité
- [ ] Tests performance

### 4. Déploiement
- [ ] Build optimisé
- [ ] Variables d'environnement configurées
- [ ] Déploiement staging
- [ ] Tests smoke sur staging
- [ ] Déploiement production
- [ ] Monitoring activé

### 5. Maintenance (Post-déploiement)
- [ ] Monitoring erreurs (Sentry)
- [ ] Analytics utilisateurs (Google Analytics)
- [ ] Collecte feedback
- [ ] Corrections bugs
- [ ] Évolutions features

---

## 🐛 GESTION DES ERREURS

### Types d'Erreurs à Gérer

**1. Erreurs Réseau**
```typescript
// Pas de connexion internet
- Message : "Pas de connexion internet. Vérifiez votre connexion."
- Action : Retry button

// Timeout
- Message : "La requête a pris trop de temps. Veuillez réessayer."
- Action : Retry button

// Erreur serveur (500)
- Message : "Une erreur s'est produite. Notre équipe a été notifiée."
- Action : Retry ou Contact support
```

**2. Erreurs Authentification**
```typescript
// Token expiré
- Action : Redirection auto vers /login
- Message : "Votre session a expiré. Veuillez vous reconnecter."

// Token invalide
- Action : Logout + redirection /login
- Message : "Session invalide. Veuillez vous reconnecter."

// Compte désactivé
- Message : "Votre compte a été désactivé. Contactez l'administrateur."
```

**3. Erreurs Validation**
```typescript
// Champ requis vide
- Affichage sous le champ : "Ce champ est obligatoire"

// Format invalide
- "Format invalide. Exemple: EMP0001"

// Valeur hors limites
- "La durée ne peut pas dépasser 12 heures"
```

**4. Erreurs Métier**
```typescript
// Demande déjà validée
- Message : "Cette demande a déjà été validée"
- Action : Retour à la liste

// Pas de permission
- Message : "Vous n'avez pas les permissions nécessaires"
- Action : Redirection dashboard

// Conflit de dates
- Message : "Une demande existe déjà pour cette date"
- Action : Afficher la demande existante
```

**5. Erreurs Système**
```typescript
// React Error Boundary
- Affichage page erreur générique
- Bouton "Recharger la page"
- Bouton "Retour à l'accueil"
- Logging automatique (Sentry)
```

### Composant ErrorBoundary
```typescript
// src/components/ErrorBoundary.tsx
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to Sentry or similar
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorPage />;
    }
    return this.props.children;
  }
}
```

---

## 🎨 ÉTATS DES COMPOSANTS

### Loading States
```typescript
// Skeleton loaders
- Table rows → Afficher skeleton rows
- Cards → Afficher skeleton cards
- Text → Afficher skeleton text lines
- Images → Afficher placeholder gris

// Spinners
- Page loading → Full page spinner centré
- Button loading → Spinner dans bouton + disabled
- Inline loading → Petit spinner inline

// Progress bars
- Upload fichiers → Barre de progression %
- Multi-step forms → Stepper avec étapes complétées
```

### Empty States
```typescript
// Aucune donnée
- Illustration/Icône
- Titre explicatif
- Description courte
- CTA (Call-to-Action) si applicable

Exemples:
- "Aucune demande" → Bouton "Créer une demande"
- "Aucun employé" → Bouton "Ajouter un employé"
- "Aucune notification" → Juste message informatif
```

### Success States
```typescript
// Action réussie
- Toast vert : "✓ Demande créée avec succès"
- Redirection automatique après 2s
- Animation checkmark

// Validation réussie
- Badge status mis à jour
- Toast : "✓ Demande validée"
- Mise à jour compteurs
```

### Error States
```typescript
// Erreur formulaire
- Champs en rouge
- Message erreur sous champ
- Scroll auto vers premier champ en erreur
- Focus sur champ en erreur

// Erreur action
- Toast rouge : "✗ Une erreur s'est produite"
- Message détaillé si disponible
- Bouton retry si applicable
```

---

## 📱 RESPONSIVE BREAKPOINTS

### Breakpoints Tailwind
```css
/* Mobile first approach */
sm: 640px   /* Small devices (landscape phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices (large desktops) */
2xl: 1536px /* 2X Extra large devices */
```

### Adaptations par Device

**Mobile (< 768px)**
```
- Sidebar → Drawer (overlay)
- Table → Cards empilées ou scroll horizontal
- Forms → 1 colonne
- Actions → FAB (Floating Action Button)
- Header → Burger menu
- Stats → 1 card par ligne
- Modal → Full screen
```

**Tablet (768px - 1024px)**
```
- Sidebar → Collapsed par défaut
- Table → Scroll horizontal si trop large
- Forms → 2 colonnes si applicable
- Stats → 2 cards par ligne
- Modal → 80% width
```

**Desktop (> 1024px)**
```
- Sidebar → Expanded
- Table → Full features
- Forms → 2-3 colonnes
- Stats → 4 cards par ligne
- Modal → Max 600px width centré
```

---

## 🔐 SÉCURITÉ FRONTEND

### Best Practices

**1. Authentification**
```typescript
- Token JWT stocké en httpOnly cookie (idéal) ou localStorage
- Refresh token pour renouvellement auto
- Logout côté serveur (invalidation token)
- Timeout session après inactivité (30 min)
- Déconnexion auto sur onglet fermé (optionnel)
```

**2. Validation Input**
```typescript
- Validation frontend ET backend (double validation)
- Sanitization des inputs (trim, escape HTML)
- Protection XSS (pas de dangerouslySetInnerHTML)
- Limites de caractères strictes
- Regex validation formats (email, phone, etc.)
```

**3. Permissions**
```typescript
- Vérification permissions côté serveur (primordial)
- Masquage UI selon permissions (amélioration UX)
- Routes protégées avec guards
- Actions sensibles avec confirmation
```

**4. Données Sensibles**
```typescript
- Jamais de mots de passe en clair
- Pas de données sensibles dans URL
- Pas de données sensibles dans localStorage (préférer sessionStorage)
- Logs sans données sensibles
```

**5. HTTPS**
```typescript
- Forcer HTTPS en production
- Cookies avec flag Secure
- CSP (Content Security Policy) headers
- CORS configuré strictement
```

---

## 🧪 STRATÉGIE DE TESTS

### Tests Unitaires (Jest + React Testing Library)
```typescript
// Composants à tester en priorité
✓ Composants UI de base (Button, Input, etc.)
✓ Forms avec validation
✓ Composants métier (RequestCard, StatusBadge, etc.)
✓ Hooks personnalisés
✓ Utilitaires (date, calculs, etc.)

// Exemple test
test('Button renders with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('Form validates required fields', async () => {
  render(<LoginForm />);
  fireEvent.click(screen.getByText('Se connecter'));
  expect(await screen.findByText('Ce champ est obligatoire')).toBeInTheDocument();
});
```

### Tests Intégration
```typescript
// Flows à tester
✓ Login → Dashboard
✓ Créer demande → Soumission → Validation
✓ Recherche employés → Voir profil
✓ Filtrer liste → Export CSV

// Exemple
test('User can create and submit a request', async () => {
  const { user } = renderWithAuth(<App />);
  
  // Navigate to create request
  await user.click(screen.getByText('Créer une demande'));
  
  // Fill form
  await user.type(screen.getByLabelText('Date'), '2025-10-20');
  await user.type(screen.getByLabelText('Heure début'), '08:00');
  await user.type(screen.getByLabelText('Heure fin'), '18:00');
  
  // Submit
  await user.click(screen.getByText('Soumettre'));
  
  // Verify success
  expect(await screen.findByText(/créée avec succès/i)).toBeInTheDocument();
});
```

### Tests E2E (Cypress ou Playwright)
```typescript
// Scénarios critiques
✓ Parcours complet création demande
✓ Workflow validation N1 → N2 → Acceptation
✓ Gestion délégations
✓ Export rapports
✓ Gestion permissions

// Exemple Cypress
describe('Request Creation Flow', () => {
  it('creates a new request successfully', () => {
    cy.login('validator', 'password123');
    cy.visit('/requests/new');
    
    cy.get('[name="requestDate"]').type('2025-10-20');
    cy.get('[name="startAt"]').type('08:00');
    cy.get('[name="endAt"]').type('18:00');
    cy.get('[name="comment"]').type('Urgent task');
    
    cy.contains('Soumettre').click();
    
    cy.contains('créée avec succès').should('be.visible');
    cy.url().should('include', '/my-requests');
  });
});
```

---

## 📦 DÉPLOIEMENT

### Environnements

**1. Development (Local)**
```bash
NODE_ENV=development
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_ENABLE_DEVTOOLS=true
```

**2. Staging**
```bash
NODE_ENV=staging
REACT_APP_API_URL=https://api-staging.ghs.com/api/v1
REACT_APP_ENABLE_DEVTOOLS=true
REACT_APP_SENTRY_DSN=xxx
```

**3. Production**
```bash
NODE_ENV=production
REACT_APP_API_URL=https://api.ghs.com/api/v1
REACT_APP_ENABLE_DEVTOOLS=false
REACT_APP_SENTRY_DSN=xxx
REACT_APP_GA_TRACKING_ID=xxx
```

### Build Production
```bash
# Build optimisé
npm run build

# Analyse bundle size
npm run analyze

# Vérifications pre-deploy
- [ ] Tests passent à 100%
- [ ] Lighthouse score > 90
- [ ] Pas de console.log
- [ ] Variables d'environnement configurées
- [ ] Build size acceptable
```

### Hébergement Recommandé

**Option 1 : Vercel** (Recommandé pour Next.js)
```bash
npm install -g vercel
vercel --prod
```

**Option 2 : Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Option 3 : AWS S3 + CloudFront**
```bash
# Build
npm run build

# Upload S3
aws s3 sync build/ s3://ghs-frontend-bucket/

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id XXX --paths "/*"
```

**Option 4 : Docker + Nginx**
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🔍 MONITORING ET ANALYTICS

### Outils de Monitoring

**1. Sentry (Error Tracking)**
```typescript
// src/index.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Usage
try {
  // Code
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

**2. Google Analytics (User Tracking)**
```typescript
// Track page views
useEffect(() => {
  ReactGA.pageview(window.location.pathname);
}, [location]);

// Track events
const handleButtonClick = () => {
  ReactGA.event({
    category: 'User',
    action: 'Created Request',
  });
};
```

**3. Performance Monitoring**
```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Métriques à Suivre

**Performance**
- Page load time
- API response time
- Bundle size
- Cache hit rate

**Utilisateurs**
- Nombre d'utilisateurs actifs
- Taux de conversion
- Taux d'abandon formulaires
- Pages les plus visitées

**Erreurs**
- Nombre d'erreurs JS
- Erreurs API par endpoint
- Taux d'échec actions critiques

**Business**
- Nombre de demandes créées
- Taux de validation
- Délai moyen de traitement
- Heures supplémentaires totales

---

## 🎓 FORMATION UTILISATEURS

### Documentation Utilisateur

**1. Guide Quick Start**
```markdown
# Guide de Démarrage Rapide

## Première Connexion
1. Accédez à https://ghs.monentreprise.com
2. Connectez-vous avec vos identifiants
3. Changez votre mot de passe

## Créer votre Première Demande
1. Cliquez sur "Créer une demande"
2. Sélectionnez la date
3. Renseignez les horaires
4. Ajoutez un commentaire
5. Cliquez sur "Soumettre"

## Suivre vos Demandes
- Accédez à "Mes demandes"
- Filtrez par statut
- Cliquez sur une demande pour voir les détails
```

**2. FAQ**
```markdown
# Questions Fréquentes

Q: Comment modifier une demande ?
R: Les demandes peuvent être modifiées uniquement si elles sont en statut "Brouillon".

Q: Combien de temps prend la validation ?
R: En moyenne 24-48h selon le workflow de votre service.

Q: Puis-je annuler une demande soumise ?
R: Non, contactez votre superviseur pour une annulation.
```

**3. Vidéos Tutoriels**
- Vidéo 1 : Première connexion (2 min)
- Vidéo 2 : Créer une demande (3 min)
- Vidéo 3 : Valider des demandes (4 min)
- Vidéo 4 : Gérer les délégations (3 min)

### Formation Administrateurs

**Module 1 : Gestion des Employés**
- Créer un employé
- Associer un compte
- Gérer les services

**Module 2 : Workflow de Validation**
- Comprendre les niveaux
- Valider/Rejeter des demandes
- Gérer les délégations

**Module 3 : Rapports et Analytics**
- Générer des rapports
- Exporter les données
- Interpréter les KPIs

---

## 🔄 ÉVOLUTIONS FUTURES

### Version 1.1 (Q1 2026)
- [ ] Notifications push (PWA)
- [ ] Mode hors ligne
- [ ] Signature électronique
- [ ] Application mobile native

### Version 1.2 (Q2 2026)
- [ ] Intégration calendrier (Outlook, Google)
- [ ] Export automatique vers paie
- [ ] Tableau de bord prédictif
- [ ] Chatbot d'assistance

### Version 2.0 (Q3 2026)
- [ ] Multi-langue complet
- [ ] Workflow personnalisable par service
- [ ] Gestion congés intégrée
- [ ] API publique pour intégrations tierces

---

## 📝 NOTES IMPORTANTES

### Conventions de Code

**Nommage**
```typescript
// Composants : PascalCase
export const UserProfile = () => { }

// Fichiers composants : PascalCase.tsx
UserProfile.tsx

// Hooks : camelCase avec prefix "use"
export const useAuth = () => { }

// Utilitaires : camelCase
export const formatDate = () => { }

// Constantes : UPPER_SNAKE_CASE
export const MAX_HOURS = 12;

// Types/Interfaces : PascalCase
export interface User { }
export type UserRole = 'admin' | 'user';
```

**Structure Fichiers**
```typescript
// Ordre dans un composant
1. Imports
2. Types/Interfaces
3. Constants
4. Component
5. Styles (si styled-components)
6. Export

// Exemple
import React, { useState } from 'react';
import { Button } from '@/components/ui';

interface Props {
  name: string;
}

const DEFAULT_VALUE = 'test';

export const MyComponent: React.FC<Props> = ({ name }) => {
  const [state, setState] = useState(DEFAULT_VALUE);
  
  return <div>{name}</div>;
};
```

**Comments**
```typescript
// Composant complexe : JSDoc
/**
 * DataTable component with sorting, filtering, and pagination
 * @param data - Array of data to display
 * @param columns - Column configuration
 * @param onRowClick - Callback when row is clicked
 */

// Logique complexe : Inline comment
// Calculate extra hours by subtracting previous hours from new hours
const extraHours = calculateDuration(startAt, endAt) - 
                   calculateDuration(previousStart, previousEnd);

// TODO/FIXME
// TODO: Add error handling
// FIXME: This breaks on mobile
```

### Git Commit Messages
```bash
# Format
<type>(<scope>): <subject>

# Types
feat: Nouvelle fonctionnalité
fix: Correction de bug
docs: Documentation
style: Formatting, missing semi colons, etc
refactor: Refactoring code
test: Ajout tests
chore: Build tasks, configs, etc

# Exemples
feat(requests): add validation workflow
fix(auth): resolve token refresh issue
docs(readme): update installation steps
refactor(components): extract common logic to hook
test(employees): add unit tests for EmployeeCard
chore(deps): upgrade react to 18.2.0
```

---

## 🎉 CONCLUSION

Ce ROADMAP constitue votre **guide complet** pour l'implémentation du frontend GHS. 

### Points Clés à Retenir

✅ **Architecture modulaire** pour faciliter la maintenance

✅ **Développement itératif** par phases pour livraisons régulières

✅ **Qualité dès le départ** : tests, types, validation

✅ **UX au centre** : feedback, loading states, erreurs claires

✅ **Performance optimisée** : lazy loading, caching, bundle size

✅ **Sécurité renforcée** : validation, permissions, HTTPS

### Prochaines Actions

1. **Choisir votre stack** (React vs Next.js, UI library)
2. **Setup projet** (Phase 1)
3. **Commencer par l'auth** (Phase 2)
4. **Itérer module par module**
5. **Tester en continu**
6. **Déployer régulièrement**

### Ressources de Support

📚 **Documentation** : Consulter ce ROADMAP régulièrement

🐛 **Issues** : Créer des issues GitHub pour bugs/features

💬 **Questions** : N'hésitez pas à demander de l'aide

🎯 **Focus** : Une phase à la fois, qualité > quantité

---

**Bon courage pour l'implémentation ! 🚀**

*Ce document est évolutif et sera mis à jour selon les besoins du projet.*