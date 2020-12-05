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


import { LoginScreen, UserContext } from './LoginScreen';
import { ProfileScreen } from './ProfileScreen';
import { ProfileEditScreen } from './ProfileEditScreen';
import { CameraScreen } from './CameraScreen';
import { ImageScreen } from './ImagePicker';
import { PortfolioEditScreen } from './PortfolioEditScreen';
import { DesignersScreen } from './DesignerScreen';
import { DesignerProfileScreen } from './DesignerProfileScreen';
import { ChatFriendScreen } from './ChatFriendScreen';



import { render } from 'react-dom';



function ChatScreen () {
  const userInfo = React.useContext(UserContext);
  console.log("what's user info",userInfo)
  return (
    
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Chats!</Text>
    </View>
  );
}

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

class DesignerStackScreen extends React.Component {
  constructor(props) {
    super(props);
    // console.log("on designer stack",this.props.navigation.getParam('currentUserInfo'));
    console.log("on designer stack context",this.context);
    this.dataModel = getDataModel();
}
  render(){

  return (
    <DesignerStack.Navigator>
      <DesignerStack.Screen name="Designers" component={DesignersScreen} />
      <DesignerStack.Screen name="Designer Profile" component={DesignerProfileScreen} />
      <ChatStack.Screen name="Chat" component={ChatScreen} />
    </DesignerStack.Navigator>
  );
  }
}

const ChatStack = createStackNavigator();

function ChatStackScreen() {
  
  return (
    <ChatStack.Navigator>
  
      <ChatStack.Screen name="Chat" component={ChatFriendScreen} />
      <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
    </ChatStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

class Tabs extends React.Component {
 
  constructor(props) {
    super(props);
    console.log("on tabs",this.props.route.params);
    this.props.navigation.setParams(({currentUserInfo:this.props.route.params}));
    console.log("on tab context",this.context);
    console.log("on tabs post setting",this.props.route.params);
    this.dataModel = getDataModel();
}
  render(){
    console.log("on tab context",this.context);
  return (
    // <NavigationContainer>
    // <UserContext.Consumer>
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
  //  </UserContext.Consumer>
  );
}
}

const Stack = createStackNavigator();
Tab.contextType = UserContext;
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

