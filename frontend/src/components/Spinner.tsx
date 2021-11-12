import React from 'react';
import { StyleSheet } from 'react-native';
import Spin from 'react-native-loading-spinner-overlay';
import { Colors } from 'react-native-paper';

interface Props {
	loading: boolean;
}

export function Spinner({ loading }: Props) {
	return (
		<Spin
			visible={loading}
			textContent={'로딩중...'}
			textStyle={styles.loadingText}
		/>
	);
}

const styles = StyleSheet.create({
	loadingText: {
		fontFamily: 'NanumSquareR',
		fontSize: 20,
		color: Colors.white,
	},
});
