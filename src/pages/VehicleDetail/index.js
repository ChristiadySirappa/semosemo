/* eslint-disable */
import {View, Text, Image, TextInput, StatusBar, TouchableOpacity} from 'react-native'
import React, {useEffect} from 'react'
import ArrowLeft from '../../assets/ArrowLeft.png'
import CalendarIcon from '../../assets/CalendarIcon.png'
import TimeIcon from '../../assets/TimeIcon.png'
import DurationIcon from '../../assets/DurationIcon.png'
import CarImage from '../../assets/CarImage.png'
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet'
import Button from '../../components/Button'
import SearchIcon from '../../assets/SearchIcon.png'
import MapNeedleIcon from '../../assets/MapNeedleIcon.png'
import {ScrollView} from 'react-native-gesture-handler'
import CalendarPicker from 'react-native-calendar-picker'
import DatePicker from 'react-native-date-picker'
import ScrollPicker from 'react-native-wheel-scrollview-picker'
import {ScrollView as ScrollViewRNGH} from 'react-native-gesture-handler'
import MotorcycleImage from '../../assets/MotorcycleImage.png'
import ArrowRightWhiteCircle from '../../assets/ArrowRightWhiteCircle.png'
import {getDatabase, ref, get, child} from 'firebase/database'
import moment from 'moment'
import app from '../../config'
import BackendDataContext from '../../contexts/backendDataContext'
import GlobalsContext from '../../contexts/globalsContext'
import popularLocation from './popularLocation'

const db = getDatabase(app)
const dbRef = ref(db)

const LocationSheet = ({selectedLocation, setSelectedLocation, confirmHandler, route, navigation}) => {
    return (
        <>
            <View style={{flex: 1}}>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 22,
                    marginTop: 25,
                    marginLeft: 15,
                    color: 'black',
                }}>Choose Pick Up Location</Text>

                {/*<View style={{*/}
                {/*    borderRadius: 15,*/}
                {/*    backgroundColor: 'rgba(0, 0, 0, 0.05)',*/}
                {/*    marginHorizontal: 10,*/}
                {/*    flexDirection: 'row',*/}
                {/*    alignItems: 'center',*/}
                {/*    marginTop: 15,*/}
                {/*}}>*/}
                {/*    <TextInput*/}
                {/*        style={{*/}
                {/*            flex: 1,*/}
                {/*            marginLeft: 15*/}
                {/*        }}*/}
                {/*    />*/}
                {/*    <TouchableOpacity*/}
                {/*        style={{*/}
                {/*            paddingHorizontal: 25,*/}
                {/*            height: 47,*/}
                {/*            justifyContent: 'center',*/}
                {/*            // backgroundColor: 'red'*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <Image source={SearchIcon}/>*/}
                {/*    </TouchableOpacity>*/}
                {/*</View>*/}

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingRight: 25,
                    paddingLeft: 15,
                }}>
                    <Image source={MapNeedleIcon} style={{margin: 10,}}/>
                    <View style={{flex: 1}}>
                        <Text>Your Location</Text>
                        <Text style={{
                            color: 'black',
                            fontSize: 18,
                            fontWeight: 'bold'
                        }}>{selectedLocation !== undefined ? selectedLocation?.name : 'Please select a location'}</Text>
                    </View>
                    <Button borderStyle={{color: 'rgba(0,0,0,0.1)', width: 1, radius: 15}}
                            onPress={() => navigation.navigate('LocationSelect', {type: route?.params?.type})}>
                        <Text style={{
                            padding: 10,
                            paddingHorizontal: 15,
                            color: route.params.type === 'Car' ? '#2AC6D0' : '#EC3476'
                        }}>Change</Text>
                    </Button>
                </View>

                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    marginVertical: 15,
                    marginLeft: 15,
                    color: 'black',
                }}>Popular Location</Text>

                <ScrollView>
                    {
                        popularLocation.map((el, idx) => (
                            <View key={idx} style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingRight: 25,
                                paddingLeft: 15,
                            }}>
                                <Image source={MapNeedleIcon} style={{margin: 10,}}/>
                                <Text
                                    style={{color: 'black', fontSize: 18, flex: 1}}
                                >
                                    {el.name}
                                </Text>
                                <Button borderStyle={{color: 'rgba(0,0,0,0.1)', width: 1, radius: 15}}
                                        onPress={() => setSelectedLocation({
                                            location: el.geometry.location,
                                            name: el.name
                                        })}>
                                    <Text style={{
                                        padding: 10,
                                        paddingHorizontal: 15,
                                        color: route.params.type === 'Car' ? '#2AC6D0' : '#EC3476'
                                    }}>Choose</Text>
                                </Button>
                            </View>
                        ))
                    }
                </ScrollView>

                <View style={{alignItems: 'center'}}>
                    <Button onPress={confirmHandler} bgColor={route.params.type === 'Car' ? '#2AC6D0' : '#EC3476'}>
                        <Text style={{
                            padding: 10,
                            color: 'white',
                            paddingHorizontal: 50,
                            fontSize: 18,
                            fontWeight: 'bold'
                        }}>Confirm</Text>
                    </Button>
                </View>
            </View>
        </>
    )
}

