/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
'use strict';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Card from '../../Components/Card/Card';
import TinderCard from 'react-tinder-card';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {db} from '../../data/CardData';

const alreadyRemoved = [];
let charactersState = db;

const Home = () => {
  const [characters, setCharacters] = useState(db);
  const [lastDirection, setLastDirection] = useState();
  const [isBookmarked, setBookmarked] = useState(false);
  const [isVisible, setVisible] = useState(false);

  const toggleBookmark = () => {
    setBookmarked(!isBookmarked);
    if (isBookmarked) {
      ToastAndroid.show('Bookmark removed', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Bookmark added', ToastAndroid.SHORT);
    }
  };

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map(i => React.createRef()),
    [],
  );

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete + ' to the ' + direction);
    setLastDirection(direction);
    alreadyRemoved.push(nameToDelete);

    if (direction === 'left' || direction === 'right') {
      setLastDirection(null);
    }
  };

  const outOfFrame = id => {
    charactersState = charactersState.filter(character => character.id !== id);
    setCharacters(charactersState);
    setBookmarked(false);
  };

  const swipe = dir => {
    const cardsLeft = characters.filter(
      person => !alreadyRemoved.includes(person.id),
    );
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].id; // Find the card object to be removed
      const index = db.map(person => person.id).indexOf(toBeRemoved); // Find the index of which to make the reference to
      alreadyRemoved.push(toBeRemoved); // Make sure the next card gets removed next time if this card do not have time to exit the screen
      childRefs[index].current.swipe(dir); // Swipe the card!
    }
  };

  useEffect(() => {
    if (characters.length === 3) {
      setVisible(true);
    }
  }, [characters.length]);

  const onClose = () => {
    setVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient
        style={styles.topContainer}
        colors={['#f7437c', '#eb8db0', '#fceab1']}>
        <View style={styles.topComponent}>
          <Text style={styles.header}>Discover</Text>
          <Entypo
            name="user"
            size={28}
            color="rgb(245, 125, 183)"
            style={styles.userIcon}
          />
        </View>
      </LinearGradient>
      <View style={styles.cardContainer}>
        {characters.map((item, i) => (
          <TinderCard
            ref={childRefs[i]}
            key={i}
            onSwipe={dir => swiped(dir, item.id)}
            onCardLeftScreen={() => {
              outOfFrame(item.id);
            }}
            preventSwipe={['down', 'up']}
            swipeRequirementType="position"
            onSwipeRequirementFulfilled={dir => setLastDirection(dir)}>
            {lastDirection !== undefined && i === characters.length - 1 && (
              <Text
                style={[
                  styles.swipeText,
                  {
                    left: lastDirection === 'left' ? 20 : null,
                    right: lastDirection === 'right' ? 20 : null,
                    color: lastDirection === 'left' ? 'red' : 'green',
                    borderColor:
                      lastDirection === 'left'
                        ? 'red'
                        : lastDirection === 'right'
                        ? 'green'
                        : 'transparent',
                  },
                ]}>
                {lastDirection === 'left'
                  ? 'Nope'
                  : lastDirection === 'right'
                  ? 'Yup'
                  : null}
              </Text>
            )}
            <Card
              data={item}
              preference={lastDirection}
              index={characters.length}
            />
          </TinderCard>
        ))}
        {characters.length === 0 && (
          <View>
            <Text
              style={{
                color: 'gray',
                alignSelf: 'center',
                top: 150,
              }}>
              No more users available
            </Text>
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            swipe('left');
          }}>
          <Entypo name="cross" size={25} color="rgb(222, 93, 155)" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => {
            swipe('right');
          }}>
          <Ionicons name="heart" size={75} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={toggleBookmark}
          disabled={characters.length === 0}>
          {isBookmarked ? (
            <FontAwesome name="bookmark" size={25} color="rgb(222, 93, 155)" />
          ) : (
            <FontAwesome
              name="bookmark-o"
              size={25}
              color="rgb(222, 93, 155)"
            />
          )}
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isVisible}
        animationIn="slideInUp"
        style={styles.modal}
        onBackdropPress={onClose}>
        <View style={styles.modalContent}>
          <FastImage
            source={require('../../assets/matchGif.gif')}
            style={styles.gif}
            resizeMode={FastImage.resizeMode.contain}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              onClose();
            }}>
            <Entypo name="cross" size={25} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    display: 'flex',
  },
  topContainer: {
    width: Dimensions.get('window').width,
    height: 200,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  topComponent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    top: 30,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  userIcon: {
    backgroundColor: 'white',
    borderRadius: 50,
    width: 45,
    textAlign: 'center',
    height: 29,
  },
  cardContainer: {},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
    position: 'absolute',
    zIndex: 9000,
    width: '100%',
    bottom: 50,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 100,
    elevation: 3,
  },
  button2: {
    borderRadius: 50,
    padding: 5,
    backgroundColor: 'rgb(222, 93, 155)',
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  swipeText: {
    position: 'absolute',
    top: 20,
    fontSize: 40,
    fontWeight: 'bold',
    zIndex: 1000,
    borderWidth: 3,
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  dragIcon: {
    width: 50,
    height: 6,
    backgroundColor: 'gray',
    borderRadius: 20,
    alignSelf: 'center',
  },
  modalContent: {
    backgroundColor: 'transparent',
    height: 500,
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    color: 'black',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  gif: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 350,
    width: Dimensions.get('window').width - 50,
    bottom: 100,
  },
  closeButton: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 100,
    elevation: 3,
    maxWidth: 80,
    alignItems: 'center',
    alignSelf: 'center',
  },
});
