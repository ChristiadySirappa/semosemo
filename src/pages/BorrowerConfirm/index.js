/* eslint-disable */
import {View, Text, Image, TouchableOpacity} from 'react-native'
import ArrowLeft from '../../assets/ArrowLeft.png'
import React from 'react'
import {ScrollView} from 'react-native-gesture-handler'
import TextInput from '../../components/TextInput'
import CameraIcon from '../../assets/CameraIcon.png'
import Button from '../../components/Button'
import {CommonActions} from '@react-navigation/native'
import ScanKTPContext from '../../contexts/scanKTPContext'
import FastImage from 'react-native-fast-image'
import {getDatabase, ref, set} from 'firebase/database'
import app from '../../config'
import uuid from 'react-native-uuid'

const rnfs = require('react-native-fs')
const db = getDatabase(app)

const BorrowerConfirm = ({navigation, route}) => {
    const scanKTPContext = React.useContext(ScanKTPContext)
    const [fullName, setFullName] = React.useState(route.params?.user?.fullName)
    const [phoneNumber, setPhoneNumber] = React.useState(route.params?.user?.nomorTelepon)
    const [email, setEmail] = React.useState(route.params?.user?.email)
    const [ktpNumber, setKtpNumber] = React.useState('')
    const [bookNowPressed, setBookNowPressed] = React.useState(false)
    // console.log(route?.params?.selectedDateAndTime)

    return (
        <View
            style={{
                flex: 1,
                width: '100%',
                height: '100%',
            }}
        >
            <View
                style={{
                    height: 20,
                    backgroundColor: route?.params?.type === 'car' ? '#2AC6D0' : '#EC3476',
                }}
            >
            </View>
            <View
                style={{
                    height: 60,
                    backgroundColor: route?.params?.type === 'car' ? '#2AC6D0' : '#EC3476',
                    alignItems: 'center',
                    flexDirection: 'row',
                }}
            >
                <TouchableOpacity style={{width: 60, height: 60, resizeMode: 'contain', padding: 20}} onPress={() => {
                    navigation.pop();
                    scanKTPContext.setKTPImageData(null)
                }}>
                    <Image source={ArrowLeft} style={{width: '100%', height: '100%', resizeMode: 'contain'}}/>
                </TouchableOpacity>
                <Text style={{color: 'white', fontSize: 22}}>Contact Details</Text>
            </View>
            <ScrollView style={{
                paddingHorizontal: 25,
            }}>
                <View style={{height: 25}}></View>

                <Text>Full Name as on ID Card (KTP)</Text>
                <TextInput
                    placeholder={'Joko Anwar'}
                    value={fullName}
                    setValue={setFullName}
                    //only accept non-numeric character and length must be at least 1
                    validation={value => value.length > 0 && /^[a-zA-Z ]*$/.test(value)}
                />

                <View style={{height: 25}}/>

                <Text>Phone Number</Text>
                <TextInput
                    placeholder={'0895xxxxxxxxx'}
                    value={phoneNumber}
                    setValue={setPhoneNumber}
                    //only accept numeric character and length must be at least 1
                    validation={value => value.length > 0 && /^[0-9]*$/.test(value)}
                />

                <View style={{height: 25}}/>

                <Text>Email</Text>
                <TextInput
                    placeholder={'jokoanwar@gmail.com'}
                    value={email}
                    setValue={setEmail}
                    //only accept non-numeric character and format must be 'x@x.x'
                    validation={value => value.length > 0 && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)}
                />

                <View style={{height: 25}}/>

                <View style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 10,
                    padding: 15,
                }}>
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <Text style={{flex: 1, color: 'black', fontWeight: 'bold', fontSize: 18}}>Upload ID Card</Text>
                        <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>KTP</Text>
                    </View>

                    <View style={{height: 25}}/>

                    <Text>ID Card Number (KTP)</Text>
                    <TextInput
                        placeholder={'710xxxxxxxxxxxxxx'}
                        value={ktpNumber}
                        setValue={setKtpNumber}
                        //only accept numeric character and length must be at least 1
                        validation={value => value.length > 0 && /^[0-9]*$/.test(value)}
                    />

                    <View style={{height: 25}}/>
                    <Text>Upload ID Card (KTP)</Text>

                    <View style={{height: 25}}/>
                    <TouchableOpacity style={{
                        borderRadius: 10,
                        borderColor: '#FF8A00',
                        borderWidth: 2,
                        height: 150,
                    }}
                                      onPress={() => navigation.navigate('ScanKTP')}
                    >
                        {
                            scanKTPContext?.ktpImageData == null ?
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Image source={CameraIcon}/>
                                </View> :
                                <FastImage
                                    source={scanKTPContext?.ktpImageData == null ? null : {uri: `file://${scanKTPContext?.ktpImageData?.path}`}}
                                    style={{flex: 1}}
                                />
                        }
                    </TouchableOpacity>
                </View>

                <View style={{height: 25}}/>
            </ScrollView>

            <Button bgColor='#FF8A00' onPress={async () => {
                try {
                    if (fullName.length < 1) return alert("Full Name is required")
                    if (phoneNumber.length < 1) return alert("Phone Number is required")
                    if (email.length < 1) return alert("Email is required")
                    if (ktpNumber.length < 1) return alert("KTP Number is required")
                    if (ktpNumber.length > 0 && !/^[0-9]*$/.test(ktpNumber)) return alert("KTP Number must be numeric")
                    if (scanKTPContext?.ktpImageData == null) return alert("KTP Image is required")

                    setBookNowPressed(true)

                    const imageData = await rnfs.readFile(scanKTPContext?.ktpImageData?.path, 'base64')
                    const ktpImageId = uuid.v4()

                    await set(ref(db, `ktpImage/${ktpImageId}`), {
                        id: ktpImageId,
                        data: `data:image/jpg;base64,${imageData}`,
                    })

                    const id = uuid.v4()

                    await set(ref(db, `booking/${id}`), {
                        id,
                        ktpImageId,
                        borrowerId: route?.params?.user?.id,
                        vehicleId: route?.params?.vehicle?.id,
                        fullName,
                        phoneNumber,
                        email,
                        ktpNumber,
                        driverType: route?.params?.selectedDriverType,
                        location: route?.params?.selectedLocation,
                        dateAndTime: route?.params?.selectedDateAndTime.toISOString(),
                        duration: route?.params?.selectedDuration,
                        status: 'unapproved',
                    })

                    navigation.dispatch(state => {
                        const routes = state.routes.slice(0, -2)
                        scanKTPContext?.setKTPImageData(null)
                        setBookNowPressed(false)

                        return CommonActions.reset({
                            ...state,
                            index: routes.length,
                            routes: [...routes, {name: 'BookSuccess'}],
                        })
                    })
                } catch (err) {
                    alert("Booking error: " + err.message)
                    setBookNowPressed(false)
                    throw err
                }
            }}>
                <Text style={{marginVertical: 15, color: 'white', fontWeight: 'bold'}}>Book Now</Text>
            </Button>

            <View style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                justifyContent: 'center',
                alignItems: 'center',
                display: bookNowPressed ? null : 'none',
            }}>
                <Text style={{fontWeight: 'bold', color: 'white', marginBottom: 100, fontSize: 22}}>Uploading...</Text>
                <Text style={{fontWeight: 'bold', color: 'white', fontSize: 22}}>Don't press the back button</Text>
            </View>
        </View>
    )
}

export default BorrowerConfirm