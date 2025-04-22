# JustInTime

JustInTime est une application de gestion de projets personnels développée avec Bun (backend) et React (frontend), entièrement en TypeScript et stylisée avec Tailwind CSS.  
Elle permet d'ajouter, consulter, modifier et supprimer des projets via une interface utilisateur simple et réactive.

---

## Fonctionnalités

- Ajout de projets (nom, description, statut)
- Affichage de la liste des projets
- Changement du statut d’un projet (`todo`, `in_progress`, `done`)
- Suppression d’un projet
- Interface responsive avec Tailwind CSS
- Données stockées localement dans un fichier JSON (`projects.json`)

---

## Stack technique

- Bun (serveur web + routage API)
- TypeScript
- React (frontend SPA)
- Tailwind CSS
- Stockage local JSON

---

## Installation

1. Cloner le dépôt :

```bash
git clone https://github.com/ton-utilisateur/just-in-time.git
cd just-in-time
```

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

This project was created using `bun init` in bun v1.2.10. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
