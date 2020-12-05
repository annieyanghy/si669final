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
        // console.log(this.props.navigation.getParam('currentUserInfo'));
        this.dataModel = getDataModel();
        this.currentUser = this.dataModel.fetchWhoIsUser();
    
        this.allUserInfo=[];
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
          toggleView:'right',
          styleView:chatFriendStyles.personCard,
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
       this.checkFollowing();
      }

      checkFollowing = async ()=>{
        console.log("hello chatfriend");
        let templist =  await this.dataModel.loadFollowing(this.currentUser);
        console.log("tempkist",templist);
        this.friendList=[];
        for (let i of templist){
          console.log("iii",i.docUserId);
          this.user = await this.dataModel.loadProfile(i.docUserId);
          //need a datamodel that directly return userinfo by inputing userId
          
          console.log("heyhey",this.user);
          this.friendList.push(this.user);
        }
        console.log("whi am I follow",this.friendList);
       this.setState({people:this.friendList})
        
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

      goChat=()=>{
        this.props.navigation.navigate("ChatScreen", {
          currentUser: this.currentUser,
          // userId: this.userId,
          // portfoKey: item.key,
          // portfoContent: item
        })
      }


    
      render() {
        return (

          <View style={chatFriendStyles.container}>
            <View style={chatFriendStyles.peopleListContainer}>
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
                          onPress={()=>this.goChat()}
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
 