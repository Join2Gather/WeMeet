import React from 'react';
import type { FC, ComponentProps } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaView as IOSSafeAreaView } from 'react-native';
export type SafeAreaViewProps = ComponentProps<typeof RNSafeAreaView>;
export type SafeAreaIosViewProps = ComponentProps<typeof IOSSafeAreaView>;

export const SafeAreaView: FC<SafeAreaViewProps> = ({
	style,
	children,
	...props
}) => {
	return Platform.OS === 'ios' ? (
		<IOSSafeAreaView style={[styles.flex, style]} {...props}>
			{children}
		</IOSSafeAreaView>
	) : (
		<RNSafeAreaView style={[styles.flex, style]} {...props}>
			{children}
		</RNSafeAreaView>
	);
};

const styles = StyleSheet.create({
	flex: { flex: 1 },
});
