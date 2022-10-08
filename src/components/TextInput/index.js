/* eslint-disable */
import {View, Text, TextInput as Input, StyleSheet} from 'react-native'
import React from 'react'
import {useState} from 'react'

const styles = StyleSheet.create({
    inputField: {
        borderBottomWidth: 1,
    }
})

const TextInput = ({placeholder, value, setValue, validation, filter, isPassword, isWhite}) => {
    const [isValid, setIsValid] = useState('')
    const [borderStyle, setBorderStyle] = useState({borderBottomWidth: 1})

    const onChangeHandler = ({nativeEvent: {text: e}}) => {
        if (!validation) validation = e => ''
        if (!filter) filter = e => e

        const error = validation(e)
        setIsValid(error)

        error ? setBorderStyle({
            borderBottomWidth: 1,
            borderBottomColor: 'red'
        }) : setBorderStyle({borderBottomWidth: 1})
        setValue(filter(e))
    }

    return (
        <View style={[styles.inputField, {borderBottomColor: isWhite ? 'white' : 'black'}, borderStyle]}>
            <Input style={{marginBottom: -10, color: isWhite ? 'white' : 'black'}}
                   placeholder={placeholder}
                   placeholderTextColor={isWhite ? 'white' : 'black'}
                   value={value}
                   onChange={onChangeHandler}
                   secureTextEntry={isPassword}
                   onFocus={e => isValid ? setBorderStyle({
                       borderBottomWidth: 1,
                       borderBottomColor: 'red'
                   }) : setBorderStyle({borderBottomWidth: 1})}
                   onBlur={e => isValid ? setBorderStyle({
                       borderBottomWidth: 1,
                       borderBottomColor: 'red'
                   }) : setBorderStyle({borderBottomWidth: 1})}
            />
        </View>
    )
}

export default TextInput