/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View} from 'react-native';
import {Text, Button} from 'react-native-paper';
// import useCounter from '../hooks/useCounter';
import {RootState} from '../store';
import {up, down, reset} from '../store/counter';
import {StyleSheet} from 'react-native';

const Counter: React.FC = () => {
  const {number} = useSelector((state: RootState) => ({
    number: state.counter.number,
  }));
  const dispatch = useDispatch();
  const onIncrease = useCallback(() => {
    dispatch(up());
  }, []);
  const onReset = useCallback(() => {
    dispatch(reset());
  }, []);
  const onDecrease = useCallback(() => {
    dispatch(down());
  }, []);
  return (
    <View style={styles.view}>
      <Text style={styles.boldText}>Counter: {number}</Text>
      <View style={styles.buttonView}>
        <Button
          mode="contained"
          style={[styles.button, {backgroundColor: 'red'}]}
          onPress={onIncrease}>
          Increase
        </Button>
        <Button
          mode="contained"
          style={[styles.button, {backgroundColor: 'green'}]}
          onPress={onReset}>
          Reset
        </Button>
        <Button
          mode="contained"
          style={[styles.button, {backgroundColor: 'blue'}]}
          onPress={onDecrease}>
          Decrease
        </Button>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  view: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  buttonView: {flex: 1, flexDirection: 'column'},
  boldText: {
    flex: 1,
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    marginTop: '30%',
  },
  button: {width: 200, marginTop: 20, color: 'white'},
});

export default Counter;
