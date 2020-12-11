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
  Modal,
  TouchableHighlight
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
  BottomSheet
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
import { chatFriendStyles,profileStyles, colors, chatStyles } from "./Styles";

export class ChatScreen extends React.Component {
  constructor(props) {
    super(props);

    console.log("chatchat", this.props.route.params);
    console.log("chatchat current", this.props.route.params.currentUser);


    this.dataModel = getDataModel();
    this.currentUser = this.dataModel.fetchWhoIsUser();
    this.self = this.props.route.params.currentUser;
    this.other = this.props.route.params.otherUser;

    this.allUserInfo = [];
    this.allUserInfo = this.dataModel.deliverAllUserProfile();
    console.log("testing",this.allUserInfo);
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

    this.imageWidth = 250,
    this.imageHeight = 'auto';
    

    this.state = {
      messages: [],
      inputText: '',
      modalVisible:false,
      portfoList:[],
      portfoImage:''
    
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
    this.subscribeToPortfo();
  };

  subscribeToChat = async() => {
    console.log("subscribed!!!");
    this.chat = await this.dataModel
      .getOrCreateChat(this.self, this.other);
      console.log("subscribed!!!!",this.chat);
    this.dataModel.subscribeToChat(this.chat, this.onChatUpdate);
    // this.checkRead(this.chat);
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
  // checkRead=(chat)=>{
  //   this.dataModel.readChatToggle( chat,this.props.route.params.currentUser);
   
  // }

  

  onTakePicture = () => {
    this.props.navigation.navigate("Camera", {
      chat: this.chat,
      currentUser: this.self
    })
  }
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  subscribeToPortfo = async () => {
    let userId = this.props.route.params.currentUser.userId;
    console.log("uderId",userId);
    let templist = await this.dataModel.loadPortfo(userId);
    this.userPortfo=[];
    this.list = templist;
    console.log("idx idx",this.list);
    for (let idx of this.list ){
      console.log("which one idx?",idx);
      this.portfoPic = await this.dataModel.loadPortfoPic(userId,idx.key);
 
      idx.portfoPicURL =this.portfoPic;
      this.userPortfo.push(idx);
      console.log("portfo pic which one ?",idx);
      this.onPortfoPicUpdate(this.portfoPic);
      this.onPortfoUpdate();
    }
   
    console.log("yoyoyo",this.userPortfo);

  };

  onPortfoUpdate = () => {
    console.log("hi");
    console.log("what's inside it yoyo",this.userPortfo);
    this.setState({
      portfoList: this.userPortfo,
    });
  };
  onPortfoPicUpdate = (pic)=>{
  
    this.setState({
      portfoImage:pic
    })
  };

  pickPortfo= async(item)=>{
    console.log(item);
    let user = this.props.route.params.currentUser;
    await this.dataModel.addChatPortfolio(item, user,this.chat);
    this.setModalVisible(!this.state.modalVisible);
  }

  render() {
    return (
      <KeyboardAvoidingView 
        style={chatStyles.container}
        behavior={"height"}
        keyboardVerticalOffset={100}>
        <View style={chatStyles.messageListContainer}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={this.state.messages}
            ref={(ref) => {this.flatListRef = ref}}
            onContentSizeChange={() => {
              if (this.flatListRef) {
                this.flatListRef.scrollToEnd();
              }
            }}
            renderItem={({item, index})=>{
              // if (item.type === 'text'){
              //   return (

              //     <View style={item.author.key === this.self.userId ? 
              //         chatStyles.chatTextSelfContainer :
              //         chatStyles.chatTextOtherContainer
              //       }>
              //           <Text style={item.author.key === this.self.userId ? 
              //             chatStyles.chatTextSelf :
              //             chatStyles.chatTextOther
              //           }>
              //             {item.text}
              //             </Text>

              //      </View>
              //   )
              // }else if (item.type ==='portfolio'){
              //     console.log("heai portfo", item);
              //   <View style={item.author.key === this.self.userId ? 
              //         chatStyles.chatTextSelfContainer :
              //         chatStyles.chatTextOtherContainer
              //       }>
              //           <Image
              //             style={{width: this.imageWidth, height: this.imageHeight}}
              //             source={{uri: item.imageURL}}
              //           />
              //      </View>

              // }
              return (
                <View style={item.author.key === this.self.userId ? 
                  chatStyles.chatTextSelfContainer :
                  chatStyles.chatTextOtherContainer
                }>
                
                  {item.type === 'text' ?
                    <Text style={item.author.key === this.self.userId ? 
                      chatStyles.chatTextSelf :
                      chatStyles.chatTextOther
                    }>
                      {item.text}
                      </Text>
                    : 
                    <TouchableOpacity
                    onPress={()=>Linking.openURL(item.portfoURL)}
                    >
                    <Card   style={{ resizeMode: 'contain', width: this.imageWidth, height: this.imageHeight}}>
                   
                    <Card.Cover source={{ uri: item.imageURL}} />
                    <Card.Title title={item.portfoTitle}/>

                    </Card>
                    </TouchableOpacity>
                    // <Card
                    //       style={{width: this.imageWidth, height: this.imageHeight}}
                    //       source={{uri: item.imageURL}}
                    //     />
                      
                
                  }
                </View>
              );
            }}
          />
        </View>
      
        <Modal
          animationType="slide"
          statusBarTranslucent={true}
          presentationStyle="overFullScreen"
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={chatStyles.centeredView}>
           
        
          <View style={chatStyles.modalView}>

          <TouchableHighlight
                style={{ ...chatStyles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <Text style={chatStyles.textStyle}>Cancel</Text>
            </TouchableHighlight>
          <FlatList
            data={this.state.portfoList}
            
            // ref={(ref) => {this.flatListRef = ref}}
            // onContentSizeChange={() => {
            //   if (this.flatListRef) {
            //     this.flatListRef.scrollToEnd();
            //   }
            // }}
            renderItem={({item, index})=>{
              return (
                <View style={chatStyles.modalBox} >
                  <TouchableOpacity
                    onPress={()=>this.pickPortfo(item)}
                  >
                    <Card  style={chatStyles.cardContainer}>
                    <Card.Cover source={{ uri: item.portfoPicURL }} />
                      <Card.Content>
                        <Title>{item.portfoTitle}</Title>
                      </Card.Content>

                    </Card>
                  </TouchableOpacity>   
                </View>
              );
            }}
          />

              {/* <TouchableHighlight
                style={{ ...chatStyles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <Text style={chatStyles.textStyle}>Send</Text>
              </TouchableHighlight> */}
            </View>
            </View>
        </Modal>
       
        <View style={chatStyles.inputContainer}>
          <View style={chatStyles.inputRow}>
            <IconButton
              icon='file-find' 
              size={32}
              color={colors.primary}
              onPress={() => this.setModalVisible(true)}
            />
            <TextInput 
              style={chatStyles.inputBox}
              value={this.state.inputText}
              returnKeyType={'send'}
              onChangeText={(text) => {
                this.setState({inputText: text})
              }}
              onSubmitEditing={this.onMessageSend}/>
            <IconButton
              icon='send' 
              size={32}
              color={colors.primary}
              onPress={this.onMessageSend}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

}
