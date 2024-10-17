# 🌦️ INSTANT WEATHER

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) 
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

## 🌍 DESCRIPTION DU PROJET

**INSTANT WEATHER** est une application Web interactive permettant à l'utilisateur d'afficher les informations météorologiques de la commune de son choix en saisissant un code postal. Le projet se décline en deux versions :
1. **Version de base** : affiche les informations météorologiques essentielles (températures, probabilité de pluie, ensoleillement).
2. **Version avancée** : permet d'afficher des informations supplémentaires telles que la direction du vent, les précipitations cumulées, et plus encore.

## ⚙️ SOCLE TECHNIQUE

- **Langages** : JavaScript, HTML, CSS
- **Environnement de développement** : Visual Studio Code
- **Versionnage** : Git & GitHub

## 🚀 FONCTIONNALITÉS

### VERSION 1 (BASIQUE)
- Saisie d'un code postal via un formulaire
- Sélection de la commune
- Affichage des données météorologiques suivantes :
  - Température minimale 🌡️
  - Température maximale 🔥
  - Probabilité de pluie 🌧️
  - Nombre d'heures d'ensoleillement ☀️
- ⚠️ **Attention** : Responsive et conforme aux standards HTML/CSS (W3C) et aux normes d'accessibilité WCAG AA 2.0

### VERSION 2 (AVANCÉE)
- Sélection du nombre de jours de prévisions (1 à 7 jours)
- Options supplémentaires à afficher :
  - Latitude et longitude 📍
  - Cumul de pluie en mm 🌧️
  - Vent moyen et direction du vent 💨
- Affichage des résultats dans des cartes personnalisées (classe `WeatherCard`)

## 🌐 API UTILISÉES
- [API de découpage administratif par commune](https://geo.api.gouv.fr/decoupage-administratif/communes)
- [API Météo de MétéoConcept](https://api.meteo-concept.com/)

## 📦 INSTALLATION ET EXÉCUTION

1. Clonez le repository :
   ```bash
   git clone https://github.com/ton-repository/instant-weather.git
