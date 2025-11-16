/**
 * Page d'accueil de l'application affichant les catégories et les produits vedettes.
 * Utilisation de Zustand pour la gestion d'état global des produits et catégories.
 */
import HomeHeader from '@/components/HomeHeader';
import { useProductStore } from '@/store/productStore';
import { Product } from '@/type';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import LoadingSpinner from '@/components/LoadingSpinner'
import ProductCard from '@/components/ProductCard'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/theme';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  // Hook de navigation pour changer de page
  const router = useRouter();

  // State local pour stocker les produits vedettes (meilleures ventes)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // Récupération des données et actions du store global Zustand
  const { products, categories, fetchProducts, fetchCategories, loading, error } = useProductStore();

  // Effet pour charger les produits et catégories au montage du composant
  useEffect(() => {
    // Utilisation d'une fonction asynchrone pour éviter les effets de bord si l'un des fetch échoue
    const fetchAll = async () => {
      await Promise.all([fetchProducts(), fetchCategories()]);
    };
    fetchAll();
  }, []);

  // Effet pour mettre à jour les produits vedettes à chaque changement de la liste des produits
  useEffect(() => {
    if (products.length > 0) {
      // On inverse la liste pour mettre en avant les produits les plus récents
      const featured = [...products].slice(-10).reverse();
      setFeaturedProducts(featured as Product[]);
    }
  }, [products]);

  /**
   * Naviguation vers la page de la boutique en filtrant par catégorie sélectionnée.
   * @param category - Nom de la catégorie à afficher
   */
  const navigateToCategory = (category: string) => {
    router.push({
      pathname: '/(tabs)/shop',
      params: { 
        category 
      },
    });
  }

  // Affichage d'un écran de chargement si les données sont en cours de récupération
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <LoadingSpinner fullscreen />
        </View>
      </SafeAreaView>
    )
  }

  // Affichage d'un message d'erreur si une erreur est survenue lors du chargement des données
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Affichage principal de la page d'accueil
  return (
    <View style={styles.wrapper}>
      {/* En-tête personnalisée de la page d'accueil */}
      <HomeHeader/>
      <View style={styles.categoriesSection}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContainerView}
        >
          {/* Section affichant la liste des catégories de produits */}
          <View style={styles.categoriesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Catégories</Text>
            </View>
            {/* Scroll horizontal pour naviguer entre les différentes catégories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {categories?.map((category) => (
                <TouchableOpacity
                  style={styles.categoryButton}
                  key={category}
                  onPress={() => navigateToCategory(category)}
                  accessibilityLabel={`Voir la catégorie ${category}`}
                >
                  <AntDesign 
                    name="tag"
                    size={16}
                    color={AppColors.primary[500]}
                  />
                  <Text style={styles.categoryText}>
                    {/* Affichage du nom de la catégorie avec la première lettre en majuscule */}
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {/* Section affichant les produits vedettes (meilleures ventes) */}
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Meilleures ventes</Text>
              <TouchableOpacity
                onPress ={() => {
                  // TODO: Naviguer vers une page listant tous les produits vedettes
                  // router.push('/(tabs)/shop?featured=true');
                }}
                accessibilityRole="button"
                accessibilityLabel="Voir tous les produits vedettes"
              >
                <Text style={styles.seeAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            {/* Liste horizontale des produits vedettes avec FlatList pour performance */}
            <FlatList 
              data={featuredProducts}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredProductContainer}
              renderItem={({item}) => (
                <View style={styles.featuredProductContainer}>
                  {/* Carte produit compacte pour chaque produit vedette */}
                  <ProductCard product={item} compact />
                </View>
              )}
              ListEmptyComponent={
                <Text style={{ color: AppColors.text.tertiary, padding: 16 }}>
                  Aucun produit vedette pour le moment.
                </Text>
              }
            />
          </View>
          {/* Section des produits les plus récents */}
          <View style={styles.newestSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nouveautés</Text>
              <TouchableOpacity
                onPress={() => {
                  // TODO: Naviguer vers une page listant toutes les nouveautés
                  // router.push('/(tabs)/shop?sort=newest');
                }}
                accessibilityRole="button"
                accessibilityLabel="Voir tout"
              >
                <Text style={styles.seeAllText}>Voir Tout</Text>
              </TouchableOpacity>
            </View>
            {/* Grille des produits récents */}
            <View style={styles.productsGrid}>
              {products?.length === 0 ? (
                <Text style={{ color: AppColors.text.tertiary, padding: 16 }}>
                  Aucun produit disponible.
                </Text>
              ) : (
                products.map((product) => (
                  <View key={product.id} style={styles.productContainer}>
                    <ProductCard 
                      product={product}
                      customStyle={{width: "100%"}}
                    />
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

/**
 * Styles de la page d'accueil, organisés par section et composant.
 */
const styles = StyleSheet.create({
  // Conteneur principal de la page d'accueil
  wrapper: {
    backgroundColor: AppColors.background.primary
  },
  // Conteneur utilisé pour les SafeAreaView (chargement/erreur)
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary
  },
  contentContainer: {},
  // Style du conteneur de la ScrollView principale
  scrollContainerView: {
    paddingBottom: 300,
  },
  // Conteneur centré pour afficher le spinner de chargement ou les erreurs
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  // Section contenant la liste des catégories
  categoriesSection: {
    marginTop: 10,
    marginBottom: 16
  },
  // Bouton de catégorie individuel
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.background.secondary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 5,
    minWidth: 100
  },
  // Texte du nom de la catégorie
  categoryText: {
    marginLeft: 6,
    fontFamily: 'Inter-Medium',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingRight: 20
  },
  // En-tête de section (catégories, meilleures ventes)
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingRight: 20
  },
  // Titre de section
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: AppColors.primary[500]
  },
  // Texte du bouton "Voir tout"
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: AppColors.primary[500]
  },
  // Texte d'erreur affiché en cas de problème de chargement
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: AppColors.error,
    textAlign: 'center',
  },
  productContainer: {},
  // Grille de produits (à compléter pour un affichage en grille responsive)
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  newestSection: {},
  productGrid: {},
  featuredProductsContainer: {},
  // Conteneur pour chaque produit vedette dans la FlatList
  featuredProductContainer: {
    marginRight: 8,
  },
  // Section des produits vedettes
  featuredSection: {
    marginVertical: 16,
  },
});