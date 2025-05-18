# Guide d'utilisation - Désobfuscateur JavaScript

## Présentation
Le Désobfuscateur JavaScript est un outil conçu pour rendre lisible du code JavaScript obfusqué. Créé par **Hi Sy Slot**, cet outil permet de détecter et traiter plusieurs types d'obfuscation couramment utilisés.

## Fonctionnalités principales
- Détection automatique de différents types d'obfuscation
- Décodage des séquences hexadécimales (\x41)
- Décodage des séquences Unicode (\u0041)
- Décodage des chaînes en Base64
- Déroulement des appels à eval() et new Function()
- Renommage des variables obfusquées (optionnel)
- Embellissement du code (indentation, formatage)
- Interface graphique intuitive aux couleurs orange et noir

## Comment utiliser l'outil
1. **Charger du code obfusqué**
   - Collez directement votre code dans la zone de texte de gauche
   - Ou utilisez le bouton "Charger un fichier" pour importer un fichier .js

2. **Désobfusquer le code**
   - Cliquez sur le bouton "Désobfusquer" ou utilisez le raccourci Ctrl+Enter
   - Les types d'obfuscation détectés s'afficheront dans le panneau inférieur
   - Le code désobfusqué apparaîtra dans la zone de texte de droite

3. **Options disponibles**
   - "Embellir le code" : Améliore la lisibilité avec une indentation appropriée
   - "Renommer les variables" : Remplace les noms de variables courts et cryptiques par des noms plus descriptifs

4. **Sauvegarder le résultat**
   - Utilisez le bouton "Sauvegarder" pour télécharger le code désobfusqué au format .js

## Types d'obfuscation pris en charge
- **Encodage hexadécimal** : Transforme les caractères en notation \x41
- **Encodage Unicode** : Transforme les caractères en notation \u0041
- **Chaînes encodées en Base64** : Encode le texte en Base64
- **Utilisation d'eval()** : Exécute du code dynamiquement
- **Renommage de variables** : Utilise des noms courts et peu descriptifs
- **Compression de code** : Réduit la taille du code en supprimant espaces et sauts de ligne

## Remarques importantes
- L'outil fonctionne entièrement côté client, aucune donnée n'est envoyée à un serveur
- Pour les codes très complexes ou utilisant plusieurs couches d'obfuscation, plusieurs passes peuvent être nécessaires
- Certains types d'obfuscation avancés peuvent nécessiter une intervention manuelle

## Crédits
Conçu et développé par **Hi Sy Slot**