const DateSheet = ({selectedDate, setSelectedDate, confirmHandler, route}) => {
    return (
        <>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <CalendarPicker
                    selectedStartDate={selectedDate.toDate()}
                    onDateChange={date => setSelectedDate(moment(date))}
                />
                <View style={{alignItems: 'center'}}>
                    <Button onPress={confirmHandler} bgColor={route.params.type === 'Car' ? '#2AC6D0' : '#EC3476'}>
                        <Text style={{
                            padding: 10,
                            color: 'white',
                            paddingHorizontal: 50,
                            fontSize: 18,
                            fontWeight: 'bold'
                        }}>Confirm</Text>
                    </Button>
                </View>
            </View>
        </>
    )
}

const TimeSheet = ({selectedTime, setSelectedTime, confirmHandler, route}) => {
    return (
        <>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <DatePicker date={selectedTime.toDate()} onDateChange={date => setSelectedTime(moment(date))}
                            mode='time'/>
                <View style={{alignItems: 'center'}}>
                    <Button onPress={confirmHandler} bgColor={route.params.type === 'Car' ? '#2AC6D0' : '#EC3476'}>
                        <Text style={{
                            padding: 10,
                            color: 'white',
                            paddingHorizontal: 50,
                            fontSize: 18,
                            fontWeight: 'bold'
                        }}>Confirm</Text>
                    </Button>
                </View>
            </View>
        </>
    )
}

const DurationSheet = ({selectedDuration, setSelectedDuration, confirmHandler, route}) => {
    return (
        <>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ScrollPicker
                    dataSource={[[1, '1 Day'], [2, '2 Day'], [3, '3 Day'], [3, ''], [3, '']]}
                    renderItem={(data, idx) => (
                        <Text key={idx} style={{fontSize: 28, marginHorizontal: 50,}}>{data[1]}</Text>
                    )}
                    selectedIndex={selectedDuration - 1}
                    wrapperHeight={180}
                    wrapperWidth={150}
                    wrapperColor='#FFFFFF'
                    itemHeight={60}
                    // highlightColor='#d8d8d8'
                    highlightColor='#ffffff'
                    highlightBorderWidth={0}
                    scrollViewComponent={ScrollViewRNGH}
                    onValueChange={data => setSelectedDuration(data[0])}
                />
                <View style={{alignItems: 'center'}}>
                    <Button onPress={confirmHandler} bgColor={route.params.type === 'Car' ? '#2AC6D0' : '#EC3476'}>
                        <Text style={{
                            padding: 10,
                            color: 'white',
                            paddingHorizontal: 50,
                            fontSize: 18,
                            fontWeight: 'bold'
                        }}>Confirm</Text>
                    </Button>
                </View>
            </View>
        </>
    )
}

