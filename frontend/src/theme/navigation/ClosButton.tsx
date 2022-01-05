import React from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';
import { Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface props {
	closeBtn: () => void;
}

export function CloseButton({ closeBtn }: props) {
	return (
		<View
			style={{
				marginBottom: 10,
				width: '100%',
			}}
		>
			<TouchableHighlight
				activeOpacity={1}
				underlayColor={Colors.white}
				style={{
					marginLeft: '85%',
					padding: 5,
				}}
				onPress={closeBtn}
			>
				<Icon style={{ alignSelf: 'flex-end' }} name="close" size={25} />
			</TouchableHighlight>
		</View>
	);
}

const styles = StyleSheet.create({});
