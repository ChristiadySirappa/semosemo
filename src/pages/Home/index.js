/* eslint-disable */
import {View, Text, StatusBar, Image, Keyboard, BackHandler} from 'react-native'
import React from 'react'
import HomePage from './HomePage'
import OrderPage from './OrderPage'
import ProfilePage from './ProfilePage'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AdminVehiclesPage from './AdminVehiclesPage'
import AdminHomePage from './AdminHomePage'
import BackendDataContext from '../../contexts/backendDataContext'
import {useFocusEffect} from "@react-navigation/native";

const Home = ({navigation, route}) => {
    const backendDataContext = React.useContext(BackendDataContext)
    const [currentPage, setCurrentPage] = React.useState(0)
    // const [userType, setUserType] = React.useState(route?.params?.userType)
    const [userType, setUserType] = React.useState(backendDataContext?.backendData?.userType)
    const [bottomNavBarDisplay, setBottomNavBarDisplay] = React.useState(null)

    React.useEffect(() => {
        const hideBottomNavBar = () => setBottomNavBarDisplay('none')
        const showBottomNavBar = () => setBottomNavBarDisplay(null)

        const didShowKeyboard = Keyboard.addListener('keyboardDidShow', hideBottomNavBar)
        const didHideKeyboard = Keyboard.addListener('keyboardDidHide', showBottomNavBar)

        return () => {
            didShowKeyboard.remove()
            didHideKeyboard.remove()
        }
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true
            }

            BackHandler.addEventListener('hardwareBackPress', onBackPress)

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
        }, [])
    )

    const NavElem = userType === 'user' ? [
        {
            name: 'Home',
            component: <HomePage {...{navigation}}/>,
            icon: [require('../../assets/OHome.png'), require('../../assets/XHome.png')],
        },
        {
            name: 'My Order',
            component: <OrderPage {...{navigation}}/>,
            icon: [require('../../assets/OOrder.png'), require('../../assets/XOrder.png')],
        },
        // {
        //     name: 'My Vehicles',
        //     component: <MyVehiclesPage {...{navigation}}/>,
        //     icon: [require('../../assets/OMyVehicles.png'), require('../../assets/XMyVehicles.png')],
        // },
        {
            name: 'Profile',
            component: <ProfilePage {...{navigation}}/>,
            icon: [require('../../assets/OProfile.png'), require('../../assets/XProfile.png')],
        },
    ] :
    [
        {
            name: 'Home',
            component: <AdminHomePage {...{navigation}}/>,
            icon: [require('../../assets/OHome.png'), require('../../assets/XHome.png')],
        },
        {
            name: 'My Vehicles',
            component: <AdminVehiclesPage {...{navigation}}/>,
            icon: [require('../../assets/OMyVehicles.png'), require('../../assets/XMyVehicles.png')],
        },
        {
            name: 'Profile',
            component: <ProfilePage {...{navigation}}/>,
            icon: [require('../../assets/OProfile.png'), require('../../assets/XProfile.png')],
        },
    ]

    return (
        <View style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
        }}>
            <StatusBar translucent backgroundColor='transparent'/>
            <View style={{flex: 1}}>
                {NavElem[currentPage].component}
            </View>
            <View style={{
                backgroundColor: 'white', 
                height: 80, 
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 20,
                display: bottomNavBarDisplay,
            }}>
                {
                    //'Home' HomePage, 'My Order' OrderPage, 'Profile' ProfilePage
                    NavElem.map((el, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={{
                                // backgroundColor: 'red',
                                alignItems: 'center',
                                paddingHorizontal: 20,
                                height: 70,
                                justifyContent: 'center'
                            }}
                            onPress={() => setCurrentPage(idx)}
                        >
                            <Image 
                                source={currentPage === idx ? el.icon[0] : el.icon[1]}
                                style={{
                                    height: 50,
                                    resizeMode: 'contain',
                                    // backgroundColor: 'red'
                                }}
                            />
                            <Text>{el.name}</Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </View>
    )
}

export default Home