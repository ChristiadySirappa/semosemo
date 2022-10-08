import { View, Image, StyleSheet, Text, ImageBackground, StatusBar } from 'react-native'
import React from 'react'
import { useEffect } from 'react'

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green'
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
    }
})

const SplashScreen = ({navigation}) => {
    useEffect(() => {
        setTimeout(() => navigation.replace('SignIn'), 2000)
    }, [])

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor='transparent'/>
            {/* <Image source={require('../../assets/SplashScreen.jpg')}/> */}
            <ImageBackground source={require('../../assets/SplashScreen.jpg')} resizeMode="cover" style={styles.background}>
            </ImageBackground>
        </View>
    )
}

export default SplashScreen