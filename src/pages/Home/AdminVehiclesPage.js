/* eslint-disable */
import {View, Text, Image, ScrollView, TouchableOpacity, Keyboard} from 'react-native'
import {Menu, Button, AnimatedFAB, TextInput} from 'react-native-paper'
import React,{useContext,useRef,useState,useEffect} from 'react'
import CarImage from '../../assets/CarImage.png'
import MotorcycleImage from '../../assets/MotorcycleImage.png'
import {getDatabase, ref, get, child, push, remove, update} from 'firebase/database'
import app from '../../config'
import BottomSheet from '@gorhom/bottom-sheet'
import {ScrollView as ScrollViewRNGH} from 'react-native-gesture-handler'
import ArrowLeft from '../../assets/ArrowLeft.png'
import BackendDataContext from '../../contexts/backendDataContext'

const db = getDatabase(app)
const dbRef = ref(db)

const EditVehicleSheet = ({vehicleData, setSelectedVehicle, updateData, deleteData}) => {
    //name, power, seats (for type 'Car'), engine
    const [vehicleName, setVehicleName] = useState('')
    const [vehiclePower, setVehiclePower] = useState('')
    const [vehicleSeats, setVehicleSeats] = useState('')
    const [vehicleEngine, setVehicleEngine] = useState('')
    const [vehicleType, setVehicleType] = useState('Motorcycle')
    const [vehicleRentPrice, setVehicleRentPrice] = useState('')
    const [vehiclePlateNumber, setVehiclePlateNumber] = useState('')
    const [vehicleDriverPrice, setVehicleDriverPrice] = useState('')

    const [menuVisible, setMenuVisible] = useState(false)
    const [bottomBarDisplay, setBottomBarDisplay] = useState(null)

    useEffect(() => {
        console.log(vehicleData)

        setVehicleName(vehicleData?.name)
        setVehiclePower(vehicleData?.power)
        setVehicleSeats(vehicleData?.seats)
        setVehicleEngine(vehicleData?.engineCC)
        setVehicleType(vehicleData?.type)
        setVehicleRentPrice(vehicleData?.rentPrice)
        setVehiclePlateNumber(vehicleData?.plateNumber)
        setVehicleDriverPrice(vehicleData?.driverPrice)
    }, [vehicleData])

    useEffect(() => {
        const hideActionBar = () => setBottomBarDisplay('none')
        const showActionBar = () => setBottomBarDisplay(null)

        const didShowListener = Keyboard.addListener('keyboardDidShow', hideActionBar)
        const didHideListener = Keyboard.addListener('keyboardDidHide', showActionBar)

        return () => {
            didShowListener.remove()
            didHideListener.remove()
        }
    }, [])

    const buttonHandler = async (actionType) => {
        switch (actionType) {
            case 'save': {
                if (vehicleName.length < 1) return alert('Please enter a vehicle name')
                if (vehiclePower.length < 1 || vehiclePower.match(/[^0-9]/g)) return alert('Please enter a valid power')
                if (vehicleType === 'Car' && vehicleSeats.length < 1 || vehicleSeats.match(/[^0-9]/g)) return alert('Please enter a valid number of seats')
                if (vehicleEngine.length < 1 || vehicleEngine.match(/[^0-9]/g)) return alert('Please enter a valid engine CC')
                if (vehicleRentPrice.length < 1 || vehicleRentPrice.match(/[^0-9]/g)) return alert('Please enter a valid rent price')
                if (vehiclePlateNumber.length < 1) return alert('Please enter a plate number')
                if (vehicleDriverPrice.length < 1 || vehicleDriverPrice.match(/[^0-9]/g)) return alert('Please enter a valid driver price')

                const vehicleId = vehicleData.id
                setSelectedVehicle(null)

                await updateData({
                    id: vehicleId,
                    name: vehicleName,
                    power: vehiclePower,
                    seats: vehicleSeats,
                    engineCC: vehicleEngine,
                    type: vehicleType,
                    rentPrice: vehicleRentPrice,
                    plateNumber: vehiclePlateNumber.toUpperCase(),
                    driverPrice: vehicleDriverPrice,
                })
                break
            }
            case 'delete': {
                const vehicleDataClone = {...vehicleData}
                const vehicleId = vehicleData.id
                setSelectedVehicle(null)

                await deleteData(vehicleDataClone)
                break
            }
            default: {
                setSelectedVehicle(null)

                break
            }
        }
    }

    return (
        <>
            <ScrollViewRNGH style={{
                flex: 1,
                paddingHorizontal: 25,
            }}>
                <View style={{height: 15}}></View>

                <Menu
                    visible={menuVisible}
                    anchor={
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: 5,
                            borderWidth: 1,
                            padding: 10,
                            paddingVertical: 20,
                            borderColor: '#3a21d4',
                        }} onPress={() => setMenuVisible(!menuVisible)}>
                            <Text style={{flex: 1}}>{vehicleType}</Text>
                            <Image source={ArrowLeft} style={{
                                resizeMode: 'contain',
                                width: 12,
                                tintColor: '#3a21d4',
                                transform: [{rotate: '-90deg'}]
                            }}/>
                        </TouchableOpacity>
                    }
                >
                    <Menu.Item onPress={() => {
                        setVehicleType('Car');
                        setMenuVisible(false)
                    }} title="Car"/>
                    <Menu.Item onPress={() => {
                        setVehicleType('Motorcycle');
                        setMenuVisible(false)
                    }} title="Motorcycle"/>
                </Menu>

                <View style={{height: 15}}></View>

                <TextInput
                    mode='outlined'
                    placeholder='Avanza'
                    label='Vehicle Name'
                    outlineColor='#3a21d4'
                    value={vehicleName}
                    onChangeText={(text) => setVehicleName(text)}
                    error={vehicleName === ''}
                />

                <View style={{height: 15}}></View>

                <TextInput
                    mode='outlined'
                    placeholder='100'
                    label='Power'
                    outlineColor='#3a21d4'
                    value={vehiclePower}
                    //only accept numbers
                    keyboardType='numeric'
                    onChangeText={(text) => setVehiclePower(text)}
                    error={vehiclePower === ''}
                />

                <View style={{height: 15}}></View>

                <TextInput
                    mode='outlined'
                    placeholder='4'
                    label='Seats'
                    outlineColor='#3a21d4'
                    value={vehicleSeats}
                    //only accept numbers
                    keyboardType='numeric'
                    onChangeText={(text) => setVehicleSeats(text)}
                    error={vehicleSeats === ''}
                    //only show if vehicleType is 'Car'
                    style={{display: vehicleType === 'Car' ? null : 'none'}}
                />

                <View style={{height: 15}}></View>

                <TextInput
                    mode='outlined'
                    placeholder='1500'
                    label='Engine CC'
                    outlineColor='#3a21d4'
                    value={vehicleEngine}
                    //only accept numbers
                    keyboardType='numeric'
                    onChangeText={(text) => setVehicleEngine(text)}
                    error={vehicleEngine === ''}
                />

                <View style={{height: 15}}></View>

                <TextInput
                    mode='outlined'
                    placeholder='Rp. 100000'
                    label='Rent Price'
                    outlineColor='#3a21d4'
                    value={vehicleRentPrice}
                    //only accept numbers
                    keyboardType='numeric'
                    onChangeText={(text) => setVehicleRentPrice(text)}
                    error={vehicleRentPrice === ''}
                />

                <View style={{height: 15}}></View>

                <TextInput
                    mode='outlined'
                    placeholder='DB ABC123'
                    label='Plate Number'
                    outlineColor='#3a21d4'
                    value={vehiclePlateNumber}
                    //only accept numbers
                    keyboardType='numeric'
                    onChangeText={(text) => setVehiclePlateNumber(text)}
                    error={vehiclePlateNumber === ''}
                />

                <View style={{height: 15}}></View>

                <TextInput
                    mode='outlined'
                    placeholder='Rp. 50000'
                    label='Driver Price'
                    outlineColor='#3a21d4'
                    value={vehicleDriverPrice}
                    onChangeText={(text) => setVehicleDriverPrice(text)}
                    error={vehicleDriverPrice === ''}
                />

                <View style={{height: 15}}></View>

            </ScrollViewRNGH>
            <View style={{
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                backgroundColor: 'rgba(0, 0, 0, 0.125)',
                display: bottomBarDisplay
            }}>
                <View style={{flexDirection: 'row', marginTop: 15}}>
                    <Button mode='contained' onPress={() => buttonHandler('delete')}
                            style={{flex: 1, marginHorizontal: 35, paddingVertical: 5}} color='red'>
                        Delete
                    </Button>
                    <Button mode='contained' onPress={() => buttonHandler('save')}
                            style={{flex: 1, marginHorizontal: 35, paddingVertical: 5}}>
                        Save Edit
                    </Button>
                </View>
                <Button mode='outlined' onPress={() => buttonHandler('cancel')}
                        style={{paddingVertical: 5, marginHorizontal: 35, marginVertical: 15, borderWidth: 3}}
                        color='black'>
                    Cancel
                </Button>
            </View>
        </>
    )
}

