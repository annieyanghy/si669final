
import React from 'react';
import { Text, View, TouchableOpacity, Image,  } from 'react-native';

import { Button } from 'react-native-elements';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';


import { getDataModel } from './DataModel';
export class ImageScreen extends React.Component {

    constructor(props) {
        super(props);
        this.dataModel = getDataModel();
        
        console.log("image picker screen",this.props.route.params);
        this.currentUser = this.props.route.params.currentUser;
        this.userId = this.props.route.params.userId;
        // this.userInfoKey =this.props.route.params.userInfoKey;
        this.userPicKey = undefined;


        this.state = {
        hasCameraRollPermission: null,
        // pickedImage:' []'
        };  
    }

    componentDidMount() {
        this.getPermissions();
    }

    getPermissions = async () => {
        let cameraRollPerms = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        let permGranted = cameraRollPerms.status === 'granted';
        this.setState({
        hasCameraRollPermission: permGranted
        });
    }

    pickImage = async () => {
        console.log("result");
        let picData = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(picData);
        console.log(this.props.route.params.mode );
        if (!picData.cancelled) {
            if (this.props.route.params.mode == 'portfolio'){
                this.props.navigation.navigate('Edit Portfolio',{picData:picData});
            }else{
                this.props.navigation.navigate('Profile',{picData:picData});
            }
           
            // this.setState({
            //     pickedImage:picData.uri
            // })
        }
      };

    render() {
        const { hasCameraRollPermission } = this.state;
        if (hasCameraRollPermission === null) {
        return <View />;
        } else if (hasCameraRollPermission === false) {
        return <Text>No access to camera</Text>;
        } else {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button title="Pick an image from camera roll" onPress={()=>this.pickImage()} />
                {/* <Image source={{ uri: this.state.pickedImage }} style={{ width: 200, height: 200 }} /> */}
            </View>
        );
        }
    }
}