const ConfirmationSheet = ({
                               selectedLocation,
                               selectedDate,
                               selectedTime,
                               selectedDuration,
                               selectedDriverType,
                               confirmHandler,
                               route,
                               vehicleData
                           }) => {
    return (
        <>
            <View style={{
                flex: 1,
                paddingHorizontal: 25,
            }}>
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
                        flex: 1,
                        justifyContent: 'center'
                    }}>
                        <Image source={route.params.type === 'Car' ? CarImage : MotorcycleImage}
                               style={{resizeMode: 'contain', height: '100%', width: '100%'}}/>
                    </View>

                    <View style={{
                        // backgroundColor: 'cyan',
                        flex: 1.5,
                    }}>
                        <Text style={{
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: 22
                        }}>{vehicleData?.name ? vehicleData.name : "Vehicle Name"}</Text>

                        <Text style={{fontSize: 16}}>
                            {selectedDriverType === 0 ? "Without Driver" : "With Driver"}
                        </Text>

                        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                            <Image source={MapNeedleIcon} style={{resizeMode: 'contain', width: 25, marginRight: 5}}/>
                            <Text style={{fontSize: 16}}>
                                {selectedLocation?.name.length > 19 ? selectedLocation?.name.slice(0, 19) + '...' : selectedLocation?.name}
                            </Text>
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={CalendarIcon}
                                       style={{resizeMode: 'contain', width: 17, tintColor: 'black', marginRight: 5}}/>
                                <Text style={{fontSize: 14}}>
                                    {selectedDate?.format('YYYY/MM/DD')}
                                </Text>
                            </View>

                            <View style={{width: 10}}></View>

                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={TimeIcon}
                                       style={{resizeMode: 'contain', width: 17, tintColor: 'black', marginRight: 5}}/>
                                <Text style={{fontSize: 14}}>
                                    {selectedTime?.format('HH:mm')} WITA
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{
                    backgroundColor: route.params.type === 'Car' ? '#2AC6D0' : '#EC3476',
                    height: 62.5,
                    marginVertical: 10,
                    borderRadius: 10,
                    flexDirection: 'row'
                }}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: 'white'}}>
                            Pick-up
                        </Text>
                        <Text style={{color: 'white'}}>
                            {selectedDate?.date()}
                        </Text>
                        <Text style={{color: 'white'}}>
                            {selectedDate?.format('dddd')} | {selectedDate?.format('MMMM')}
                        </Text>
                    </View>
                    <View style={{backgroundColor: 'white', width: 2, justifyContent: 'center'}}>
                        <Image source={ArrowRightWhiteCircle}
                               style={{marginLeft: -11.5, width: 25, resizeMode: 'contain'}}/>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: 'white'}}>
                            Drop-off
                        </Text>
                        <Text style={{color: 'white'}}>
                            {selectedDate?.clone().add(selectedDuration, 'days').date()}
                        </Text>
                        <Text style={{color: 'white'}}>
                            {selectedDate?.clone().add(selectedDuration, 'days').format('dddd')} | {selectedDate?.clone().add(selectedDuration, 'days').format('MMMM')}
                        </Text>
                    </View>
                </View>

                <View style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.125)',
                    height: 180,
                    borderRadius: 10,
                    padding: 10,
                }}>
                    {
                        (() => {
                            const FONT_SIZE = 18
                            return (
                                <>
                                    <View style={{flex: 1, justifyContent: 'space-evenly'}}>
                                        <Text style={{fontSize: FONT_SIZE, color: 'black'}}>
                                            {vehicleData?.name ? vehicleData.name : "Vehicle Name"}
                                        </Text>

                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={{flex: 1, fontSize: FONT_SIZE, color: 'black'}}>
                                                {selectedDuration} day
                                            </Text>
                                            <Text style={{fontSize: FONT_SIZE, color: 'black'}}>
                                                Rp. {selectedDuration * vehicleData?.rentPrice}
                                            </Text>
                                        </View>

                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={{flex: 1, fontSize: FONT_SIZE, color: 'black'}}>
                                                {selectedDriverType === 0 ? "Without Driver" : `With Driver (x ${selectedDuration} day${selectedDuration > 1 ? 's' : ''})`}
                                            </Text>
                                            <Text style={{fontSize: FONT_SIZE, color: 'black'}}>
                                                Rp. {selectedDriverType === 0 ? 0 : (vehicleData?.driverPrice * selectedDuration)}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={{height: 50, justifyContent: 'space-evenly'}}>
                                        <View style={{height: 2, backgroundColor: 'black'}}>

                                        </View>

                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={{
                                                flex: 1,
                                                fontSize: FONT_SIZE,
                                                color: 'black',
                                                fontWeight: 'bold'
                                            }}>
                                                Total Price
                                            </Text>
                                            <Text style={{fontSize: FONT_SIZE, color: 'black', fontWeight: 'bold'}}>
                                                Rp. {(parseInt(vehicleData?.rentPrice) + (selectedDriverType === 0 ? 0 : parseInt(vehicleData?.driverPrice))) * selectedDuration}
                                            </Text>
                                        </View>
                                    </View>
                                </>
                            )
                        })()
                    }
                </View>

                <View style={{
                    //  backgroundColor: 'yellow',
                    flex: 1,
                    flexDirection: 'row',
                    marginVertical: 15,
                }}>
                    <Button overrideStyle={{flex: 1, marginRight: 5}} borderStyle={{
                        color: route.params.type === 'Car' ? '#2AC6D0' : '#EC3476',
                        radius: 15,
                        width: 3
                    }} onPress={() => confirmHandler('edit')}>
                        <Text style={{
                            color: route.params.type === 'Car' ? '#2AC6D0' : '#EC3476',
                            fontSize: 22,
                            fontWeight: 'bold'
                        }}>Edit</Text>
                    </Button>
                    <Button overrideStyle={{flex: 1}} bgColor={route.params.type === 'Car' ? '#2AC6D0' : '#EC3476'}
                            borderStyle={{radius: 15}} onPress={() => confirmHandler('confirm')}>
                        <Text style={{color: 'white', fontSize: 22, fontWeight: 'bold'}}>Next</Text>
                    </Button>
                </View>
            </View>
        </>
    )
}

