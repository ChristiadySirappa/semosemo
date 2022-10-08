import { View, Text, StyleSheet, Image, StatusBar, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import BottomSheet from '@gorhom/bottom-sheet'
import DatePicker from 'react-native-date-picker'
import app from '../../config'
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'
import {getDatabase, ref, set} from 'firebase/database'

const auth = getAuth(app)
const db = getDatabase(app)

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3A21D4'
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
    },
    textInputWrapper: {
        alignSelf: 'stretch',
        marginBottom: 10,
    },
    buttonText: {
        paddingVertical: 5,
    }
})

const SignUp = ({navigation}) => {
    const bottomSheetRef = React.useRef(null)
    const snapPoints = React.useMemo(() => ['50%'], [])
    const [datePickerSheetVisible, setDatePickerSheetVisible] = React.useState(-1)
    const [namaLengkap, setNamaLengkap] = React.useState('')
    const [tanggalLahir, setTanggalLahir] = React.useState('')
    const [nomorTelepon, setNomorTelepon] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    const createAccountHandler = async() => {
        try {
            //check if all fields is valid
            if(
                //empty
                namaLengkap.length < 1 || 
                //contain non-alphabetical character (except spaces)
                !namaLengkap.match(/^[a-zA-Z ]+$/)
            ) {
                alert('Nama lengkap tidak valid')
                return
            }

            if(
                //empty
                tanggalLahir === ''
            ) {
                alert('Tanggal lahir tidak valid')
                return
            }

            if(
                //empty
                nomorTelepon.length < 1 || 
                //contain non-numeric character
                !nomorTelepon.match(/^[0-9]+$/)
            ) {
                alert('Nomor telepon tidak valid')
                return
            }

            if(
                //empty
                email.length < 1 ||
                //not in the format of xx@xx.xx
                !email.match(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/)

            ) {
                alert('Email tidak valid')
                return
            }

            if(
                //empty
                password.length < 1
            ) {
                alert('Password tidak valid')
                return
            }

            //create account
            const userCred = await createUserWithEmailAndPassword(auth, email, password)

            if(!userCred) {
                alert('Gagal membuat akun')
                return
            }

            await set(ref(db, 'users/' + userCred.user.uid), {
                id: userCred.user.uid,
                email: userCred.user.email,
                fullName: namaLengkap,
                birthDate: tanggalLahir.toISOString(),
                nomorTelepon: nomorTelepon,
                userType: 'user',
            })

            alert("Akun berhasil dibuat")
            navigation.goBack()
            
            //clear all forms
            setNamaLengkap('')
            setTanggalLahir('')
            setNomorTelepon('')
            setEmail('')
            setPassword('')
        } catch (err) {
            alert(err)
        }
    }

    return (
    <View style={styles.container}>
        <StatusBar translucent backgroundColor='transparent'/>
        <ScrollView style={{width: '85%'}} contentContainerStyle={{alignItems: 'center'}} showsVerticalScrollIndicator={false}>
            {/* buffer */}
            <View style={{height: 75}}></View>

            {/* horizontal layout */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => navigation.pop()} style={{flex:1}} activeOpacity={0.8}>
                    <Image source={require('../../assets/ArrowLeft.png')}/>
                </TouchableOpacity>
                <View style={{flex:2}}>
                    <Text style={{fontSize: 32, color: 'white'}}>Registration</Text>
                </View>
                <View style={{flex:1}}></View>
            </View>

            {/* main form */}
            <View style={styles.textInputWrapper}>
                <TextInput  placeholder='Name'
                            value={namaLengkap}
                            setValue={setNamaLengkap}
                            //validation if the input is empty
                            validation={e => e.length === 0 ? 'Nama tidak boleh kosong' : ''}
                            isWhite
                />
            </View>
            <View style={styles.textInputWrapper}>
                <TouchableOpacity 
                    style={{borderBottomColor: 'white', borderBottomWidth: 1, flexDirection: 'row', marginTop: 20, alignItems: 'center', paddingBottom: 10}}
                    onPress={() => bottomSheetRef?.current?.expand()}>
                    <Text style={{color: 'white', flex: 1}}>{tanggalLahir ? tanggalLahir.toString().substring(4,16) : 'Tanggal Lahir'}</Text>
                    <Image source={require('../../assets/ArrowDownOrange.png')}/>
                </TouchableOpacity>
            </View>
            <View style={styles.textInputWrapper}>
                <TextInput  placeholder='Phone Number'
                            value={nomorTelepon}
                            setValue={setNomorTelepon}
                            //filter for non numeric character
                            filter={e => e.replace(/[^0-9]/g, '')}
                            //validation if the input is empty
                            validation={e => e.length === 0 ? 'Nomor Telepon tidak boleh kosong' : ''}
                            isWhite
                />
            </View>
            <View style={styles.textInputWrapper}>
                <TextInput  placeholder='Email'
                            value={email}
                            setValue={setEmail}
                            //validation if the input is empty
                            validation={e => e.length === 0 ? 'Email tidak boleh kosong' : ''}
                            isWhite
                />
            </View>
            <View style={styles.textInputWrapper}>
                <TextInput  placeholder='Password'
                            value={password}
                            setValue={setPassword}
                            isPassword={true}
                            //validation if the input is empty
                            validation={e => e.length === 0 ? 'Password tidak boleh kosong' : ''}
                            isWhite
                /> 
            </View>
            <View style={styles.loginBtn}>
                <Button text='Sign In' bgColor='#FF8A00' onPress={createAccountHandler}>
                    <Text style={[styles.buttonText, {color: 'white'}]}>Register</Text>
                </Button>
            </View>
            {/* <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 250, height: 30}}>
                <View style={{height: 1, backgroundColor: 'rgba(255,255,255,0.5)', flex: 1, marginHorizontal: 10}}><Text>a</Text></View>
                <Text style={{color: 'white'}}>Or With</Text>
                <View style={{height: 1, backgroundColor: 'rgba(255,255,255,0.5)', flex: 1, marginHorizontal: 10}}><Text>a</Text></View>
            </View>
            <View style={[styles.loginBtn, {marginBottom: 15}]}>
                <Button text='Sign Up with Google' bgColor='white' borderStyle={{color: '#FF8A00', width: 2}} onPress={() => alert("duarr")}>
                    <Text style={[styles.buttonText, {color: 'black'}]}>Register with Google</Text>
                </Button>
            </View> */}
        </ScrollView>
        <BottomSheet    ref={bottomSheetRef}
                        index={datePickerSheetVisible}
                        snapPoints={snapPoints}
                        onChange={e => console.log(e)}
                        enableHandlePanningGesture={false}
                        handleComponent={() => <View></View>}
        >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <DatePicker date={tanggalLahir === '' ? new Date() : tanggalLahir} onDateChange={setTanggalLahir} mode='date'/>
                <Button bgColor='#FF8A00' onPress={() => bottomSheetRef?.current?.close()}>
                    <Text style={[styles.buttonText, {color: 'white'}]}>Accept</Text>
                </Button>
            </View>
        </BottomSheet>
    </View>
    )
}

export default SignUp