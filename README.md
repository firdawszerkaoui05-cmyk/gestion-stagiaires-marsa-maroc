# Plateforme Intelligente de Gestion des Stagiaires

## Description

Ce projet consiste en la conception et le développement d’une plateforme intelligente permettant d’automatiser la gestion des candidatures de stage au sein de Marsa Maroc.

La solution facilite le dépôt des candidatures, le traitement des dossiers, l’extraction automatique des informations via OCR, la génération de fiches administratives ainsi que l’envoi de notifications SMS.

## Fonctionnalités principales

- Dépôt en ligne des candidatures de stage
- Gestion des candidatures par le responsable RH
- Validation ou refus des candidatures
- Extraction automatique des données des CV (OCR)
- Génération automatique des fiches administratives
- Affectation des stagiaires aux divisions
- Notifications SMS automatiques via Twilio
- Tableau de bord de suivi

## Technologies utilisées

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript

### Backend
- Flask
- Python

### Base de données
- SQLite

### Services externes
- OCR (Reconnaissance optique de caractères)
- Twilio SMS

  Architecture de la solution

## La plateforme repose sur une architecture client-serveur :

- Frontend React.js : interface utilisateur destinée aux candidats et au responsable RH.
- Backend Flask : gestion des traitements métiers et des API REST.
- Base de données SQLite : stockage des candidatures et informations des stagiaires.
- OCR Pytesseract : extraction automatique des données des documents.
- Twilio SMS : envoi automatique des notifications aux candidats.

## Structure du projet

```text
stage-app/
│
├── frontend/
├── backend/
├── tests/
└── documentation/
```

## Prérequis

- Python 3.x
- Node.js
- npm
- SQLite

## Variables d'environnement

Le fichier `.env` doit contenir les paramètres nécessaires à l'envoi des notifications SMS via Twilio :

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

## Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Principales routes API

GET /stagiaires
Récupération des candidatures.

POST /stagiaires
Soumission d'une candidature.

PUT /stagiaires/<id>/decision
Validation ou refus d'une candidature.

POST /valider-stage/<id>
Validation finale avec génération automatique de la fiche et envoi SMS.

POST /api/affectation/generer
Génération automatique d'une affectation.

POST /api/documents/fiche-officielle
Génération de la fiche officielle du stagiaire.

## Résultats obtenus

La plateforme permet :

- La digitalisation du processus de candidature.
- La réduction des erreurs administratives.
- L'amélioration du suivi des dossiers.
- L'automatisation des tâches répétitives.
- L'accélération du traitement des candidatures.

## Auteur

**Firdaws Zerkaoui**

Projet de Fin d'Études (PFE)

## Dépôt GitHub

https://github.com/firdawszerkaoui05-cmyk/gestion-stagiaires-marsa-maroc