const DriverTypeSheet = ({selectedDriverType, setSelectedDriverType, confirmHandler, route}) => {
    return (
        <>
            <View style={{flex: 1}}>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 22,
                    marginTop: 25,
                    marginLeft: 15,
                    color: 'black',
                }}>Choose Driver Type</Text>

                <ScrollView>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            paddingRight: 25,
                            paddingLeft: 15,
                            backgroundColor: 'rgba(0, 0, 0, 0.03)',
                            margin: 10,
                            paddingVertical: 15,
                            borderRadius: 20,
                        }}
                        onPress={() => setSelectedDriverType(0)}
                    >
                        <Text style={{
                            color: 'black', fontSize: 18, flex: 1
                        }}>
                            Without Driver
                        </Text>
                        <Text style={{
                            color: 'rgba(0, 0, 0, 0.5)', fontSize: 18
                        }}>
                            {selectedDriverType === 0 ? "Selected" : ""}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            paddingRight: 25,
                            paddingLeft: 15,
                            backgroundColor: 'rgba(0, 0, 0, 0.03)',
                            margin: 10,
                            paddingVertical: 15,
                            borderRadius: 20,
                        }}
                        onPress={() => setSelectedDriverType(1)}
                    >
                        <Text style={{
                            color: 'black', fontSize: 18, flex: 1
                        }}>
                            With Driver
                        </Text>
                        <Text style={{
                            color: 'rgba(0, 0, 0, 0.5)', fontSize: 18
                        }}>
                            {selectedDriverType === 1 ? "Selected" : ""}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>

                <View style={{alignItems: 'center'}}>
                    <Button onPress={confirmHandler} bgColor={route.params.type === 'Car' ? '#2AC6D0' : '#EC3476'}>
                        <Text style={{
                            padding: 10,
                            color: 'white',
                            paddingHorizontal: 50,
                            fontSize: 18,
                            fontWeight: 'bold'
                        }}>Confirm</Text>
                    </Button>
                </View>
            </View>
        </>
    )
}

