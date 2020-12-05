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
    // load all of the users
  // console.log('hi');

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
  // load all of the users
// console.log('hi');

let querySnap = await this.usersRef.doc(userId).collection("portfolio").doc(portfoKey).get();
let data = querySnap.data();
this.Portfo = [];

console.log("data data",data);

// querySnap.forEach((qDocSnap) => {
//   let key = qDocSnap.id;
//   data = qDocSnap.data();
//   data.key = key;

//   //save to local array
//   this.Portfo.push(data);
//   // console.log("user info",data);
//   console.log("user portfo key", this.Portfo[0].key);
// });

// console.log("portfo data", data);
// console.log("in load portfo first line", this.Portfo);
  //should return a list
return data;
};


  savePortfo = async (title, dscrp, web, userId, userPortfoKey) => {

    //creating use model inside Firebase
    let userPortfo = {
      portfoTitle: title,
      portfoDscrp: dscrp,
      portfoURL: web,
      timestamp: Date.now(),
    };
    console.log(userId);
    let userPortfoColRef = await this.usersRef.doc(userId).collection("portfolio");
    let userPortfoDocRef;

    if (userPortfoKey) {
      //update the edited info
      console.log("it's an old user updating the portfolio", userPortfoKey);
      userPortfoDocRef = userPortfoColRef.doc(userPortfoKey);
      await userPortfoDocRef.update(userPortfo);
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
    // console.log("in load profile first line", this.userPic);
    let url = data.portfoPicURL;
    console.log("portfo pic  url",  url);
    return url;
  };

  savePortfoImage = async (userId, portfoKey, portfoPicObject, portfoPicKey) => {
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
      portfoPicRef= await this.usersRef.doc(userId).collection('portfolio').doc(portfoKey).collection('portfoPic');
      await profilePicRef.update(portfoPicDoc);
    }else{
       //add new portfolio picture
       console.log("I am adding, new portfolio");
       let docRef= await this.usersRef.doc(userId).collection('portfolio').doc();
       portfoKey = docRef.id;
       portfoPicRef = await docRef.collection('portfoPic').add(portfoPicDoc);
       portfoPicKey = portfoPicRef.id;
       console.log(portfoPicRef.id);
       console.log(portfoPicKey); 
       console.log("new portfoKey",portfoKey);

      //  let key = portfoPicKey.id;
      //  portfoPicDoc.key = key;
    }
    


   
    console.log("hiiii");
  
    console.log(portfoKey);
    
    console.log("loaded");
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
}


let theDataModel = undefined;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}
