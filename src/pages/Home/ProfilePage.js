import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import BackendDataContext from '../../contexts/backendDataContext'

const ProfilePage = ({navigation}) => {
  const backendDataContext = React.useContext(BackendDataContext)
  let listElem = []

  listElem.push({name: 'Edit Profile', icon: require('../../assets/EditProfileIcon.png'), onPress: () => navigation.navigate('EditProfile')})
  // backendDataContext?.backendData?.userType === 'user' && listElem.push({name: 'History', icon: require('../../assets/HistoryIcon.png'), onPress: () => console.log('history')})
  //listElem.push({name: 'Send Feedback', icon: require('../../assets/SendFeedbackIcon.png'), onPress: () => console.log('send feedback')})
  listElem.push({name: 'Logout', icon: require('../../assets/LogOutIcon.png'), onPress: () => navigation.replace('SignIn')})

  return (
    <>
    <View style={{height: 80, backgroundColor: '#3a21d4', elevation: 16}}>
      <View style={{height: 20}}></View>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{color: 'white', marginLeft: 25}}>Profile</Text>
      </View>
    </View>
    <ScrollView style={{marginTop: 25}}>
    {
      listElem.map((el, idx) => (
        <View key={idx} style={{height: 80}}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              borderTopWidth: 2,
              borderTopColor: 'rgba(0, 0, 0, 0.125)',
            }}
            onPress={el.onPress}
          >
              <Image source={el.icon} style={{width: 60, resizeMode: 'contain', marginLeft: 10, marginRight: 15}}/>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>{el.name}</Text>
              <View style={{flex: 1}}></View>
              <Image source={require('../../assets/ArrowRightOrange.png')} style={{marginRight: 25}}/>
          </TouchableOpacity>
        </View>
      ))
    }
    </ScrollView>
    </>
  )
}

export default ProfilePage