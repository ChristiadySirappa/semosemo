import { View, Text, Image } from 'react-native'
import React from 'react'
import MapView from 'react-native-maps'
import MapNeedleColorIcon from '../../assets/MapNeedleColorIcon.png'
import MapNeedleIcon from '../../assets/MapNeedleIcon.png'
import { Button } from 'react-native-paper'
import BottomSheet from '@gorhom/bottom-sheet'
import { ScrollView } from 'react-native-gesture-handler'
import GlobalsContext from '../../contexts/globalsContext'

const PlacesSheet = ({globalsDataContext, nearbyPlaces, setBottomSheetVisible, navigation, route}) => {
    return (
    <>
        <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'center', margin: 25,}}>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 22, fontWeight: 'bold', color: 'black'}}>Nearby Places</Text>
                    <Text style={{fontSize: 22, fontWeight: 'bold', color: 'black'}}>(within 50 meters)</Text>
                </View>
                <Button color={route.params.type === 'Car' ? '#2AC6D0' : '#EC3476'} mode='outlined' onPress={() => setBottomSheetVisible(false)}>Change spot</Button>
            </View>

            <ScrollView>
            {
                nearbyPlaces?.map((el, idx) => 
                    <View key={idx} style={{
                        flexDirection: 'row',
                        marginHorizontal: 15,
                        marginVertical: 5,
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        borderRadius: 15,
                        padding: 7,
                        alignItems: 'center',
                    }}>
                        <Image source={MapNeedleIcon} style={{resizeMode: 'contain'}} />
                        <Text style={{fontSize: 18, marginLeft: 25,}}>{el?.name?.substring(0, 18)}{el?.name?.length > 18 ? '...' : ''}</Text>
                        
                        <View style={{flex: 1}}></View>

                        <Button mode='outlined' onPress={() => {
                            globalsDataContext?.setGlobalsData(prevState => {
                                navigation.pop()

                                return {...prevState, selectedPickUpLocation: {location: el.geometry.location, name: el.name}}
                            })
                        }} style={{borderRadius: 15, borderWidth: 2}} color={route.params.type === 'Car' ? '#2AC6D0' : '#EC3476'}>
                            Choose
                        </Button>
                    </View>
                )
            }
            </ScrollView>
        </View>
    </>
    )
}

const LocationSelect = ({navigation, route}) => {
    const [latestRegionCoord, setLatestRegionCoord] = React.useState(null)
    const bottomSheetRef = React.useRef(null)
    const [bottomSheetVisible, setBottomSheetVisible] = React.useState(false)
    const [nearbyPlaces, setNearbyPlaces] = React.useState([])
    //console.log(route)

    const globalsDataContext = React.useContext(GlobalsContext)

    const geoCoding = () => {
        setBottomSheetVisible(true)
        fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latestRegionCoord.latitude}%2C${latestRegionCoord.longitude}&radius=50&key=AIzaSyCwI6AwhGXxkLiUbf0YxbfkihQyoDd4Xqc`)
        .then(res => res.json())
        .then(res => setNearbyPlaces(res.results))
    }

    React.useEffect(() => {
        bottomSheetVisible ? bottomSheetRef?.current?.expand() : bottomSheetRef?.current?.close()

        const timeout = setInterval(() => !bottomSheetVisible ? bottomSheetRef?.current?.close() : null, 1000)

        return () => clearInterval(timeout)
    }, [bottomSheetVisible])

    return (
    <View
        style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}
    >
        <MapView 
            style={{flex: 1}}
            initialRegion={{
                latitude: 1.479849,
                longitude: 124.871387,
                latitudeDelta: 0.08,
                longitudeDelta: 0.08,
            }}
            onRegionChangeComplete={region => {
                setLatestRegionCoord(region)
            }}
        />
        <View style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }} pointerEvents='none'>
            <Image source={MapNeedleColorIcon} style={{
                resizeMode: 'contain',
                width: 100,
                height: 100,
            }}/>
        </View>
        <View style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'flex-end'
        }}>
            <Button 
                mode={latestRegionCoord === null ? 'outlined' : 'contained'} 
                style={{marginBottom: 45, padding: 15, borderRadius: 45, backgroundColor: latestRegionCoord === null ? null : route.params.type === 'Car' ? '#2AC6D0' : '#EC3476'}} 
                onPress={geoCoding} 
                disabled={latestRegionCoord === null}
                >
                <Text style={{fontSize: 22}}>Select Place</Text>
            </Button>
        </View>

        <View style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: bottomSheetVisible ? null : 'none',
        }}>
        </View>

        <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={['1%', '80%']}
            enableHandlePanningGesture={false}
            handleComponent={() => <View></View>}
            enablePanDownToClose={false}
        >
            <PlacesSheet {...{nearbyPlaces, setBottomSheetVisible, globalsDataContext, navigation, route}}/>
        </BottomSheet>
    </View>
    )
}

export default LocationSelect