const VehicleDetail = ({navigation, route}) => {
    const backendDataContext = React.useContext(BackendDataContext)
    const globalsDataContext = React.useContext(GlobalsContext)
    const [selectedLocation, setSelectedLocation] = React.useState(globalsDataContext?.globalsData?.selectedPickUpLocation)
    const [selectedDate, setSelectedDate] = React.useState(moment())
    const [selectedTime, setSelectedTime] = React.useState(moment())
    const [selectedDuration, setSelectedDuration] = React.useState(1)
    const [selectedDriverType, setSelectedDriverType] = React.useState(0) // 0 = without driver, 1 = with driver

    const bottomSheetRef = React.useRef(null)
    const snapPoints = React.useMemo(() => ({
        '': ['1%'],
        'location': ['80%'],
        'date': ['55%'],
        'time': ['40%'],
        'duration': ['40%'],
        'confirmation': ['70%'],
        'driverType': ['40%'],
    }), [])
    const [bottomSheetVisible, setBottomSheetVisible] = React.useState(-1)
    const [bottomSheetContent, setBottomSheetContent] = React.useState('')

    const [vehicleData, setVehicleData] = React.useState({})

    const triggerBottomSheet = (content) => setBottomSheetContent(content)

    useEffect(() => {
        // console.log(bottomSheetRef?.current)
        // console.log(bottomSheetContent)
        if (bottomSheetContent !== '')
            bottomSheetRef.current.expand()
        else {
            bottomSheetRef.current.close()

            const timeout = setTimeout(() => bottomSheetContent === '' && bottomSheetRef.current.close(), 300)

            return () => clearTimeout(timeout)
        }
    }, [bottomSheetContent])

    useEffect(() => {
        const interval = setInterval(() => {
            if (bottomSheetContent !== '')
                bottomSheetRef.current.expand()
        }, 300)

        return () => clearInterval(interval)
    }, [bottomSheetContent, bottomSheetRef])

    useEffect(() => {
        try {
            console.log(route.params)

            const getVehicleDetail = async () => {
                const data = (await get(child(dbRef, 'vehicles/' + route.params.selectedId))).val()
                console.log(data)

                setVehicleData(data)
            }

            getVehicleDetail()
        } catch (err) {
            alert("Fetch data failed: " + err.message)
        }
    }, [])

    useEffect(() => {
        setSelectedLocation(globalsDataContext?.globalsData?.selectedPickUpLocation)
        console.log(globalsDataContext?.globalsData?.selectedPickUpLocation)
    }, [globalsDataContext?.globalsData?.selectedPickUpLocation])

    return (
        <View style={{
            width: '100%',
            height: '100%',
            backgroundColor: route.params.type === 'Car' ? '#2AC6D0' : '#EC3476',
            aligmItems: 'center',
        }}>
            <StatusBar translucent barStyle='dark-content'/>
            <ScrollView style={{flex: 1}}>
                <Text style={{textAlign: 'center', fontSize: 18, marginTop: 35, color: 'white'}}>SEMO SEMO</Text>

                <View style={{
                    // backgroundColor: 'red',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 100
                }}>
                    <TouchableOpacity style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}
                                      onPress={() => navigation.pop()}>
                        <Image source={ArrowLeft} style={{height: 50, resizeMode: 'contain'}}/>
                    </TouchableOpacity>
                    <View style={{flex: 1, borderRadius: 15, marginRight: 20}}/>
                </View>

                {/* <View style={{flex: 1}}></View> */}

                <View style={{
                    backgroundColor: 'white',
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50, /*height: route.params.type === 'Car' ? 475 : 488.75*/
                }}>
                    <Image
                        source={route.params.type === 'Car' ? CarImage : MotorcycleImage}
                        style={{
                            marginTop: -70,
                            alignSelf: 'center',
                            width: route.params.type === 'Car' ? 400 : 300,
                            resizeMode: 'contain'
                        }}
                    />

                    <Text style={{
                        marginLeft: 25,
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: 'black'
                    }}>{vehicleData?.name ? vehicleData.name : "Vehicle Name"}</Text>
                    <View style={{
                        borderRadius: 15,
                        marginHorizontal: 25,
                        marginVertical: 15,
                        backgroundColor: route.params.type === 'Car' ? '#2AC6D0' : '#EC3476',
                        padding: 10,
                        flexDirection: 'row',
                    }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                borderRadius: 15,
                                padding: 10,
                                flex: 1
                            }}
                            onPress={() => triggerBottomSheet('location')}
                        >
                            <Text style={{color: 'white', fontSize: 10}}>Pickup Location</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Text style={{
                                    flex: 1,
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>{selectedLocation === undefined ? 'Choose Location' : selectedLocation?.name}</Text>
                                <Image source={ArrowLeft}
                                       style={{transform: [{rotate: '-90deg'}], width: 10, resizeMode: 'contain'}}/>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                borderRadius: 15,
                                padding: 10,
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                marginLeft: 5
                            }}
                            onPress={() => triggerBottomSheet('date')}
                        >
                            <View style={{flex: 1}}>
                                <Text style={{color: 'white', fontSize: 10}}>Pickup Date</Text>
                                <Text style={{
                                    flex: 1,
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>{selectedDate === '' ? 'Choose Date' : selectedDate.format('DD MM YYYY')}</Text>
                            </View>
                            <Image source={CalendarIcon} style={{resizeMode: 'contain'}}/>
                        </TouchableOpacity>
                    </View>

                    <View style={{height: 1, backgroundColor: 'black'}}></View>

                    <View style={{
                        borderRadius: 15,
                        marginHorizontal: 25,
                        marginVertical: 15,
                        backgroundColor: route.params.type === 'Car' ? '#2AC6D0' : '#EC3476',
                        padding: 10,
                        flexDirection: 'row',
                    }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                borderRadius: 15,
                                padding: 10,
                                flex: 1
                            }}
                            onPress={() => triggerBottomSheet('time')}
                        >
                            <Text style={{color: 'white', fontSize: 10}}>Pickup Time</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={TimeIcon} style={{width: 20, resizeMode: 'contain'}}/>
                                <Text style={{
                                    flex: 1,
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>{selectedTime === '' ? 'xx:xx WITA' : selectedTime.format('HH:mm')}</Text>
                                <Image source={ArrowLeft}
                                       style={{transform: [{rotate: '-90deg'}], width: 10, resizeMode: 'contain'}}/>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                borderRadius: 15,
                                padding: 10,
                                flex: 1,
                                marginLeft: 5
                            }}
                            onPress={() => triggerBottomSheet('duration')}
                        >
                            <Text style={{color: 'white', fontSize: 10}}>Duration</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={DurationIcon} style={{width: 20, resizeMode: 'contain'}}/>
                                <Text style={{
                                    flex: 1,
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>{selectedDuration === '' ? 'x Day' : `${selectedDuration} Day`}</Text>
                                <Image source={ArrowLeft}
                                       style={{transform: [{rotate: '-90deg'}], width: 10, resizeMode: 'contain'}}/>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{height: 1, backgroundColor: 'black'}}></View>

                    <View style={{
                        borderRadius: 15,
                        marginHorizontal: 25,
                        marginVertical: 15,
                        backgroundColor: route.params.type === 'Car' ? '#2AC6D0' : '#EC3476',
                        padding: 10,
                        flexDirection: 'row',
                    }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                borderRadius: 15,
                                padding: 10,
                                flex: 1
                            }}
                            onPress={() => triggerBottomSheet('driverType')}
                        >
                            <Text style={{color: 'white', fontSize: 10}}>Driver Type</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {/*<Image source={TimeIcon} style={{width: 20, resizeMode: 'contain'}}/>*/}
                                <Text style={{
                                    flex: 1,
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>{selectedDriverType === 0 ? "Without Driver" : "With Driver"}</Text>
                                <Image source={ArrowLeft}
                                       style={{transform: [{rotate: '-90deg'}], width: 10, resizeMode: 'contain'}}/>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{height: 1, backgroundColor: 'black'}}></View>

                    <Text style={{
                        color: 'black',
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginLeft: 25,
                        marginVertical: 15
                    }}>Specification</Text>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20}}>
                        <View style={{
                            backgroundColor: route.params.type === 'Car' ? '#2AC6D0' : '#EC3476',
                            alignItems: 'center',
                            borderRadius: 15,
                            // width: 100,
                            flex: 1,
                            paddingVertical: 25,
                        }}>
                            <Text style={{color: 'white', fontSize: 22}}>Power</Text>
                            <Text style={{
                                color: 'white',
                                fontSize: 28,
                                fontWeight: 'bold'
                            }}>{vehicleData?.power ? vehicleData.power : 'xxx'}</Text>
                            <Text style={{color: 'white', fontSize: 22}}>HP</Text>
                        </View>
                        <View style={{
                            backgroundColor: '#2AC6D0',
                            alignItems: 'center',
                            borderRadius: 15,
                            // width: 100,
                            flex: 1,
                            display: route.params.type === 'Car' ? null : 'none',
                            paddingVertical: 25,
                            marginLeft: 10,
                        }}>
                            <Text style={{color: 'white', fontSize: 22}}>Capacity</Text>
                            <Text style={{
                                color: 'white',
                                fontSize: 28,
                                fontWeight: 'bold'
                            }}>{vehicleData?.seats ? vehicleData.seats : 'x'}</Text>
                            <Text style={{color: 'white', fontSize: 22}}>Seats</Text>
                        </View>
                        <View style={{
                            backgroundColor: route.params.type === 'Car' ? '#2AC6D0' : '#EC3476',
                            alignItems: 'center',
                            borderRadius: 15,
                            // width: 100,
                            flex: 1,
                            paddingVertical: 25,
                            marginLeft: 10,
                        }}>
                            <Text style={{color: 'white', fontSize: 22}}>Engine</Text>
                            <Text style={{
                                color: 'white',
                                fontSize: 28,
                                fontWeight: 'bold'
                            }}>{vehicleData?.engineCC ? vehicleData.engineCC : 'xxxx'}</Text>
                            <Text style={{color: 'white', fontSize: 22}}>CC</Text>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        paddingHorizontal: 20,
                        marginTop: 10,
                    }}>
                        <View style={{
                            backgroundColor: route.params.type === 'Car' ? '#2AC6D0' : '#EC3476',
                            alignItems: 'center',
                            borderRadius: 15,
                            paddingVertical: 25,
                            flex: 1,
                            justifyContent: 'space-around'
                        }}>
                            <Text style={{color: 'white', fontSize: 22}}>Plate Number</Text>
                            <Text style={{
                                color: 'white',
                                fontSize: 28,
                                fontWeight: 'bold'
                            }}>{vehicleData?.plateNumber}</Text>
                        </View>
                        <View style={{
                            backgroundColor: route.params.type === 'Car' ? '#2AC6D0' : '#EC3476',
                            alignItems: 'center',
                            borderRadius: 15,
                            paddingVertical: 25,
                            flex: 1,
                            marginLeft: 10,
                        }}>
                            <Text style={{color: 'white', fontSize: 22}}>Rent Price</Text>
                            <Text style={{
                                color: 'white',
                                fontSize: 28,
                                fontWeight: 'bold'
                            }}>Rp.{(parseInt(vehicleData?.rentPrice) + (selectedDriverType === 0 ? 0 : parseInt(vehicleData?.driverPrice))) * selectedDuration}</Text>
                            <Text style={{
                                color: 'white',
                                fontSize: 22
                            }}>For {selectedDuration} day{selectedDuration > 1 ? "s" : ""}</Text>
                            <Text style={{
                                color: 'white',
                                fontSize: 22
                            }}>With{selectedDriverType === 0 ? "out" : ""} Driver</Text>
                        </View>
                    </View>

                    <View style={{height: 80}}></View>
                </View>

            </ScrollView>

            <View style={{
                height: 50,
                backgroundColor: 'white',
                justifyContent: 'center',
            }}>
                <TouchableOpacity style={{
                    marginHorizontal: 5,
                    marginVertical: 2,
                    borderRadius: 10,
                    justifyContent: 'center',
                    flex: 1,
                    backgroundColor:
                        selectedLocation === undefined ||
                        selectedDate === '' ||
                        selectedTime === '' ||
                        selectedDuration === '' ?
                            'grey' : route.params.type === 'Car' ? '#2AC6D0' : '#EC3476'
                }} onPress={() => {
                    //validate all inputs
                    if (selectedLocation === undefined) return alert("Please select pickup location")
                    if (selectedDate === '') return alert("Please select pickup date")
                    if (selectedTime === '') return alert("Please select pickup time")
                    if (selectedDuration === '') return alert("Please select duration")

                    triggerBottomSheet('confirmation')
                }}>
                    <Text style={{textAlign: 'center', fontSize: 22, fontWeight: 'bold', color: 'white'}}>Rent
                        Now</Text>
                </TouchableOpacity>
            </View>

            <View
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: bottomSheetContent.length > 0 ? null : 'none',
                }}
                // pointerEvents='none'
            >
            </View>

            <BottomSheet
                ref={bottomSheetRef}
                index={bottomSheetVisible}
                snapPoints={snapPoints[bottomSheetContent]}
                onChange={e => console.log(e)}
                enableHandlePanningGesture={false}
                handleComponent={() => <View></View>}
                enablePanDownToClose={true}
            >
                {
                    (() => {
                        let confirmHandler = () => {
                            bottomSheetRef?.current?.close()
                            setBottomSheetContent('')
                        }

                        if (bottomSheetContent === 'location')
                            return <LocationSheet {...{
                                selectedLocation,
                                setSelectedLocation,
                                confirmHandler,
                                route,
                                navigation
                            }}/>
                        else if (bottomSheetContent === 'date')
                            return <DateSheet {...{selectedDate, setSelectedDate, confirmHandler, route}}/>
                        else if (bottomSheetContent === 'time')
                            return <TimeSheet {...{selectedTime, setSelectedTime, confirmHandler, route}}/>
                        else if (bottomSheetContent === 'duration')
                            return <DurationSheet {...{selectedDuration, setSelectedDuration, confirmHandler, route}}/>
                        else if (bottomSheetContent === 'confirmation') {
                            confirmHandler = (returnType) => {
                                if (returnType === 'edit') {
                                    bottomSheetRef?.current?.close()
                                    setBottomSheetContent('')
                                    return
                                } else if (returnType === 'confirm') {
                                    bottomSheetRef?.current?.close()
                                    setBottomSheetContent('')

                                    let combinedDateAndTime = selectedDate

                                    combinedDateAndTime = combinedDateAndTime
                                        .set('hour', selectedTime.get('hour'))
                                        .set('minute', selectedTime.get('minute'))
                                        .set('second', 0)

                                    navigation.replace('BorrowerConfirm', {
                                        type: route?.params?.type?.toLowerCase(),
                                        vehicle: vehicleData,
                                        user: backendDataContext?.backendData,
                                        selectedLocation: selectedLocation.name,
                                        selectedDateAndTime: combinedDateAndTime.toDate(),
                                        selectedDuration,
                                        selectedDriverType,
                                    })
                                    return
                                }
                            }
                            return <ConfirmationSheet {...{
                                selectedLocation,
                                selectedDate,
                                selectedTime,
                                selectedDuration,
                                selectedDriverType,
                                confirmHandler,
                                route,
                                vehicleData
                            }}/>
                        } else if (bottomSheetContent === 'driverType')
                            return <DriverTypeSheet {...{
                                selectedDriverType,
                                setSelectedDriverType,
                                confirmHandler,
                                route
                            }}/>
                        else
                            return <View><Text>Nothing here</Text></View>
                    })()
                }
            </BottomSheet>
        </View>
    )
}

export default VehicleDetail