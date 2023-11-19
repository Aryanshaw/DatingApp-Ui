/* eslint-disable prettier/prettier */

import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Card = ({data, preference, index}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageDotPress = index => {
    setSelectedImageIndex(index);
  };

  return (
    <View>
      <View
        style={[
          styles.card,
          index !== data.id && data.id % 2 !== 0
            ? {transform: [{rotate: '-5deg'}]}
            : {},
          index !== data.id && data.id % 2 === 0
            ? {transform: [{rotate: '5deg'}]}
            : {},
        ]}>
        {Array.isArray(data.images) && data.images.length > 0 ? (
          <>
            <Image
              source={{uri: data.images[selectedImageIndex].img}}
              alt=""
              style={styles.userImg}
            />

            <View style={styles.paginationDotsContainer}>
              {data.images.map((image, index) => (
                <TouchableOpacity
                  key={image.imgId}
                  style={[
                    styles.paginationDot,
                    index === selectedImageIndex && styles.selectedDot,
                  ]}
                  onPress={() => handleImageDotPress(index)}
                />
              ))}
            </View>
          </>
        ) : null}

        <View style={styles.infoContainer}>
          <Text style={styles.name}>
            {data.name} , {data.age}
          </Text>
          <View style={{left: 15}}>
            <View style={styles.genderContainer}>
              {data.gender === 'Male' ? (
                <MaterialCommunityIcons
                  name="gender-male"
                  color="gray"
                  size={15}
                />
              ) : (
                <MaterialCommunityIcons
                  name="gender-female"
                  color="gray"
                  size={15}
                />
              )}
              <Text style={[styles.text, {marginLeft: 5}]}>{data.gender}</Text>
            </View>
            <Text style={styles.text}>
              <Entypo name="location" size={15} color="gray" /> {data.location}{' '}
              , {data.distance}
            </Text>
            <Text style={styles.text}>
              <Entypo name="info-with-circle" size={15} color="gray" />{' '}
              {data.bio}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    maxWidth: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height - 300,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderRadius: 20,
    resizeMode: 'cover',
    alignSelf: 'center',
    top: -85,
    elevation: 5,
  },
  userImg: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    padding: 5,
  },
  name: {
    color: 'gray',
    fontSize: 25,
    marginBottom: 5,
    fontWeight: 'bold',
    left: 10,
    textTransform: 'capitalize',
  },
  text: {
    color: 'gray',
    fontSize: 15,
    // left: 16,
    marginBottom: 5,
  },
  paginationDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    position: 'absolute',
    bottom: 10,
    left: '50%',
    right: '50%',
  },
  paginationDot: {
    width: 20,
    height: 10,
    borderRadius: 4,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  selectedDot: {
    backgroundColor: 'rgb(222, 93, 155)',
  },
  genderContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
