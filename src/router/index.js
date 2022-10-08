import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import SplashScreen from '../pages/SplashScreen'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Home from '../pages/Home'
import VehicleSelectContainer from '../pages/VehicleSelect'
import EditProfile from '../pages/EditProfile'
import VehicleDetail from '../pages/VehicleDetail'
import BorrowerConfirm from '../pages/BorrowerConfirm'
import BookSuccess from '../pages/SuccessPages/BookSuccess'
import AdminAddVehicle from '../pages/AdminAddVehicle'
import ScanKTP from '../pages/ScanKTP'
import LocationSelect from '../pages/LocationSelect'
const Stack = createStackNavigator()

const Router = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
            <Stack.Screen name="SignIn" component={SignIn} options={{headerShown: false}}/>
            <Stack.Screen name="SignUp" component={SignUp} options={{headerShown: false}}/>
            <Stack.Screen name="VehicleSelect" component={VehicleSelectContainer} options={{headerShown: false}}/>
            <Stack.Screen name="EditProfile" component={EditProfile} options={{headerShown: false}}/>
            <Stack.Screen name="VehicleDetail" component={VehicleDetail} options={{headerShown: false}}/>
            <Stack.Screen name="BorrowerConfirm" component={BorrowerConfirm} options={{headerShown: false}}/>
            <Stack.Screen name="BookSuccess" component={BookSuccess} options={{headerShown: false}}/>
            <Stack.Screen name="AdminAddVehicle" component={AdminAddVehicle} options={{headerShown: false}}/>
            <Stack.Screen name="ScanKTP" component={ScanKTP} options={{headerShown: false}}/>
            <Stack.Screen name="LocationSelect" component={LocationSelect} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}

export default Router