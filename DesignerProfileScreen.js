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
import { designerStyles, profileStyles, colors } from "./Styles";
import { EditInfo } from "./Component";

export class DesignerProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.dataModel = getDataModel();
    this.userInfo = this.props.route.params.viewedDesigner;
    this.currentUser = this.props.route.params.currentUser;
    this.userId = this.props.route.params.viewedDesigner.userId;
    this.portfoKey = this.props.route.params.portfoKey;
    this.userPic = [];
    this.userPortfo =[];
    console.log(this.props.route);
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
    let userId = this.props.route.params.viewedDesigner.userId;
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
    let userId = this.props.route.params.viewedDesigner.userId;
    this.userPic = await this.dataModel.loadProfilePic(userId);
    this.onPicUpdate(this.userPic);
  }

  subscribeToUserPic = async()=>{
    let picData = this.props.route.params.picData;
    console.log("pic data", this.props.route.params.picData);
    let userId = this.props.route.params.viewedDesigner.userId;
    let url = await this.dataModel.saveProfileImage(userId, picData);
   
    this.onPicUpdate(url);
  }

  onPicUpdate = (pic)=>{
    this.setState({
        theImage:pic
    })
  }

  subscribeToPortfo = async () => {
    let userId = this.props.route.params.viewedDesigner.userId;
    
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
  };

  onPortfoUpdate = () => {
    console.log("hi");
    console.log("what's inside it yoyo",this.userPortfo);
    this.setState({
      portfoList: this.userPortfo,
    });
  };
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
                  <View style={designerStyles.actionContainer}>
                    <Button icon="comment" mode="contained" 
                        color={colors.primary}
                        style={{height:32}}
                        labelStyle={{color:colors.primaryLight, fontSize:14}}
                        onPress={() =>
                        this.props.navigation.navigate("Chat", {
                          currentUser: this.currentUser,
                          userId: this.userId,
                        })
                      }
                        >Chat</Button>
                  </View>
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

                        {/* <Button icon="pencil" mode="outline" 
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
                        ></Button> */}
                      </Card.Actions>
                    </Card>
                      
                </View>
                )
              }}
              
              />

          </View>
      </View>
      
      
    );
  }
}
