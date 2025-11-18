// Importer la fonction getDefaultConfig depuis le package expo/metro-config.
// Cette fonction permet de récupérer la configuration Metro par défaut fournie par Expo.
// Metro est l'outil (appelé "bundler") qui va analyser, transformer et servir le code JavaScript de l'application
// pour qu'il soit compris et exécuté sur un appareil mobile ou un émulateur.
const { getDefaultConfig } = require('expo/metro-config');

// Utiliser __dirname pour indiquer à getDefaultConfig le chemin du dossier courant (là où se trouve ce fichier).
// __dirname est une variable spéciale de Node.js qui contient le chemin absolu du dossier du fichier en cours d'exécution.
// Cela permet à Metro de savoir où chercher les fichiers de configuration et les dépendances du projet,
// ce qui est essentiel pour que le bundler fonctionne correctement, peu importe où le projet est installé sur l'ordinateur.

// Cette annotation TypeScript (entre /** ... */) indique que 'config' est de type MetroConfig.
// Cela n'est utile que pour l'auto-complétion et la vérification de type dans les éditeurs compatibles TypeScript.
// Cela n'a aucun impact à l'exécution, mais aide à éviter les erreurs et à mieux comprendre les propriétés disponibles.
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Il faut modifier la configuration du résolveur de modules de Metro.
// La propriété 'unstable_enablePackageExports' est une option expérimentale de Metro.
// Quand elle est à true, Metro tente de résoudre les modules en utilisant le champ "exports" du package.json des dépendances.
// Or, beaucoup de bibliothèques React Native/Expo ne supportent pas encore ce standard "exports".
// Mettre cette option à false permet d'éviter des erreurs de résolution de modules et d'assurer une meilleure compatibilité
// avec la majorité des packages utilisés dans l'écosystème React Native/Expo.
config.resolver.unstable_enablePackageExports = false;

// Exporter la configuration Metro personnalisée.
// Cela permet à Metro (et donc à Expo) d'utiliser cette configuration lors du démarrage du projet et du bundling de l'application.
// Sans cette export, Metro utiliserait uniquement sa configuration par défaut, sans tenir compte des modifications précédentes.
module.exports = config;