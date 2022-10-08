import { View, Text } from 'react-native'
import React from 'react'
import SelectCar from './SelectCar'
import SelectMotorcycle from './SelectMotorcycle'

const VehicleSelectContainer = ({navigation, route}) => {
    const pageToShow = {
        'car': <SelectCar {...{navigation, route}}/>,
        'motorcycle': <SelectMotorcycle {...{navigation, route}}/>,
    }

    return (
        <View>
            {pageToShow[route.params.vehicleType]}
        </View>
    )
}

export default VehicleSelectContainer