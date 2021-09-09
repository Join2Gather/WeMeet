import React, { forwardRef } from 'react';
import type { ForwardRefRenderFunction, ComponentProps } from 'react';
import { StyleSheet, TextInput as RNTextInput } from 'react-native';
import { Colors } from 'react-native-paper';
import { useIsDarkMode } from '../../hooks';

export type TextInputProps = ComponentProps<typeof RNTextInput>;

const _TextInput: ForwardRefRenderFunction<RNTextInput, TextInputProps> = (
	{ style, ...props },
	ref
) => {
	const { backgroundColor, isDark, textColor } = useIsDarkMode();
	return (
		<RNTextInput
			ref={ref}
			style={[
				{
					color: textColor,
					borderColor: isDark ? Colors.white : Colors.grey800,
				},
				styles.textInput,
				style,
			]}
			placeholderTextColor={textColor}
			{...props}
		/>
	);
};
export const TextInput = forwardRef(_TextInput);
const styles = StyleSheet.create({
	textInput: { borderWidth: 1, borderRadius: 5 },
});
