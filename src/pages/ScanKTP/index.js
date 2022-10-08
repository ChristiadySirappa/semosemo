import { View, Text } from 'react-native'
import React from 'react'
import ScanKTPContext from '../../contexts/scanKTPContext'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import Button from '../../components/Button'

const ScanKTP = ({navigation}) => {
    const scanKTPContext = React.useContext(ScanKTPContext)
    const camRef = React.useRef(null)
    const [canUseCamera, setCanUseCamera] = React.useState('denied')
    const devices = useCameraDevices()
    const backCamera = devices.back

    React.useEffect(() => {
        const getPermission = async () => {
            setCanUseCamera(await Camera.requestCameraPermission())
        }

        getPermission()
    }, [])

    return (
        <View style={{
            width: '100%',
            height: '100%',
        }}>
            {
            canUseCamera !== 'authorized' ?
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text>Camera permission denied, can't open camera (error code: {canUseCamera})</Text>
            </View> :
            backCamera == null ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Loading Camera...</Text></View> :
            <>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 18, color: '#3a21d4'}}>Position your ID Card on the camera</Text>

                    <View style={{borderRadius: 25, overflow: 'hidden', marginVertical: 25}}>
                        <Camera
                            ref={camRef}
                            style={{width: 300, height: 200}}
                            device={backCamera}
                            isActive={true}
                            preset='photo'
                        />
                    </View>

                    <Button borderStyle={{color: '#3a21d4', width: 4, radius: 15}} onPress={async () => {
                        const snapshot = await camRef?.current?.takeSnapshot({
                            quality: 85,
                            skipMetadata: true,
                        })

                        scanKTPContext.setKTPImageData(snapshot)
                        navigation.pop()
                    }}>
                        <Text style={{padding: 15, paddingHorizontal: 20, color: '#3a21d4', fontWeight: 'bold', fontSize: 18}}>Take Picture</Text>
                    </Button>
                </View>
            </>
            }
        </View>
    )
}

export default ScanKTP