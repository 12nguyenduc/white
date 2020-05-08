import React from 'react';
import {StyleSheet, View, Image, SafeAreaView} from 'react-native';
import {
  Surface,
  Title,
  Caption,
  Avatar,
  Subheading,
  useTheme,
} from 'react-native-paper';
import color from 'color';

type Props = {
  item: any
};

export const SetTime = (props: Props) => {
  const theme = useTheme();
  const item = props?.route?.params?.item;
  return (
      <React.Fragment>
        <Image source={{uri: item.image}} style={{width: '100%', height: '100%', position: 'absolute', }} blurRadius={30}/>
    <SafeAreaView style={styles.container}>

    </SafeAreaView>
      </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
