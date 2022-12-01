/* eslint-disable */
import React, {useState,useRef,useContext,useEffect} from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image,Linking } from 'react-native'
import PersonIcon from '../../assets/PersonIcon.png'
import Call from '../../assets/call.png'
import MapNeedleIcon from '../../assets/MapNeedleIcon.png'
import CalendarIcon from '../../assets/CalendarIcon.png'
import TimeIcon from '../../assets/TimeIcon.png'
import DurationIcon from '../../assets/DurationIcon.png'
import CarImage from '../../assets/CarImage.png'
import MotorcycleImage from '../../assets/MotorcycleImage.png'
import BottomSheet from '@gorhom/bottom-sheet'
import { Button } from 'react-native-paper'
import ButtonCust from '../../components/Button'
import ArrowRightWhiteCircle from '../../assets/ArrowRightWhiteCircle.png'
import {ScrollView as ScrollViewRNGH} from 'react-native-gesture-handler'
import { getDatabase, ref, child, get, update, remove } from 'firebase/database'
import app from '../../config'
import moment from 'moment'
import BackendDataContext from '../../contexts/backendDataContext'

const db = getDatabase(app)
const dbRef = ref(db)

const VehicleDetailSheet = ({navigation,route, selectedOrder, setSelectedOrder, acceptBookingHandler, declineBookingHandler, completeBookingHandler, setBottomSheetVisible}) => {
    const scrollView = useRef(null)
    const [vehicleData, setVehicleData] = useState(null)
    const [imageData, setImageData] = useState('')
    const backendDataContext = useContext(BackendDataContext)

    useEffect(() => {
        if (selectedOrder) {
            console.log(selectedOrder)
            scrollView.current.scrollTo({x: 0, y: 0, animated: true})

            get(child(dbRef, 'vehicles/' + selectedOrder.vehicleId))
                .then(snapshot => {
                    if (!snapshot.exists()) return false

                    const data = snapshot.val()
                    // console.log(data);
                    setVehicleData(data)
                })

            get(child(dbRef, 'ktpImage/' + selectedOrder?.ktpImageId))
                .then(snapshot => {
                    if (!snapshot.exists()) return false

                    const data = snapshot.val()

                    setImageData(data.data)
                })
        }
    }, [selectedOrder])

    // console.log('sadfsd',vehicleData);

    return (
    <>
        <ScrollViewRNGH style={{
            flex: 1,
            paddingHorizontal: 25,
        }} ref={scrollView}>
            <Text style={{
                fontWeight: 'bold',
                fontSize: 28,
                color: 'black',
                marginTop: 10,
            }}>Summary</Text>

            <View style={{
                // backgroundColor: 'red',
                height: 100,
                flexDirection: 'row',
            }}>
                <View style={{
                    // backgroundColor: 'yellow',
                    justifyContent: 'center'
                }}>
                    <Image source={{uri:`data:image/png;base64,${vehicleData?.vehicleImage}`}} style={{resizeMode: 'contain', height: 130, width: 130,marginRight:10}}/>
                </View>

                <View style={{
                    // backgroundColor: 'cyan',
                    flex: 1.5,
                }}>
                    <Text style={{color: 'black', fontWeight: 'bold', fontSize: 22}}>{vehicleData?.name}</Text>
                    <Text style={{color: 'black', fontSize: 16}}>{vehicleData?.driverType === 0 ? "Without Driver" : "With Driver"}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                        <Image source={MapNeedleIcon} style={{resizeMode: 'contain', width: 25, marginRight: 5}}/>
                      <Text style={{fontSize: 16}}>
                            {selectedOrder?.location.length > 19 ? selectedOrder?.location.substring(0, 19) + '...' : selectedOrder?.location}
                        </Text>
                    </View>

                    <View style={{flexDirection: 'row',}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={CalendarIcon} style={{resizeMode: 'contain', width: 17, tintColor: 'black', marginRight: 5}}/>
                            <Text style={{fontSize: 14}}>
                                {moment(selectedOrder?.dateAndTime)?.format('DD-MM-YYYY')}
                            </Text>
                        </View>

                        <View style={{width: 10}}></View>

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={TimeIcon} style={{resizeMode: 'contain', width: 17, tintColor: 'black', marginRight: 5}}/>
                            <Text style={{fontSize: 14}}>
                                {moment(selectedOrder?.dateAndTime)?.format('HH:mm')}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={{marginVertical:20,flexDirection:'row',alignItems:'center',borderStyle:'solid'}} onPress={()=>Linking.openURL(`tel:${vehicleData.rentalInfo.nomorTelepon}`)}>
              <Image source={Call} style={{width: 20, height: 20, marginRight: 10, tintColor: 'rgb(80, 80, 80)'}} />
            <Text style={{color:"#000"}}>{vehicleData?.rentalInfo?.nomorTelepon}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginVertical:20,flexDirection:'row',alignItems:'center',borderStyle:'solid'}} onPress={()=>navigation.navigate('LocationSelect', {locate: selectedOrder?.location})}>
              <Image source={MapNeedleIcon} style={{width: 20, height: 20, marginRight: 10, tintColor: 'rgb(80, 80, 80)'}} />
            <Text style={{color:"#000"}}>{selectedOrder?.location}</Text>
            </TouchableOpacity>

            <View style={{
                backgroundColor: '#3a21d4',
                height: 62.5,
                marginVertical: 10,
                borderRadius: 10,
                flexDirection: 'row'
            }}>
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: 'white'}}>
                        Pick-up
                    </Text>
                    <Text style={{color: 'white'}}>
                        {moment(selectedOrder?.dateAndTime)?.format('Do')}
                    </Text>
                    <Text style={{color: 'white'}}>
                        {moment(selectedOrder?.dateAndTime)?.format('dddd')} | {moment(selectedOrder?.dateAndTime)?.format('YYYY')}
                    </Text>
                </View>
                <View style={{backgroundColor: 'white', width: 2, justifyContent: 'center'}}>
                    <Image source={ArrowRightWhiteCircle} style={{marginLeft: -11.5, width: 25, resizeMode: 'contain'}}/>
                </View>
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: 'white'}}>
                        Drop-off
                    </Text>
                    <Text style={{color: 'white'}}>
                        {moment(selectedOrder?.dateAndTime)?.add(selectedOrder?.duration, 'days')?.format('Do')}
                    </Text>
                    <Text style={{color: 'white'}}>
                        {moment(selectedOrder?.dateAndTime)?.add(selectedOrder?.duration, 'days')?.format('dddd')} | {moment(selectedOrder?.dateAndTime)?.add(selectedOrder?.duration, 'days')?.format('YYYY')}
                    </Text>
                </View>
            </View>

            <View style={{
                backgroundColor: 'rgba(0, 0, 0, 0.125)',
                borderRadius: 10,
                padding: 10,
            }}>
            {
            (() => {
                const FONT_SIZE = 18
                return (
                <>
                    <Text style={{fontSize: FONT_SIZE, color: 'black'}}>
                        {/* Vehicle Name */}
                        {vehicleData?.name} {vehicleData?.plateNumber}
                    </Text>

                    <View style={{flexDirection: 'row'}}>
                        <Text style={{flex: 1, fontSize: FONT_SIZE, color: 'black'}}>
                            {selectedOrder?.duration} day
                        </Text>
                        <Text style={{fontSize: FONT_SIZE, color: 'black'}}>
                            Rp. {vehicleData?.rentPrice * selectedOrder?.duration}
                        </Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <Text style={{flex: 1, fontSize: FONT_SIZE, color: 'black'}}>
                            {selectedOrder?.driverType === 0 ? "Without Driver" : `With Driver (x ${selectedOrder?.duration} day${selectedOrder?.duration > 1 ? 's' : ''})`}
                        </Text>
                        <Text style={{fontSize: FONT_SIZE, color: 'black'}}>
                            Rp. {selectedOrder?.driverType === 0 ? 0 : (vehicleData?.driverPrice * selectedOrder?.duration)}
                        </Text>
                    </View>

                    <View style={{height: 50, justifyContent: 'space-evenly'}}>
                        <View style={{height: 2, backgroundColor: 'black'}}>

                        </View>

                        <View style={{flexDirection: 'row'}}>
                            <Text style={{flex: 1, fontSize: FONT_SIZE, color: 'black', fontWeight: 'bold'}}>
                                Total Price
                            </Text>
                            <Text style={{fontSize: FONT_SIZE, color: 'black', fontWeight: 'bold'}}>
                                Rp. {(parseInt(vehicleData?.rentPrice) + (selectedOrder?.driverType === 0 ? 0 : parseInt(vehicleData?.driverPrice))) * selectedOrder?.duration}
                            </Text>
                        </View>
                    </View>
                </>
                )
            })()
            }
            </View>

            <View style={{
                backgroundColor: '#3a21d4',
                borderRadius: 10,
                padding: 10,
                marginTop: 10,
                marginBottom: 15,
            }}>
                <Text style={{color: 'white', fontSize: 22, fontWeight: 'bold'}}>Borrower</Text>
                <Text style={{color: 'white'}}>{selectedOrder?.fullName}</Text>
                <Text style={{color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 10}}>KTP</Text>
                <View style={{
                    height: 195,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: 'white',
                    overflow: 'hidden'
                }}>
                    <Image source={{uri: imageData!==null||[] ? imageData : ''}} style={{flex: 1, resizeMode: 'contain', width: null}}/>
                </View>
            </View>

            <View style={{
                // backgroundColor: 'yellow',
                flexDirection: 'row',
                justifyContent: 'space-between',
                display: selectedOrder?.status === 'approved' ? 'none' : selectedOrder?.status === 'completed' ? 'none' : null,
                marginBottom: 15,
            }}>
                <ButtonCust bgColor='red' borderStyle={{radius: 15}} onPress={declineBookingHandler}>
                    <Text style={{marginHorizontal: 45, color: 'white', fontSize: 22, fontWeight: 'bold'}}>Decline</Text>
                </ButtonCust>
                <ButtonCust bgColor={'#3a21d4'} borderStyle={{radius: 15}} onPress={acceptBookingHandler}>
                    <Text style={{marginHorizontal: 45, color: 'white', fontSize: 22, fontWeight: 'bold'}}>Accept</Text>
                </ButtonCust>
            </View>
            <View style={{marginBottom: 15, display: selectedOrder?.status === 'approved' ? null : 'none'}}>
                <ButtonCust bgColor='#FF8A00' borderStyle={{radius: 15}} onPress={completeBookingHandler}>
                    <Text style={{marginHorizontal: 55, color: 'white', fontSize: 22, fontWeight: 'bold'}}>Mark as Completed</Text>
                </ButtonCust>
            </View>
            <ButtonCust borderStyle={{radius: 15, color: '#3a21d4', width: 3}} onPress={() => {
                //hack to prevent the hidden button from showing because the selectedOrder is null
                (new Promise(r => setTimeout(() => {
                    setBottomSheetVisible(false)
                    r()
                }, 100))).then(() => {
                    setSelectedOrder(null)
                })
            }}>
                <Text style={{marginHorizontal: 55, color: '#3a21d4', fontSize: 22, fontWeight: 'bold'}}>Back</Text>
            </ButtonCust>

            <View style={{height: 25}}></View>
        </ScrollViewRNGH>
    </>
    )
}

