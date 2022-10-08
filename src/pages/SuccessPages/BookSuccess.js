import { View, Text, Image } from 'react-native'
import React from 'react'
import TelegramRight from '../../assets/TelegramRight.png'
import Button from '../../components/Button'

const BookSuccess = ({navigation}) => {
  return (
    <View style={{width: '100%', height: '100%', alignItems: 'center', backgroundColor: 'white'}}>
      <Text style={{marginTop:50, fontSize: 22}}>SEMO SEMO</Text>

      <Image source={TelegramRight} style={{marginTop: 100}}/>

      <Text style={{marginTop:50, fontSize: 28, fontWeight: 'bold', marginBottom: 100}}>Your booking is successfull</Text>

      <Button borderStyle={{radius: 25, color: '#3A21D4', width: 2}} bgColor='white' onPress={() => navigation.pop()}>
        <Text style={{paddingHorizontal: 50, paddingVertical: 10, color: '#3A21D4', fontWeight: 'bold', fontSize: 22}}>Okay</Text>
      </Button>
    </View>
  )
}

export default BookSuccess