import firebase from "firebase";
import "@firebase/firestore";
import "@firebase/storage";
import { firebaseConfig } from "./Secrets";

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
    this.userPic = [];

    this.theCallback = undefined;
    this.asyncInit();
  }

  asyncInit = async () => {
    this.loadUsers();
    this.loadProfile();
    // this.loadChats();
    //this.subscribeToChats();
    // console.log("userInfo",this.userInfo)
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

  //---Profile Infoℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️ℹ️

  loadProfile = async (userId) => {
      // load all of the users
    // console.log('hi');

    let querySnap = await this.usersRef.doc(userId).collection("info").get();
    let data;
    querySnap.forEach((qDocSnap) => {
      let key = qDocSnap.id;
      console.log("user info key", qDocSnap.id);
      data = qDocSnap.data();
      data.key = key;

      //save to local array-> need to use this.Info[0] to access data
      this.Info.push(data);
      // console.log("user info",data);
      console.log("user info key", this.Info[0].key);
    });

    console.log("user data", data);
    console.log("in load profile first line", this.Info);

    return data;
  };

  saveProfile = async (name, school, company, web, userId, userInfoKey) => {
    console.log("hihihi");

    //creating use model inside Firebase
    let userInfo = {
      userName: name,
      userSchool: school,
      userCompany: company,
      userWeb: web,
      timestamp: Date.now(),
    };
    console.log(userId);
    let userInfoColRef = await this.usersRef.doc(userId).collection("info");
    let userInfoDocRef;

    if (userInfoKey) {
      //update the edited info
      console.log("it's an old user updating the info", userInfoKey);
      userInfoDocRef = userInfoColRef.doc(userInfoKey);
      await userInfoDocRef.update(userInfo);
    } else {
      // this is a new user!

      userInfoDocRef = await userInfoColRef.add(userInfo);
    }

    let key = userInfoDocRef.id;
    userInfo.key = key;
    this.Info.push(userInfo);
    // console.log(this.Info);
    return userInfo;
  };

  // ---- Profile Picture🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻🤳🏻

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

  let querySnap = await this.usersRef.doc(userId).collection("portfolio").get();
  let data;
  querySnap.forEach((qDocSnap) => {
    let key = qDocSnap.id;

    data = qDocSnap.data();
    data.key = key;

    //save to local array-> need to use this.Info[0] to access data
    this.Portfo.push(data);
    // console.log("user info",data);
    console.log("user portfo key", this.Portfo[0].key);
  });

  console.log("portfo data", data);
  console.log("in load portfo first line", this.Portfo);
    //should return a list
  return this.Portfo;
};

  savePortfo = async (title, dscrp, web, userId, userPortfoKey) => {
    console.log("hihihi");

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
    // this.Portfo.push(userPortfo);
  
    return userPortfo;
  };
}

let theDataModel = undefined;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}
