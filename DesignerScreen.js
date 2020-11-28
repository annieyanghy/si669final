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
import { Avatar, Accessory, Divider, Icon, SocialIcon, SearchBar } from "react-native-elements";
import { Card, Title, Paragraph, Button, IconButton, Subheading, Caption, Headline, ToggleButton } from 'react-native-paper';

import { UserContext } from './LoginScreen';

import { getDataModel } from "./DataModel";
import { designerStyles, colors } from "./Styles";


export class DesignersScreen extends React.Component {
     
    constructor(props) {
        super(props);
        // console.log(this.props.navigation.getParam('currentUserInfo'));
        this.dataModel = getDataModel();
        this.currentUser = this.dataModel.fetchWhoIsUser();
        
        // this.currentUser = this.props.route.params.currentUser;
        // this.chatMode = this.props.route.params.readChat;
    
        // this.self = this.props.route.params.currentUser;
        // this.other = this.props.route.params.otherUser;
    
     

        //all users' profile information
      
        this.allUserInfo=[];
        this.allUserInfo = this.dataModel.deliverAllUserProfile();
        // console.log("hihihihihi",this.currentUser);
        // console.log("getUser()",allUsers);
        // console.log("all users info, this.alluserinfo",this.allUserInfo);
        this.otherUsers = [];
        for (let user of this.allUserInfo) {
          if (user.userId !== this.currentUser.userId) {
            console.log(user.key);
            this.otherUsers.push(user);
          }
        }
        //all users' login info
        let allUsers = this.dataModel.getUsers();
        for (let x of allUsers){
          for (let other of this.otherUsers){
            if (x.key == other.userId){
              other.profilePicURL = x.imageURL
            }
          }
         
        };
        console.log("what's all users",allUsers);
        console.log("what's other user",this.otherUsers);
    
        this.state = {
          people: this.otherUsers,
          search:'',
          toggleView:'right',
          styleView:designerStyles.personCard,
          numofCol:2
        }
      }
    
      componentDidMount = () => {
        this.dataModel.getAllUserInfo();
        this.focusUnsubscribe = this.props.navigation.addListener(
          "focus",
          this.onFocus
        );
       
      }
    
      onFocus = () =>{
       
      }

      updateSearch = (search) => {
        console.log(search);
        // let query = search.toLowerCase()
        let query=[];
        let format = search.toLowerCase();
        if (search.length>0){
          query = this.state.people.filter(e => 
            e.userName.toLowerCase().includes(format)|| e.userSchool.toLowerCase().includes(format)|| e.userCompany.toLowerCase().includes(format));
        }else if(search.length==0){
          query = this.otherUsers
        }
       
        console.log(this.filteredPople)
        this.setState({ 
          search: search,
          people: query
         });
      };
      handleCancel=()=>{
        console.log("hihihi");
       
        this.setState({ 
         
          people: this.otherUsers
         });
      }
      handleToggleView=()=>{
        let value;
        let style;
        let col;
        if (this.state.toggleView=='right'){
          value ='left',
          style = designerStyles.personRow,
          col = 1
        }else if (this.state.toggleView=='left'){
          value ='right',
          style = designerStyles.personCard,
          col=2
        };
        console.log(value);
        this.setState({
          toggleView:value,
          styleView:style,
          numofCol:this.state.toggleView =='right'? 1:2
        })
      }
    
      render() {
        return (

          <View style={designerStyles.container}>
            <View style={designerStyles.peopleListContainer}>
              <FlatList
                numColumns={this.state.numofCol}
                key={this.state.numofCol}
                data={this.state.people}
                ListHeaderComponent={
                  <View>
                    <ToggleButton.Row
                      onValueChange={(value)=>this.setState({toggleView:value})}
                      value={this.state.toggleView}
                      
                    >
                      <ToggleButton
                          icon="view-stream"
                          value="left"
                          // status={status}
                          onPress={this.handleToggleView}
                          style={{height:32, width:32,borderColor:colors.outline}}
                          size={18}
                        />
                         <ToggleButton
                          icon="view-grid"
                          value="right"
                          // status={status}
                          style={{height:32, width:32,borderColor:colors.outline}}
                          onPress={this.handleToggleView}
                          size={18}
                        />
                    </ToggleButton.Row>
                  <SearchBar
                    placeholder="Type Here..."
                    onChangeText={this.updateSearch}
                    value={this.state.search}
                    round={true}
                    lightTheme={true}
                    platform='ios'
                    cancelButtonTitle="Cancle"
                    showCancel={true}
                    onCancel={this.handleCancel}
                    cancelButtonProps={{buttonTextStyle:{fontSize:14}}}
                    inputContainerStyle={{height:16, borderRadius:20}}
                    inputStyle={{fontSize:16}}
                    containerStyle={{marginVertical:10}}
                  />
                  </View>
                }
                renderItem={({item, index})=> {
                  return (
                    <TouchableOpacity 
                      style={this.state.styleView}
                      onPress={()=> {
                        this.props.navigation.navigate('Designer Profile', {
                          currentUser: this.currentUser,
                          viewedDesigner:item,
                        });
                      }}
                    >
                     
                      <View style={designerStyles.avatarContainer}>
                          <Avatar 
                            source={{uri:item.profilePicURL}} 
                            rounded
                            icon={{name:'account',type:'material-community'}}
                            iconStyle ={{ backgroundColor: colors.primaryLight }}
                            placeholderStyle={{ backgroundColor: colors.primaryLight }}
                            size="medium">
                            </Avatar>
                      </View>
                      <View style={designerStyles.designerInfoContainer}>
                          <Title>{item.userName}</Title>
                          <Subheading>{item.userJob}</Subheading>
                          <Caption>{item.userCompany}</Caption>
                          <Caption>{item.userSchool}</Caption>
                      

                          <View style={designerStyles.linkContainer}>
                              <SocialIcon
                                  dark
                                  type='linkedin'
                                  iconSize ={18}
                                  style={{width:28, height:28, margin:10}}
                                  onPress={()=>Linking.openURL(this.state.infoLinkedin)}
                              />
                              <View style={designerStyles.iconbuttonContainer} >
                                <IconButton
                                  icon="web"
                                  color='white'
                                  size={20}
                                  animated={true}
                                  style={designerStyles.iconbutton}
                                  onPress={()=>Linking.openURL(this.state.infoWeb)}
                                  
                                />
                              </View>
                            </View>
                        </View>
                       
                    </TouchableOpacity>
                  );
                }}
              /> 
             </View>
          </View> 
   
        )
      }
    }
 