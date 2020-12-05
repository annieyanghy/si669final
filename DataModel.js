import firebase from "firebase";
import "@firebase/firestore";
import "@firebase/storage";
import { firebaseConfig } from "./Secrets";
import React from "react";
import {
  Alert,

} from "react-native";

class DataModel {
  constructor() {
    if (firebase.apps.length === 0) {
      // aka !firebase.apps.length
      firebase.initializeApp(firebaseConfig);
    }
    this.usersRef = firebase.firestore().collection("users");
    // this.chatsRef = firebase.firestore().collection('chats');
    // this.currentImageRef = firebase.firestore().doc('chats/images');
    this.storageRef = firebase.storage().ref(); // for image
    this.users = [];
    // this.chats = [];
    this.Info = [];
    this.Portfo = [];
    this.PortfoPic = [];
    this.userPic = [];
    this.theCurrentUser ={};
   this.userInfoList =[];
   this.followingList=[];
   this.chats = [];


    this.theCallback = undefined;
    this.asyncInit();
  }

  asyncInit = async () => {
    this.loadUsers();
    this.loadProfile();
    this.getAllUserInfo();
    
    // this.loadChats();
    //this.subscribeToChats();

  };

  //--- Login ---//

  loadUsers = async () => {
    let querySnap = await this.usersRef.get();
    querySnap.forEach((qDocSnap) => {
      let key = qDocSnap.id;
      let data = qDocSnap.data();
      data.key = key;
      this.users.push(data);
    
    });
  };

  getUsers = () => {
    return this.users;
  };

  createUser = async (email, pass, dispName) => {
    // assemble the data structure
    let newUser = {
      email: email,
      password: pass,
      displayName: dispName,
    };

    // add the data to Firebase (user collection)
    let newUserDocRef = await this.usersRef.add(newUser);

    // get the new Firebase ID and save it as the local "key"
    let key = newUserDocRef.id;
    newUser.key = key;
    this.users.push(newUser);
    return newUser;
  };

  getUserForID = (id) => {
    for (let user of this.users) {
      if (user.key === id) {
        return user;
      }
    }
    // will return undefined. No haiku this time...
  };

  saveWhoIsUser = (user, key)=>{
    this.theCurrentUser.currentUser = user;
    this.theCurrentUser.userId = key;
    console.log("user!");
    return this.theCurrentUser

  }

  fetchWhoIsUser = ()=>{
    console.log("what's info",this.Info);
    return this.theCurrentUser
  }

  //---Profile Infoℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️

  getAllUserInfo = async()=>{
    //fetch all of the user's information
    //and store their info in an array
    let querySnap = await this.usersRef.get();
   
    let userData;
    this.userInfoList =[];
    let key;
    let keylist=[];
    querySnap.forEach((qDocSnap) => {
      key = qDocSnap.id;
      let data = qDocSnap.data();
      data.key = key;
      keylist.push(key);
      
    })
  for (let i of keylist){
    let userSnap = await this.usersRef.doc(i).collection("info").get();
      userSnap.forEach((uDocSnap) => {
        
        let infoDockey = uDocSnap.id;
        userData = uDocSnap.data();
        userData.infoKey = infoDockey;
        userData.userId = i;
        this.userInfoList.push(userData);
      // console.log("what's all of the users",userData);
      })      
  }
    console.log("what's all of the users",this.userInfoList);
    return this.userInfoList
  }
 

  deliverAllUserProfile = ()=>{
    return this.userInfoList
  }

  loadProfile = async (userId) => {
      // load all of the users

    let querySnap = await this.usersRef.doc(userId).collection("info").get();
    let data;
    this.Info =[];
    querySnap.forEach((qDocSnap) => {
      let key = qDocSnap.id;
      console.log("user info key", qDocSnap.id);
      data = qDocSnap.data();
      data.infoKey = key;

      //save to local array-> need to use this.Info[0] to access data
      this.Info.push(data);
      // console.log("user info",data);
      console.log("user info key", this.Info[0].infoKey);
    });

    console.log("user data", data);
    console.log("in load profile first line", this.Info);

    return data;
  };

  getUserForInfo =(id)=>{
    for (let user of this.Info){
      if (id == user.userInfoKey)
      console.log("hello ni hao ma",user);
      return user
    }
  }

