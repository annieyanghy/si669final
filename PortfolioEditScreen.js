import React from "react";
import {
  TextInput,
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Button,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { getDataModel } from "./DataModel";
import { profileStyles, colors } from "./Styles";
import { EditInfo } from "./Component";

export class PortfolioEditScreen extends React.Component {
  constructor(props) {
    super(props);
    this.dataModel = getDataModel();
    this.props.navigation.setOptions({
      headerRight: () => (
        <MaterialCommunityIcons
          name="content-save"
          size={24}
          color="black"
          onPress={() => this.onSavePortfo()}
        />
      ),
    });
    console.log("on portfo edit", this.props.route.params);
    this.state = {
      profileInfo: [
        {
          label: "Title",
          placeholder: "Project title",
          iconName: "account-badge-horizontal-outline",
        },
        {
          label: "Description",
          placeholder: "Describe the project!",
          iconName: "message-text",
        },
        {
          label: "Link",
          placeholder: "Link to the project piece",
          iconName: "web",
        },
      ],

      editable: true,
      portTitle: "",
      portDscrp: "",
      portURL: "",
    };
  }

  componentDidMount = () => {
    // console.log(this.props.route);
    this.subscribeToPortfo();
  };

  subscribeToPortfo = async () => {
    let userId = this.props.route.params.userId;
    this.userPortfo = await this.dataModel.loadPortfo(userId);

    this.onPortfoUpdate();
  };

  onPortfoUpdate = () => {
    console.log("hi");
    this.setState({
      portTitle: this.userPortfo.portfoTitle,
      portDscrp: this.userPortfo.portfoDscrp,
      portURL: this.userPortfo.portfoURL,
    });
  };

  onSavePortfo = async () => {
    // console.log("edit page",this.userInfo);
    // console.log("hihihi");

    if (this.userPortfo) {
      // console.log("here?");

      let userInfo = await this.dataModel.savePortfo(
        this.state.portTitle,
        this.state.portDscrp,
        this.state.portURL,
        this.props.route.params.userId,
        this.userPortfo.key
      );
    } else {
      console.log("I am new");
      let userInfo = await this.dataModel.savePortfo(
        this.state.portTitle,
        this.state.portDscrp,
        this.state.portURL,
        this.props.route.params.userId
      );
    }

    this.props.navigation.navigate("Profile", {
      userPortfoKey: !this.userPortfo ? -1 : this.userPortfo.key,
    });
  };

  render() {
    return (
      <View style={profileStyles.container}>
        <EditInfo
          icon={this.state.profileInfo[0].iconName}
          label={this.state.profileInfo[0].label}
          info={this.state.portTitle}
          placeholder={this.state.profileInfo[0].placeholder}
          editable={this.state.editable}
          onChange={(text) => {
            this.setState({ portTitle: text.nativeEvent.text });
          }}
          value={this.state.portTitle}
        />
        <EditInfo
          icon={this.state.profileInfo[1].iconName}
          label={this.state.profileInfo[1].label}
          info={this.state.portDscrp}
          placeholder={this.state.profileInfo[1].placeholder}
          editable={this.state.editable}
          onChange={(text) => {
            this.setState({ portDscrp: text.nativeEvent.text });
          }}
          value={this.state.portDscrp}
        />
        <EditInfo
          icon={this.state.profileInfo[2].iconName}
          label={this.state.profileInfo[2].label}
          info={this.state.portURL}
          placeholder={this.state.profileInfo[2].placeholder}
          editable={this.state.editable}
          onChange={(text) => {
            this.setState({ portURL: text.nativeEvent.text });
          }}
          value={this.state.portURL}
        />
      </View>
    );
  }
}
