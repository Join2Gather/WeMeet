import React, { useCallback, ReactNode } from 'react';
import { Modal, StyleSheet, View, Dimensions } from 'react-native';
import { Colors } from 'react-native-paper';

const screen = Dimensions.get('screen');

interface props {
	modalVisible?: boolean;
	setModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
	ModalViewRender: () => ReactNode;
}

export function ModalView({ modalVisible, ModalViewRender }: props) {
	return (
		<Modal animationType="fade" transparent={true} visible={modalVisible}>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>{ModalViewRender()}</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: -20
	},
	modalView: {
		marginBottom: 60,
		backgroundColor: Colors.white,
		borderRadius: 13,
		padding: 20,
		alignItems: 'center',
		shadowColor: 'black',
		elevation: 10,
		shadowOffset: {
			width: 1,
			height: 1
		},
		shadowOpacity: 0.21,
		shadowRadius: 1.0,
		width: screen.width * 0.9,
		maxHeight: screen.height * 0.7
	}
});