  saveProfile = async (name, job, school, company, web, linkedin, userId, userInfoKey) => {
    console.log("hihihi");

    //creating use model inside Firebase
    let userInfo = {
      userName: name,
      userJob:job,
      userSchool: school,
      userCompany: company,
      userWeb: web,
      userLinkedin: linkedin,
      timestamp: Date.now(),
    };
    console.log(userId);
    let userInfoColRef = await this.usersRef.doc(userId).collection("info");
    let userInfoDocRef;
    console.log(userInfoKey);
    if (userInfoKey!==-1) {
      //update the edited info
      console.log("it's an old user updating the info", userInfoKey);
      userInfoDocRef= await userInfoColRef.doc(userInfoKey);
      console.log(userInfoDocRef.id);
      await userInfoDocRef.update(userInfo);
      // console.log(userInfoDocRef.id);
      // await userInfoDocRef.update(userInfo);
    } else {
      // this is a new user!
      console.log("newbie!")
      userInfoDocRef = await userInfoColRef.add(userInfo);
    }

    let key = userInfoDocRef.id;
    userInfo.key = key;
    this.Info.push(userInfo);
    // console.log(this.Info);
    return userInfo;
  };

  // ---- Profile Picture🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻

  loadProfilePic = async (userId) => {
    // console.log('hi');

    let querySnap = await this.usersRef.doc(userId).get();
    let data;

    //all of the users account data (email, password)
    data = querySnap.data()
    let url = data.imageURL;
    data.key = querySnap.id; // == userId
    console.log("data!", url);

    //save to local array
    this.userPic.push(url);
    console.log("qDocSnap!", this.userPic);
  
    console.log("user profile pic", data);
    // console.log("in load profile first line", this.userPic);

    return url;
  };

  saveProfileImage = async (userId, imageObject) => {
    if (this.theCallback) {
      this.theCallback(imageObject);
    }

    // in firebase storage
    let fileName = "" + Date.now();
    let imageRef = this.storageRef.child(fileName);

    let response = await fetch(imageObject.uri);
    let imageBlob = await response.blob();

    await imageRef.put(imageBlob);

    //update the image to Firestore
    let downloadURL = await imageRef.getDownloadURL();
    imageObject.uri = downloadURL;

    let imageDoc = {
      imageObject,
      imageURL: downloadURL,
    };

    console.log("I alreadyregistered!");
    let profilePicRef = await this.usersRef.doc(userId);


    await profilePicRef.update(imageDoc);
    console.log("hiiii");
    this.loadProfilePic(userId);
    console.log("loaded");
    return downloadURL;
  };


  // --- save portfolio👩🏻‍🖼👩🏻‍🖼👩🏻‍🖼👩🏻‍🖼👩🏻‍🖼👩🏻‍🖼👩🏻‍🖼👩🏻‍🖼👩🏻‍🖼👩🏻‍🖼👩🏻‍🖼👩🏻‍🖼👩🏻‍🖼👩🏻‍🖼

  loadPortfo = async (userId) => {


  let querySnap = await this.usersRef.doc(userId).collection("portfolio").orderBy('timestamp').get();
  let data;
  this.Portfo = [];
  querySnap.forEach((qDocSnap) => {
    let key = qDocSnap.id;
    data = qDocSnap.data();
    data.key = key;

    //save to local array
    this.Portfo.push(data);
    // console.log("user info",data);
    console.log("user portfo key", this.Portfo[0].key);
  });

  console.log("portfo data", data);
  console.log("in load portfo first line", this.Portfo);
    //should return a list
  return this.Portfo;
};

loadThisPortfo = async (userId, portfoKey) => {

  let querySnap = await this.usersRef.doc(userId).collection("portfolio").doc(portfoKey).get();
  let data = querySnap.data();
  this.Portfo = [];

  console.log("data data",data);

  return data;
};


  savePortfo = async (mode,title, dscrp, web, userId, userPortfoKey) => {

    //creating use model inside Firebase
    let userPortfo = {
      portfoTitle: title,
      portfoDscrp: dscrp,
      portfoURL: web,
      timestamp: Date.now(),
    };
    console.log("the mode",mode);
    let userPortfoColRef = await this.usersRef.doc(userId).collection("portfolio");
    let userPortfoDocRef;

    if (userPortfoKey) {
      if(mode == "edit"){
        //update the edited info
        console.log("it's an old user updating the portfolio", userPortfoKey);
        userPortfoDocRef = userPortfoColRef.doc(userPortfoKey);
        await userPortfoDocRef.update(userPortfo);
      }else if(mode == "create"){
        //add new info but have already uploaded the portfo image
        console.log("it's a new user adding description", userPortfoKey);
        userPortfoDocRef = userPortfoColRef.doc(userPortfoKey);
        await userPortfoDocRef.set(userPortfo);
      }
     
    } else {
      // this is a new user!

      userPortfoDocRef = await userPortfoColRef.add(userPortfo);
    }

    let key = userPortfoDocRef.id;
    userPortfo.key = key;

    return userPortfo;
  };

