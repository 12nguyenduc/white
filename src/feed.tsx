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
import TrackPlayer, { TrackPlayerEvents, STATE_PLAYING, STATE_STOPPED, useTrackPlayerEvents } from 'react-native-track-player';
import WebView from 'react-native-webview'

function renderItem({ item }: { item: TwittProps }) {
  return <Twitt {...item} />;
}

function keyExtractor(item: TwittProps) {
  return item.id.toString();
}

type Props = {
  navigation?: StackNavigationProp<StackNavigatorParamlist>;
};

const events = [
  TrackPlayerEvents.PLAYBACK_STATE,
  TrackPlayerEvents.PLAYBACK_ERROR
];

class PlayAudio extends React.PureComponent{
  constructor(props:any) {
    super(props);
    this.state = {
      item: props.item,
      playerState: null
    };
    TrackPlayer.registerEventHandler(event=>{
      console.log(event);
      this.setState({playerState: event.state})
      if(event.type==='playback-queue-ended'){
        this.play(props.item)
      }
    })
  }


   play(item:any){
    if(!item.sound)
      return;
    try {
      const start = async () => {
        // Set up the player
        await TrackPlayer.stop();
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
    } catch (e) {
      console.log(`cannot play the sound file`, e)
    }
  }
  touchAction(){
    if(this.state.playerState===STATE_PLAYING){
      TrackPlayer.pause();
    }else{
      TrackPlayer.play();
    }
  }
  render() {
    return (
        <React.Fragment>
          {
            this.state.playerState !== STATE_PLAYING &&
            <View
                pointerEvents={'box-none'}
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
        </React.Fragment>
    );
  }
}

export const Feed = (props: Props) => {
  const theme = useTheme();
  const safeArea = useSafeArea();
  const offset = new Animated.Value(0);
  const data = [
    { image: 'https://i.imgur.com/vofRaU9.jpg', sound: require('./audio/1050_daydream.mp3')},
    { image: 'https://i.imgur.com/1ieAm1M.jpg', sound: require('./audio/1931_deep-cove.mp3')},
    { image: 'https://i.imgur.com/VOvcaek.jpg', sound: require('./audio/24298_Rain_Bali_Indonesia.mp3')},
    { image: 'https://i.imgur.com/PRQhFq7.jpg', sound: require('./audio/22082_Beach_wave.mp3')},
    { image: 'https://i.imgur.com/ab7CdIb.jpg', sound: require('./audio/18331_Bird_night.mp3')},
    { image: 'https://i.imgur.com/OWBYX5h.jpg', sound: require('./audio/cow.mp3')},
    { image: 'https://i.imgur.com/fyea32A.jpg', sound: require('./audio/21104_Street_carnival.mp3')},
  ];
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState({})
  const [playStatus, setPlayStatus] = useState({})
  const [focus, setFocus] = useState(false)
  const [sleep, setSleep] = useState(false)
  const [nap, setNap] = useState(false)
  const [breath, setBreath] = useState(false);
  let previous = 0;
  let scrollState = 'idle';
  const DURATION_VIEWPAGER = 250;
  let webView: WebView | null;
  let count = 0;
  let playAudioRef: any = null;
  const runJSInBackground = (code) =>{
    code = `
        (function a() {
                window.ReactNativeWebView.postMessage('${code}');
            })();
    `;
    webView?.injectJavaScript(code)
  };
  const handleMessage = (e) => {
    try{
      const message = e.nativeEvent.data;
      const data = JSON.parse(message);
      playAudioRef.play(data.item)
    }catch (e) {
      console.log(e)
    }
  }
  return (
  <React.Fragment>
    <WebView
        ref={el => webView = el}
        style={{ width: 0, height: 0, position: 'absolute', backgroundColor: '#000'}}
        source={{ html: '<html><body></body></html>' }}
        // injectedJavaScript={`
        //     (function a() {
        //       var i=0;
        //       while(i<1000000){
        //         window.ReactNativeWebView.postMessage(i++);
        //       }
        //     })();`}
        onMessage={handleMessage}
    />
  <ViewPager
      style={{width: '100%', height: Dimensions.get('screen').height, position: 'absolute', backgroundColor: 'black'}}
      initialPage={0}
      onPageSelected={e=>{
        const position = e.nativeEvent.position;
        const item = data[position];
        setSelected(item);
        setIndex(index);
        runJSInBackground(JSON.stringify({item: item, index: position}))
      }}
      onPageScroll={(e)=>{
          let duration = 0;
          if(scrollState==='settling')
            duration = Math.abs(e.nativeEvent.offset - previous)*DURATION_VIEWPAGER/2;

          Animated.timing(offset, {
            toValue: e.nativeEvent.offset,
            duration: duration,
            useNativeDriver: true,
          }).start();
          previous = e.nativeEvent.offset;
        // }
      }}
      onPageScrollStateChanged={(e) => {
        scrollState = e.nativeEvent.pageScrollState;
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
                console.log(offset._value);
                if(offset._value===0){
                  playAudioRef.touchAction();
                }
              }catch (e) {
                console.log('Touchable',e)
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
        <PlayAudio {...props} ref={ref=>playAudioRef=ref} item={selected}/>

        <View style={[styles.row, {bottom: 64+safeArea.bottom, width: '100%', height: 100,  position: 'absolute',}]} >
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
