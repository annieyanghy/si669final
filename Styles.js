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
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        //backgroundColor: 'lightgreen'
        },
        inputRow: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingVertical: 15
        },
            inputLabel: {
            flex: 0.3,
            justifyContent: 'flex-end',
            paddingRight: 5,
            textAlign: 'right',
            fontSize: 10
            },
            inputText: {
            flex: 0.5,
            borderColor: colors.outline,
            paddingLeft: 5,
            borderBottomWidth: 1,
            fontSize: 18,
            },
        bottomView: {
            flex: 0.3,
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'flex-start'
        },
            buttonContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.outline,
            borderRadius: 6,
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
        paddingVertical: 20,
    },
        
    infoContainer:{
        flex: 0.3,
        // backgroundColor: 'yellow',
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
                resizeMode: 'contain',
                opacity:1,
                // backgroundColor: 'lightblue',

                
            },
        profileListContainer:{
            flex: 1,
            // flexDirection: "column",
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: 'lightgray',
            marginVertical:4,

            
        },
            profileList:{
                flex: 1,
                flexDirection: "row",
                // backgroundColor: 'yellow',
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical:0

            },
            infoIcon:{
                flex: 0.1,
                alignSelf: 'center',
                justifyContent: 'center',
                fontSize: 18,
                color:"black",
                // backgroundColor: 'red',
                paddingHorizontal: 2,
                paddingVertical: 2,
            },
            infoLabel:{
                flex: 0.3,
                // backgroundColor: '#e4e',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16
            },
            infoInput:{
                flex: 0.6,
                // backgroundColor: '#888',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16
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
    });



export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    });
