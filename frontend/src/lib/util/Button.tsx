import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { Colors } from 'react-native-paper';

interface props {
	buttonNumber: number;
	buttonText: string;
	secondButtonText?: string;
	onPressFunction?: () => void;
	secondOnPressFunction?: () => void;
	onPressWithParam?: (pressParam: any) => void;
	secondOnPressWithParam?: (secondParam: any) => void;
	pressParam?: any;
	secondParam?: any;
}

export function Button({
	buttonNumber,
	buttonText,
	secondButtonText,
	onPressFunction,
	secondOnPressFunction,
	onPressWithParam,
	secondOnPressWithParam,
	pressParam,
	secondParam,
}: props) {
	return (
		<>
			{buttonNumber === 1 && (
				<View style={styles.buttonRowView}>
					<TouchableHighlight
						activeOpacity={0.1}
						underlayColor={Colors.grey200}
						style={styles.closeButtonStyle}
						onPress={() => {
							onPressFunction && onPressFunction();
							onPressWithParam && pressParam && onPressWithParam(pressParam);
						}}
					>
						<Text style={styles.buttonText}>{buttonText}</Text>
					</TouchableHighlight>
				</View>
			)}
			{buttonNumber === 2 && (
				<View style={styles.buttonWithTwoView}>
					<TouchableHighlight
						activeOpacity={0.1}
						underlayColor={Colors.grey200}
						style={[styles.twoButtonStyle, { borderBottomLeftRadius: 13 }]}
						onPress={() => {
							onPressFunction && onPressFunction();
							onPressWithParam && pressParam && onPressWithParam(pressParam);
						}}
					>
						<Text style={[styles.buttonText]}>{buttonText}</Text>
					</TouchableHighlight>
					<View
						style={{
							height: '100%',
							borderWidth: 0.3,
						}}
					/>
					<TouchableHighlight
						activeOpacity={0.1}
						underlayColor={Colors.grey200}
						style={[styles.twoButtonStyle, { borderBottomRightRadius: 13 }]}
						onPress={() => {
							secondOnPressFunction && secondOnPressFunction();
							secondOnPressWithParam &&
								secondParam &&
								secondOnPressWithParam(secondParam);
						}}
					>
						<Text style={styles.buttonText}>{secondButtonText}</Text>
					</TouchableHighlight>
				</View>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	buttonRowView: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignContent: 'center',
		alignSelf: 'center',
		marginTop: 10,
		marginBottom: -14,
	},
	closeButtonStyle: {
		padding: 15,
		width: '80%',
		height: '100%',
		borderRadius: 13,
	},
	twoButtonStyle: {
		padding: 15,
		width: '57%',
		height: '100%',
		paddingLeft: 10,
		paddingRight: 10,
	},
	buttonWithTwoView: {
		flexDirection: 'row',
		marginBottom: -20,
		marginLeft: 1,
	},
	buttonText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
	},
});
