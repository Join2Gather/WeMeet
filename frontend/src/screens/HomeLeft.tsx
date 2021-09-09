import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// prettier-ignore
import {SafeAreaView, View, Text, NavigationHeader,
MaterialCommunityIcon as Icon} from '../theme';
import {LeftRightNavigation} from '../components';

const title = '카메라 접근을 허가해 주세요';

export default function HomeLeft() {
  const navigation = useNavigation();
  const goHome = useCallback(() => navigation.navigate('Home'), []);
  return (
    <SafeAreaView>
      <View style={[styles.view]}>
        <NavigationHeader
          Right={() => <Icon name="close" size={30} onPress={goHome} />}
        />
        <LeftRightNavigation distance={40} onRightToLeft={goHome}>
          <View style={[styles.content]}>
            <Text style={[styles.text]}>{title}</Text>
          </View>
        </LeftRightNavigation>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  view: {flex: 1, padding: 5},
  text: {fontSize: 20},
  content: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