const OrderCard = ({el, setSelectedOrder}) => {
    const [vehicleName, setVehicleName] = React.useState('Vehicle Name')
    const [vehicleType, setVehicleType] = React.useState('Car')
    const backendDataContext = useContext(BackendDataContext)

    // console.log("blablabla",backendDataContext);

    React.useEffect(() => {
        get(child(dbRef, 'vehicles/' + el.vehicleId)).then(snapshot => {
            if (!snapshot.exists()) return false

            const data = snapshot.val()
            // console.log(backendDataContext.backendData.fullName);
            if (data.rentalInfo.fullName!== backendDataContext.backendData.fullName) {
              return false
            }
            setVehicleName(data.name)
            setVehicleType(data.type)
        })
    }, [el])

    return (
    <TouchableOpacity
        style={{
            backgroundColor: 'white',
            elevation: 10,
            borderRadius: 15,
            marginHorizontal: 25,
            marginTop: 35,
            padding: 10,
        }}
        onPress={() => setSelectedOrder(el)}
    >
        <View style={{
            position: 'absolute',
            right: 15,
            top: 15,
            padding: 10,
            paddingHorizontal: 25,
            borderRadius: 15,
            backgroundColor: el.status === 'approved' ? 'rgba(0, 255, 0, 0.5)' : 'rgba(0, 0, 255, 0.5)',
            display: el.status === 'approved' || el.status === 'completed' ? null : 'none',
        }}
        >
            <Text style={{color: el.status === 'approved' ? 'black' : 'white'}}>{el.status === 'approved' ? 'Active' : 'Completed'}</Text>
        </View>
        <Text style={{textAlign: 'center', fontWeight: 'bold'}}>{vehicleName}</Text>
        <View style={{flexDirection: 'row'}}>
            <View>
            {
                [
                    {
                      icon: PersonIcon,
                      value: el?.fullName
                    },
                    {
                      icon: MapNeedleIcon,
                      value: el?.location
                    },
                    {
                      icon: CalendarIcon,
                      value: moment(el?.dateAndTime)?.format('DD MMM YYYY')
                    },
                    {
                      icon: TimeIcon,
                      value: moment(el?.dateAndTime)?.format('HH:mm')
                    },
                    {
                      icon: DurationIcon,
                      value: `${el?.duration} Day${el?.duration > 1 ? 's' : ''}`
                    },
                    {
                      icon: Call,
                      value: el?.phoneNumber,
                      label:"phoneNumber"
                    },

                ].map((item, idx) => (

                    <View
                        key={idx}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: 5,
                        }}
                    >
                        <Image source={item.icon} style={{width: 20, height: 20, marginRight: 10, tintColor: 'rgb(80, 80, 80)'}} />
                      {item.label === "phoneNumber" ? <TouchableOpacity onPress={()=>Linking.openURL(`tel:${item.value}`)}>
                        <Text style={{color: 'black'}}>Call</Text>
                      </TouchableOpacity> : <Text style={{color: 'black'}}>{item.value}</Text>}
                    </View>
                ))
            }
            </View>
            <View style={{flex: 1}}>
                <Image source={{uri:`data:image/png;base64,${el.image}`}} style={{flex: 1, width: null, resizeMode: 'contain'}}/>
            </View>
        </View>
    </TouchableOpacity>
    )
}

