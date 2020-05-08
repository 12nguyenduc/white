import React, {useState} from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity, TouchableWithoutFeedback, Modal,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {Button, useTheme, Paragraph, Headline} from 'react-native-paper';

import { Twitt } from './components/twitt';
import { twitts } from './data';
import { StackNavigatorParamlist } from './types';
import { Portal, Caption } from "react-native-paper";
import ViewPager from '@react-native-community/viewpager';
import {useSafeArea, SafeAreaView} from "react-native-safe-area-context";
import {Title} from 'react-native-paper';
import color from 'color';
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
type TwittProps = React.ComponentProps<typeof Twitt>;
import BackgroundService from 'react-native-background-actions';
import TrackPlayer, { TrackPlayerEvents, STATE_PLAYING } from 'react-native-track-player';

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
  const offset = new Animated.Value(0);
  let registerListenTrack = false;
  const data = [
    { image: 'https://i.imgur.com/vofRaU9.jpg', sound: 'https://cdn.artlist.io/artlist-mp3/87179_05_-_Seven_Wonders_-_Master_(16-44.1).mp3'},
    { image: 'https://i.imgur.com/1ieAm1M.jpg', sound: 'https://data25.chiasenhac.com/downloads/2073/5/2072958-2cfdf70c/128/Sweet%20Night%20-%20V%20BTS_.mp3'},
    { image: 'https://i.imgur.com/VOvcaek.jpg', sound: 'https://data3.chiasenhac.com/downloads/1740/5/1739437-5434152c/320/River%20-%20Charlie%20Puth.mp3'},
    { image: 'https://i.imgur.com/PRQhFq7.jpg', sound: 'https://data22.chiasenhac.com/downloads/1540/5/1539612-330ce8e7/320/One%20Call%20Away%20-%20Charlie%20Puth.mp3'},
    { image: 'https://i.imgur.com/ab7CdIb.jpg', sound: 'https://data25.chiasenhac.com/downloads/2074/5/2073390-14cdb95e/320/Death%20Bed%20-%20Powfu_%20Beabadoobee.mp3'},
    { image: 'https://i.imgur.com/OWBYX5h.jpg', sound: 'https://data20.chiasenhac.com/downloads/2064/5/2063840-c2a67058/320/No%20Shame%20-%205%20Seconds%20Of%20Summer.mp3'},
    { image: 'https://i.imgur.com/fyea32A.jpg', sound: 'https://data25.chiasenhac.com/downloads/2084/5/2083023-0a0ccbed/320/Be%20Kind%20-%20Marshmello_%20Halsey.mp3'},
  ];
  const playTrack = (item:any)=>{
    if(!item.sound)
      return;
    try {
      console.log(item)
      const start = async () => {
        // Set up the player
        await TrackPlayer.setupPlayer();

        // Add a track to the queue
        await TrackPlayer.add({
          id: 'trackId',
          url: item.sound,
          title: 'Track Title',
          artist: 'Track Artist',
          artwork: item.image
        });

        // Start playing it
        await TrackPlayer.play();
      };
      start();
      if(!registerListenTrack){
        registerListenTrack = true;
        console.log(registerListenTrack)
        TrackPlayer.registerEventHandler(e=>{
          console.log('playStatus', e)
          if(JSON.stringify(e)!==JSON.stringify(playStatus)){
            setPlayStatus(e)
          }
          if(e.type==='playback-queue-ended'){
             TrackPlayer.add({
              id: 'trackId',
              url: selected.sound,
              title: 'Track Title',
              artist: 'Track Artist',
              artwork: selected.image
            });
             TrackPlayer.play();
          }
        })
      }
    } catch (e) {
      console.log(`cannot play the sound file`, e)
    }
  }
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState({})
  const [playStatus, setPlayStatus] = useState({})
  const [focus, setFocus] = useState(false)
  const [sleep, setSleep] = useState(false)
  const [nap, setNap] = useState(false)
  const [breath, setBreath] = useState(false);
  return (
  <React.Fragment>
  <ViewPager
      style={{width: '100%', height: Dimensions.get('screen').height, position: 'absolute', backgroundColor: 'black'}}
      initialPage={0}
      showPageIndicator={true}
      onPageSelected={e=>{
        const item = data[e.nativeEvent.position]
        setSelected(item)
        setIndex(e.nativeEvent.position);
        setTimeout(()=>{
          playTrack(item)
        }, 50)
      }}
      onPageScroll={(e)=>{
        if(e.nativeEvent.offset!==0){
          // console.log(e.nativeEvent.offset)
          Animated.timing(offset, {
            toValue: e.nativeEvent.offset,
            duration: 0,
            useNativeDriver: true,
          }).start();
        }
      }}
  >
    {
      data.map((item, i) => {
        const transform = [{scale: offset.interpolate({
            inputRange: [-1, -0.85, -0.15, -0.1, 0, 0.1, 0.15, 1],
            outputRange: [1, 0.9, 0.9, 0.9, 1, 0.9, 0.9, 1],
          })}
        ]
        const transform2 =[]
        //
        const duration = 20000;
        const isFocus = index===i;
        const tranX = new Animated.Value(0)
        const tran = ()=>{
          Animated.timing(tranX, {
            toValue: -Dimensions.get('window').width/4,
            duration: duration,
            useNativeDriver: true,
          }).start();
          setTimeout(()=>{
            Animated.timing(tranX, {
              toValue: 0,
              duration: duration,
              useNativeDriver: true,
            }).start();
            setTimeout(()=>tran(), duration)
          }, duration)
        }
        if(isFocus){
          tran();
          transform2.push({translateX: tranX})
        }
        return <TouchableWithoutFeedback
            onPress={()=>{

              try {
                if(playStatus.state===3){
                  TrackPlayer.pause();
                }else{
                  TrackPlayer.play();
                }
              }catch (e) {
                console.log(e)
              }
            }}
            key={i + ''}
            style={{
              width: '100%',
              height: Dimensions.get('screen').height,
              position: 'absolute',
              justifyContent: 'center',
              alignContent: 'center',
            }}>
          <Animated.View
            style={{
              transform: transform,
              borderRadius: offset.interpolate({
                inputRange: [-1, -0.85, -0.15, -0.1, 0, 0.1, 0.15, 1],
                outputRange: [0, 40, 40, 40, 0, 40, 40, 0],
              }),
              overflow: 'hidden'
            }}
          >
          <Animated.Image
              source={{uri: item.image}}
              style={{
                width: Dimensions.get('screen').width*5/4,
                height: Dimensions.get('screen').height,
                resizeMode: 'cover',
                position: 'absolute',
                transform: transform2,
                overflow: 'hidden'
              }}/>
          </Animated.View>
        </TouchableWithoutFeedback>
      })
    }
  </ViewPager>
    <View style={{flex: 1, position: 'absolute', width: '100%', height: '100%'}} pointerEvents={'box-none'}>
    <SafeAreaView style={{flex: 1,}} pointerEvents={'box-none'}>
      <View style={styles.row}>
        <Title style={styles.title}>Good day</Title>
        {/*<Button*/}
        {/*    onPress={()=>alert('share')}*/}
        {/*    style={styles.buttonLeft}>*/}
        {/*  <FontAwesome name='share' color={'white'} size={24} />*/}
        {/*</Button>*/}
        {/*<Button*/}
        {/*    onPress={()=>alert('share')}*/}
        {/*    style={styles.buttonRight}>*/}
        {/*  <FontAwesome name='share' color={'white'} size={24} />*/}
        {/*</Button>*/}
      </View>
      <Caption style={styles.caption}>This time you feel lonely is the time you most need to be by yourself</Caption>
      {
        playStatus.state===2 &&
        <View
            style={{
              position: 'absolute',
              width: Dimensions.get('screen').width,
              height: Dimensions.get('screen').height,
              top: (Dimensions.get('screen').height - 30) / 2,
              left: (Dimensions.get('screen').width - 30) / 2
            }}
        >
          <FontAwesome name='play' color={'#ffffff80'} size={30}/>
        </View>
      }

      <View style={[styles.row, {bottom: 64, width: '100%', height: 100,  position: 'absolute',}]} >
        <View style={styles.containMode}>
            <TouchableOpacity
                onPress={()=>setFocus(true)}
                style={styles.buttonMode}>
              <FontAwesome name='dot-circle' color={'white'} size={24}/>
            </TouchableOpacity>
            <Caption style={styles.titleMode}>Focus</Caption>
        </View>
        <View style={styles.containMode}>
          <TouchableOpacity
              onPress={()=>setSleep(true)}
              style={styles.buttonMode}>
            <FontAwesome name='moon' color={'white'} size={24}/>
          </TouchableOpacity>
          <Caption style={styles.titleMode}>Sleep</Caption>
        </View>
        <View style={styles.containMode}>
          <TouchableOpacity
              onPress={()=>setNap(true)}
              style={styles.buttonMode}>
            <MaterialCommunityIcons name='timelapse' color={'white'} size={28}/>
          </TouchableOpacity>
          <Caption style={styles.titleMode}>Nap</Caption>
        </View>
        <View style={styles.containMode}>
          <TouchableOpacity
              onPress={()=>setBreath(true)}
              style={styles.buttonMode}>
            <FontAwesome name='leaf' color={'white'} size={18}/>
          </TouchableOpacity>
          <Caption style={styles.titleMode}>Breath</Caption>
        </View>
      </View>
    </SafeAreaView>
    </View>
    {
      (focus || sleep || nap || breath)&&
      <View style={{width: '100%', height: Dimensions.get('screen').height, position: 'absolute',}}>
        <Image source={{uri: selected.image}} style={{width: '100%', height: Dimensions.get('screen').height, position: 'absolute', }} blurRadius={30}/>
        <SafeAreaView style={{flex: 1}}>
          <View style={ {flexDirection: 'row', alignItems: 'center', height: 50}}>
            <TouchableOpacity
                onPress={()=>{
                  setFocus(false)
                  setSleep(false)
                  setNap(false)
                  setBreath(false)
                }}
                style={styles.buttonHeader}>
              <MaterialCommunityIcons name='close' color={'white'} size={36}/>
            </TouchableOpacity>
            <Title style={{flex: 1, textAlign: 'center', color: 'white',fontSize: 16}}>Focus</Title>
            <TouchableOpacity
                onPress={()=>setFocus(false)}
                style={styles.buttonHeader}>
              <MaterialCommunityIcons name='tune' color={'white'} size={24}/>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, }}>

          </View>
        </SafeAreaView>
      </View>
    }
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
    color: '#fffffff5',
    paddingHorizontal: 16,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    padding:0,
    margin: 0,
    justifyContent: 'flex-end',
  },
  buttonLeft: {
    padding:0,
    margin: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  buttonRight: {
    padding:0,
    margin: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  containMode: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonMode: {
    backgroundColor: '#ffffff30',
    width: 56,
    height: 56,
    borderRadius: 56/2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleMode: {
    marginTop: 8,
    color: '#ffffff',
    textAlign: 'center'
  },
  buttonHeader: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
