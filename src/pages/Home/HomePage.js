import {View, Text, Image, ImageBackground} from 'react-native';
import React from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import CarIcon from '../../assets/CarIcon.png';
import MotorCycleIcon from '../../assets/MotorCycleIcon.png';
import BikeIcon from '../../assets/BikeIcon.png';
import BuzzerIcon from '../../assets/BuzzerIcon.png';
import ManadoBridge from '../../assets/ManadoBridge.jpg';
import BackendDataContext from '../../contexts/backendDataContext';

const HomePage = ({navigation}) => {
  const backendDataContext = React.useContext(BackendDataContext);

  return (
    <>
      <View
        style={{
          height: 300,
          backgroundColor: '#3a21d4',
          zIndex: 1,
          borderBottomLeftRadius: 50,
          elevation: 20,
        }}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 16,
              color: 'white',
              marginBottom: 75,
            }}>
            SEMO SEMO
          </Text>
          <View style={{paddingLeft: 15}}>
            <Text
              style={{
                fontSize: 24,
                color: 'white',
              }}>
              Hello, {backendDataContext?.backendData?.fullName}
            </Text>
            <Text style={{fontSize: 24, color: 'white'}}>
              What are you looking for?
            </Text>
          </View>
        </View>
        <View
          style={{
            height: 100, // backgroundColor: 'green',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {
            //car 2ac6d0, motorcycle ec3476, bike 5dd400
            [
              {
                name: 'Car',
                color: '#2ac6d0',
                icon: CarIcon,
                action: () =>
                  navigation.navigate('VehicleSelect', {vehicleType: 'car'}),
              },
              {
                name: 'Motorcycle',
                color: '#ec3476',
                icon: MotorCycleIcon,
                action: () =>
                  navigation.navigate('VehicleSelect', {
                    vehicleType: 'motorcycle',
                  }),
              }, // {
              //     name: 'Bike',
              //     color: '#5dd400',
              //     icon: BikeIcon,
              // },
            ].map((el, idx) => (
              <TouchableOpacity
                key={idx}
                style={{
                  width: 110,
                  height: 150,
                  marginTop: 75,
                  backgroundColor: el.color, // justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 15,
                  borderRadius: 30,
                  borderWidth: 3,
                  borderColor: 'white',
                }}
                onPress={el.action}>
                <Image
                  source={el.icon}
                  style={{width: 60, resizeMode: 'contain', flex: 1}}
                />
                <Text style={{height: 40, color: 'white', fontWeight: 'bold'}}>
                  {el.name}
                </Text>
              </TouchableOpacity>
            ))
          }
        </View>
      </View>
      <ScrollView>
        <View
          style={{height: 60, justifyContent: 'center', alignItems: 'center'}}>
          {/* <Text> BUFFER </Text> */}
        </View>

        <View
          style={{
            backgroundColor: 'rgba(36, 47, 155, 0.15)',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginVertical: 15,
          }}>
          <Image source={BuzzerIcon} style={{marginVertical: 25}} />
          <Text style={{fontSize: 18}}>
            Tip : Make sure to double check your order!
          </Text>
        </View>

        <ImageBackground
          source={ManadoBridge}
          style={{
            marginHorizontal: 20,
            marginVertical: 15,
            borderRadius: 25,
            elevation: 8,
            height: 130,
            overflow: 'hidden',
          }}>
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              flex: 1,
              padding: 15,
            }}>
            <View style={{flex: 1}} />
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              Explore manado city with us
            </Text>
          </View>
        </ImageBackground>
      </ScrollView>
    </>
  );
};

export default HomePage;
