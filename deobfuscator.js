/**
 * Désobfuscateur JavaScript
 * Créé par: Hi Sy Slot
 * 
 * Ce module contient les fonctions principales pour désobfusquer du code JavaScript.
 */

class Deobfuscator {
    constructor() {
        this.originalCode = '';
        this.deobfuscatedCode = '';
        this.detectedObfuscationTypes = [];
    }

    /**
     * Charge le code à désobfusquer
     * @param {string} code - Code JavaScript obfusqué
     */
    loadCode(code) {
        this.originalCode = code;
        this.deobfuscatedCode = '';
        this.detectedObfuscationTypes = [];
        this.detectObfuscationTypes();
        return this;
    }

    /**
     * Détecte les types d'obfuscation présents dans le code
     */
    detectObfuscationTypes() {
        const code = this.originalCode;
        
        // Détection d'encodage hexadécimal
        if (/\\x[0-9a-f]{2}/i.test(code)) {
            this.detectedObfuscationTypes.push('hexadecimal');
        }
        
        // Détection d'encodage Unicode
        if (/\\u[0-9a-f]{4}/i.test(code)) {
            this.detectedObfuscationTypes.push('unicode');
        }
        
        // Détection de eval ou Function
        if (/eval\s*\(|new\s+Function\s*\(/i.test(code)) {
            this.detectedObfuscationTypes.push('eval');
        }
        
        // Détection de variables obfusquées (noms courts et répétitifs)
        if (/var\s+[a-z_$]{1,2}\s*=|let\s+[a-z_$]{1,2}\s*=|const\s+[a-z_$]{1,2}\s*=/i.test(code)) {
            this.detectedObfuscationTypes.push('variable_renaming');
        }
        
        // Détection de chaînes de caractères encodées en base64
        const base64Regex = /['"][A-Za-z0-9+/=]{24,}['"]/;
        if (base64Regex.test(code)) {
            this.detectedObfuscationTypes.push('base64');
        }
        
        // Détection de code compressé
        if (/function\(\w+,\w+,\w+\){/.test(code) && code.includes('return')) {
            this.detectedObfuscationTypes.push('compression');
        }
        
        return this.detectedObfuscationTypes;
    }

    /**
     * Désobfusque le code chargé
     * @returns {string} Code désobfusqué
     */
    deobfuscate() {
        let result = this.originalCode;
        
        // Appliquer les méthodes de désobfuscation dans un ordre spécifique
        if (this.detectedObfuscationTypes.includes('hexadecimal')) {
            result = this.decodeHexadecimal(result);
        }
        
        if (this.detectedObfuscationTypes.includes('unicode')) {
            result = this.decodeUnicode(result);
        }
        
        if (this.detectedObfuscationTypes.includes('base64')) {
            result = this.decodeBase64Strings(result);
        }
        
        if (this.detectedObfuscationTypes.includes('eval')) {
            result = this.unwrapEval(result);
        }
        
        // Beautifier le code final
        result = this.beautifyCode(result);
        
        this.deobfuscatedCode = result;
        return result;
    }

    /**
     * Décode les séquences hexadécimales
     * @param {string} code - Code à traiter
     * @returns {string} Code avec séquences hexadécimales décodées
     */
    decodeHexadecimal(code) {
        return code.replace(/\\x([0-9a-f]{2})/gi, (match, hex) => {
            return String.fromCharCode(parseInt(hex, 16));
        });
    }

    /**
     * Décode les séquences Unicode
     * @param {string} code - Code à traiter
     * @returns {string} Code avec séquences Unicode décodées
     */
    decodeUnicode(code) {
        return code.replace(/\\u([0-9a-f]{4})/gi, (match, hex) => {
            return String.fromCharCode(parseInt(hex, 16));
        });
    }

    /**
     * Décode les chaînes en base64
     * @param {string} code - Code à traiter
     * @returns {string} Code avec chaînes base64 décodées
     */
    decodeBase64Strings(code) {
        // Recherche des chaînes qui semblent être en base64
        const base64Regex = /(['"])[A-Za-z0-9+/=]{24,}\1/g;
        
        return code.replace(base64Regex, (match) => {
            // Enlever les guillemets
            const base64Str = match.substring(1, match.length - 1);
            
            try {
                // Tenter de décoder en base64
                const decoded = atob(base64Str);
                
                // Vérifier si le résultat est du texte lisible
                if (/^[\x20-\x7E]+$/.test(decoded)) {
                    return `"${decoded}"`;
                }
            } catch (e) {
                // Si le décodage échoue, retourner la chaîne originale
            }
            
            return match;
        });
    }

    /**
     * Déroule les appels à eval
     * @param {string} code - Code à traiter
     * @returns {string} Code avec eval déroulé
     */
    unwrapEval(code) {
        // Cette fonction est simplifiée car l'exécution réelle d'eval pourrait être dangereuse
        // Dans une implémentation réelle, il faudrait analyser statiquement le contenu de l'eval
        
        // Recherche des motifs eval("...") ou new Function("...")
        const evalRegex = /eval\s*\(\s*(['"])(.*?)\1\s*\)/g;
        const functionRegex = /new\s+Function\s*\(\s*(['"])(.*?)\1\s*\)/g;
        
        let result = code;
        
        // Remplacer eval("...") par le contenu
        result = result.replace(evalRegex, (match, quote, content) => {
            // Essayer de décoder le contenu si nécessaire
            let decodedContent = content;
            try {
                decodedContent = this.decodeHexadecimal(content);
                decodedContent = this.decodeUnicode(decodedContent);
            } catch (e) {
                // En cas d'erreur, utiliser le contenu original
            }
            
            return `/* EVAL DÉSOBFUSQUÉ: */ ${decodedContent}`;
        });
        
        // Remplacer new Function("...") par le contenu
        result = result.replace(functionRegex, (match, quote, content) => {
            // Essayer de décoder le contenu si nécessaire
            let decodedContent = content;
            try {
                decodedContent = this.decodeHexadecimal(content);
                decodedContent = this.decodeUnicode(decodedContent);
            } catch (e) {
                // En cas d'erreur, utiliser le contenu original
            }
            
            return `/* FUNCTION DÉSOBFUSQUÉE: */ function() { ${decodedContent} }`;
        });
        
        return result;
    }

    /**
     * Beautifie le code JavaScript
     * @param {string} code - Code à embellir
     * @returns {string} Code embelli
     */
    beautifyCode(code) {
        // Version simplifiée d'un beautifier
        // Dans une implémentation réelle, on utiliserait une bibliothèque comme js-beautify
        
        // Ajouter des sauts de ligne après les accolades et points-virgules
        let result = code.replace(/[{};]/g, match => match + '\n');
        
        // Indenter le code
        let indentLevel = 0;
        const lines = result.split('\n');
        result = lines.map(line => {
            // Réduire l'indentation pour les lignes fermantes
            if (line.includes('}')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            
            const indentedLine = ' '.repeat(indentLevel * 2) + line;
            
            // Augmenter l'indentation pour les lignes ouvrantes
            if (line.includes('{')) {
                indentLevel++;
            }
            
            return indentedLine;
        }).join('\n');
        
        return result;
    }

    /**
     * Renomme les variables obfusquées pour améliorer la lisibilité
     * @param {string} code - Code à traiter
     * @returns {string} Code avec variables renommées
     */
    renameVariables(code) {
        // Cette fonction est une version simplifiée
        // Une implémentation complète nécessiterait une analyse AST
        
        // Identifier les variables obfusquées (noms courts)
        const varRegex = /\b(var|let|const)\s+([a-z_$]{1,2})\s*=/g;
        let varCounter = 0;
        const varMap = {};
        
        let result = code.replace(varRegex, (match, keyword, varName) => {
            if (!varMap[varName]) {
                varMap[varName] = `descriptiveVar${varCounter++}`;
            }
            return `${keyword} ${varMap[varName]} =`;
        });
        
        // Remplacer toutes les occurrences des variables
        Object.keys(varMap).forEach(varName => {
            const regex = new RegExp(`\\b${varName}\\b`, 'g');
            result = result.replace(regex, varMap[varName]);
        });
        
        return result;
    }

    /**
     * Obtient les types d'obfuscation détectés
     * @returns {Array} Liste des types d'obfuscation
     */
    getDetectedObfuscationTypes() {
        return this.detectedObfuscationTypes;
    }

    /**
     * Obtient le code original
     * @returns {string} Code original
     */
    getOriginalCode() {
        return this.originalCode;
    }

    /**
     * Obtient le code désobfusqué
     * @returns {string} Code désobfusqué
     */
    getDeobfuscatedCode() {
        return this.deobfuscatedCode;
    }
}

// Exporter la classe pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Deobfuscator };
} else {
    // Pour utilisation dans le navigateur
    window.Deobfuscator = Deobfuscator;
}
