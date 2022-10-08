import { View, Text, StyleSheet, Image, StatusBar, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import BottomSheet from '@gorhom/bottom-sheet'
import DatePicker from 'react-native-date-picker'
import BackendDataContext from '../../contexts/backendDataContext'
import moment from 'moment'
import { getDatabase, ref, child, update, get } from 'firebase/database'
import { getAuth, updatePassword, updateEmail } from 'firebase/auth'
import app from '../../config'

const db = getDatabase(app)
const dbRef = ref(db)

const auth = getAuth(app)
const currentUser = auth.currentUser

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
        marginTop: 50,
    },
    textInputWrapper: {
        alignSelf: 'stretch',
        marginBottom: 25,
    },
    buttonText: {
        paddingVertical: 5,
    },
})

const EditProfile = ({navigation}) => {
    const backendDataContext = React.useContext(BackendDataContext)
    const bottomSheetRef = React.useRef(null)
    const snapPoints = React.useMemo(() => ['50%'], [])
    const [datePickerSheetVisible, setDatePickerSheetVisible] = React.useState(-1)
    const [namaLengkap, setNamaLengkap] = React.useState(backendDataContext?.backendData?.fullName)
    const [tanggalLahir, setTanggalLahir] = React.useState(moment(backendDataContext?.backendData?.birthDate)?.toDate())
    const [nomorTelepon, setNomorTelepon] = React.useState(backendDataContext?.backendData?.nomorTelepon)
    const [email, setEmail] = React.useState(backendDataContext?.backendData?.email)
    const [password, setPassword] = React.useState('')

    const updateProfileHandler = () => {
        if(namaLengkap.length < 1) return alert('Name must not be empty')
        if(nomorTelepon.length < 1) return alert('Phone number must not be empty')
        if(email.length < 1) return alert('Email must not be empty')

        update(child(dbRef, `users/${backendDataContext?.backendData?.id}`), {
            fullName: namaLengkap,
            birthDate: tanggalLahir.toISOString(),
            nomorTelepon: nomorTelepon,
            email: email,
        })
        .then(() => {
            // updateEmail(currentUser, email).then(() => {
            //     if(password.length > 0) {
            //         updatePassword(currentUser, password).then(() => {
            //             alert("Profile updated")
            //             navigation.pop()
            //         })
            //     }

            //     alert("Profile updated")
            //     navigation.pop()
            // })

            
            get(child(dbRef, `users/${backendDataContext?.backendData?.id}`))
            .then(snapshot => {
                if(!snapshot.exists()) return alert("Error getting new profile data: Not found!")

                backendDataContext.setBackendData({
                    ...snapshot.val()
                })

                alert("Profile updated")
                navigation.pop()
            })
        })
    }

    return (
    <View style={styles.container}>
        <StatusBar translucent backgroundColor='transparent'/>
        <ScrollView style={{width: '85%'}} contentContainerStyle={{alignItems: 'center'}} showsVerticalScrollIndicator={false}>
            {/* buffer */}
            <View style={{height: 75, justifyContent: 'center'}}>
                <Text style={{fontSize: 18, color: 'white'}}>SEMO SEMO</Text>
            </View>

            {/* horizontal layout */}
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 50,}}>
                <TouchableOpacity onPress={() => navigation.pop()} style={{flex:1}} activeOpacity={0.8}>
                    <Image source={require('../../assets/ArrowLeft.png')}/>
                </TouchableOpacity>
                <View style={{flex:2}}>
                    <Text style={{fontSize: 32, color: 'white'}}>Edit Profile</Text>
                </View>
                <View style={{flex:1}}></View>
            </View>

            {/* main form */}
            {/*
            <View style={{
                backgroundColor: 'red',
                paddingVertical: 25,
                alignItems: 'center',
            }}>
                <View style={{
                    borderRadius: 100,
                    borderStyle: 'dashed',
                    borderWidth: 2,
                    overflow: 'hidden',
                    marginBottom: 10,
                }}>
                    <View style={{
                        width: 100,
                        height: 100,
                        backgroundColor: 'white',
                    }}>

                    </View>
                </View>

                <Text>Change Picture</Text>
            </View>
            */}
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
            {/* <View style={styles.textInputWrapper}>
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
            </View> */}
            <View style={styles.loginBtn}>
                <Button text='Sign In' bgColor='#FF8A00' onPress={updateProfileHandler}>
                    <Text style={[styles.buttonText, {color: 'white'}]}>Save</Text>
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

export default EditProfile