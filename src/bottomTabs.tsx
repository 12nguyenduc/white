import React, {useState} from 'react';
import color from 'color';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme, Portal, FAB } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { useIsFocused, RouteProp } from '@react-navigation/native';

import overlay from './overlay';
import { Feed } from './feed';
import { Message } from './message';
import { Notifications } from './notifications';
import { StackNavigatorParamlist } from './types';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Animated from 'react-native-reanimated';
import {Button, TouchableOpacity, View, StatusBar, StatusBarStyle, Platform} from "react-native";

const Tab = createMaterialTopTabNavigator();

function MyTabBar({ state, descriptors, navigation, position }) {
    const theme = useTheme();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const safeArea = useSafeArea();
    return (
        <View style={{borderTopWidth: 0.35, borderTopColor: selectedIndex !== 0 ? '#00000020' : '#ffffff30', paddingHorizontal: 16, flexDirection: 'row', backgroundColor: selectedIndex===0?'transparent':'white', width: '100%', height: 50, position:'absolute', bottom: safeArea.bottom }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = state.index === index;
                if(isFocused && selectedIndex!==index){
                    setSelectedIndex(index);
                    if(Platform.OS==='android')
                        StatusBar.setBackgroundColor(index===0?'transparent':'white');
                    StatusBar.setBarStyle(index===0?'light-content':'dark-content')
                }

                const icon = options.tabBarIcon({color: selectedIndex===0?(isFocused?'white':'#b4b1b2'):(isFocused?'#404040':'#e6e6e6')});

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const inputRange = state.routes.map((_, i) => i);
                const opacity = Animated.interpolate(position, {
                    inputRange,
                    outputRange: inputRange.map(i => (i === index ? 1 : 0)),
                });

                return (
                    <TouchableOpacity
                        key={index+''}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Animated.View style={{  }}>
                            {icon}
                        </Animated.View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

type Props = {
  route: RouteProp<StackNavigatorParamlist, 'FeedList'>;
};

export const BottomTabs = (props: Props) => {
  const routeName = props.route.state
    ? props.route.state.routes[props.route.state.index].name
    : 'Feed';

  const theme = useTheme();
  const safeArea = useSafeArea();
  const isFocused = useIsFocused();

  let icon = 'feather';

  switch (routeName) {
    case 'Messages':
      icon = 'email-plus-outline';
      break;
    default:
      icon = 'feather';
      break;
  }

  const tabBarColor = theme.dark
    ? (overlay(6, theme.colors.surface) as string)
    : theme.colors.surface;
    if(Platform.OS==='android')
        StatusBar.setTranslucent(true)

  return (
    <React.Fragment>
      <Tab.Navigator
          style={{backgroundColor: 'red'}}
          swipeEnabled={false}
          tabBarPosition={'bottom'}
          initialRouteName="Feed"
          tabBarOptions={{
              showIcon: true,
              showLabel: false,
              inactiveTintColor: theme.colors.backdrop,
              activeTintColor: theme.colors.primary,
          }}
          backBehavior="initialRoute"
          tabBar={props => <MyTabBar {...props} />}
      >
        <Tab.Screen
          name="Feed"
          key={'1'}
          component={Feed}
          options={{
              tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name='home-variant' color={color} size={24} />
              ),
          }}
        />
        <Tab.Screen
            key={'2'}
            name="Notifications"
          component={Notifications}
          options={{
            tabBarIcon: ({ color }) => (
                <Fontisto name="compass" color={color} size={22} />
            ),
          }}
        />
        <Tab.Screen
        key={'3'}
        name="Messages"
          component={Message}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome name='circle-thin' color={color} size={22} />
            ),
          }}
        />
      </Tab.Navigator>
    </React.Fragment>
  );
};
