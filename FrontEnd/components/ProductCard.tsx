/**
 * Composant ProductCard : affiche une carte produit avec image, titre, prix, note, favoris et bouton panier.
 * Gère l'affichage compact ou détaillé selon la prop "compact".
 * Permet d'ajouter le produit au panier et de le marquer comme favori.
 */
import { 
    StyleSheet, Text, View, StyleProp, 
    ViewStyle, Image, TouchableOpacity, 
} from 'react-native';
import React from 'react';
import { AppColors } from '@/constants/theme';
import { Product } from '@/type';
import Button from './Button';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import Rating from './Rating';
import { useCartStore } from '@/store/cartStore';
import { useFavoritesStore } from '@/store/favoriteStore';
import { AntDesign } from '@expo/vector-icons';

/**
 * Props du composant ProductCard
 * @property product - Le produit à afficher
 * @property compact - Affichage compact (pour les listes horizontales)
 * @property customStyle - Styles personnalisés à appliquer à la carte
 */
interface ProductCardProps {
    product: Product;
    compact?: boolean;                      // Affiche une version compacte de la carte si true
    customStyle?: StyleProp<ViewStyle>;     // Permet d'ajouter des styles personnalisés
}

/**
 * Composant principal ProductCard
 */
const ProductCard: React.FC<ProductCardProps> = ({ 
    product, 
    compact = false, 
    customStyle
}) => {
    // Déstructuration des propriétés du produit
    const { id, title, price, category, image, rating } = product;

    // Hook de navigation pour accéder à la page détail du produit
    const router = useRouter();

    /**
     * Navigue vers la page détail du produit.
     * Utilisation d'un cast "as any" car Expo Router n'accepte que des routes statiques.
     */
    const handleProductRoute = () => {
        router.push(`/product/${id}` as any);
    };

    // Récupération des actions du store panier et favoris
    const { addItem } = useCartStore();
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const isFav = isFavorite(id);

    /**
     * Ajoute le produit au panier et affiche un toast de confirmation.
     */
    const handleAddToCart = () => {
        addItem(product, 1);
        Toast.show({
            type: 'success',
            text1: `Produit ${title} ajouté au panier 👋`,
            text2: "Voir le panier pour finaliser votre achat.",
            visibilityTime: 2000,
        });
    };

    /**
     * Ajoute ou retire le produit des favoris.
     */
    const handleToggleFavorite = () => {
        toggleFavorite(product);
    };

    return (
        <TouchableOpacity 
            onPress={handleProductRoute}
            style={[styles.card, compact && styles.compactCard, customStyle]}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Voir le détail du produit ${title}`}
        >
            {/* Affichage de l'image produit et du bouton favori */}
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: image }} 
                    style={styles.image}
                    resizeMode='contain'
                    accessibilityLabel={`Image du produit ${title}`}
                />
                {/* Bouton pour ajouter/retirer des favoris */}
                <TouchableOpacity
                    onPress={event => {
                        event.stopPropagation();
                        handleToggleFavorite();
                    }}
                    style={[styles.favoriteButton, { borderWidth: isFav ? 1 : 0 }]}
                    accessibilityRole="button"
                    accessibilityLabel={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                    <AntDesign 
                        name='heart' 
                        size={18}
                        color={isFav ? AppColors.error : AppColors.gray[400]} 
                    />
                </TouchableOpacity>
            </View>
            {/* Contenu texte de la carte produit */}
            <View style={styles.content}>
                {/* Catégorie du produit */}
                <Text style={styles.category}>{category}</Text>
                {/* Titre du produit, tronqué si compact */}
                <Text 
                    style={styles.title}
                    numberOfLines={compact ? 1 : 2}
                    ellipsizeMode='tail'
                >
                    {title}
                </Text>
                {/* Pied de carte : prix, note, bouton panier */}
                <View style={styles.footer}>
                    {/* Prix du produit */}
                    <Text style={[styles.price, !compact && { marginBottom: 7 }]}>
                        €{price.toFixed(2)}
                    </Text>
                    {/* Note du produit */}
                    <View style={!compact && { marginBottom: 7 }}>
                        <Rating 
                            rating={rating?.rate} 
                            count={rating?.count}
                            size={12}
                        />
                    </View>
                    {/* Bouton "Ajouter au panier" affiché seulement en mode détaillé */}
                    {!compact && (
                        <Button 
                            onPress = {event => {
                                event.stopPropagation?.();
                                handleAddToCart();
                            }}
                            title='Ajouter au panier' 
                            size='small' 
                            variant='outline'
                            accessibilityLabel={`Ajouter ${title} au panier`}
                        />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ProductCard

/**
 * Styles du composant ProductCard, organisés par section.
 */
const styles = StyleSheet.create({
    // Style du prix affiché
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: AppColors.primary[600],
        marginBottom: 5,
    },
    // Pied de carte : contient prix, note, bouton panier
    footer: {
        // flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'column',
        // alignItems: 'center',
    },
    // Style du texte de la note (non utilisé, remplacé par Rating)
    ratingText: {
        marginBottom: 8,
        textTransform: 'capitalize',
        color: AppColors.gray[600],
    },
    // Titre du produit
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: AppColors.text.primary,
        marginBottom: 8,
    },
    // Catégorie du produit
    category: {
        fontSize: 12,
        color: AppColors.text.tertiary,
        textTransform: 'capitalize',
        marginBottom: 4,
    },
    // Conteneur du contenu texte de la carte
    content: {
        padding: 12,
        backgroundColor: AppColors.background.secondary,
    },
    // Bouton favori (coeur)
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: -45,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 18,
        padding: 2,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: AppColors.error,
    },
    // Image du produit
    image: {
        width: '100%',
        height: '100%',
    }, 
    // Conteneur de l'image produit
    imageContainer: {
        position: 'relative',
        height: 150,
        width: 100,
        backgroundColor: AppColors.background.primary,
        padding: 5,
        alignSelf: 'center',
    },
    // Style appliqué en mode compact (liste horizontale)
    compactCard: {
        width: 150,
        marginRight: 12,
    },
    // Style principal de la carte produit
    card: {
        backgroundColor: AppColors.background.primary,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        width: '48%',
        minWidth: 150,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: AppColors.gray[200],
    },
})