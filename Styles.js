import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#7986CB', // MD Amber 500
  primaryDark: '#303F9F', // MD Brown 300
  primaryLight: '#E8EAF6', // MD Amber 200
  outline: '#BDBDBD' // MD Gray 400
}


export const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20
    },
        topView: {
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        },
        logoImage: {
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '50%',
            resizeMode: 'contain',
        },
        middleView: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            marginTop:100
            //backgroundColor: 'lightgreen'
        },
        inputRow: {
            flex:0.2,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingVertical: 10,
            marginBottom:20,
            marginHorizontal:60,
            // backgroundColor:'pink',
           
        },
            inputText: {
                flex: 1,
                fontSize: 16,
                paddingLeft: 14,
                // backgroundColor:'yellow',
                flexDirection: 'column',
                justifyContent: 'flex-end',
            
            },
        bottomView: {
            flex: 0.3,
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'flex-start',
            // backgroundColor:'green'
        },
            buttonContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.outline,
            borderRadius: 6,
            marginHorizontal:10,
            backgroundColor: colors.primary,
            width: 100,
            height: 50
            },
            buttonText: {
                textAlign: 'center',
                color: 'white'
            }
    });

export const profileStyles = StyleSheet.create({
    emptyMsg:{
        textAlign: 'center',
        fontSize: 14,
        color: colors.primary
        
    },
    container: {
        flex: 1,
        // backgroundColor: 'orange',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 2,
    },
        
    infoContainer:{
        flex: 0.5,
        // backgroundColor: 'pink',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        marginTop:10,
        marginBottom:10
        // paddingHorizontal: 20,
        // paddingVertical: 20,
    },
        imageContainer: {
            flex: 0.3,
            // backgroundColor: 'orange',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginVertical:10
        },
            mainImage: {
                resizeMode: 'cover',
                opacity:1,
                // backgroundColor: 'lightblue',
            },
        actionContainer:{
            flex: 0.1,
            flexDirection: "row",
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            backgroundColor:'pink'
        },
        linkContainer:{
            flex: 1,
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconbuttonContainer:{
                        
            shadowOffset:{
                width:0.5,
                height:0.5
            },
            shadowColor:'black',
            shadowOpacity:0.5,
            shadowRadius:1,
        },
        infoDisplay:{
            flex:0.5,
            flexDirection: "column",
            justifyContent:'center',
            alignItems:'center',
            marginVertical:10
            // backgroundColor:'pink'
        },
        profileListContainer:{
            flex: 0.15,
            flexDirection: "column",
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            // backgroundColor: 'lightgray',
            marginVertical:10,

        },
            profileList:{
                flex: 1,
                flexDirection: "column",
                // backgroundColor: 'lightblue',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginVertical:0

            },
            infoLabel:{
                flex: 0.4,
                flexDirection: "column",
                // backgroundColor: '#e4e',
                color:colors.primaryDark,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'flex-start',
                fontSize: 14,
            
            },
            inputContainer:{
                flex: 0.7,
                flexDirection: "row",
                // backgroundColor: 'yellow',
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical:0

            },
                infoIcon:{
                    flex: 0.1,
                    flexDirection: "column",
                    alignItems:'flex-end',
                    justifyContent: 'flex-end',
                    fontSize: 18,
                    color:"black",
                    // backgroundColor: 'red',
                    paddingRight: 0,
                    paddingVertical: 2,
                },
            
                infoInput:{
                    flex: 0.9,
                    flexDirection: "column",
                    // backgroundColor: '#888',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    borderBottomWidth:1,
                    borderBottomColor: colors.outline
                },
                infoInput_Focus:{
                  flex: 0.9,
                  flexDirection: "column",
                  // backgroundColor: '#888',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  borderBottomWidth:2,
                  borderBottomColor: colors.primary
              },
    dividerStyle:{
        marginVertical:20,
        backgroundColor: colors.primary, 
        height:2
    },  
    portfoContainer:{
        flex: 1,
        // backgroundColor: '#888',
        alignItems: 'stretch',
        justifyContent: 'center',
        marginVertical:10

    },
    cardContainer:{
        flex: 1,
        // backgroundColor: 'pink',
        // alignItems: 'center',
        // justifyContent: 'center',
        marginTop:10
    },
        portItem:{
            fontSize:18,
            color:'black'

        },
        portfoImageContainer:{
            flex: 0.5,
            flexDirection: "column",
            alignItems:'center',
            justifyContent: 'center',
           
            shadowOffset:{
                width:5,
                height:5
            },
            shadowColor:colors.outline,
            shadowOpacity:0.6,
            shadowRadius:10,

        },
            portfoImage:{
                resizeMode: 'contain',
                opacity:1,
                borderRadius:5,
                height:200,
                width:300,
                marginVertical:10,
                backgroundColor:'lightgray'
            },
        
    });

    export const portfoEditStyles = StyleSheet.create({
    
      container: {
          flex: 1,
          backgroundColor: 'orange',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          paddingHorizontal: 20,
          // paddingVertical: 5,
      },
          actionContainer:{
              flex: 0.1,
              flexDirection: "row",
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              backgroundColor:'pink'
          },
          portfoImageContainer:{
              flex: 0.5,
              flexDirection: "column",
              alignItems:'center',
              justifyContent: 'center',
              shadowOffset:{
                  width:5,
                  height:5
              },
              shadowColor:colors.outline,
              shadowOpacity:0.6,
              shadowRadius:10,
  
          },
              portfoImage:{
                  resizeMode: 'contain',
                  opacity:1,
                  borderRadius:5,
                  height:200,
                  width:300,
                  marginVertical:10,
                  backgroundColor:'lightgray'
              },
          
      });

    export const designerStyles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 20,
        //   backgroundColor:'lightgray'
        },
          peopleListContainer: {
            flex: 1,
            flexDirection:'column',
            justifyContent: 'space-around',
            alignItems: 'stretch',
            width: '90%',
            // padding:5,
            // backgroundColor:'lightblue'
          },  
            separator: {
              backgroundColor: colors.primaryLight,
              height: 1,
              width: '50%',
              alignSelf: 'center'
            },
            personCard: {
              flex: 0.5,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '50%',
              paddingVertical: 10,
              margin:5,
              height:240,
              backgroundColor:'white',
              borderRadius:5,
              shadowOffset:{
                width:2,
                height:2
                },
                shadowColor:'black',
                shadowOpacity:0.3,
                shadowRadius:4,
            },
            personRow: {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '95%',
                paddingVertical: 10,
                margin:5,
                height:180,
                backgroundColor:'white',
                borderRadius:5,
                shadowOffset:{
                  width:2,
                  height:2
                  },
                  shadowColor:'black',
                  shadowOpacity:0.3,
                  shadowRadius:4,
              },
              avatarContainer:{
                flex: 0.3,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                // backgroundColor:'yellow'
              },
              designerInfoContainer:{
                flex: 0.7,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                // backgroundColor:'pink'
              },
                actionContainer:{
                    flex: 0.08,
                    flexDirection: "row",
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    // backgroundColor:'pink'
                },
                linkContainer:{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                    iconbuttonContainer:{
                        shadowOffset:{
                            width:0.5,
                            height:0.5
                        },
                        shadowColor:'black',
                        shadowOpacity:0.5,
                        shadowRadius:1,
                    },
                        iconbutton:{
                            width:28, 
                            height:28, 
                            margin:10, 
                            backgroundColor:colors.primary, 
                            borderRadius:50,
                        
                        },
                chipContainer:{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginVertical:5,
                }
      });
      export const chatFriendStyles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 20,
        //   backgroundColor:'lightgray'
        },
          peopleListContainer: {
            flex: 1,
            flexDirection:'column',
            justifyContent: 'space-around',
            alignItems: 'stretch',
            width: '90%',
            // padding:5,
            // backgroundColor:'lightblue'
          },  
            separator: {
              backgroundColor: colors.primaryLight,
              height: 1,
              width: '50%',
              alignSelf: 'center'
            },
            personCard: {
              flex: 0.5,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '50%',
              paddingVertical: 10,
              margin:5,
              height:240,
              backgroundColor:'white',
              borderRadius:5,
              shadowOffset:{
                width:2,
                height:2
                },
                shadowColor:'black',
                shadowOpacity:0.3,
                shadowRadius:4,
            },
            personRow: {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '95%',
                paddingVertical: 10,
                margin:5,
                height:120,
                backgroundColor:'white',
                borderRadius:5,
                shadowOffset:{
                  width:2,
                  height:2
                  },
                  shadowColor:'black',
                  shadowOpacity:0.3,
                  shadowRadius:4,
              },
              avatarContainer:{
                flex: 0.3,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                // backgroundColor:'yellow'
              },
              designerInfoContainer:{
                flex: 0.7,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                // backgroundColor:'pink'
              },
                actionContainer:{
                    flex: 0.08,
                    flexDirection: "row",
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    // backgroundColor:'pink'
                },
                linkContainer:{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                    iconbuttonContainer:{
                        shadowOffset:{
                            width:0.5,
                            height:0.5
                        },
                        shadowColor:'black',
                        shadowOpacity:0.5,
                        shadowRadius:1,
                    },
                        iconbutton:{
                            width:28, 
                            height:28, 
                            margin:10, 
                            backgroundColor:colors.primary, 
                            borderRadius:50,
                        
                        }
      });

      export const chatStyles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'flex-start',
        },
          messageListContainer: {
            flex: 0.9,
            justifyContent: 'center',
            alignItems: 'stretch',
            width: '100%',
            alignSelf: 'center',
            paddingTop: '3%'
          },
            chatTextSelfContainer: {
              alignSelf: 'flex-end',
              padding: 5,
              margin: 5, 
              marginRight: 20,
              marginLeft: 40,
              backgroundColor: 'lightblue',
              borderRadius: 6
            },
              chatTextSelf: {
                fontSize: 18,
                textAlign: 'right',
              },
            chatTextOtherContainer: {
              alignSelf: 'flex-start',
              padding: 5,
              margin: 5, 
              marginLeft: 20,
              marginRight: 40,
              backgroundColor: 'lightgray',
              borderRadius: 6
            },
              chatTextOther: {
                fontSize: 18,
                textAlign: 'left',
              },
          inputContainer: {
            flex: 0.1,
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'stretch'
          },
            inputRow: {
              flexDirection: 'row',
              justifyContent: "space-between",
              alignItems: 'center'
            },  
            inputBox: {
              flex: 1,
              borderWidth: 1,
              borderColor: colors.primaryDark,
              borderRadius: 6,
              alignSelf: 'center',
              fontSize: 18,
              height: 40,
              padding: 5,
              margin: 5
            },
            centeredView: {
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "stretch",
              marginTop: 22,
              backgroundColor:  'rgba(0, 0, 0, 0.5)',
             
            },
            modalView: {
              margin: 0,
              flexDirection:'column',
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 10,
              overflow: 'hidden',
              maxHeight:'80%',
              // justifyContent:'stretch'
              alignItems: "stretch",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2
              },

              shadowOpacity: 0.3,
              shadowRadius: 5,
              elevation: 5,
              opacity:1,
              marginBottom:0,
            },
            openButton: {
              backgroundColor: "#F194FF",
              borderRadius: 20,
              padding: 10,
              elevation: 2
            },
            textStyle: {
              color: "white",
              fontWeight: "bold",
              textAlign: "center"
            },
            modalText: {
              marginBottom: 15,
              textAlign: "center"
            },
            modalBox:{
              // backgroundColor: 'ivory',
              flex: 1,
            },
            cardContainer:{
              flex: 1,
              
              flexDirection:'row',
              // backgroundColor: 'gray',
              alignItems: 'center',
              // justifyContent: 'center',
              marginTop:10
          },
      });

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    });
