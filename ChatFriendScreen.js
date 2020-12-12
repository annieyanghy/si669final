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


import { getDataModel } from "./DataModel";
import { chatFriendStyles, colors } from "./Styles";


export class ChatFriendScreen extends React.Component {
     
    constructor(props) {
        super(props);

        this.dataModel = getDataModel();
        this.currentUser = this.dataModel.fetchWhoIsUser();
        this.chatFriend=[];
        this.allUserInfo=[];
        this.allUserInfo = this.dataModel.deliverAllUserProfile();
     
        this.otherUsers = [];
        for (let user of this.allUserInfo) {
          if (user.userId !== this.currentUser.userId) {
            this.otherUsers.push(user);
          }
        }
        console.log("otherusers",this.otherUsers);
        //all users' login info
        let allUsers = this.dataModel.getUsers();
        for (let x of allUsers){
          for (let other of this.otherUsers){
            if (x.key == other.userId){
              other.profilePicURL = x.imageURL
            }
          }
         
        };

        this.state = {
          people: [],
          search:'',
          toggleView:'left',
          styleView:chatFriendStyles.personRow,
         
        }
      }
    
      componentDidMount = () => {
        this.dataModel.getAllUserInfo();
        this.focusUnsubscribe = this.props.navigation.addListener(
          "focus",
          this.onFocus
        );
        this.generateList();
      }
    
      onFocus = () =>{
        this.generateList();
      }

      generateList = async()=>{
        
            let templist =  await this.dataModel.loadFollowing(this.currentUser);
            let id =  this.currentUser.userId;
            await this.dataModel.checkChatFromFollower(id);
            let followerId = this.dataModel.returnFollowerList();
            this.chatFriend=[];
            let followerList=[];
            let followingList =[];
            let mutualFollowList=[];

            for (let otheruser of this.otherUsers){
              for (let following of templist){
                if (following.docUserId == otheruser.userId && !followerId.includes(following.docUserId )){
                  otheruser.status = "following";
                  
                  followingList.push(otheruser);
                }else if(following.docUserId == otheruser.userId && followerId.includes(following.docUserId )){
                  otheruser.status = "mutual";
                    
                  mutualFollowList.push(otheruser);
                }
                else if(!followerId.includes(following.docUserId) && followerId.includes(otheruser.userId)){
                  otheruser.status = "follower";  
                  followerList.push(otheruser);
                
                }

              }
            };

              console.log("followingList!!!",followingList);
              console.log("mutualFollowList",mutualFollowList);
            
                console.log("followers list!",followerList);
            
  
            let tempComboList = followingList.concat(followerList);
            let uniqueChatFriendList = tempComboList.filter((v,i,a)=>a.indexOf(v)===i);
            console.log("uniqueChatFriendList",uniqueChatFriendList);
            this.setState({people:uniqueChatFriendList})

      };

      

      updateSearch = (search) => {
        console.log(search);
        // let query = search.toLowerCase()
        let query=[];
        let format = search.toLowerCase();
        if (search.length>0){
          query = this.state.people.filter(e => 
            e.userName.toLowerCase().includes(format)|| e.userSchool.toLowerCase().includes(format)|| e.userCompany.toLowerCase().includes(format));
        }else if(search.length==0){
          query = this.chatlist
        }

        this.setState({ 
          search: search,
          people: query
         });
      };

      handleCancel=()=>{
        console.log("hihihi");
       
        this.setState({ 
         
          people:this.chatlist
         });
      };

     
      render() {
          return (

            <View style={chatFriendStyles.container}>
              <View style={chatFriendStyles.peopleListContainer}>
                <FlatList
                  numColumns={1}
                  data={this.state.people}
                  keyExtractor={(item, index) => index.toString()}
                  ListHeaderComponent={
                    <View>
                    <SearchBar
                      placeholder="Search..."
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
                        // onPress={()=> {
                        //   this.props.navigation.navigate('Designer Profile', {
                        //     currentUser: this.currentUser,
                        //     viewedDesigner:item,
                        //   });
                        // }}
                      >
                      
                        <View style={chatFriendStyles.avatarContainer}>
                            <Avatar 
                              source={{uri:item.profilePicURL}} 
                              rounded
                              icon={{name:'account',type:'material-community'}}
                              iconStyle ={{ backgroundColor: colors.secondaryLight }}
                              placeholderStyle={{ backgroundColor: colors.secondaryLight }}
                              size="medium">
                              </Avatar>
                        </View>
                        <View style={chatFriendStyles.designerInfoContainer}>
                        <Caption>{ item.status == "follower"?item.userName + " follows you.":null}</Caption>
                            <Title>{item.userName}</Title>
                            <Subheading>{item.userJob}</Subheading>
                            
                            <Caption>{item.userCompany} / {item.userSchool}</Caption>
                          

                  
                          </View>
                          <View>
                          <IconButton
                            icon="chevron-right"
                            color='white'
                            size={20}
                            style={{width:36, height:36, margin:10, backgroundColor:colors.primary, borderRadius:50}}
                            onPress={()=> this.props.navigation.navigate("ChatScreen", {
                                            currentUser: this.currentUser,
                                            otherUser:item,
                                          })}
                        />

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