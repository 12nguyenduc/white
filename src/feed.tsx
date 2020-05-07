import React from 'react';
import {FlatList, View, StyleSheet, ImageBackground, Image, Dimensions} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';

import { Twitt } from './components/twitt';
import { twitts } from './data';
import { StackNavigatorParamlist } from './types';
import { Portal } from "react-native-paper";

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

  const data = twitts.map(twittProps => ({
    ...twittProps,
    onPress: () =>
      props.navigation &&
      props.navigation.push('Details', {
        ...twittProps,
      }),
  }));

  return (
        <Image source={require('./assets/bg_home.jpg')} style={{width: '100%', height: Dimensions.get('window').height, resizeMode: 'cover', position: 'absolute', backgroundColor: 'red'}}>
    {/*<FlatList*/}
    {/*  contentContainerStyle={{ backgroundColor: theme.colors.background }}*/}
    {/*  style={{ backgroundColor: theme.colors.background }}*/}
    {/*  data={data}*/}
    {/*  renderItem={renderItem}*/}
    {/*  keyExtractor={keyExtractor}*/}
    {/*  ItemSeparatorComponent={() => (*/}
    {/*    <View style={{ height: StyleSheet.hairlineWidth }} />*/}
    {/*  )}*/}
    {/*/>*/}
        </Image>
  );
};