const AdminHomePage = ({navigation, route}) => {
    const bottomSheetRef = React.useRef(null)
    const [bottomSheetVisible, setBottomSheetVisible] = React.useState(false)
    const [ordersList, setOrdersList] = React.useState([])
    const [selectedOrder, setSelectedOrder] = React.useState(null)
    const backendDataContext = useContext(BackendDataContext)

    React.useEffect(() => {
        if(bottomSheetVisible) bottomSheetRef?.current?.expand()
        else bottomSheetRef?.current?.close()

        const timeout = setTimeout(() => !bottomSheetVisible && bottomSheetRef?.current?.close(), 300)

        return () => clearTimeout(timeout)
    }, [bottomSheetVisible])

    React.useEffect(() => {
        if(!selectedOrder) return setBottomSheetVisible(false)

        setBottomSheetVisible(true)
    }, [selectedOrder])

    const fetchData = async () => {
        try {
            const orders = (await get(child(dbRef, 'booking'))).val()

            if(orders === null)
                return setOrdersList([])

            setOrdersList(Object.keys(orders).reduce((acc, key) => {
                acc.push({...orders[key]})

                return acc
            }, []))
        } catch (err) {
            return alert("Failed Fetching Data: " + err.message)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const acceptBookingHandler = () => {
        if(!selectedOrder) return

        update(child(dbRef, `booking/${selectedOrder.id}`), {
            ...selectedOrder,
            status: 'approved'
        })
        .then(() => {
            get(child(dbRef, `vehicles/${selectedOrder.vehicleId}`))
                .then(snapshot => {
                    if(!snapshot) return

                    const data = snapshot.val()

                    update(child(dbRef, `vehicles/${data.id}`), {
                        ...data,
                        status: 'occupied'
                    })
                    .then(() => {
                        setSelectedOrder(null)
                        fetchData()
                    })
                })
        })
    }

    const declineBookingHandler = () => {
        if(!selectedOrder) return

        remove(child(dbRef, `booking/${selectedOrder.id}`))
            .then(() => {
                setSelectedOrder(null)
                fetchData()
            })
    }

    const completeBookingHandler = () => {
        if(!selectedOrder) return

        update(child(dbRef, `booking/${selectedOrder.id}`), {
            ...selectedOrder,
            status: 'completed'
        })
        .then(() => {
            get(child(dbRef, `vehicles/${selectedOrder.vehicleId}`))
                .then(snapshot => {
                    if(!snapshot) return

                    const data = snapshot.val()

                    update(child(dbRef, `vehicles/${data.id}`), {
                        ...data,
                        status: 'available'
                    })
                    .then(() => {
                        setSelectedOrder(null)
                        fetchData()
                    })
                })
        })
    }

  return (
    <>
    <View style={{height: 80, backgroundColor: '#3a21d4', elevation: 16}}>
      <View style={{height: 20}}></View>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{color: 'white', textAlign: 'center', fontSize: 18}}>SEMO SEMO</Text>
      </View>
    </View>
    <ScrollView style={{marginTop: 25}}>
        <Text style={{fontSize: 28, marginTop: 5, marginBottom: 25, color: 'black', textAlign: 'center'}}>
            List of Order
        </Text>

        {
            ordersList.map((el, idx) => (
              el.rentalId == backendDataContext.backendData.id ?
              <OrderCard {...{el, key: el.id, setSelectedOrder}}/> : null
            ))
        }
        <View style={{height: 50}}></View>
    </ScrollView>

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
        snapPoints={bottomSheetVisible ? ['80%'] : ['1%']}
        onChange={e => console.log(e)}
        enableHandlePanningGesture={false}
        handleComponent={() => <View></View>}
    >
        <VehicleDetailSheet {...{navigation,route, selectedOrder, setSelectedOrder, acceptBookingHandler, declineBookingHandler, completeBookingHandler, setBottomSheetVisible}}/>
    </BottomSheet>
    </>
  )
}

export default AdminHomePage
