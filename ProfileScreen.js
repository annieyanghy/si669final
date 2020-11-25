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
  Linking
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Avatar, Accessory, Divider, Icon, } from "react-native-elements";
import { Card, Title, Paragraph,Button } from 'react-native-paper';


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
    this.userPic = [];
    this.userPortfo =[]
    // console.log(this.currentUser.imageURL);
    // this.props.navigation.setOptions({
    //   headerRight: () => (
    //     // <MaterialCommunityIcons
    //     //   name="pencil"
    //     //   size={24}
    //     //   color="black"
    //     //   onPress={() =>
    //     //     this.props.navigation.navigate("Edit Profile", {
    //     //       currentUser: this.currentUser,
    //     //       userId: this.userId,
    //     //     })
    //     //   }
    //     // />
    //   ),
    // });
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
      infoSchool: "",
      infoCompany: "",
      infoWeb: "",
      theImage: this.currentUser.imageURL,
      portfoList:this.userPortfo,
      portTitle: "",
      portDscrp: "",
      portURL: "",
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
    this.subscribeToPortfo();

  };

  onFocus = () => {
    this.subscribeToInfo();
    this.subscribeToUserPic();
 
  

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
      infoSchool: this.userInfo.userSchool,
      infoCompany: this.userInfo.userCompany,
      infoWeb: this.userInfo.userWeb,
    });
  };

  loadPic = async()=>{
    let userId = this.props.route.params.userId;
    this.userPic = await this.dataModel.loadProfilePic(userId);
    this.onPicUpdate(this.userPic);
  }

  subscribeToUserPic = async()=>{
    let picData = this.props.route.params.picData;
    console.log("hihihi");
    console.log("pic data", this.props.route.params.picData);
    let userId = this.props.route.params.userId;
    let url = await this.dataModel.saveProfileImage(userId, picData);
   
    this.onPicUpdate(url);
  }

  onPicUpdate = (pic)=>{
    console.log("currentuser",this.currentUser.imageURL);
    console.log("this userPic",this.userPic);
    console.log("pic pic pic",pic);
    this.setState({
        theImage:pic
    })
  }

  subscribeToPortfo = async () => {
    let userId = this.props.route.params.userId;
    this.userPortfo = await this.dataModel.loadPortfo(userId);

    this.onPortfoUpdate();
  };

  onPortfoUpdate = () => {
    console.log("hi");
    this.setState({
      portfoList: this.userPortfo,
 
    });
  };
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
                  <Button icon="pencil" mode="contained" 
                      color={colors.primary}
                      labelStyle={{color:'white'}}
                      onPress={() =>
                      this.props.navigation.navigate("Edit Profile", {
                        currentUser: this.currentUser,
                        userId: this.userId,
                      })
                    }
                      >Edit</Button>
                  <EditInfo
                    icon={this.state.profileInfo[0].iconName}
                    label={this.state.profileInfo[0].label}
                    info={this.state.infoName}
                    placeholder={this.state.profileInfo[0].placeholder}
                    editable={this.state.editable}
                  />
                  <EditInfo
                    icon={this.state.profileInfo[1].iconName}
                    label={this.state.profileInfo[1].label}
                    info={this.state.infoSchool}
                    placeholder={this.state.profileInfo[1].placeholder}
                    editable={this.state.editable}
                  />
                  <EditInfo
                    icon={this.state.profileInfo[2].iconName}
                    label={this.state.profileInfo[2].label}
                    info={this.state.infoCompany}
                    placeholder={this.state.profileInfo[2].placeholder}
                    editable={this.state.editable}
                  />
                  <EditInfo
                    icon={this.state.profileInfo[3].iconName}
                    label={this.state.profileInfo[3].label}
                    info={this.state.infoWeb}
                    placeholder={this.state.profileInfo[3].placeholder}
                    editable={this.state.editable}
                  />
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
                    <Divider style={{ backgroundColor: colors.primary, height:2 }} />
                    <Card style={profileStyles.cardContainer}>
                    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                      <Card.Title title={item.portfoTitle} subtitle={item.portfoDscrp}/>
                      <Card.Actions>
                      <Button icon="pencil" mode="contained" 
                      color={colors.primary}
                      labelStyle={{color:'white'}}
                      >Edit</Button>
                      <Button icon="web" mode="contained" 
                      color={colors.primary}
                      labelStyle={{color:'white'}}
                      onPress={()=>Linking.openURL('http://google.com')}
                      >Open URL

                      </Button>
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
