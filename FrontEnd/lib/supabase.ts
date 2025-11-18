// Importation des variables d'environnement contenant l'URL et la clé anonyme de Supabase.
// Ces variables sont définies dans le fichier de configuration du projet Expo (.env).
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from '@/config';

// Importer la fonction createClient depuis le SDK ( Software Development Kit ) Supabase pour initialiser le client Supabase.
// Ce client permet d'interagir avec la base de données, l'authentification et les fonctionnalités temps réel de Supabase.
import { createClient } from '@supabase/supabase-js';

// Importation de SecureStore, une bibliothèque Expo qui permet de stocker des données sensibles (comme des tokens) de façon sécurisée sur mobile.
// Sur le web, on utilisera localStorage à la place.
import * as SecureStore from 'expo-secure-store';

// Importer Platform depuis react-native pour détecter sur quelle plateforme (web, iOS, Android) l'application s'exécute.
import { Platform } from 'react-native';

// Définition d'un adaptateur de stockage qui permet de stocker et récupérer les tokens d'authentification
// de façon sécurisée selon la plateforme (web ou mobile).
// Sur mobile, utilisation SecureStore (stockage sécurisé natif).
// Sur web, utilisation localStorage (stockage local du navigateur, moins sécurisé mais standard).
const ExpoSecureStoreAdapter = {
  // Récupérer un item (par exemple, ici, un token) depuis le stockage sécurisé ou localStorage.
  getItem: async (key: string) => {
    // Si la plateforme est web, utiliser localStorage.
    if (Platform.OS === "web") {
      // Retourner la valeur stockée dans localStorage pour la clé donnée.
      return localStorage.getItem(key);
    }
    // Sinon, utiliser SecureStore (stockage sécurisé natif sur mobile).
    return await SecureStore.getItemAsync(key);
  },
  // Enregistrer un item dans le stockage sécurisé ou localStorage.
  setItem: async (key: string, value: string) => {
    // Si la plateforme est web, enregistrer dans localStorage.
    if(Platform.OS === "web") {
      // Stocker la valeur dans localStorage pour la clé donnée.
      localStorage.setItem(key, value);
      return;
    }
    // Sinon, enregistrer dans SecureStore (stockage sécurisé natif sur mobile).
    await SecureStore.setItemAsync(key, value);
  },
  // Supprimer un item du stockage sécurisé ou localStorage.
  removeItem: async (key: string) => {
    // Si la plateforme est web, supprimer de localStorage.
    if (Platform.OS === "web") {
      // Supprimer la clé du localStorage.
      localStorage.removeItem(key);
      return;
    }
    // Sinon, supprimer de SecureStore (stockage sécurisé natif sur mobile).
    await SecureStore.deleteItemAsync(key);
  },
}

// Récupération de l'URL et la clé anonyme de Supabase depuis la configuration d'environnement.
// Si les variables ne sont pas définies, utilisation d'une chaîne vide par défaut qui provoquera une erreur explicite.
const supabaseUrl = EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// Création et configuration du client Supabase pour l'application.
// Ce client sera utilisé pour toutes les requêtes vers Supabase (auth, base de données, etc).
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Définir l'adaptateur de stockage pour la session utilisateur (sécurisé selon la plateforme).
    // Définition Ligne 20
    storage: ExpoSecureStoreAdapter,
    // Activer le rafraîchissement automatique du token d'authentification.
    // Cela permet à l'utilisateur de rester connecté sans avoir à se reconnecter manuellement.
    autoRefreshToken: true,
    // Activer la persistance de la session utilisateur entre les redémarrages de l'application.
    // Cela permet de restaurer automatiquement la session à l'ouverture de l'application.
    persistSession: true,
    // Désactiver la détection de session dans l'URL (inutile sur mobile, utile sur web pour l'auth via liens magiques).
    detectSessionInUrl: false,
  },
  // Désactiver le transport realtime.
  // Le "transport" désigne le protocole utilisé pour la communication en temps réel (par exemple WebSocket, SSE, etc).
  // Ici, en mettant "transport: undefined", on désactive les fonctionnalités temps réel de Supabase (écoute d'événements, synchronisation live, etc).
  // Pourquoi désactiver ? Si l'application n'utilise pas les fonctionnalités temps réel de Supabase, cela peut éviter des connexions réseau inutiles.
  // Si on veut utiliser les fonctionnalités temps réel (par exemple, recevoir des notifications instantanées de changements dans la base),
  // il faut laisser la configuration par défaut ou spécifier un transport supporté.
  // Bonnes pratiques : pour une meilleure évolutivité, il est conseillé de ne pas désactiver le transport realtime
  // sauf si on est certain de ne jamais utiliser les fonctionnalités temps réel de Supabase.
  // On peut aussi rendre cette option configurable via une variable d'environnement.
  realtime: { transport: undefined },
});

// Exporter le client Supabase pour l'utiliser dans toute l'application.
// Cela permet d'avoir une seule instance partagée et configurée correctement.
export default supabase