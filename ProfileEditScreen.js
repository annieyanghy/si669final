import React from 'react';
import { TextInput, Text, View, 
    Image, TouchableOpacity, KeyboardAvoidingView, Alert, Button, FlatList, Switch} 
    from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


import { getDataModel } from './DataModel';
import { profileStyles, colors } from './Styles';
import { EditInfo} from './Component';
import { ScrollView } from 'react-native-gesture-handler';
import { Chip } from 'react-native-paper';



export class ProfileEditScreen extends React.Component {
    constructor(props) {
    super(props);
    this.dataModel = getDataModel();
    this.props.navigation.setOptions({
        headerRight: () => (
            <MaterialCommunityIcons name="content-save" size={24} color="black"
                onPress={() => this.onSaveInfo()}
            />
        ),
    })
    console.log("on profile edit",this.props.route.params);
    this.state = {
        
        profileInfo:[
            {label: "Name", placeholder:"My name", iconName:"account-badge-horizontal-outline"},
            {label: "Education", placeholder:"School or certificate", iconName:"school"},
            {label: "Company", placeholder:"Recent company", iconName:"briefcase"},
            {label: "Website", placeholder:"My portfolio website", iconName:"web"},
            {label: "Linkedin", placeholder:"Linkedin URL", iconName:"linkedin"},
            {label: "Job Title", placeholder:"My latest job title", iconName:"account-box"},

        ],

        editable: true,
        infoName: '',
        infoJobTitle:'',
        infoSchool:'',
        infoCompany:'',
        infoWeb:'',
        infoLinkedin:'',
        isEnabled:false,
    }

    
}

componentDidMount = ()=>{
 
    // console.log(this.props.route);
    this.subscribeToInfo();
}

subscribeToInfo = async()=>{
    let userId = this.props.route.params.userId
    this.userInfo = await this.dataModel.loadProfile(userId);

    this.onInfoUpdate();
}

onInfoUpdate = ()=>{
    console.log('hi')
    this.setState({
        infoName: this.userInfo.userName,
        infoJobTitle: this.userInfo.userJob,
        infoSchool: this.userInfo.userSchool,
        infoCompany:this.userInfo.userCompany,
        infoWeb: this.userInfo.userWeb,
        infoLinkedin: this.userInfo.userLinkedin,
        isEnabled:this.userInfo.isMentor,
    })

}


onSaveInfo = async () =>{
    // console.log("edit page",this.userInfo);
    // console.log("hihihi");

    if(this.userInfo){
        console.log("here?",this.userInfo);

        let userInfo = await this.dataModel.saveProfile(
            this.state.infoName,
            this.state.infoJobTitle, 
            this.state.infoSchool, 
            this.state.infoCompany, 
            this.state.infoWeb,
            this.state.infoLinkedin,
            this.state.isEnabled,
            this.props.route.params.userId,
            this.userInfo.infoKey,
            );
    }else{
        console.log("I am new");
        let userInfo = await this.dataModel.saveProfile(
            this.state.infoName,
            this.state.infoJobTitle, 
            this.state.infoSchool, 
            this.state.infoCompany, 
            this.state.infoWeb,
            this.state.infoLinkedin,
            this.state.isEnabled,
            this.props.route.params.userId,
            
            );
    };

    this.props.navigation.navigate('Profile',{
        userInfoKey:!this.userInfo?-1:this.userInfo.infoKey
    });
    
}

toggleSwitch=(value)=>{

    this.setState({isEnabled:value})
}


render(){
return (
    <KeyboardAvoidingView
        style={profileStyles.container}
        behavior={"padding"}
        keyboardVerticalOffset={2}
        enabled={true}
        scrollEnabled={true}
    >
        <ScrollView>
    
        <EditInfo icon={this.state.profileInfo[0].iconName} 
                                label={this.state.profileInfo[0].label} 
                                info={this.state.infoName}  
                                placeholder={this.state.profileInfo[0].placeholder} 
                                editable={this.state.editable}
                                textContentType='name'
                                onChange = {(text) =>{this.setState({infoName: text.nativeEvent.text})}}
                                value = {this.state.infoName}
        />
        <EditInfo icon={this.state.profileInfo[1].iconName} 
                            label={this.state.profileInfo[1].label} 
                            info={this.state.infoSchool}  
                            placeholder={this.state.profileInfo[1].placeholder} 
                            editable={this.state.editable}
                            onChange = {(text) =>{this.setState({infoSchool:text.nativeEvent.text})}}
                            value = {this.state.infoSchool}
        />
        <EditInfo icon={this.state.profileInfo[2].iconName} 
                            label={this.state.profileInfo[2].label} 
                            info={this.state.infoCompany}  
                            placeholder={this.state.profileInfo[2].placeholder} 
                            editable={this.state.editable}
                            onChange = {(text) =>{this.setState({infoCompany:text.nativeEvent.text})}}
                            value = {this.state.infoCompany}
        />
        <EditInfo icon={this.state.profileInfo[3].iconName} 
                            label={this.state.profileInfo[3].label} 
                            info={this.state.infoWeb}  
                            placeholder={this.state.profileInfo[3].placeholder} 
                            editable={this.state.editable}
                            textContentType='URL'
                            onChange = {(text) =>{this.setState({infoWeb:text.nativeEvent.text})}}
                            value = {this.state.infoWeb}
        />
        <EditInfo icon={this.state.profileInfo[4].iconName} 
                            label={this.state.profileInfo[4].label} 
                            info={this.state.infoLinkedin}  
                            placeholder={this.state.profileInfo[4].placeholder} 
                            editable={this.state.editable}
                            textContentType='URL'
                            onChange = {(text) =>{this.setState({infoLinkedin:text.nativeEvent.text})}}
                            value = {this.state.infoLinkedin}
        />
         <EditInfo icon={this.state.profileInfo[5].iconName} 
                            label={this.state.profileInfo[5].label} 
                            info={this.state.infoJobTitle}  
                            placeholder={this.state.profileInfo[5].placeholder} 
                            editable={this.state.editable}
                            textContentType='jobTitle'
                            onChange = {(text) =>{this.setState({infoJobTitle:text.nativeEvent.text})}}
                            value = {this.state.infoJobTitle}
        />
        <Text>I want to be a Mentor</Text>
       <Switch 
        trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={this.state.isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={this.toggleSwitch}
            value={this.state.isEnabled}
       ></Switch>
   
    </ScrollView>
    </KeyboardAvoidingView>
);
}}
