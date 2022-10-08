/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Router from './router';
import {Provider as PaperProvider} from 'react-native-paper'
import { BackendDataProvider } from './contexts/backendDataContext';
import { ScanKTPProvider } from './contexts/scanKTPContext';
import { GlobalsProvider } from './contexts/globalsContext';

const App = () => {
  const [backendData, setBackendData] = React.useState({})
  const [KTPImageData, setKTPImageData] = React.useState(null)
  const [globalsData, setGlobalsData] = React.useState({})

  const SetBackendData = data => {
    setBackendData(prevState => ({...prevState, ...data}))
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BackendDataProvider value={{
        backendData,
        setBackendData: SetBackendData,
      }}>
        <ScanKTPProvider
          value={{
            ktpImageData: KTPImageData,
            setKTPImageData: setKTPImageData,
          }}
        >
          <GlobalsProvider
            value={{
              globalsData,
              setGlobalsData,
            }}
          >
            <PaperProvider>
              <StatusBar translucent/>
              <NavigationContainer>
                <Router/>
              </NavigationContainer>
            </PaperProvider>
          </GlobalsProvider>
        </ScanKTPProvider>
      </BackendDataProvider>
      <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: 0
        }}
        pointerEvents='none'
      >
        <View style={{width: 800, transform: [{rotateZ: '20deg'}]}}>
          {
            [...Array(50)].map(el =>
              <Text numberOfLines={1} style={{fontSize: 25, fontWeight: 'bold', marginBottom: 10, color: 'grey'}}> .</Text>
            )
          }
        </View>
      </View>
      <FlashMessage position='top'/>
    </GestureHandlerRootView>
  )
};

export default App;
