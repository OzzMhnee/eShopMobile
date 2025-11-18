import { Alert, Platform, TouchableOpacity, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
// Importer React et useEffect pour gérer le cycle de vie du composant
import React, { useEffect, useMemo, useState } from 'react';
// Importer le store d'authentification pour accéder à l'utilisateur, à la session et aux méthodes de connexion/déconnexion
import { useAuthStore } from '@/store/authStore';
// Importer le hook de navigation Expo Router pour changer de page de façon sécurisée
import { useRouter } from 'expo-router';
// Importer le composant Wrapper pour appliquer un style et une structure cohérente à la page
import Wrapper from '@/components/Wrapper';
// Importer le composant Button pour afficher des boutons stylés et accessibles
import Button from '@/components/Button';
// Importer les icônes utilisées dans le menu et le profil
import { Feather, FontAwesome5, Foundation, MaterialIcons } from '@expo/vector-icons';
// Importer Toast pour afficher des notifications temporaires à l'utilisateur
import Toast from 'react-native-toast-message';
// Importer la palette de couleurs de l'application pour garantir la cohérence visuelle
import { AppColors } from '@/constants/theme';
// Importer ErrorBoundary pour capturer les erreurs inattendues dans le composant (à créer ou utiliser une lib comme react-error-boundary)
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Définir le composant principal de la page profil utilisateur
const ProfileScreen = () => {

  // Récupérer l'utilisateur, les méthodes d'authentification et l'état de chargement depuis le store
  const { user, logout, checkSession, isLoading } = useAuthStore();
  // Initialiser le routeur pour naviguer entre les pages de l'application
  const router = useRouter();

  // Gérer l'affichage d'une erreur globale (pour ErrorBoundary)
  const [globalError, setGlobalError] = useState<Error | null>(null);

  // Gérer l'expiration de session côté client (timer, refresh automatique)
  // Amélioration : rendre la durée configurable et éviter de recréer le timer si l'utilisateur ne change pas
  useEffect(() => {
    let timer: number | undefined;
    if (user) {
      // Utilisation de la variable d'environnement pour la durée de session (en ms)
      // SESSION_TIMEOUT_MS doit être définie dans le fichier .env à la racine du projet
      // Exemple : SESSION_TIMEOUT_MS=3600000
      const SESSION_TIMEOUT = Number(process.env.SESSION_TIMEOUT_MS) || 60 * 60 * 1000; // 1h en ms par défaut
      timer = setTimeout(() => {
        logout();
        Toast.show({
          type: 'info',
          text1: 'Session expirée',
          text2: 'Veuillez vous reconnecter.',
        });
      }, SESSION_TIMEOUT) as unknown as number;
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [user, logout]);

  // Vérifier la session utilisateur à chaque fois que le composant est monté ou que l'utilisateur change
  // Cela permet de maximiser la sécurité en s'assurant que l'utilisateur est bien authentifié
  // Optimisation de la vérification de session pour ne la faire qu'au montage du composant,
  // et éviter de la relancer à chaque changement de user (ce qui peut créer une boucle infinie).
  useEffect(() => {
    if (!user) { 
      checkSession(); 
    }
    // Le commentaire au dessous désactive l’avertissement ESLint sur la ligne suivante concernant les dépendances du hook React.
    // mis pour éviter que ESLint signale le fait que tu devrais avoir [user] :
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gestion de rôles/permissions (à adapter selon backend)
  // On suppose que le user a un champ "role" (admin, user, etc.)
  const userRole = user?.role || 'user';

  // Définition les éléments du menu utilisateur (panier, commandes, paiement, adresse, paramètres)
  // Chaque item contient un identifiant, une icône, un titre et une action à exécuter lors du clic
  // Utiliser useMemo pour éviter de recréer le tableau menuItems à chaque rendu,
  // ce qui améliore les performances si le composant est re-rendu souvent.
  const menuItems = useMemo(() => [
    { 
      id: 'cart',
      icon: (<Foundation name='shopping-cart' size={20} color={AppColors.primary[500]}/>),
      title: 'Mon panier',
      onPress: () => { router.push('/(tabs)/cart'); },
      roles: ['user', 'admin'],
    },
    {
      id: 'orders',
      icon: (<FontAwesome5 name='box-open' size={16} color={AppColors.primary[500]}/>),
      title: 'Mes commandes',      
      onPress: () => { router.push('./orders'); },
      roles: ['user', 'admin'],
    },
    {
      id: 'payment',
      icon: (<Foundation name='credit-card' size={20} color={AppColors.primary[500]} />),
      title: 'Mes paiements',
      onPress: () => { router.push('./payment'); },
      roles: ['user'],
    },
    {
      id: 'address',
      icon: (<Foundation name='home' size={20} color={AppColors.primary[500]} />),
      title: 'Adresse de livraison',
      onPress: () => { router.push('./deliveryAddress') },
      roles: ['user'],
    },
    {
      id: 'settings',
      icon: (<Foundation name='home' size={20} color={AppColors.primary[500]} />),
      title: 'Paramètres',
      onPress: () => { router.push('./settings'); },
      roles: ['user', 'admin'],
    },
    
    {
      id: 'admin',
      icon: (<MaterialIcons name='admin-panel-settings' size={20} color={AppColors.primary[500]} />),
      title: 'Admin Panel',
      onPress: () => { router.push(  './admin' ); },
      roles: ['admin'],
    },
  ], [router]);

  // Composant optimisé pour chaque item du menu (évite les rerenders inutiles)
  // Composant optimisé pour chaque item du menu (évite les rerenders inutiles)
  interface MenuItemProps {
    item: {
      id: string;
      icon: React.ReactNode;
      title: string;
      onPress: () => void;
    };
  }

  const MenuItem: React.FC<MenuItemProps> = React.memo(({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={item.onPress}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        {item.icon}
        <Text style={styles.menuItemTitle}>{item.title}</Text>
      </View>
      <MaterialIcons
        name="chevron-right"
        size={24}
        color={AppColors.gray[400]}
      />
    </TouchableOpacity>
  ));

    MenuItem.displayName = "MenuItem";
    
  // Définir la fonction de déconnexion sécurisée de l'utilisateur
  // Afficher une boîte de dialogue pour confirmer la déconnexion
  // Si l'utilisateur confirme, appeler la méthode logout du store et afficher une notification
  // En cas d'erreur, afficher une alerte et loguer l'erreur pour analyse
  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion', 
      'Êtes-vous certain de vouloir vous déconnecter ?', 
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        { 
          text: 'Déconnexion',
          onPress: async () => {
            try {
              // Déconnecter l'utilisateur via le store
              await logout();
              // Afficher une notification de succès
              Toast.show({
                type: 'success',
                text1: 'Déconnexion réussie',
                text2: 'Vous avez été déconnecté',
                visibilityTime: 2000,
              });
            } catch (error) {
              setGlobalError(error as Error);
              // Loguer l'erreur pour analyse et afficher une alerte à l'utilisateur
              console.log('Profil: Erreur durant la déconnexion', error);
              Alert.alert('Erreur de déconnexion', 'Une erreur est survenue');
            }
          },
        },
      ]
    );
  };

  // Afficher un loader global si isLoading est vrai
  if (isLoading) {
    return (
      <Wrapper>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={AppColors.primary[500]} />
          <Text style={{ marginTop: 16 }}>Chargement...</Text>
        </View>
      </Wrapper>
    );
  }

  // Gérer les erreurs globales via ErrorBoundary ou affichage custom
  if (globalError) {
    return (
      <Wrapper>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: AppColors.error, fontSize: 18, marginBottom: 16 }}>
            Une erreur est survenue : {globalError.message}
          </Text>
          <Button title="Réessayer" onPress={() => { setGlobalError(null); checkSession(); }} />
        </View>
      </Wrapper>
    );
  }

  // Afficher le contenu de la page profil
  // Utiliser le composant Wrapper pour garantir la cohérence visuelle et la sécurité des marges
  return (
    <ErrorBoundary>
      <Wrapper>
        {/* Si l'utilisateur est connecté, afficher le profil et le menu */}
        {user ? (
          <View>
            {/* Afficher l'entête de la page profil */}
            <View style={styles.header}>
              <Text style={styles.title}>Mon Profil</Text>
            </View>
            {/* Afficher la carte profil avec avatar et email */}
            <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <Feather 
                  name='user'
                  size={40}
                  color={AppColors.gray[400]}
                />
              </View>
              <View style={styles.profileInfo}>
                {/* Afficher l'email de l'utilisateur connecté */}
                <Text style={styles.profileEmail}>{user?.email}</Text>
                {/* Désactiver le bouton "Modifier mon profil" si l'utilisateur n'est pas authentifié */}
                <TouchableOpacity
                  onPress={() => router.push('./profile/edit')}
                  disabled={!user}
                  accessibilityRole="button"
                  accessibilityLabel="Modifier mon profil"
                  activeOpacity={0.7}
                >
                  <Text style={styles.editProfileText}>Modifier mon profil</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Afficher le menu des options utilisateur */}
            <View style={styles.menuContainer}>
              {/* Utilisation React.memo ou un composant MenuItem séparé pour éviter les rerenders inutiles */}
              {menuItems
                .filter(item => item.roles.includes(userRole))
                .map((item) => (
                  <MenuItem key={item.id} item={item} />
                )
              )}
            </View>
            {/* Afficher le bouton de déconnexion sécurisé */}
            <View style={styles.logoutContainer}>
              <Button 
                title="Déconnexion"
                onPress={handleLogout}
                variant='outline'
                fullWidth
                style={styles.logoutButton}
                textStyle={styles.logoutButtonText}
                disabled={isLoading}
                accessibilityLabel="Se déconnecter"
                accessibilityRole="button"
              />
            </View>
          </View>
        ) : (
          // Si l'utilisateur n'est pas connecté, afficher un message d'accueil et les boutons de connexion/inscription
          <View style={styles.container}>
            <Text style={styles.title}>Bienvenue !</Text>
            <Text style={styles.message}>
              Veuillez vous connecter ou vous inscrire pour accéder à votre profil
            </Text>
            <View style={styles.buttonContainer}>
              {/* Bouton pour accéder à la page de connexion */}
              <Button 
                title="Connexion" 
                fullWidth 
                style={styles.loginButton}
                textStyle={styles.buttonText}
                onPress={() => router.push("./login")}
                accessibilityLabel="Se connecter"
                accessibilityRole="button"
              />
              {/* Bouton pour accéder à la page d'inscription */}
              <Button 
                title="Inscription" 
                fullWidth 
                variant='outline'
                style={styles.signupButton}
                textStyle={styles.signupButtonText}
                onPress={() => router.push("./signup")}
                accessibilityLabel="S'inscrire"
                accessibilityRole="button"
              />
            </View>
          </View>
        )}
      </Wrapper>
    </ErrorBoundary>
  );
};

// Exporter le composant ProfileScreen pour l'utiliser dans la navigation de l'application
export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingBottom: 16,
    backgroundColor: AppColors.background.primary,
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: AppColors.text.primary,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: "center",
    // backgroundColor: AppColors.background.primary,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppColors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileEmail: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.text.primary,
  },
  editProfileText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.primary[500],
  },
  menuContainer: {
    marginTop: 16,
    backgroundColor: AppColors.background.primary,
    borderRadius: 8,
    paddingVertical: 8,
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: AppColors.text.primary,
    marginLeft: 12,
  },
  logoutContainer: {
    marginTop: 24,
    //paddingHorizontal: 16
  },
  logoutButton: {
    backgroundColor: "transparent",
    borderColor: AppColors.error,
  },
  logoutButtonText: {
    color: AppColors.error,
  },
  message: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: AppColors.text.secondary,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  loginButton: {
    backgroundColor: AppColors.primary[500]
  },
  buttonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.background.primary,
  },
  signupButton: {
    borderColor: AppColors.primary[500],
    backgroundColor: "transparent"
  },
  signupButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.primary[500],
  },
})