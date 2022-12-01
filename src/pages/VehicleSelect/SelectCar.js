/* eslint-disable */
import {View, Text, Image, TextInput, Touchable, StatusBar} from 'react-native'
import React from 'react'
import ArrowLeft from '../../assets/ArrowLeft.png'
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler'
import {getDatabase, ref, get, child} from 'firebase/database'
import app from '../../config'

const db = getDatabase(app)
const dbRef = ref(db)

const debounce = (func, timeout = 300) => {
    let timer

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), timeout)
    }
}

const SelectCar = ({navigation}) => {
    const [vehiclesList, setVehiclesList] = React.useState([])
    const [searchTextbox, setSearchTextbox] = React.useState('')
    const [proxyVehiclesList, setProxyVehiclesList] = React.useState([])

    React.useEffect(() => {
        try {
            const getVehicles = async () => {
                const vehicles = (await get(child(dbRef, 'vehicles'))).val()

                setVehiclesList(Object.keys(vehicles).reduce((acc, key) => {
                    const el = vehicles[key]
                    el.type === 'Car' && el.status === 'available' && acc.push({...vehicles[key]})

                    return acc
                }, []))

                setProxyVehiclesList(Object.keys(vehicles).reduce((acc, key) => {
                    const el = vehicles[key]
                    el.type === 'Car' && el.status === 'available' && acc.push({...vehicles[key]})

                    return acc
                }, []))
            }

            getVehicles()
        } catch (err) {
            alert('Load data failed: ' + err.message)
        }
    }, [])

    React.useEffect(() => {
        debounce(() =>
            setProxyVehiclesList(vehiclesList.filter(e => searchTextbox.length > 0 ? e?.name?.toLowerCase().includes(searchTextbox?.toLowerCase()) : true))
        )()
    }, [searchTextbox, vehiclesList])

    return (
        <View style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#2AC6D0',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <StatusBar translucent barStyle='dark-content'/>
            <Text style={{textAlign: 'center', fontSize: 18, marginTop: 35, color: 'white'}}>SEMO SEMO</Text>

            <View style={{
                // backgroundColor: 'red',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 25,
            }}>
                <TouchableOpacity style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}
                                  onPress={() => navigation.pop()}>
                    <Image source={ArrowLeft} style={{height: 50, resizeMode: 'contain'}}/>
                </TouchableOpacity>
                <TextInput style={{backgroundColor: 'white', flex: 1, borderRadius: 15, marginRight: 20}}
                           value={searchTextbox} onChangeText={e => setSearchTextbox(e)}/>
            </View>

            <Text style={{textAlign: 'center', fontSize: 24, marginVertical: 50, color: 'white'}}>Find your perfect
                car!</Text>

              <ScrollView style={{backgroundColor: 'white', borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
                <View style={{height: 25,width:380}}></View>
                {proxyVehiclesList.map(el => (
                    <TouchableOpacity
                        key={el.id}
                        style={{
                            marginHorizontal: 20,
                            marginVertical: 15,
                            backgroundColor: '#2AC6D0',
                            padding: 15,
                            borderRadius: 15,
                            height: 180,
                            alignItems: 'center',
                            justifyContent:'space-between',
                            flexDirection: 'row',
                        }}
                        onPress={() => navigation.navigate('VehicleDetail', {selectedId: el.id, type: el.type})}
                    >
                        <View>
                          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', flex: 1}}>{el?.merek}</Text>
                          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', flex: 1}}>{el.name}</Text>
                          <Text style={{color: 'white', fontSize: 14, fontWeight: 'bold', flex: 1}}>Tahun {el?.year}</Text>
                          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', flex: 1}}>{el.power} CC</Text>
                          <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold', flex: 1}}>{el.rentalInfo?.fullName}</Text>
                          <Text style={{color: 'white', fontSize: 14, fontWeight: 'bold', flex: 1}}>Harga {el?.rentPrice}</Text>
                        </View>
                        <Image source={{uri:`data:image/png;base64,${el.vehicleImage}`}} style={{resizeMode: 'contain', width: 100,height:100,borderRadius: 20}}/>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

export default SelectCar
