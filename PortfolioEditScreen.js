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
import { profileStyles, colors } from "./Styles";
import { EditInfo } from "./Component";

export class PortfolioEditScreen extends React.Component {
  constructor(props) {
    super(props);
    this.dataModel = getDataModel();
    this.currentUser = this.props.route.params.currentUser;
    this.userId = this.props.route.params.userId;
    this.userPortfo=[];
    this.portfoPic ='';
    
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
      portfoImage:''
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
   
  

  };

  subscribeToPortfo = async () => {
    let userId = this.props.route.params.userId;
    this.userPortfo = await this.dataModel.loadPortfo(userId);
    // cannot fetch a list, why?    
    this.onPortfoUpdate();
  };

  onPortfoUpdate = () => {
    console.log("hi");
    this.setState({
      portTitle: this.userPortfo.portfoTitle,
      portDscrp: this.userPortfo.portfoDscrp,
      portURL: this.userPortfo.portfoURL,
    });
   
  };

  onSavePortfo = async () => {
    console.log("edit page",this.portfoKey);
    // console.log("hihihi");

    if (this.portfoKey) {
      console.log("here?");

      let userInfo = await this.dataModel.savePortfo(
        this.state.portTitle,
        this.state.portDscrp,
        this.state.portURL,
        this.props.route.params.userId,
        this.portfoKey
      );
    } else {
      console.log("I am new");
      let userInfo = await this.dataModel.savePortfo(
        this.state.portTitle,
        this.state.portDscrp,
        this.state.portURL,
        this.props.route.params.userId
      );
    }

    this.props.navigation.navigate("Profile", {
        portfoKey: !this.portfoKey ? -1 : this.portfoKey,
    });
  };

  loadPic = async()=>{
    let userId = this.props.route.params.userId;
    this.portfoPic = await this.dataModel.loadPortfoPic(userId, this.portfoKey);
    this.onPicUpdate(this.portfoPic);
  }

  subscribeToPortfoPic = async()=>{
    let picData = this.props.route.params.picData;
    console.log("hihihi");
    console.log("pic data", this.props.route.params.picData);
    let userId = this.props.route.params.userId;
    let url = await this.dataModel.savePortfoImage(userId,this.portfoKey, picData);
   
    this.onPicUpdate(url);
  }

  onPicUpdate = (pic)=>{
    console.log("currentuser",this.currentUser.imageURL);
    console.log("this userPic",this.portfoPic);
    console.log("pic pic pic",pic);
    this.setState({
      portfoImage:pic
    })
  }

  render() {
    return (
      <View style={profileStyles.container}>
        <View style={profileStyles.portfoImageContainer}>
          <Image
            style={profileStyles.portfoImage}
            // defaultSource={{<ActivityIndicator/>}}
            source={{uri:this.state.portfoImage}}

            // {{uri:this.state.portfoImage}}
          />
        </View>
        <View style={profileStyles.actionContainer}>
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
            this.setState({ portURL: text.nativeEvent.text });
          }}
          value={this.state.portURL}
        />
      </View>
    );
  }
}
