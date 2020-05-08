import React, {useState} from 'react';
import {FlatList, View, StyleSheet, ImageBackground, Image, Dimensions, Animated, } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {Button, useTheme} from 'react-native-paper';

import { Twitt } from './components/twitt';
import { twitts } from './data';
import { StackNavigatorParamlist } from './types';
import { Portal, Caption } from "react-native-paper";
import ViewPager from '@react-native-community/viewpager';
import {SafeAreaView, useSafeArea} from "react-native-safe-area-context";
import {Title} from 'react-native-paper';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
type TwittProps = React.ComponentProps<typeof Twitt>;

function renderItem({ item }: { item: TwittProps }) {
  return <Twitt {...item} />;
}

function keyExtractor(item: TwittProps) {
  return item.id.toString();
}

type Props = {
  navigation?: StackNavigationProp<StackNavigatorParamlist>;
};

export const Feed = (props: Props) => {
  const theme = useTheme();
  const safeArea = useSafeArea();
  console.log(safeArea)
  const offset = new Animated.Value(0);
  const images = [
    require(`./assets/i0.jpg`),
    require(`./assets/i1.jpg`),
    require(`./assets/i2.jpg`),
    require(`./assets/i3.jpg`),
    require(`./assets/i4.jpg`),
    require(`./assets/i5.jpg`),
    require(`./assets/i6.jpg`),
  ];
  // const scale = Animated.interpolate(offset, {
  //   inputRange: [-1, 0, 1],
  //   outputRange: [0.8, 0, 0.8],
  // });
  return (
  <React.Fragment>
  <ViewPager
      style={{width: '100%', height: Dimensions.get('window').height, position: 'absolute', backgroundColor: 'black'}}
      initialPage={0}
      onPageScroll={(e)=>{
        if(e.nativeEvent.offset!==0)
          Animated.timing(offset, {
            toValue: e.nativeEvent.offset,
            duration: 1,
            useNativeDriver: true,
          }).start();
      }}
  >
    {
      images.map((i, index) => {
        return <View
            key={i + ''}
            style={{
              width: '100%',
              height: Dimensions.get('window').height,
              position: 'absolute',
              justifyContent: 'center',
              alignContent: 'center',
            }}>
          <Animated.Image
              source={i}
              style={{
                width: '100%',
                height: Dimensions.get('window').height,
                resizeMode: 'cover',
                backgroundColor: 'green',
                position: 'absolute',
                borderRadius: offset.interpolate({
                  inputRange: [-1, -0.85, -0.15, -0.1, 0, 0.1, 0.15, 1],
                  outputRange: [0, 40, 40, 40, 0, 40, 40, 0],
                }),
                transform: [{scale: offset.interpolate({
                    inputRange: [-1, -0.85, -0.15, -0.1, 0, 0.1, 0.15, 1],
                    outputRange: [1, 0.9, 0.9, 0.9, 1, 0.9, 0.9, 1],
                  })}]
              }}/>
        </View>
      })
    }
  </ViewPager>
  <Portal>
    <SafeAreaView>
      <View style={styles.row}>
        <Title style={styles.title}>Good Morning</Title>
        <Button
            onPress={()=>alert('share')}
            style={styles.button}>
          <MaterialCommunityIcons name='home-variant' color={'white'} size={24} />
        </Button>
        <Button
            onPress={()=>alert('share')}
            style={styles.button}>
          <MaterialCommunityIcons name='home-variant' color={'white'} size={24} />
        </Button>
      </View>
      <Caption style={styles.caption}>This time you feel lonely is the time you most need to be by yourself</Caption>
    </SafeAreaView>
  </Portal>
  </React.Fragment>
  );
};
const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  caption: {
    fontSize: 14,
    color: 'white',
    paddingHorizontal: 16,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    width: 24,
    // minHeight: 30,
    paddingHorizontal: 0,
    marginHorizontal: 0,
    // alignItems: 'flex-end',
  }
});
