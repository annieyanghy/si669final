import React from 'react';
import { TextInput, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Alert, Button, FlatList} 
    from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { profileStyles, colors } from './Styles';


export class EditInfo extends React.Component {

    constructor(props) {
    super(props);
    }
    render() {
    return (
        <View style={profileStyles.profileListContainer}>
            <View style={profileStyles.profileList}>
                
                <Text style={profileStyles.infoLabel}>{this.props.label}</Text>
                <View  style={profileStyles.inputContainer}>
                    <MaterialCommunityIcons name={this.props.icon} style={profileStyles.infoIcon} />
                    <TextInput style={profileStyles.infoInput} 
                                placeholder={this.props.placeholder}
                                autoCorrect={false}
                                editable={this.props.editable}
                                autoCapitalize = 'none'
                                value = {this.props.infoInputValue}
                                defaultValue={this.props.defaultValue}
                                onChange = {this.props.onChange}
                                textContentType = {this.props.textContentType}
                                multiline={true}
                                numberOfLines={5}
                                onFocus={this.props.onFocus}

                    >{this.props.info}</TextInput>
                </View>
        </View>
    </View>
    );
    }
}



{/* <FlatList
keyExtractor={(item, index) => item.key}
style={profileStyles.profileListContainer}
data={this.state.profileInfo}
renderItem={({item, index}) => 
    <EditInfo icon={item.iconName} 
                label={item.label} 
                info={this.state.userInfo}  
                placeholder={item.placeholder} 
                editable={this.state.editable}
                infoInputValue = {this.state.textInput[index]}
                onChangeText = { e => this.handleChangeText(e, item)}
                />
    }
    /> */}