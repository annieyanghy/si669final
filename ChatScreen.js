import React from "react";
import {
  TextInput,
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  FlatList,
  ScrollView,
  ActionSheetIOS,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Avatar,
  Accessory,
  Divider,
  Icon,
  SocialIcon,
  SearchBar,
} from "react-native-elements";
import {
  Card,
  Title,
  Paragraph,
  Button,
  IconButton,
  Subheading,
  Caption,
  Headline,
  ToggleButton,
} from "react-native-paper";

import { getDataModel } from "./DataModel";
import { chatFriendStyles, colors, chatStyles } from "./Styles";

export class ChatScreen extends React.Component {
  constructor(props) {
    super(props);

    console.log("chatchat", this.props.route.params);

    this.dataModel = getDataModel();
    this.currentUser = this.dataModel.fetchWhoIsUser();
    this.self = this.props.route.params.currentUser;
    this.other = this.props.route.params.otherUser;

    this.allUserInfo = [];
    this.allUserInfo = this.dataModel.deliverAllUserProfile();

    this.otherUsers = [];
    for (let user of this.allUserInfo) {
      if (user.userId !== this.currentUser.userId) {
        console.log(user.key);
        this.otherUsers.push(user);
      }
    }
    //all users' login info
    let allUsers = this.dataModel.getUsers();
    for (let x of allUsers) {
      for (let other of this.otherUsers) {
        if (x.key == other.userId) {
          other.profilePicURL = x.imageURL;
        }
      }
    }

    this.imageWidth = 225,
    this.imageHeight = 300;
    

    this.state = {
      messages: [],
      inputText: ''
    
    };
  }

  componentDidMount = () => {
    this.dataModel.getAllUserInfo();
    this.props.navigation.setOptions({title: this.other.userName});
  
    this.focusUnsubscribe = this.props.navigation.addListener(
      "focus",
      this.onFocus
    );
    this.subscribeToChat();
  };

  onFocus = () => {
    //    this.checkFollowing();
  };

  subscribeToChat = async() => {
    console.log("subscribed!!!");
    this.chat = await this.dataModel
      .getOrCreateChat(this.self, this.other);
    this.dataModel.subscribeToChat(this.chat, this.onChatUpdate);
    this.checkRead(this.chat);
  }

  onChatUpdate = () => {
    this.setState({messages: this.chat.messages});
  }

  onMessageSend = async () => {
    let messageData = {
      text: this.state.inputText,
      timestamp: Date.now(),
      author: this.self,
      other:this.other,
      read: false,
    }
    await this.dataModel.addChatMessage(this.chat.key, messageData);
    this.setState({
      messages: this.chat.messages,
      inputText: ''
    });
  }
  checkRead=(chat)=>{
    this.dataModel.readChatToggle( chat,this.props.route.params.currentUser);
   
  }

  

  onTakePicture = () => {
    this.props.navigation.navigate("Camera", {
      chat: this.chat,
      currentUser: this.self
    })
  }

  render() {
    return (
      <KeyboardAvoidingView 
        style={chatStyles.container}
        behavior={"height"}
        keyboardVerticalOffset={100}>
        <View style={chatStyles.messageListContainer}>
          <FlatList
            data={this.state.messages}
            ref={(ref) => {this.flatListRef = ref}}
            onContentSizeChange={() => {
              if (this.flatListRef) {
                this.flatListRef.scrollToEnd();
              }
            }}
            renderItem={({item, index})=>{
              return (
                <View style={item.author === this.self ? 
                  chatStyles.chatTextSelfContainer :
                  chatStyles.chatTextOtherContainer
                }>
                  {item.type === 'text' ?
                    <Text style={item.author === this.self ? 
                      chatStyles.chatTextSelf :
                      chatStyles.chatTextOther
                    }>
                      {item.text}
                    </Text>
                  :
                  <Image
                    style={{width: this.imageWidth, height: this.imageHeight}}
                    source={{uri: item.imageURL}}
                  />
                }
                </View>
              );
            }}
          />
        </View>
        <View style={chatStyles.inputContainer}>
          <View style={chatStyles.inputRow}>
            <Ionicons 
              name='ios-camera' 
              size={44}
              color={colors.primary}
              onPress={this.onTakePicture}
            />
            <TextInput 
              style={chatStyles.inputBox}
              value={this.state.inputText}
              returnKeyType={'send'}
              onChangeText={(text) => {
                this.setState({inputText: text})
              }}
              onSubmitEditing={this.onMessageSend}/>
            <Ionicons 
              name='md-send' 
              size={36}
              color={colors.primary}
              onPress={this.onMessageSend}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

}
