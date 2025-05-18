/**
 * Application principale du Désobfuscateur JavaScript
 * Créé par: Hi Sy Slot
 * 
 * Ce fichier gère l'interface utilisateur et l'interaction avec le moteur de désobfuscation.
 */

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le désobfuscateur
    const deobfuscator = new Deobfuscator();
    
    // Éléments DOM
    const inputCode = document.getElementById('inputCode');
    const outputCode = document.getElementById('outputCode');
    const deobfuscateBtn = document.getElementById('deobfuscateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const loadFileBtn = document.getElementById('loadFileBtn');
    const saveFileBtn = document.getElementById('saveFileBtn');
    const fileInput = document.getElementById('fileInput');
    const detectionList = document.getElementById('detectionList');
    const originalSize = document.getElementById('originalSize');
    const deobfuscatedSize = document.getElementById('deobfuscatedSize');
    const processingTime = document.getElementById('processingTime');
    const beautifyOption = document.getElementById('beautifyOption');
    const renameVarsOption = document.getElementById('renameVarsOption');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');
    
    // Fonction pour mettre à jour la liste des détections
    function updateDetectionList(detections) {
        detectionList.innerHTML = '';
        
        if (detections.length === 0) {
            const li = document.createElement('li');
            li.className = 'no-detection';
            li.textContent = 'Aucune obfuscation détectée';
            detectionList.appendChild(li);
            return;
        }
        
        const detectionLabels = {
            'hexadecimal': 'Encodage hexadécimal (\x41)',
            'unicode': 'Encodage Unicode (\u0041)',
            'eval': 'Utilisation d\'eval() ou new Function()',
            'variable_renaming': 'Renommage de variables',
            'base64': 'Encodage Base64',
            'compression': 'Compression de code'
        };
        
        detections.forEach(detection => {
            const li = document.createElement('li');
            li.textContent = detectionLabels[detection] || detection;
            detectionList.appendChild(li);
        });
    }
    
    // Fonction pour mettre à jour les statistiques
    function updateStats(original, deobfuscated, time) {
        originalSize.textContent = `${original} caractères`;
        deobfuscatedSize.textContent = `${deobfuscated} caractères`;
        processingTime.textContent = `${time} ms`;
    }
    
    // Fonction pour afficher une notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon;
        switch (type) {
            case 'success':
                icon = 'check-circle';
                break;
            case 'warning':
                icon = 'exclamation-triangle';
                break;
            case 'error':
                icon = 'times-circle';
                break;
            default:
                icon = 'info-circle';
        }
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Supprimer la notification après 3 secondes
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Fonction pour désobfusquer le code
    function deobfuscateCode() {
        const code = inputCode.value.trim();
        
        if (!code) {
            showNotification('Veuillez entrer du code à désobfusquer', 'warning');
            return;
        }
        
        // Afficher l'indicateur de chargement
        deobfuscateBtn.innerHTML = '<span class="loading"></span> Traitement...';
        deobfuscateBtn.disabled = true;
        
        // Utiliser setTimeout pour permettre à l'UI de se mettre à jour
        setTimeout(() => {
            try {
                const startTime = performance.now();
                
                // Charger et désobfusquer le code
                deobfuscator.loadCode(code);
                let result = deobfuscator.deobfuscate();
                
                // Appliquer les options supplémentaires
                if (renameVarsOption.checked) {
                    result = deobfuscator.renameVariables(result);
                }
                
                const endTime = performance.now();
                const timeElapsed = Math.round(endTime - startTime);
                
                // Mettre à jour l'interface
                outputCode.value = result;
                updateDetectionList(deobfuscator.getDetectedObfuscationTypes());
                updateStats(
                    code.length,
                    result.length,
                    timeElapsed
                );
                
                showNotification('Désobfuscation terminée avec succès');
            } catch (error) {
                console.error('Erreur lors de la désobfuscation:', error);
                showNotification(`Erreur: ${error.message}`, 'error');
            } finally {
                // Restaurer le bouton
                deobfuscateBtn.innerHTML = '<i class="fas fa-magic"></i> Désobfusquer';
                deobfuscateBtn.disabled = false;
            }
        }, 100);
    }
    
    // Fonction pour effacer les champs
    function clearFields() {
        inputCode.value = '';
        outputCode.value = '';
        updateDetectionList([]);
        updateStats(0, 0, 0);
    }
    
    // Fonction pour charger un fichier
    function loadFile() {
        fileInput.click();
    }
    
    // Fonction pour sauvegarder le résultat
    function saveFile() {
        const code = outputCode.value.trim();
        
        if (!code) {
            showNotification('Aucun code à sauvegarder', 'warning');
            return;
        }
        
        // Créer un blob et un lien de téléchargement
        const blob = new Blob([code], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'deobfuscated.js';
        document.body.appendChild(a);
        a.click();
        
        // Nettoyer
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
        
        showNotification('Fichier sauvegardé avec succès');
    }
    
    // Gestionnaires d'événements
    deobfuscateBtn.addEventListener('click', deobfuscateCode);
    clearBtn.addEventListener('click', clearFields);
    loadFileBtn.addEventListener('click', loadFile);
    saveFileBtn.addEventListener('click', saveFile);
    
    // Gérer le chargement de fichier
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            inputCode.value = e.target.result;
            showNotification(`Fichier "${file.name}" chargé avec succès`);
        };
        reader.onerror = () => {
            showNotification('Erreur lors de la lecture du fichier', 'error');
        };
        reader.readAsText(file);
    });
    
    // Gérer le modal
    document.querySelector('.logo').addEventListener('click', () => {
        modal.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Raccourcis clavier
    document.addEventListener('keydown', (event) => {
        // Ctrl+Enter pour désobfusquer
        if (event.ctrlKey && event.key === 'Enter') {
            deobfuscateCode();
        }
        
        // Échap pour fermer le modal
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
    
    // Initialiser l'interface
    updateDetectionList([]);
    updateStats(0, 0, 0);
    
    // Afficher un message de bienvenue
    showNotification('Bienvenue dans le Désobfuscateur JavaScript');
});
