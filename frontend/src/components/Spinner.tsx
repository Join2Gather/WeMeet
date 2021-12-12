import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Spin from 'react-native-loading-spinner-overlay';
import { Colors } from 'react-native-paper';

interface Props {
	loading: string | undefined;
}

export function Spinner({ loading }: Props) {
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		if (loading === 'loading') setVisible(true);
		else setVisible(false);
	}, [loading]);
	return (
		<Spin
			visible={visible}
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
