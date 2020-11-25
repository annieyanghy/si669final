import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import { getDataModel } from './DataModel';
import { UserContext } from './Context';

import { LoginScreen } from './LoginScreen';
import { ProfileScreen } from './ProfileScreen';
import { ProfileEditScreen } from './ProfileEditScreen';
import { CameraScreen } from './CameraScreen';
import { ImageScreen } from './ImagePicker';
import { PortfolioEditScreen } from './PortfolioEditScreen';



import { render } from 'react-dom';






class DesignersScreen extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      message: 'None'
    }
  }
render(){
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Other designers!</Text>
      <Button
        title="Go to Edit Profile"
        onPress={() => this.props.navigation.navigate('Designers Profile')}
      />
    </View>
  );
}}

class DesignerProfileScreen extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      message: 'None'
    }
  }
render(){
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile of designers!</Text>
    </View>
  );
}}

class ChatScreen extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      message: 'None'
    }
  }
render(){
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Chats!</Text>
    </View>
  );
}}

const ProfileStack = createStackNavigator();

class ProfileStackScreen extends React.Component {
  constructor(props) {
    super(props);
    // const user = React.useContext(UserContext);
    console.log("on profile stack",this.props.route);
    let dataModel = getDataModel();
    this.state = {
      message: 'None'
    }
  }
  render(){

    return (
      
      
      <ProfileStack.Navigator>
        <ProfileStack.Screen name="Profile" component={ProfileScreen} />
        <ProfileStack.Screen name="Edit Profile" component={ProfileEditScreen} />
        <ProfileStack.Screen name="Camera Screen" component={CameraScreen} />
        <ProfileStack.Screen name="Image Picker" component={ImageScreen} />
        <ProfileStack.Screen name="Edit Portfolio" component={PortfolioEditScreen} />

      </ProfileStack.Navigator>
    );
  }
}

const DesignerStack = createStackNavigator();

function DesignerStackScreen() {
  return (
    <DesignerStack.Navigator>
      <DesignerStack.Screen name="Designers" component={DesignersScreen} />
      <DesignerStack.Screen name="Designers Profile" component={DesignerProfileScreen} />
    </DesignerStack.Navigator>
  );
}

const ChatStack = createStackNavigator();

function ChatStackScreen() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen name="Chat" component={ChatScreen} />
      <ChatStack.Screen name="Designers Profile" component={DesignerProfileScreen} />
    </ChatStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

class Tabs extends React.Component {

  constructor(props) {
    super(props);
    console.log("on tab",this.props.route);

    this.dataModel = getDataModel();
}
  render(){
  return (
    // <NavigationContainer>
    // <UserContext.Provider >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Profile Stack') {
              iconName = focused
                ? 'account-circle' : 'account-circle-outline';
            } else if (route.name === 'Designers') {
              iconName = focused ? 'account-group' : 'account-group-outline';
            } else if (route.name === 'Chats') {
              iconName = focused ? 'chat' : 'chat-outline';
            }
            // You can return any component that you like here!
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'teal',
          inactiveTintColor: 'gray',
          fontSize: 24
        }}
      >
        <Tab.Screen name="Profile Stack" component={ProfileStackScreen} />
        <Tab.Screen name="Designers" component={DesignerStackScreen} />
        <Tab.Screen name="Chats" component={ChatStackScreen} />
        {/* <Tab.Screen name="Login" component={LoginScreen} 
            screenOptions={{
              tabBarVisible: false
            }}
        /> */}
      </Tab.Navigator>
      // </UserContext.Provider>
  );
}
}

const Stack = createStackNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    console.log("on tab",this.props.route);

    this.dataModel = getDataModel();
  }
  render(){

    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Tab" component={Tabs} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

