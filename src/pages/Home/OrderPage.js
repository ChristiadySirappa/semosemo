/* eslint-disable */
import {View, Text, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import {ScrollView} from 'react-native-gesture-handler'
import {getDatabase, ref, get, child, remove, update} from 'firebase/database'
import app from '../../config'
import CarImage from '../../assets/CarImage.png'
import MotorcycleImage from '../../assets/MotorcycleImage.png'
import moment from 'moment'
import BackendDataContext from '../../contexts/backendDataContext'

const db = getDatabase(app)
const dbRef = ref(db)

const OrderCard = ({el}) => {
    const [vehicleData, setVehicleData] = React.useState(null)

    React.useEffect(() => {
        get(child(dbRef, 'vehicles/' + el.vehicleId))
            .then(snapshot => {
                if (!snapshot.exists()) return

                setVehicleData(snapshot.val())
            })
    }, [el])

    return (
        <TouchableOpacity style={{
            backgroundColor: 'white',
            borderRadius: 25,
            elevation: 16,
            overflow: 'hidden',
            margin: 25,
        }}>
            <Text style={{fontWeight: 'bold', textAlign: 'center', marginVertical: 10}}>{vehicleData?.name}</Text>

            <View style={{
                flexDirection: 'row',
                flex: 1,
                marginHorizontal: 15,
            }}>

                <View style={{
                    flex: 1.8,
                    // backgroundColor: 'yellow'
                }}>
                    {
                        //Borrow Date, el.dateAndTime
                        //Return Date, el.dateAndTime + el.duration (in days)
                        //Location, el.location
                        //Rent Price, vehicleData.rentPrice * el.duration
                        //Driver Type, vehicleData.driverType (0 = Without Driver, 1 = With Driver)
                        //Plate Number, vehicleData.plateNumber
                        [
                            {name: 'Borrow Date', value: moment(el?.dateAndTime)?.format('DD-MM-YYYY')},
                            {
                                name: 'Return Date',
                                value: moment(el?.dateAndTime)?.add(el?.duration, 'days')?.format('DD-MM-YYYY')
                            },
                            {name: 'Location', value: el?.location?.length > 15 ? el?.location?.substring(0, 15) + '...' : el?.location},
                            // {name: 'Rent Price', value: 'Rp. ' + vehicleData?.rentPrice * el?.duration},
                            {name: 'Rent Price', value: 'Rp. ' + ((parseInt(vehicleData?.rentPrice) + (el?.driverType === 1 ? parseInt(vehicleData?.driverPrice) : 0)) * el?.duration)},
                            {name: 'Driver Type', value: el?.driverType === 0 ? 'Without Driver' : 'With Driver'},
                            {name: 'Plate Number', value: vehicleData?.plateNumber},
                        ].map((string, idx) =>
                            <View style={{
                                flexDirection: 'row',
                                marginBottom: 10,
                            }}>
                                <Text style={{
                                    flex: 1,
                                }}>
                                    {string.name}
                                </Text>

                                <Text style={{
                                    fontWeight: 'bold',
                                }}>
                                    {string.value}
                                </Text>
                            </View>
                        )
                    }
                </View>

                <View style={{
                    flex: 1,
                    // backgroundColor: 'cyan'
                }}>
                    <Image
                        source={vehicleData?.type === 'Car' ? CarImage : MotorcycleImage}
                        style={{
                            flex: 1,
                            width: null,
                            height: null,
                            resizeMode: 'contain',
                            display: vehicleData?.type ? null : 'none',
                        }}
                    />
                </View>

            </View>
        </TouchableOpacity>
    )
}

const OrderPage = () => {
    const backendDataContext = React.useContext(BackendDataContext)
    const [activeTab, setActiveTab] = React.useState(0)
    const [ordersList, setOrdersList] = React.useState([])

    const getOrders = async () => {
        try {
            const orders = (await get(child(dbRef, 'booking'))).val()

            if (orders === null)
                return setOrdersList([])

            setOrdersList(Object.keys(orders).reduce((acc, key) => {
                if (orders[key].borrowerId === backendDataContext?.backendData?.id) {
                    if (activeTab === 0) //only show orders with 'approved' status
                        orders[key].status === 'approved' && acc.push(orders[key])
                    else if (activeTab === 1) //only show orders with 'completed' status
                        orders[key].status === 'completed' && acc.push(orders[key])
                }

                return acc
            }, []))
        } catch (err) {
            alert("Failed Fetching Data: " + err.message)
        }
    }

    React.useEffect(() => {
        getOrders()
    }, [activeTab])

    React.useEffect(() => {
        console.log(ordersList)
    }, [ordersList])

    return (
        <>
            <View style={{height: 80, backgroundColor: '#3a21d4', elevation: 16}}>
                <View style={{height: 20}}></View>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{color: 'white', marginLeft: 25}}>My Order</Text>
                </View>
            </View>
            <View style={{
                flexDirection: 'row',
                height: 60,
                borderBottomColor: 'rgba(0,0,0,0.15)',
                borderBottomWidth: 2,
                elevation: 16,
                backgroundColor: 'white'
            }}>
                {
                    ['Active', 'Complete'].map((el, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={{
                                backgroundColor: activeTab === idx ? 'rgba(0,0,0,0.125)' : 'white',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 10,
                                borderRadius: 25,
                            }}
                            onPress={() => setActiveTab(idx)}
                        >
                            <Text key={idx} style={{
                                fontWeight: activeTab === idx ? 'bold' : 'normal',
                            }}>
                                {el}
                            </Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
            <ScrollView>
                {
                    ordersList.map(el =>
                        <OrderCard {...{el, key: el.id}} />
                    )
                }
            </ScrollView>
        </>
    )
}

export default OrderPage