  onDeletePortfo = (item, userId) => {
    let deletedItem = item.portfoTitle;
    console.log("list screen on delete", deletedItem);
    console.log(item);
    Alert.alert(
      "Delete item?",
      'Are you sure you want to delete "' + deletedItem + '"?',
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "Delete",
          onPress: () => {
            this.deletePortfoItem(item.key, userId);
          },
        },
      ],
      { cancelable: true }
    );
  };

  deletePortfoItem = async (itemKey, userId) => {
    console.log(itemKey);
    console.log(userId)
    let deleteRef = this.usersRef.doc(userId).collection("portfolio").doc(itemKey);

    await deleteRef.delete();

    let foundIndex = -1;
    for (let idx in this.Portfo) {
      if (this.Portfo[idx].key === itemKey) {
        foundIndex = idx;
        break;
      }
    }
    if (foundIndex !== -1) {
      // silently fail if item not found
      this.Portfo.splice(foundIndex, 1); // remove one element
    }
    console.log(this.Portfo);
  };

  loadPortfoPic = async (userId, portfoKey) => {
    // console.log('hi');

    let querySnap = await this.usersRef.doc(userId).collection('portfolio').doc(portfoKey).collection('portfoPic').get();
    let data;
    this.PortfoPic =[];
    querySnap.forEach((qDocSnap) => {
    
      let key = qDocSnap.id;
      data = qDocSnap.data();
      data.key = key;
  
      //save to local array
      this.PortfoPic.push(data);
      // console.log("user info",data);
      console.log("user portfoPic key",  this.PortfoPic[0].key);
    });
    console.log("portfo pic", data);
    let url = data.portfoPicURL
    return  url;
  };

  savePortfoImage = async (userId, portfoKey, portfoPicObject, portfoPicKey, update) => {
    if (this.theCallback) {
      this.theCallback(portfoPicObject);
    }
    
    // in firebase storage
    let fileName = "" + Date.now();
    let imageRef = this.storageRef.child(fileName);

    let response = await fetch(portfoPicObject.uri);
    let imageBlob = await response.blob();

    await imageRef.put(imageBlob);

    //update the image to Firestore
    let downloadURL = await imageRef.getDownloadURL();
    portfoPicObject.uri = downloadURL;

    let portfoPicDoc = {
      portfoPicObject,
      portfoPicURL: downloadURL,
    };

    let portfoPicRef;
    if (portfoKey){
      //update portfolio picture
      console.log("I am updating");
      let docRef= await this.usersRef.doc(userId).collection('portfolio').doc(portfoKey).collection('portfoPic').doc(portfoPicKey);

      await docRef.set(portfoPicDoc);
    }else{
       //add new portfolio picture
       console.log("I am adding, new portfolio");
       let docRef= await this.usersRef.doc(userId).collection('portfolio').doc();
       portfoKey = docRef.id;
       
       portfoPicRef = await docRef.collection('portfoPic').add(portfoPicDoc);
       portfoPicKey = portfoPicRef.id;
       portfoPicDoc.picKey = portfoKey;
       console.log(portfoPicRef.id);
       console.log(portfoPicKey); 
       console.log("new portfoKey",portfoKey);

    }

    console.log("hiiii");
    console.log(portfoKey);
    console.log("loaded");
    update();
    return portfoPicDoc;
  };



  loadFollowing =async(currentUser)=>{
    // let querysnap = await this.usersRef.doc(currentUser.userId).collection('following').get();
    let followList = await this.usersRef.doc(currentUser.userId).collection('following').onSnapshot((querysnap)=>{
      this.followingList=[];
      querysnap.forEach((qDocFollowSnap)=>{
        let data = qDocFollowSnap.data();
          data.followingId = qDocFollowSnap.id;
          console.log("following data",data);
    
          let docUserId = data.userId;
          let followingDocKey = data.followingId;
          let followingUser = {docUserId: docUserId, followingDocKey:followingDocKey}
          this.followingList.push(followingUser);
      })
    });
    // this.followingList=[];
    // querysnap.forEach((qDocFollowSnap)=>{
   
    //   let data = qDocFollowSnap.data();
    //   data.followingId = qDocFollowSnap.id;
    //   console.log("following data",data);

    //   let docUserId = data.userId;
    //   let followingDocKey = data.followingId;
    //   let followingUser = {docUserId: docUserId, followingDocKey:followingDocKey}
    //   this.followingList.push(followingUser);
   
    // })
    
    return this.followingList
  }

  //--following other designers
  followOthers=async(currentUser, followedDesigner, followedId)=>{
    console.log(currentUser);
    console.log(followedDesigner);
    followedDesigner.userId = followedId;
    let followingCol = await this.usersRef.doc(currentUser.userId).collection('following');
    let followingRef = await followingCol.add(followedDesigner);
    let key = followingRef.id;
    console.log(key);
  }

