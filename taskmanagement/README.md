 ```
# Task Management

Application web de gestion de taches realisee dans le cadre du TP collaboratif.

## Objectif

Le but du projet etait de mettre en pratique :

- Git et GitHub en travail d'equipe
- un workflow avec branches et merges
- une application web front/back
- des tests automatises
- une pipeline CI/CD

## Fonctionnalites realisees

- inscription et connexion utilisateur
- protection des routes cote frontend
- recuperation de la liste des taches
- creation, modification et suppression de taches
- gestion du statut et de la priorite
- attribution d'une tache a un utilisateur
- interface web simple et fonctionnelle
- API REST pour l'authentification, les taches et les utilisateurs

## Stack technique

- Frontend : React + Vite + Axios + React Router
- Backend : Node.js + Express
- Tests : Jest + Selenium WebDriver
- CI/CD : GitHub Actions

## Structure du projet

```text
taskmanagement/
├── backend/
├── frontend/
├── tests/
└── README.md
```

## Repartition du travail

- Backend : routes API, authentification, CRUD des taches, route utilisateurs
- Frontend : interface React, pages login/register, dashboard, formulaire de taches
- Tests / DevOps / Documentation : organisation Git, tests, workflow GitHub Actions, README

## Workflow Git

Branches utilisees :

- `main` : version stable du projet
- `dev` : branche d'integration
- `feature/backend` : developpement backend
- `feature/frontend` : developpement frontend
- `tests` : tests, documentation et CI/CD

Organisation retenue :

- chaque membre travaille sur sa branche
- les modifications sont poussees puis relues
- les branches de travail sont mergees dans `dev`
- la version finale est fusionnee dans `main`

## Commandes Git utilisees

```bash
git clone https://github.com/vinshd7/TP_git_IABD.git

git init
git remote add origin git@github.com:vinshd7/TP_git_IABD.git
git branch -M main

git add .
git commit -m "ajt du code source"
git push -u origin main

git checkout -b dev
git push -u origin dev

git checkout -b feature/backend
git push -u origin feature/backend

git checkout -b feature/frontend
git push -u origin feature/frontend

git checkout -b tests
git push -u origin tests
```

## Installation et lancement

### Backend

```bash
cd backend
npm install
npm run dev
```

Le backend demarre sur `http://localhost:3001`.

Route de verification :

```text
GET http://localhost:3001/health
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Le frontend demarre sur `http://localhost:3000`.

### Compte de demonstration

```text
email : admin@test.com
password : password
```

## Tests

Les tests ont ete organises dans le dossier `tests/` :

- `unit/` : tests unitaires
- `integration/` : tests d'integration API
- `e2e/` : tests end-to-end Selenium

### Installation

```bash
cd tests
npm install
```

### Lancer les tests unitaires

```bash
npx jest unit/tasks.test.js --runInBand
```

Resultat constate pendant la validation :

- les tests unitaires passent

### Lancer les tests d'integration

Prerequis : backend demarre sur `http://localhost:3001`

```bash
npx jest integration/api.test.js --runInBand
```

Resultat constate pendant la validation :

- les tests d'integration sont en place
- deux assertions ont du etre alignees avec le comportement reel de l'API

### Lancer les tests E2E

Prerequis :

- backend demarre sur `http://localhost:3001`
- frontend demarre sur `http://localhost:3000`

```bash
npx jest e2e/app.test.js --runInBand --testTimeout=30000
```

Limite constatee :

- les tests Selenium sont implementes
- l'execution locale etait bloquee par une incompatibilite entre Chrome local et la version de `chromedriver`

## CI/CD

Un workflow GitHub Actions a ete ajoute dans `.github/workflows/main.yml` avec :

- lint backend
- lint frontend
- tests backend
- tests frontend
- etapes de deploiement conditionnelles

Le workflow sert de base d'automatisation pour le projet.

## Difficultes rencontrees

- synchronisation des branches entre les membres du groupe
- alignement des tests avec les codes de retour reels de l'API
- configuration des tests E2E Selenium en environnement local
- gestion du temps, ce qui nous a pousses a livrer une version simple mais fonctionnelle

## Limites actuelles

- interface volontairement tres basique
- donnees stockees en memoire cote backend
- couverture de tests encore perfectible
- deploiement non finalise en conditions reelles

## Bilan

Dans le temps imparti, nous avons livre une application simple mais fonctionnelle couvrant l'authentification, l'affichage et la gestion CRUD des taches, avec une organisation Git collaborative, une base de tests automatises et une premiere configuration CI/CD.