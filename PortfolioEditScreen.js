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
  Linking
} from "react-native";
import { Card, Title, Paragraph, Button, IconButton, Subheading, Caption, Headline } from 'react-native-paper';
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { getDataModel } from "./DataModel";
import { portfoEditStyles, colors } from "./Styles";
import { EditInfo } from "./Component";

export class PortfolioEditScreen extends React.Component {
  constructor(props) {
    super(props);
    this.dataModel = getDataModel();
    this.currentUser = this.props.route.params.currentUser;
    this.userId = this.props.route.params.userId;
    this.userThisPortfo=[];
    this.portfoPic ='';
    this.portfoPicKey="";
    this.mode =  this.props.route.params.mode;
   
    
    this.props.navigation.setOptions({
      headerRight: () => (
        <MaterialCommunityIcons
          name="content-save"
          size={24}
          color="black"
          onPress={() => this.onSavePortfo()}
        />
      ),
    });
    console.log("on portfo edit", this.props.route.params);
    let initTitle;
    let initDscrp;
    let initURL;
    console.log("routeeee", this.props.route.params.portfoContent);
    if (this.props.route.params.portfoKey){
        //edit portfolio
        this.portfoKey = this.props.route.params.portfoKey;
        initTitle = this.props.route.params.portfoContent.portfoTitle;
        initDscrp = this.props.route.params.portfoContent.portfoDscrp;
        initURL = this.props.route.params.portfoContent.portfoURL;
    }else{
        // new portfolio
        console.log("new portfolio");
        initTitle = [];
        initDscrp = [];
        initURL = [];
    }
    this.state = {
      profileInfo: [
        {
          label: "Title",
          placeholder: "Project title",
          iconName: "account-badge-horizontal-outline",
        },
        {
          label: "Description",
          placeholder: "Describe the project!",
          iconName: "message-text",
        },
        {
          label: "Link",
          placeholder: "include https:// for your project's url",
          iconName: "web",
        },
      ],

      editable: true,
      portTitle: initTitle,
      portDscrp: initDscrp,
      portURL: initURL,
      portfoImage:'',
      isFocused:false
    };
  }

  


  componentDidMount = () => {
    // console.log("profile page",this.userInfo);
    // console.log(this.props.route);
    this.focusUnsubscribe = this.props.navigation.addListener(
      "focus",
      this.onFocus
    );
    console.log(this.props.route.params);
    
    this.loadPic();

  };

  onFocus = () => {
  
    this.subscribeToPortfoPic();
    this.subscribeToThisPortfo();
   
  

  };

  subscribeToThisPortfo = async () => {
    let userId = this.props.route.params.userId;
    this.userThisPortfo = await this.dataModel.loadThisPortfo(userId, this.portfoKey);
    console.log("holaaa",this.userThisPortfo);
    // cannot fetch a list, why?    
    this.onPortfoUpdate();
  };

  onPortfoUpdate = () => {
    console.log("hi");
    this.setState({
      portTitle: this.userThisPortfo.portfoTitle,
      portDscrp: this.userThisPortfo.portfoDscrp,
      portURL: this.userThisPortfo.portfoURL,
    });
   
  };

 
  loadPic = async()=>{
    let userId = this.props.route.params.userId;
    this.portfoPic = await this.dataModel.loadPortfoPic(userId, this.portfoKey);
    console.log(".portfoPicURL",this.portfoPic);
    // let url = this.portfoPic.portfoPicUR;
    // why I cannot return a whole data from loadPortfoPic
    let doc = this.dataModel.getPortfoPicData();
    this.portfoPicKey = doc[0].key;
    console.log("docdoc", this.portfoPicKey);
    this.onPicUpdate( this.portfoPic);
    this.subscribeToPortfoPic();
  }

  subscribeToPortfoPic = async()=>{
    console.log(this.mode);
    console.log("what's the matter pic",this.portfoPic);
    console.log("hey doc doc pic key",this.portfoPicKey);
    let picData = this.props.route.params.picData;
    
   
    let userId = this.props.route.params.userId;
    this.portfoPicFile = await this.dataModel.savePortfoImage(userId,this.portfoKey, picData, this.portfoPicKey, this.hi);
    let url = this.portfoPicFile.portfoPicURL;
    this.portfoKey = this.portfoPicFile.portfoKey;
    this.portfoPicKey = this.portfoPicFile.portfoPicKey;
    // console.log("hey key key",this.portfoPicKey);
    this.onPicUpdate(url);

    //how to get this.portfoKey detected here after it's created by uploading picture?
  }
  hi=()=>{
    console.log("wowwowwow",this.portfoKey);
  }
  onPicUpdate = (pic)=>{
    console.log("ni hao",this.portfoKey);
    console.log("ni hao ah",this.portfoPicKey);
 
    console.log("pic pic pic",pic);
    this.setState({
      portfoImage:pic
    })
  }

