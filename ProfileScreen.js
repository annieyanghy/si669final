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
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Avatar, Accessory, Divider, Icon, SocialIcon } from "react-native-elements";
import { Card, Title, Paragraph, Button, IconButton, Subheading, Caption, Headline } from 'react-native-paper';


import { getDataModel } from "./DataModel";
import { profileStyles, colors } from "./Styles";
import { EditInfo } from "./Component";

export class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.dataModel = getDataModel();
    this.userInfo = this.props.route.params.userInfoKey;
    this.currentUser = this.props.route.params.currentUser;
    this.userId = this.props.route.params.userId;
    this.portfoKey = this.props.route.params.portfoKey;
    this.userPic = [];
    this.userPortfo =[];
    
    this.portfoPic ='';
    this.state = {
      profileInfo: [
        {
          label: "Name",
          placeholder: "My name",
          iconName: "account-badge-horizontal-outline",
        },
        {
          label: "Education",
          placeholder: "School or certificate",
          iconName: "school",
        },
        {
          label: "Company",
          placeholder: "Recent company",
          iconName: "briefcase",
        },
        {
          label: "Website",
          placeholder: "My portfolio website",
          iconName: "web",
        },
      ],
      editable: false,
      infoName: "",
      infoJobTitle:"",
      infoSchool: "",
      infoCompany: "",
      infoWeb: "",
      infoLinkedin:"",
      theImage: this.currentUser.imageURL,
      portfoList:this.userPortfo,
      portTitle: "",
      portDscrp: "",
      portURL: "",
      portfoImage:"",
    };
  }

  componentDidMount = () => {
    // console.log("profile page",this.userInfo);
    // console.log(this.props.route);
    this.focusUnsubscribe = this.props.navigation.addListener(
      "focus",
      this.onFocus
    );
    this.loadPic();
   

  };

  componentWillUnmount =()=>{
    this.subscribeToPortfo();
  }

  onFocus = () => {
    this.subscribeToInfo();
    this.subscribeToUserPic();
    this.subscribeToPortfo();
    // this.loadPortfoPic();

  };

  subscribeToInfo = async () => {
    let userId = this.props.route.params.userId;
    this.userInfo = await this.dataModel.loadProfile(userId);
    console.log("profile page subscribe", this.userInfo);
    this.onInfoUpdate();
  };

  onInfoUpdate = () => {
    this.setState({
      infoName: this.userInfo.userName,
      infoJobTitle: this.userInfo.userJob,
      infoSchool: this.userInfo.userSchool,
      infoCompany: this.userInfo.userCompany,
      infoWeb: this.userInfo.userWeb,
      infoLinkedin: this.userInfo.userLinkedin
    });
  };

  loadPic = async()=>{
    let userId = this.props.route.params.userId;
    this.userPic = await this.dataModel.loadProfilePic(userId);
    this.onPicUpdate(this.userPic);
  }

  subscribeToUserPic = async()=>{
    let picData = this.props.route.params.picData;
    console.log("pic data", this.props.route.params.picData);
    let userId = this.props.route.params.userId;
    let url = await this.dataModel.saveProfileImage(userId, picData);
   
    this.onPicUpdate(url);
  }

  onPicUpdate = (pic)=>{
    this.setState({
        theImage:pic
    })
  }

  subscribeToPortfo = async () => {
    let userId = this.props.route.params.userId;
    
    let templist = await this.dataModel.loadPortfo(userId);
    
    let list = templist;
    console.log("idx idx",list);
    for (let idx of list ){
      console.log("which one ?",idx);
      this.portfoPic = await this.dataModel.loadPortfoPic(userId,idx.key);
      console.log("portfo pic which one ?",idx);
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
  
  // loadPortfoPic = async()=>{
  //   let userId = this.props.route.params.userId;
  //   console.log("hey yo!",this.props.route.params)
  //   console.log("hey yo!",this.portfoKey)
    
  //   this.portfoPic = await this.dataModel.loadPortfoPic(userId, this.portfoKey);
  //   this.onPortfoPicUpdate(this.portfoPic);
  // }

  // subscribeToPortfoPic = async()=>{
  //   let picData = this.props.route.params.picData;
  //   console.log("hihihi");
  //   console.log("pic data", this.props.route.params.picData);
  //   let userId = this.props.route.params.userId;
  //   let url = await this.dataModel.savePortfoImage(userId,this.portfoKey, picData);
  //   this.onPicUpdate(url);
  // }

  onPortfoPicUpdate = (pic)=>{
    console.log("portfolio piccccc",pic);
    this.setState({
      portfoImage:pic
    })
  }

  render() {
    return (
      
      <View style={profileStyles.container}>


          <View style={profileStyles.portfoContainer}>
              <FlatList
              data={this.state.portfoList}
              ListHeaderComponent={
                
                <View style={profileStyles.infoContainer}>
                <View style={profileStyles.imageContainer}>
                    <Avatar
                      source={{uri:this.state.theImage}}
                      avatarStyle={profileStyles.mainImage}
                      rounded
                      icon={{name:'account',type:'material-community'}}
                      iconStyle ={{ backgroundColor: colors.primaryLight }}
                      placeholderStyle={{ backgroundColor: colors.primaryLight }}
                      size="large"
                    >
                      <Accessory
                        size={26}
                        underlayColor={colors.primary}
                        name='pencil'
                        type='material-community'
                      
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
                                  currentUser: this.currentUser,
                                  userId: this.userId,
                                  userInfoKey: !this.userInfo ? -1 : this.userInfo.key,
                                });
                              } else if (buttonIndex === 2) {
                                console.log(this.userInfo);
                                this.props.navigation.navigate("Camera Screen", {
                                  currentUser: this.currentUser,
                                  userId: this.userId,
                                  userInfoKey: !this.userInfo ? -1 : this.userInfo.key,
                                });
                              }
                            }
                          )
                        }
                      />
                    </Avatar>
                    
                  </View>
                  <View style={profileStyles.infoDisplay}>
                    <Title>{this.state.infoName}</Title>
                    <Subheading>{this.state.infoJobTitle}</Subheading>
                    <Caption>{this.state.infoSchool}</Caption>
                    <Caption>{this.state.infoCompany}</Caption>
                  </View>
                  <View style={profileStyles.linkContainer}>
                    <SocialIcon
                        dark
                        type='linkedin'
                        iconSize ={20}
                        style={{width:36, height:36, margin:10}}
                        onPress={()=>Linking.openURL(this.state.infoLinkedin)}
                      />
                      <View style={profileStyles.iconbuttonContainer} >
                      <IconButton
                        icon="web"
                        color='white'
                        size={20}
                        style={{width:36, height:36, margin:10, backgroundColor:colors.primary, borderRadius:50}}
                        onPress={()=>Linking.openURL(this.state.infoWeb)}
                      />
                      </View>
                  </View>
                  <View style={profileStyles.actionContainer}>
                    <Button icon="pencil" mode="text" 
                        color={colors.primary}
                        style={{height:32}}
                        labelStyle={{color:colors.primary, fontSize:14}}
                        onPress={() =>
                        this.props.navigation.navigate("Edit Profile", {
                          currentUser: this.currentUser,
                          userId: this.userId,
                        })
                      }
                        >Edit</Button>
                  </View>
                  {/* <EditInfo
                    icon={this.state.profileInfo[0].iconName}
                    // label={this.state.profileInfo[0].label}
                    info={this.state.infoName}
                    placeholder={this.state.profileInfo[0].placeholder}
                    editable={this.state.editable}
                  />
                  <EditInfo
                    icon={this.state.profileInfo[1].iconName}
                    // label={this.state.profileInfo[1].label}
                    info={this.state.infoSchool}
                    placeholder={this.state.profileInfo[1].placeholder}
                    editable={this.state.editable}
                  />
                  <EditInfo
                    icon={this.state.profileInfo[2].iconName}
                    // label={this.state.profileInfo[2].label}
                    info={this.state.infoCompany}
                    placeholder={this.state.profileInfo[2].placeholder}
                    editable={this.state.editable}
                  /> */}
                  {/* <EditInfo
                    icon={this.state.profileInfo[3].iconName}
                    label={this.state.profileInfo[3].label}
                    info={this.state.infoWeb}
                    placeholder={this.state.profileInfo[3].placeholder}
                    editable={this.state.editable}
                  /> */}
                    <Divider style={profileStyles.dividerStyle} />
                    <Title>My Portfolio</Title>
        </View>
        
              }
              ListEmptyComponent={() =>
                  <Text style={profileStyles.emptyMsg}>
                    No portfolio yet.{"\n"}Tap "+" to add your work!
                  </Text>                
              }
              renderItem={({ item, index }) => {
                return(
                  <View >
                    <Card style={profileStyles.cardContainer}>
                    <Card.Cover source={{ uri: item.portfoPicURL }} />
                      {/* <Card.Title title={item.portfoTitle} subtitle={item.portfoDscrp}/> */}
                      <Card.Content>
                        <Title>{item.portfoTitle}</Title>
                        <Paragraph>{item.portfoDscrp}</Paragraph>
                      </Card.Content>
                      <Card.Actions>
                      <Button icon="web" mode="contained" 
                        color={colors.primary}
                        labelStyle={{color:'white'}}
                        onPress={()=>Linking.openURL(item.portfoURL)}
                        >Open URL
                        </Button>

                        <Button icon="pencil" mode="outline" 
                        color={colors.primary}
                        labelStyle={{color:colors.primary}}
                        onPress={ ()=>
                          this.props.navigation.navigate("Edit Portfolio", {
                                currentUser: this.currentUser,
                                userId: this.userId,
                                portfoKey: item.key,
                                portfoContent: item
                              })}
                        ></Button>

                        <Button icon="delete" mode="outline" 
                        color={colors.primary}
                        labelStyle={{color:colors.primary}}
                        onPress={()=>this.dataModel.onDeletePortfo(item, this.userId)}
                        ></Button>
                      </Card.Actions>
                    </Card>
                      
                </View>
                )
              }}
              
              />

          </View>
          <Button
                icon="plus"
                size={15}
                color={colors.primary}
                mode="contained"
                labelStyle={{color:'white'}}
                onPress={ ()=>
                  this.props.navigation.navigate("Edit Portfolio", {
                        currentUser: this.currentUser,
                        userId: this.userId,
                      })}
            >Add Portfolio</Button>
      </View>
      
      
    );
  }
}