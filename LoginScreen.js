import React from 'react';

import { TextInput, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Alert, Button, FlatList} 
    from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Input } from "react-native-elements";

import { getDataModel } from './DataModel';
import { loginStyles, colors } from './Styles';




export const UserContext = React.createContext(undefined);


export class LoginScreen extends React.Component {
    constructor(props) {
    super(props);

    this.dataModel = getDataModel();
    this.currentUserInfo = {
        currentUser: {},
        userId: "",
    };
    this.state = {
        mode: 'login',
        emailInput: '',
        displayNameInput: '',
        passwordInput: '',
        passwordCheckInput: '',
        currentUser: {},
        userId: "",
    }
}




onCreateAccount = async () => {

    // check that this is a valid email (skipping this)
    // check password rules (skipping this)
    // check that passwords match (skipping this)
    // check that displayName isn't empty (skipping this)

    // check that user doesn't already exist
    let users = this.dataModel.getUsers();
    for (let user of users) {
    if (user.email === this.state.emailInput) {
        console.log("found matching user");
        Alert.alert(
        'Duplicate User',
        'User ' + this.state.emailInput + ' already exists.',
        [{ text: 'OK',style: 'OK'}]
        );
        return;
    } 
    } // made it through loop, no user exists!
    console.log("no matching user found, creating");
    let newUser = await this.dataModel.createUser(
    this.state.emailInput,
    this.state.passwordInput,
    this.state.displayNameInput
    );
    this.props.navigation.navigate("Tab", {
        screen:"Profiles",
        params:{
            screen:"Profile",
            params:{
                currentUser: newUser,
                userId: user.key,
            }
        }
    });
}

onLogin = () => {
    let users = this.dataModel.getUsers();
    
    let email = this.state.emailInput;
    let pass = this.state.passwordInput;
    for (let user of users) {
    if (user.email === email) {
        if (user.password === pass) {
        // success!
        // this.currentUserInfo.currentUser = user;
        // this.currentUserInfo.userId = user.key;
        // console.log("what's current user info on login?",this.currentUserInfo);
        console.log("who is loging?",user);
        this.dataModel.saveWhoIsUser(user, user.key);
        this.setState({
            currentUser:user,
            userId: user.key
        });
        this.props.navigation.navigate("Tab", {
            screen:"Profiles",
            params:{
                screen:"Profile",
                params:{
                    currentUser: user,
                    userId: user.key,
                }
            }
        });
        return;
        }
    }
    }
    // we got through all the users with no match, so failure
    Alert.alert(
    'Login Failed',
    'No match found for this email and password.',
    [{ text: 'OK',style: 'OK'}]
    );
}

render() {
    return (
     
            <KeyboardAvoidingView 
                style={loginStyles.container}
                behavior={"height"}
                keyboardVerticalOffset={10}>
                <View style={loginStyles.topView}>
                <Image 
                    source={require('./assets/favicon.png')}
                    style={loginStyles.logoImage}
                />
                </View>
                <View style={loginStyles.middleView}>
                <View style={loginStyles.inputRow}>
                    {/* <Text 
                    style={loginStyles.inputLabel}
                    >Email:</Text> */}
                    <Input
                    label='Email'
                    labelStyle={{fontSize:14}}
                    leftIcon={{size:18,type:'material-community', name:'email',color:'gray'}}
                    style={loginStyles.inputText}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoCorrect={false}
                    autoCompleteType='email'
                    textContentType='emailAddress'
                    value={this.state.emailInput}
                    onChangeText={(text)=>{this.setState({emailInput: text})}}
                    />
                </View>
                {this.state.mode === 'create' ? (
                    <View style={loginStyles.inputRow}>
                    {/* <Text style={loginStyles.inputLabel}>Display Name:</Text> */}
                    <Input
                        label='User name'
                        labelStyle={{fontSize:14}}
                        leftIcon={{size:18,type:'material-community', name:'camera-account',color:'gray'}}
                        style={loginStyles.inputText}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={this.state.displayNameInput}
                        onChangeText={(text)=>{this.setState({displayNameInput: text})}}
                    />
                    </View>
                ):(
                    <View/>
                )}
                <View style={loginStyles.inputRow}>
                    {/* <Text style={loginStyles.inputLabel}>Password:</Text> */}
                    <Input
                        label='Password'
                        labelStyle={{fontSize:14}}
                        leftIcon={{size:18,type:'material-community', name:'lock',color:'gray'}}

                        style={loginStyles.inputText}
                        autoCapitalize='none'
                        autoCorrect={false}
                        textContentType='password'
                        value={this.state.passwordInput}
                        onChangeText={(text)=>{this.setState({passwordInput: text})}}
                />
                </View>
                {this.state.mode === 'create' ? (
                    <View style={loginStyles.inputRow}>
                    {/* <Text style={loginStyles.inputLabel}>Re-enter Password:</Text> */}
                    <Input
                        label='Confirm password' 
                        labelStyle={{fontSize:14}}  
                        leftIcon={{size:18,type:'material-community', name:'lock',color:'gray'}}

                        style={loginStyles.inputText}
                        autoCapitalize='none'
                        autoCorrect={false}
                        textContentType='password'  
                        value={this.state.passwordCheckInput}
                        onChangeText={(text)=>{this.setState({passwordCheckInput: text})}}
                    />
                    </View>
                ):(
                    <View/>
                )}
                </View>
                {this.state.mode === 'login' ? (

                <View style={loginStyles.bottomView}>
                    <TouchableOpacity 
                    style={loginStyles.buttonContainer}
                    onPress={()=>{
                        this.setState({mode: 'create'})
                    }}
                    >
                    <Text style={loginStyles.buttonText}>Create Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={loginStyles.buttonContainer}
                    onPress={this.onLogin}
                    >
                    <Text style={loginStyles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>

                ):(

                <View style={loginStyles.bottomView}>
                    <TouchableOpacity 
                    style={loginStyles.buttonContainer}
                    onPress={()=>{
                        this.setState({mode: 'login'})
                    }}
                    >
                    <Text style={loginStyles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={loginStyles.buttonContainer}
                    onPress={this.onCreateAccount}
                    >
                    <Text style={loginStyles.buttonText}>Create</Text>
                    </TouchableOpacity>
                </View>
                )}
            </KeyboardAvoidingView>
     
    )
}
}

