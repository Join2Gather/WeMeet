import React from 'react';
import { StyleSheet } from 'react-native';

import { Modal } from 'react-native';
import { SocialWebview } from './SocialWebview';

export function SocialWebviewModal({ visible, source, closeSocialModal }: any) {
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			style={styles.container}
		>
			<SocialWebview
				source={{ uri: source }}
				closeSocialModal={closeSocialModal}
			/>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
