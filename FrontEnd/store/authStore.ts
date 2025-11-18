import supabase from '@/lib/supabase';
import { create } from 'zustand';

// Définir le type User pour représenter un utilisateur authentifié
export interface User {
  id : string; 
  email : string;
  role?: string;
}

// Définir l'interface du store d'authentification Zustand
interface AuthState {
  user: User | null; // Contient l'utilisateur connecté ou null si déconnecté
  isLoading: boolean; // Indique si une opération d'authentification est en cours
  error: string | null; // Contient le message d'erreur éventuel

  // Déclare la méthode pour inscrire un nouvel utilisateur
  signup: ( email : string, password : string ) => Promise<void>;
  // Déclare la méthode pour connecter un utilisateur existant
  login: ( email : string, password : string ) => Promise<void>;
  // Déclare la méthode pour déconnecter l'utilisateur
  logout: ( ) => Promise<void>;
  // Déclare la méthode pour vérifier la session utilisateur actuelle
  checkSession : ( ) => Promise<void>;
}

// Crée le store Zustand pour gérer l'état d'authentification
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null, 

  // Connecter un utilisateur avec email et mot de passe
  login: async ( email : string, password : string ) => {
    try {
      // Indique que l'opération est en cours et réinitialise l'erreur
      set ({ isLoading: true, error : null });
      // Tente de se connecter via Supabase
      const { data , error } = await supabase.auth.signInWithPassword({
        email, password,
      });
      // Si une erreur survient, la propager pour la gérer dans le catch
      if (error) throw error;

      // Si la connexion réussit, mettre à jour l'utilisateur dans le store
      if (data && data.user) {
        set ({
          user: {
            id: data.user.id,
            email: data.user.email || '',
          },
          isLoading: false,
        });
      }
    } catch (error: any) {
      // En cas d'erreur, stocker le message d'erreur et arrêter le chargement
      set({ error: error.message, isLoading: false});
    }
  },

  // Inscrire un nouvel utilisateur avec email et mot de passe
  signup: async ( email: string, password: string ) => {
    try {
      // Indique que l'opération est en cours et réinitialise l'erreur
      set({ isLoading : true, error : null});
      // Tente de s'inscrire via Supabase
      const { data, error } = await supabase.auth.signUp({ email, password });
      // Si une erreur survient, la propager pour la gérer dans le catch
      if ( error ) throw error;
      // Si l'inscription réussit, mettre à jour l'utilisateur dans le store
      if ( data && data.user ) {
        set({
          user: { id : data.user.id, email : data.user.email || ''},
          isLoading: false,
        });
      }
    } catch ( error : any ) {
      // En cas d'erreur, stocker le message d'erreur et arrêter le chargement
      set ({ error : error.message, isLoading : false });
    }
  },

  // Déconnecter l'utilisateur
  logout : async () => {
    try {
      // Indique que l'opération est en cours et réinitialise l'erreur
      set({ isLoading : true, error : null });
      // Tente de se déconnecter via Supabase
      const { error } = await supabase.auth.signOut();
      // Si une erreur survient, la propager pour la gérer dans le catch
      if ( error ) throw error;
      // Réinitialise l'utilisateur dans le store
      set({ user : null, isLoading : false });
    } catch ( error: any ) {
      // En cas d'erreur, stocker le message d'erreur et arrêter le chargement
      set ({ error : error.message, isLoading : false });
    }
  },

  // Vérifier la session utilisateur actuelle (exécuté au démarrage de l'app)
  checkSession : async () => {
    try {
      // Indique que l'opération est en cours et réinitialise l'erreur
      set({ isLoading : true, error : null });
      // Récupère la session courante via Supabase
      const { data , error } = await supabase.auth.getSession();
      // Si une erreur survient, la propager pour la gérer dans le catch
      if ( error ) throw error;
      // Si une session existe, met à jour l'utilisateur dans le store
      if ( data && data.session ) {
        const { user } = data.session;
        set({
          user : { id: user.id, email: user.email ||'' },
          isLoading : false,
        });
      } else {
        // Si aucune session, réinitialise l'utilisateur
        set({ user : null , isLoading : false });
      }
    } catch ( error : any ) {
      // En cas d'erreur, réinitialise l'utilisateur et stocke le message d'erreur
      set({ user : null , isLoading : false, error : error.message });
    }
  },
}));