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
        // this.checkFollowing();
        // this.checkChatFromFollower();
      }
    
      onFocus = () =>{
        this.generateList();
      //  this.checkFollowing();
      //  this.checkChatFromFollower();
      }

      generateList = async()=>{
        //check following
        let templist =  await this.dataModel.loadFollowing(this.currentUser);
        this.friendList=[];
        for (let i of templist){
          for (let otheruser of this.otherUsers){
            if (i.docUserId == otheruser.userId){
              otheruser.status = "following";
              this.friendList.push(otheruser);
            }
          }
        }
        this.chatlist=[];
            let id =  this.currentUser.userId;
            await this.dataModel.checkChatFromFollower(id);
            let followerId = this.dataModel.returnFollowerList();
         
            let followerList=[];
            let followingList =[];
            let mutualFollowList=[];
            
            for (let follower of followerId){
              for (let following of templist){
                for (let otheruser of this.otherUsers){
                  console.log("following list", following);
                  console.log("my follower", follower);
                    //check followers
                  if (follower == otheruser.userId && follower !==following.docUserId){
                    otheruser.status = "follower";
                    followerList.push(otheruser);
                    this.chatFriend.push(otheruser);
                  }else if(following.docUserId == otheruser.userId && follower !==following.docUserId){
                      //check following
                      otheruser.status = "following";
                      followingList.push(otheruser);
                      this.chatFriend.push(otheruser);
                  }else if( following.docUserId == otheruser.userId && follower ==following.docUserId){
                    //check mutual follow
                    otheruser.status = "mutual";
                    mutualFollowList.push(otheruser);
                    this.chatFriend.push(otheruser);
                  }
                }
              }
            }
            this.setState({people:this.chatFriend})

      }

      // checkFollowing = async ()=>{
      //   let templist =  await this.dataModel.loadFollowing(this.currentUser);
      //   this.friendList=[];
      //   for (let i of templist){
      //     for (let otheruser of this.otherUsers){
      //       if (i.docUserId == otheruser.userId){
      //         otheruser.status = "following";
      //         this.friendList.push(otheruser);
      //       }
      //     }
      //   }
      //   this.setState({people:this.friendList})    
      //   }

        // checkChatFromFollower = async()=>{
          
        //   this.chatlist=[];
        //     let id =  this.currentUser.userId;
        //     await this.dataModel.checkChatFromFollower(id);
        //     let followerId = this.dataModel.returnFollowerList();
         
        //     let followerList=[];
        //     for (let i of followerId){
        //       for (let following of this.friendList){
        //         for (let otheruser of this.otherUsers){
        //           console.log("following list", following);
        //           console.log("my follower", i);
        //           if (i == otheruser.userId && i !==following.userId){
        //             otheruser.status = "follower";
        //             followerList.push(otheruser);
        //           }
        //         }
        //       }
             
              
        //     }
        //     this.chatlist = this.friendList.concat(followerList);
        //     console.log("chatlist",this.chatlist);
        //     this.setState({people:this.chatlist})
        // }

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
      }
      handleToggleView=()=>{
        let value;
        let style;
        let col;
        if (this.state.toggleView=='right'){
          value ='left',
          style = chatFriendStyles.personRow,
          col = 1
        }else if (this.state.toggleView=='left'){
          value ='right',
          style = chatFriendStyles.personCard,
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
                            iconStyle ={{ backgroundColor: colors.primaryLight }}
                            placeholderStyle={{ backgroundColor: colors.primaryLight }}
                            size="medium">
                            </Avatar>
                      </View>
                      <View style={chatFriendStyles.designerInfoContainer}>
                      <Caption>{ item.status == "follower"? item.userName + " follows you.":null}</Caption>
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
                                         
                                          // userId: this.userId,
                                          // portfoKey: item.key,
                                          // portfoContent: item
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
 