/* eslint-disable */
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native'
import {TextInput, Menu, Button, Portal, Modal} from 'react-native-paper'
import React from 'react'
import ArrowLeft from '../../assets/ArrowLeft.png'
import {getDatabase, ref, set} from 'firebase/database'
import app from '../../config'
import uuid from 'react-native-uuid'

const db = getDatabase(app)

const AdminAddVehicle = ({navigation, route}) => {
    const [vehicleName, setVehicleName] = React.useState('')
    const [power, setPower] = React.useState('')
    const [seats, setSeats] = React.useState('')
    const [engineCC, setEngineCC] = React.useState('')
    const [rentPrice, setRentPrice] = React.useState('')
    const [plateNumber, setPlateNumber] = React.useState('')
    const [driverPrice, setDriverPrice] = React.useState('')

    const [vehicleTypeMenuVisible, setVehicleTypeMenuVisible] = React.useState(false)
    const [vehicleType, setVehicleType] = React.useState('Car')

    const [confirmModalVisible, setConfirmModalVisible] = React.useState(false)

    const addVehicleHandler = async () => {
        try {
            if (vehicleName.length < 1) return alert('Please enter a vehicle name')
            if (power.length < 1 || !power.match(/^[0-9]+$/)) return alert('Please enter a valid power')
            if (vehicleType === 'Car' && (seats.length < 1 || !seats.match(/^[0-9]+$/))) return alert('Please enter a valid number of seats')
            if (engineCC.length < 1 || !engineCC.match(/^[0-9]+$/)) return alert('Please enter a valid engine CC')
            if (rentPrice.length < 1 || !rentPrice.match(/^[0-9]+$/)) return alert('Please enter a valid rent price')
            if (plateNumber.length < 1) return alert('Please enter a plate number')
            if (driverPrice.length < 1 || !driverPrice.match(/^[0-9]+$/)) return alert('Please enter a valid driver price')

            const id = uuid.v4()

            await set(ref(db, `vehicles/${id}`), {
                name: vehicleName,
                power: power,
                seats: seats,
                engineCC: engineCC,
                type: vehicleType,
                rentPrice: rentPrice,
                id: id,
                plateNumber: plateNumber.toUpperCase(),
                driverPrice: driverPrice,
                status: 'available',
            })

            setConfirmModalVisible(true)

            setVehicleName('')
            setPower('')
            setSeats('')
            setEngineCC('')
            setVehicleType('Car')
            setRentPrice('')
            setPlateNumber('')
            setDriverPrice('')
        } catch (err) {
            alert(`${err.name} : ${err.message}`)
        }
    }

    return (
        <View style={{
            width: '100%',
            height: '100%',
        }}>
            <View style={{height: 20, backgroundColor: '#3a21d4'}}></View>
            <View style={{
                height: 60,
                backgroundColor: '#3a21d4',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <TouchableOpacity style={{width: 50, paddingVertical: 20}} onPress={() => navigation.pop()}>
                    <Image source={ArrowLeft} style={{resizeMode: 'contain', width: null, flex: 1}}/>
                </TouchableOpacity>
                <Text style={{color: 'white'}}>Add new vehicle</Text>
            </View>

            <ScrollView style={{
                paddingHorizontal: 25,
                flex: 1,
            }}>
                <Portal>
                    <Modal
                        visible={confirmModalVisible}
                        contentContainerStyle={{
                            backgroundColor: 'white',
                            marginHorizontal: 25,
                            padding: 15,
                            borderRadius: 25,
                            elevation: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        dismissable={false}
                    >
                        <Text style={{marginBottom: 50, color: 'black', fontSize: 22, fontWeight: 'bold'}}>Vehicle
                            Successfully Added</Text>
                        <Button mode='contained' onPress={() => {
                            setConfirmModalVisible(false);
                            navigation.pop()
                        }}>Dismiss</Button>
                    </Modal>
                </Portal>
                <View style={{height: 15}}></View>

                <Menu
                    visible={vehicleTypeMenuVisible}
                    onDismiss={() => console.log("menu dismiss")}
                    anchor={
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: 5,
                            borderWidth: 1,
                            padding: 10,
                            paddingVertical: 20,
                            borderColor: '#3a21d4',
                        }} onPress={() => setVehicleTypeMenuVisible(!vehicleTypeMenuVisible)}>
                            <Text style={{flex: 1}}>{vehicleType === '' ? '-- Vehicle Type --' : vehicleType}</Text>
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
                        setVehicleTypeMenuVisible(false)
                    }} title="Car"/>
                    <Menu.Item onPress={() => {
                        setVehicleType('Motorcycle');
                        setVehicleTypeMenuVisible(false)
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
                    placeholder='106'
                    label='Power'
                    right={<TextInput.Affix text='HP'/>}
                    outlineColor='#3a21d4'
                    value={power}
                    //only accept numerical values
                    keyboardType='numeric'
                    onChangeText={(text) => setPower(text)}
                    error={power === ''}
                />

                <View style={{height: 15}}></View>

                <TextInput
                    mode='outlined'
                    placeholder='3'
                    label='Capacity'
                    right={<TextInput.Affix text='Seats'/>}
                    outlineColor='#3a21d4'
                    style={{display: vehicleType === 'Car' ? null : 'none'}}
                    value={seats}
                    //only accept numerical values
                    keyboardType='numeric'
                    onChangeText={(text) => setSeats(text)}
                    error={seats === ''}
                />

                <View style={{height: vehicleType === 'Car' ? 15 : 0}}></View>

                <TextInput
                    mode='outlined'
                    placeholder='1600'
                    label='Engine'
                    right={<TextInput.Affix text='CC'/>}
                    outlineColor='#3a21d4'
                    value={engineCC}
                    //only accept numerical values
                    keyboardType='numeric'
                    onChangeText={(text) => setEngineCC(text)}
                    error={engineCC === ''}
                />

                <View style={{height: 15}}></View>

                <TextInput
                    mode='outlined'
                    placeholder='150000'
                    label='Rent Price'
                    left={<TextInput.Affix text='Rp.'/>}
                    outlineColor='#3a21d4'
                    value={rentPrice}
                    //only accept numerical values
                    keyboardType='numeric'
                    onChangeText={(text) => setRentPrice(text)}
                    error={rentPrice === ''}
                />

                <View style={{height: 15}}></View>

                <TextInput
                    mode='outlined'
                    placeholder='DB1234AB'
                    label='Plate Number'
                    outlineColor='#3a21d4'
                    value={plateNumber}
                    onChangeText={(text) => setPlateNumber(text)}
                    error={plateNumber === ''}
                />

                <View style={{height: 15}}></View>

                <TextInput
                    mode='outlined'
                    placeholder='50000'
                    label='Driver Rent Price'
                    left={<TextInput.Affix text='Rp.'/>}
                    outlineColor='#3a21d4'
                    value={driverPrice}
                    //only accept numerical values
                    keyboardType='numeric'
                    onChangeText={(text) => setDriverPrice(text)}
                    error={driverPrice === ''}
                />

                <View style={{height: 15}}></View>

                <Button mode='contained' style={{marginBottom: 25}} onPress={addVehicleHandler}>
                    Add
                </Button>
            </ScrollView>
        </View>
    )
}

export default AdminAddVehicle