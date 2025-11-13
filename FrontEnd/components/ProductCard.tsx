import { 
    StyleSheet, Text,
    View, StyleProp, 
    ViewStyle, Image,
    TouchableOpacity, 
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

interface ProductCardProps {
    product: Product;
    compact?: boolean; // Optionnel : pour afficher une version compacte de la carte    
    customStyle?: StyleProp<ViewStyle>; // Optionnel : pour des styles personnalisés
}

const ProductCard: React.FC<ProductCardProps> = ({ 
    product, 
    compact = false, 
    customStyle
}) => {
    const { id, title, price, category, image, rating} = product;

    const router = useRouter();
    const handleProductRoute = () => {
        // Logique pour naviguer vers la page du produit
        //on ecrit la route de cette manière car expo router n'accepte pas les types dynamiques
        //juste les routes strictes / statiques
        router.push(`/product/${id}` as any);
    };
    const {addItem} = useCartStore();
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const isFav = isFavorite(id);

    const handleAddToCart = () => {
        // e.stopPropagation();
        addItem(product, 1);
        Toast.show({
            type: 'success',
            text1: `Produit ${title} ajouté au panier 👋`,
            text2: "Voir le panier pour finaliser votre achat.",
            visibilityTime: 2000,
            // position: 'bottom',
            
        });
        // Alert.alert(`Produit ${title} ajouté au panier`);
    };
    const handleToggleFavorite = () => {
        toggleFavorite(product);
    };

  return (
    <TouchableOpacity 
        onPress={handleProductRoute}
        style= {[ styles.card, compact && styles.compactCard,customStyle]}
        activeOpacity={0.8}
    >
        <View style={styles.imageContainer}>
            <Image 
                source={{ uri: image }} 
                style={styles.image}
                resizeMode='contain'
            />
            <TouchableOpacity
                onPress={handleToggleFavorite}
                style={[styles.favoriteButton, { borderWidth: isFav ? 1 : 0 }]}
            >
                <AntDesign 
                  name='heart' 
                  size={18}
                  color={isFav ? AppColors.error : AppColors.gray[400]} 
                />
            </TouchableOpacity>
        </View>
        <View style={styles.content}>
            <Text style={styles.category}>{category}</Text>
            <Text 
                style={styles.title}
                numberOfLines={compact ? 1 :2}
                ellipsizeMode='tail'
            >
                {title}
            </Text>
            <View style={styles.footer}>
                <Text style={[styles.price, !compact && { marginBottom: 7}]}>
                    €{price.toFixed(2)}
                </Text>
                <View style={!compact && { marginBottom: 7}}>
                    <Rating 
                        rating={rating?.rate} 
                        count={rating?.count}
                        size={12}
                    />
                </View>
                {/* <Text style={[styles.ratingText, !compact && { marginBottom: 7}]}>
                    Notes:{rating?.rate.toFixed(1)}/{`(${rating?.count})`}
                </Text> */}
                {!compact && (
                <Button 
                    onPress={handleAddToCart}
                    title='Ajouter au panier' 
                    size='small' 
                    variant='outline'/>
                )}
            </View>
        </View>
    </TouchableOpacity>
  )
}

export default ProductCard

const styles = StyleSheet.create({
    price:{
        fontSize:16,
        fontWeight:'600',
        color:AppColors.primary[600],
        marginBottom: 5,
    },
    footer: {
        // flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
    },
    ratingText: {
        marginBottom: 8,
        textTransform: 'capitalize',
        color: AppColors.gray[600],
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: AppColors.text.primary,
        marginBottom: 8,
    },
    category: {
        fontSize: 12,
        color: AppColors.text.tertiary,
        textTransform: 'capitalize',
        marginBottom: 4,
    },
    content: {
        padding: 12,
        backgroundColor: AppColors.background.secondary,
    },
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
    image: {
        width: '100%',
        height: '100%',
    }, 
    imageContainer: {
        position: 'relative',
        height: 150,
        width: 100,
        backgroundColor: AppColors.background.primary,
        padding: 5,
    },
    compactCard: {
        width: 150,
        marginRight: 12,
    },
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
        marginBottom: 16,
        borderWidth: 1,
        borderColor: AppColors.gray[200],
    },
})