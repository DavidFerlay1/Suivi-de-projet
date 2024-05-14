# Suivi-de-projet

Techs: **React, Symfony, Nginx, Docker, mailcatcher**

Outil de suivi de projet vaste (potentiellement un futur ERP). **Sécurité** et **Clean Code**
L'application suit un **modèle SaaS** dans lequel **chaque client dispose de sa propre base de données**
Un module RH permet également de **créer et gérer du personnel**, des comptes et implémente une **gestion des roles dynamiques**

Les fonctionnalités sont séparées en **modules** qui recquièrent des autorisations

# Lancer le projet

- Il vous faudra docker installé sur votre machine.
**docker compose up** à la racine du projet
**https://localhost** (Le nom de domaine doit être localhost et pas 127.0.0.1) Nginx écoute directement le port 80 donc inutile de le préciser dans l'url

Installation des dépendances php:
- **docker exec -it php /bin/bash**
- **composer install**

Installation des dépendances node:
- **docker exec -it node sh**
- **npm i**

## Comptes utilisables

- Super administrateur: super@gmail.com azerty1234
- Compte RH: personal@gmail.com azerty1234
- Compte chef de projet: project@gmail.com azerty1234


**NB: Si vous utilisez une fonctionnalité qui nécessite de recevoir un email, vous pouvez accéder au mailcatcher via localhost:1080**
