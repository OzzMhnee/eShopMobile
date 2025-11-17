///test, juste copié collé de cours jrm


import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { AntDesign, Feather } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';

interface RatingProps {
    rating:number;
    count?:number;
    size?:number;
    showCount?:boolean;
}

const Rating:React.FC<RatingProps> = ({
    rating, count, 
    size=16, showCount=true
}) => {
    const roundedRating = Math.round(rating * 2) / 2;

    const renderStars = () => {
        const stars = [];
        //Full stars
        for (let i = 1; i <= Math.floor(roundedRating); i++) {
          stars.push(
            <AntDesign 
              name='star' 
              key={`star-${i}`} 
              size={size} 
              color={AppColors.accent[500]}
              fill={AppColors.accent[500]}
            />
          );
        }
        // //half star
        // if (roundedRating % 1 !== 0) {
        //   stars.push(
        //     <View key="half-star" style={styles.halfStarContainer}>
        //       <Feather 
        //         name='star' 
        //         size={size} 
        //         color={AppColors.accent[500]}
        //         fill={AppColors.accent[500]}
        //         style={styles.halfStarBackground}
        //       />
        //       <View style={styles.halfStarOverlay}>
        //         <Feather 
        //         name='star' 
        //         size={size} 
        //         color={AppColors.accent[500]}
        //         style={styles.halfStarforeground}
        //         />
        //       </View>
        //     </View>
        //   );
        // }
        //Empty stars
        const emptyStars = 5 - Math.ceil(roundedRating);
        for (let i = 1; i <= emptyStars; i++) {
          stars.push(
            <Feather 
              name='star' 
              size={size} 
              color={AppColors.accent[500]}
              style={styles.halfStarforeground}
            />
          );
        }
        return stars;
    }; 
  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {renderStars()}
      </View>
      {showCount && count !== undefined && (
        <Text style={styles.count}>({count})</Text>
      )}
    </View>
  )
}

export default Rating

const styles = StyleSheet.create({
  halfStarforeground: {
    position: "absolute"
  },
  halfStarOverlay: {
    position: "absolute",
    width: "50%",
    overflow: "hidden"
  },
  halfStarBackground: {
    // position: "absolute",
  },
  halfStarContainer: {
    position: "relative",
  },
  count: {
    marginLeft: 4,
    fontSize: 14,
    color: AppColors.text.secondary,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: "center",
  },
  container: {
    flexDirection: 'row',
    alignItems: "center",
  }
})