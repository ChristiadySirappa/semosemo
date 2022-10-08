import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        paddingVertical: 5,
    }
})

const Button = ({bgColor, onPress, children, borderStyle, overrideStyle}) => {
    return (
        <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: bgColor, borderColor: borderStyle?.color, borderWidth: borderStyle?.width, borderRadius: borderStyle?.radius ? borderStyle?.radius : 5}, overrideStyle]} onPress={onPress}>
            {/* <Text style={[styles.buttonText, {color: textColor}]}>{text}</Text> */}
            {children}
        </TouchableOpacity>
    )
}

export default Button