const AdminVehiclesPage = ({navigation}) => {
    const [vehiclesList, setVehiclesList] = useState([])
    const bottomSheetRef = useRef(null)
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState(null)
    const backendDataContext = useContext(BackendDataContext)

    const fetchData = async () => {
        try {
            const vehicles = (await get(child(dbRef, 'vehicles'))).val()

            if (vehicles === null)
                return setVehiclesList([])

            setVehiclesList(Object.keys(vehicles).reduce((acc, key) => {
                if(vehicles[key].status === 'deleted')
                    return acc

                acc.push({...vehicles[key]})

                return acc
            }, []))
        } catch (err) {
            alert("Failed Fetching Data: " + err.message)
        }
    }

    const updateData = async (selectedVehicleData) => {
        try {
            const updatedData = await update(child(dbRef, `vehicles/${selectedVehicleData.id}`), {
                ...selectedVehicleData
            })

            fetchData()
        } catch (err) {
            alert("Failed Updating Data: " + err.message)
        }
    }

    const deleteData = async (selectedVehicleData) => {
        try {
            // const deletedData = await remove(child(dbRef, `vehicles/${selectedVehicleId}`))
            const deletedData = await update(child(dbRef, `vehicles/${selectedVehicleData.id}`), {
                ...selectedVehicleData,
                status: 'deleted',
            })

            fetchData()
        } catch (err) {
            alert("Failed Deleting Data: " + err.message)
        }
    }

    useEffect(() => {
        bottomSheetVisible ? bottomSheetRef?.current?.expand() : bottomSheetRef?.current?.close()

        const timeout = setInterval(() => !bottomSheetVisible && bottomSheetRef?.current?.close(), 1000)

        return () => clearInterval(timeout)
    }, [bottomSheetVisible])

    useEffect(() => {
        selectedVehicle !== null ? setBottomSheetVisible(true) : setBottomSheetVisible(false)
    }, [selectedVehicle])

    useEffect(() => {
        fetchData()

        bottomSheetRef?.current?.close()
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => fetchData())

        return unsubscribe
    }, [navigation])

    return (
        <>
            <View style={{height: 80, backgroundColor: '#3a21d4', elevation: 16}}>
                <View style={{height: 20}}></View>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{color: 'white', marginLeft: 25}}>Select Type</Text>
                </View>
            </View>
            <ScrollView>
                {
                    vehiclesList.map((el, idx) => (
                      el.rentalInfo.id == backendDataContext.backendData.id ?
                        <TouchableOpacity
                            key={idx}
                            style={{
                                backgroundColor: 'white',
                                elevation: 10,
                                borderRadius: 15,
                                marginHorizontal: 25,
                                marginTop: 35,
                                padding: 10,
                            }}
                            onPress={() => {
                                setSelectedVehicle(el)
                            }}
                        >
                            <Text style={{textAlign: 'center', fontWeight: 'bold'}}>{el.name}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 1, justifyContent: 'space-around', marginRight: 25}}>
                                    {
                                        [
                                            {
                                                name: 'Power',
                                                value: el?.power,
                                            },
                                            {
                                                name: 'Capacity',
                                                value: el?.seats,
                                            },
                                            {
                                                name: 'Engine',
                                                value: el?.engineCC,
                                            },
                                            {
                                                name: 'Rent Price',
                                                value: `Rp. ${el.rentPrice}`
                                            },
                                            {
                                                name: 'Plate Number',
                                                value: el?.plateNumber,
                                            },
                                            {
                                                name: 'Driver Rent Price',
                                                value: `Rp. ${el?.driverPrice}`
                                            },
                                        ].map((item, idx) => (
                                            <View
                                                key={idx}
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    display: item.name === 'Capacity' && el.type === 'Motorcycle' ? 'none' : null,
                                                }}
                                            >
                                                <Text style={{color: 'black'}}>{item.name}</Text>
                                                <Text style={{color: 'black'}}>:</Text>
                                              <Text style={{color: 'black'}}>{item.value}</Text>
                                            </View>
                                        ))
                                    }
                                </View>
                                <View style={{flex: 0.5}}>
                                    <Image source={{uri:`data:image/png;base64,${el?.vehicleImage}`}}
                                           style={{flex: 1, width: null, height: 100, resizeMode: 'contain'}}/>
                                </View>
                            </View>
                        </TouchableOpacity> : null
                    ))
                }
                <View style={{height: 50}}></View>
            </ScrollView>
            <AnimatedFAB
                extended={true}
                onPress={() => navigation.navigate('AdminAddVehicle')}
                label='Add Vehicle'
                icon='plus'
                style={{
                    bottom: 25,
                    right: 25,
                    position: 'absolute',
                }}
                animateFrom='right'
            />

            <View
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: bottomSheetVisible ? null : 'none',
                }}
                // pointerEvents='none'
            >
            </View>

            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={bottomSheetVisible ? ['60%'] : ['1%']}
                enableHandlePanningGesture={false}
                handleComponent={() => <View></View>}
            >
                <EditVehicleSheet vehicleData={selectedVehicle} {...{setSelectedVehicle, updateData, deleteData}}/>
            </BottomSheet>
        </>
    )
}

export default AdminVehiclesPage