//--unfollow other designers
unFollowOthers =async(currentUser, followedDesigner, followedId)=>{
  console.log(currentUser);
  console.log(followedDesigner);
  let unfollowedUser = this.followingList.find(designer =>designer.docUserId == followedId);
  console.log("hey hey",unfollowedUser);
  // followedDesigner.userId = followedId;
  let unFollowingCol = await this.usersRef.doc(currentUser.userId).collection('following');
  let unFollowingDocRef = await unFollowingCol.doc(unfollowedUser.followingDocKey);
  await unFollowingDocRef.delete();
  
}


// ---about chats

loadChats = async () => {
  let querySnap = await this.chatsRef.get();
  querySnap.forEach(async qDocSnap => {
    let data = qDocSnap.data();
    let thisChat = {
      key: qDocSnap.id,
      participants: [],
      messages: [],
      // read: data.read
    }
    for (let userID of data.participants) {
      let user = this.getUserForID(userID);
      thisChat.participants.push(user);
    }

    let messageRef = qDocSnap.ref.collection("messages");
    let messagesQSnap = await messageRef.get();
    messagesQSnap.forEach(qDocSnap => {
      let messageData = qDocSnap.data();
      messageData.author = this.getUserForID(messageData.author);
      messageData.key = qDocSnap.id;
      thisChat.messages.push(messageData);
    });
    this.chats.push(thisChat);
  
  });
}  

subscribeToChat = (chat, notifyOnUpdate) => {
  
  this.chatSnapshotUnsub = this.chatsRef.doc(chat.key)
    .collection('messages')
    .orderBy('timestamp')
    .onSnapshot((querySnap) => {
      chat.messages = [];
      querySnap.forEach((qDocSnap) => {
        let messageObj = qDocSnap.data();
        messageObj.key = qDocSnap.id;
        messageObj.author = this.getUserForID(messageObj.author);
        chat.messages.push(messageObj);
        
      
      });
      notifyOnUpdate(); // call back to the subscriber

  });
}

unsubscribeFromChat = (chat) => {
  // don't really need 'chat' but could need it in the future
  if (this.chatSnapshotUnsub) {
    this.chatSnapshotUnsub();
  }
}

getOrCreateChat = async (user1, user2) => {
  console.log("heeeeee",user1);
  console.log("heeeeee",user2);

  // look for this chat in the existing data model 'chats' array
  // if it's here, we know it's already in Firebase
  for (let chat of this.chats) {
    // we need to use user keys to look for a match
    // and we need to check for each user in each position
    if (( chat.participants[0].key === user1.key && 
          chat.participants[1].key === user2.key) ||
        ( chat.participants[0].key === user2.key &&
          chat.participants[1].key === user1.key)){
      return chat; // if found, return it and we're done
    }
  }


  // chat not found, gotta create it. Create an object for the FB doc
  let newChatDocData = { participants: [user1.key, user2.key]};
  
  // add it to firebase
  let newChatDocRef = await this.chatsRef.add(newChatDocData);
  console.log("newChatDocData",newChatDocData);

  // create a local chat object with full-fledged user objects (not just keys)
  let newChat = {
    participants: [user1, user2],
    key: newChatDocRef.id, // use the Firebase ID
    messages: [],
   
  }


  // add it to the data model's chats, then return it
  this.chats.push(newChat);

  return newChat;
}

getChatForID = (id) => {
  for (let chat of this.chats) {
    if (chat.key === id) {
      return chat;
    }
  }
  // the chat was not found
  // should throw an error prob'ly
  // return undefined
  // [[almost accidental haiku]]
}

addChatMessage = async (chatID, message) => { // doesn't need to be async?

  let messagesRef = this.chatsRef.doc(chatID).collection('messages');

  let fbMessageObject = {
    type: 'text',
    text: message.text,
    timestamp: message.timestamp,
    author: message.author.key,
    other:message.other.key,
    read:false

  }

  messagesRef.add(fbMessageObject); // onSnapshot will update local model
}

addChatImage = async (chat, author, imageObject) => {
  if (this.theCallback) {
    this.theCallback(imageObject);
}
  console.log('... and here we would add the image ...');
  console.log(imageObject);
  // let messageRef = this.chatsRef.doc(chat.key).collection('messages');

  let newImageRef = await this.chatsRef.doc(chat.key).collection('messages');

  let fileName = ''+Date.now();
  let imageRef = this.storageRef.child(fileName);

  let response = await fetch(imageObject.uri);
  let imageBlob = await response.blob();

  await imageRef.put(imageBlob);

  //update current image to Firestore
  let downloadURL = await imageRef.getDownloadURL();
  imageObject.uri = downloadURL;

  let imageDoc = {
    imageObject,
    imageURL: downloadURL,
    type: 'image',
    author: author.key,
    timestamp: Date.now(),
    read: false
  }

  await newImageRef.add(imageDoc);
  
}

}


let theDataModel = undefined;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}
