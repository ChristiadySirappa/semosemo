/* eslint-disable */
import { View, Text, StyleSheet, ImageBackground, StatusBar, ScrollView } from 'react-native'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import app from '../../config'
import React from 'react'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import BackendDataContext from '../../contexts/backendDataContext'
import { CommonActions } from '@react-navigation/native'
import {getDatabase, ref, get, child} from 'firebase/database'

const auth = getAuth(app)
const db = getDatabase(app)

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue'
    },
    background: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginCard: {
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 20,
        alignItems: 'center'
    },
    loginBtn: {
        width: 250,
        marginBottom: 15,
    },
    textInputWrapper: {
        alignSelf: 'stretch',
        marginBottom: 10,
    },
    buttonText: {
        paddingVertical: 5,
    }
})

const SignIn = ({navigation}) => {
    const backendData = React.useContext(BackendDataContext)
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    const loginHandler = async () => {
        try {
            if(email.length < 1) {
                alert("Email tidak boleh kosong!")
                return
            }

            if(password.length < 1) {
                alert("Password tidak boleh kosong!")
                return
            }

            const loginCred = await signInWithEmailAndPassword(auth, email, password)

            if(!loginCred) {
                alert("Login failed!")
                return
            }

            console.log("Login success!")

            const user = await get(child(ref(db), `users/${loginCred.user.uid}`))

            if(!user) {
                alert("User not found!")
                return
            }

            if(!user.exists()) {
                alert("User not found!")
                return
            }

            console.log("User found!")

            console.log(JSON.stringify(user.val()))
            backendData.setBackendData(user.val())

            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'Home' }
                    ]
                })
            )
        } catch (err) {
            if(err.name === 'FirebaseError') {
                // alert(JSON.stringify(err))

                if(err.code === 'auth/too-many-requests')
                    alert("Too many failed logins!")
                else
                    alert("Email/Password incorrect!")

                return
            }

            alert(`${err.name} : ${err.message}`)
        }
    }

    return (
    <View style={styles.container}>
        <StatusBar translucent backgroundColor='transparent'/>
        <ImageBackground source={require('../../assets/SplashScreen.jpg')} resizeMode="cover" style={styles.background}>
            <ScrollView style={{width: '100%'}} contentContainerStyle={{alignItems: 'center'}}>
                <View style={{height: 150}}></View>
                <View style={styles.loginCard}>
                    <Text style={{fontSize: 32, color: 'black', marginBottom: 15}}>Vehicle Rent</Text>
                    <Text style={{fontSize: 32, color: 'black', marginBottom: 100}}>LOG IN</Text>
                    <View style={styles.textInputWrapper}>
                        <TextInput  placeholder='E-mail'
                                    value={email}
                                    setValue={setEmail}
                                    //filter for non alphabetical character (except @ and .)
                                    filter={e => e.replace(/[^a-zA-Z0-9@.]/g, '')}
                                    //validation if the input is empty
                                    validation={e => e.length === 0 ? 'Nomor Telepon tidak boleh kosong' : ''}
                        />
                    </View>
                    <View style={styles.textInputWrapper}>
                        <TextInput  placeholder='Password'
                                    value={password}
                                    setValue={setPassword}
                                    isPassword={true}
                                    //validation if the input is empty
                                    validation={e => e.length === 0 ? 'Password tidak boleh kosong' : ''}
                        />
                    </View>
                    <View style={styles.loginBtn}>
                        <Button text='Sign In' bgColor='#FF8A00' textColor='white' onPress={loginHandler}>
                            <Text style={[styles.buttonText, {color: 'white'}]}>Sign In</Text>
                        </Button>
                    </View>
                    <Text style={{color: 'black'}}>Don't have an account yet? <Text style={{fontWeight: 'bold', color: '#FF8A00'}} onPress={() => navigation.navigate('SignUp')}>Register</Text></Text>
                </View>
            </ScrollView>
        </ImageBackground>
    </View>
    )
}

export default SignIn
