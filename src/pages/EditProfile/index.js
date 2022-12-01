import React,{useContext,useRef,useMemo,useState} from 'react'
import { View, Text, StyleSheet, Image, StatusBar, ScrollView, TouchableOpacity } from 'react-native'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import BottomSheet from '@gorhom/bottom-sheet'
import DatePicker from 'react-native-date-picker'
import BackendDataContext from '../../contexts/backendDataContext'
import moment from 'moment'
import { getDatabase, ref, child, update, get } from 'firebase/database'
import { getAuth, updatePassword, updateEmail } from 'firebase/auth'
import app from '../../config'
import {launchImageLibrary} from 'react-native-image-picker';

const db = getDatabase(app)
const dbRef = ref(db)

const EditProfile = ({navigation}) => {
    const backendDataContext = useContext(BackendDataContext)
    const bottomSheetRef = useRef(null)
    const snapPoints = useMemo(() => ['50%'], [])
    const [datePickerSheetVisible, setDatePickerSheetVisible] = useState(-1)
    const [namaLengkap, setNamaLengkap] = useState(backendDataContext?.backendData?.fullName)
    const [tanggalLahir, setTanggalLahir] = useState(moment(backendDataContext?.backendData?.birthDate)?.toDate())
    const [nomorTelepon, setNomorTelepon] = useState(backendDataContext?.backendData?.nomorTelepon)
    const [email, setEmail] = useState(backendDataContext?.backendData?.email)
    const [password, setPassword] = useState('')
    const [photo,setPhoto] = useState('')
    const [hasPhoto, setHasPhoto] = useState(false)
    const [photoBase64,setPhotoBase64] = useState('')

    const imageGallery = ()=>{
      const options={
        maxHeight:400,
        maxWidth:400,
        includeBase64:true,
      }
      launchImageLibrary(options,res=>{
        if(res.didCancel){
          setHasPhoto(false)
          setPhoto('');
          setPhotoBase64('');
        }else{
          setPhoto(res.assets[0].uri);
          setPhotoBase64(res.assets[0].base64);
          setHasPhoto(true);
          // console.log(photoBase64);
          update(child(dbRef, `users/${backendDataContext.backendData.id}`), {
              image:res.assets[0].base64,
          })
          .then(() => {
              get(child(dbRef, `users/${backendDataContext.backendData.id}`))
              .then(snapshot => {
                  if(!snapshot.exists()) return alert("Error getting new profile data: Not found!")

                  backendDataContext.setBackendData({
                      ...snapshot.val()
                  })
                  // setHasPhoto(false)
                  // setPhoto('');
                  // setPhotoBase64('');
                  alert("Profile updated")
                  navigation.pop()
              })
          })
        }
      })
    }

    const updateProfileHandler = () => {
        if(namaLengkap.length < 1) return alert('Name must not be empty')
        if(nomorTelepon.length < 1) return alert('Phone number must not be empty')
        if(email.length < 1) return alert('Email must not be empty')

        update(child(dbRef, `users/${backendDataContext.backendData.id}`), {
            fullName: namaLengkap,
            birthDate: tanggalLahir.toISOString(),
            nomorTelepon,
            email,
        })
        .then(() => {
            get(child(dbRef, `users/${backendDataContext.backendData.id}`))
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

    // console.log(backendDataContext.backendData);

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

            <View style={{borderBottomColor: 'black',borderBottomWidth: 1, opacity: 0.2, marginBottom: 12 }}/>
              <TouchableOpacity style={{marginTop:30}} onPress={imageGallery} activeOpacity={0.5}>
                {backendDataContext.backendData.image !== "" || hasPhoto==true  ?
                  <Image source={{uri: `data:image/png;base64,${backendDataContext.backendData.image}`}} style={styles.avatar} />
                 : <View style={styles.addPhoto}>
                   <Text style={styles.addPhotoText}>Add Photo</Text>
                 </View>}
              </TouchableOpacity>

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
            <View style={styles.loginBtn}>
                <Button text='Sign In' bgColor='#FF8A00' onPress={updateProfileHandler}>
                    <Text style={[styles.buttonText, {color: 'white'}]}>Save</Text>
                </Button>
            </View>
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
    avatar: {
      height: 130,
      width: 130,
      borderRadius: 130,
    },
    image:{
      width:100,
      height:100,
      borderRadius:35
    },
    containerImage:{
      alignItems:'center',
      justifyContent:'center'
    },
    ImageStyle: {
      padding: 10,
      marginTop: 40,
      marginBottom: 35,
      height: 130,
      width: 130,
      borderRadius:43.5,
      resizeMode: 'stretch',
      alignItems: 'center',
    },
    addPhoto: {
      height: 130,
      width: 130,
      backgroundColor: '#E5E5E5',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 130,
    },
    addPhotoText: {
      fontSize: 12,
      fontFamily: 'Inter',
      maxWidth: 40,
      textAlign: 'center',
    },
})

export default EditProfile