  onSavePortfo = async () => {
    console.log("edit page",this.portfoKey);
    // console.log("hihihi");
    console.log("picpic", this.portfoPic);
    if (this.portfoKey) {
      console.log("here?");

      let userInfo = await this.dataModel.savePortfo(
        this.mode,
        this.state.portTitle,
        this.state.portDscrp,
        this.state.portURL,
        this.props.route.params.userId,
        this.portfoKey,
       
      );
    } else {
      console.log("I am new");
      let userInfo = await this.dataModel.savePortfo(
        this.mode,
        this.state.portTitle,
        this.state.portDscrp,
        this.state.portURL,
        this.props.route.params.userId,
        
      );
    }

    this.props.navigation.navigate("Profile", {
        portfoKey: !this.portfoKey ? -1 : this.portfoKey,
    });
  };

  // textFocus=()=>{
  //   this.setState({isFocused:true})
  // }


  render() {
    return (
      <KeyboardAvoidingView 
        style={portfoEditStyles.container}
        behavior={"position"}
        keyboardVerticalOffset={0}
        enabled={true}
        scrollEnabled={true}
      >
         <ScrollView>
      {/* <View style={profileStyles.container}> */}
        <View style={portfoEditStyles.portfoImageContainer}>
          <Image
            style={portfoEditStyles.portfoImage}
            // defaultSource={{<ActivityIndicator/>}}
            source={{uri:this.state.portfoImage}}
          />
        </View>
        <View style={portfoEditStyles.actionContainer}>
                    <Button icon="pencil" mode="text" 
                        color={colors.primary}
                        style={{height:32}}
                        labelStyle={{color:colors.primary, fontSize:14}}
                        onPress={() =>
                          ActionSheetIOS.showActionSheetWithOptions(
                            {
                              options: ["Cancel", "Upload from albums", "Take a picture"],
                              // destructiveButtonIndex: 2,
                              cancelButtonIndex: 0,
                            },
                            (buttonIndex) => {
                              if (buttonIndex === 0) {
                                // cancel actionexpo start
                              } else if (buttonIndex === 1) {
                                this.props.navigation.navigate("Image Picker", {
                                  mode:'portfolio',
                                  currentUser: this.currentUser,
                                  userId: this.userId,
                                  portfoKey: !this.portfoKey ? -1 : this.portfoKey,
                                });
                              } else if (buttonIndex === 2) {
                                console.log(this.userInfo);
                                this.props.navigation.navigate("Camera Screen", {
                                  mode:'portfolio',
                                  currentUser: this.currentUser,
                                  userId: this.userId,
                                  portfoKey: !this.portfoKey ? -1 : this.portfoKey,
                                });
                              }
                            }
                          )
                        }
                        >Edit Photo</Button>
                  </View>
        <EditInfo
          icon={this.state.profileInfo[0].iconName}
          label={this.state.profileInfo[0].label}
          info={this.state.portTitle}
          placeholder={this.state.profileInfo[0].placeholder}
          editable={this.state.editable}
          onChange={(text) => {
            this.setState({ portTitle: text.nativeEvent.text });
          }}
          value={this.state.portTitle}
        />
        <EditInfo
          icon={this.state.profileInfo[1].iconName}
          label={this.state.profileInfo[1].label}
          info={this.state.portDscrp}
          placeholder={this.state.profileInfo[1].placeholder}
          editable={this.state.editable}
          onChange={(text) => {
            this.setState({ portDscrp: text.nativeEvent.text });
          }}
          value={this.state.portDscrp}
        />
        <EditInfo
          icon={this.state.profileInfo[2].iconName}
          label={this.state.profileInfo[2].label}
          info={this.state.portURL}
          placeholder={this.state.profileInfo[2].placeholder}
          editable={this.state.editable}
          textContentType='URL'
        
          onChange={(text) => {
            this.setState({ portURL: +text.nativeEvent.text });
          }}
          value={this.state.portURL}
          // onFocus={()=>this.textFocus()}
        />
      {/* </View> */}
      </ScrollView>
       </KeyboardAvoidingView >
    );
  }
}
