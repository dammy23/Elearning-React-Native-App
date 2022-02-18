import React from 'react';
import { StyleSheet, Dimensions,View, ScrollView,TouchableHighlight,TextInput,SafeAreaView ,FlatList, Image, ImageBackground, Platform,Alert } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { Block, Text, theme,Button } from 'galio-framework';
import { LinearGradient } from 'expo-linear-gradient';
import * as SQLite from 'expo-sqlite';
import { Icon } from '../components';
import { Images, materialTheme } from '../constants';
import { HeaderHeight,base_url } from "../constants/utils";
import moment from 'moment';
import Toast from 'react-native-root-toast';
import YoutubePlayer from "react-native-youtube-iframe";
import { Video } from 'expo-av'

import * as ScreenOrientation from 'expo-screen-orientation';

const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;
const db = SQLite.openDatabase("LearnDB.db");

export default class Player extends React.Component {
 

  state = {
    items: null,
    playing: true,
    videoId:"",
    youtubeHidden:styles.hidden,
    videoHidden:styles.hidden,
    type:1,
    inFullscreen:false,
   



  };


  setOrientation() {
    if (Dimensions.get('window').height > Dimensions.get('window').width) {
      //Device is in portrait mode, rotate to landscape mode.
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    else {
      //Device is in landscape mode, rotate to portrait mode.
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
  }
  constructor(props) {
    super(props);
    this.refVideo = React.createRef();
    
  }

  componentDidMount() {
    this.getLessons();
    
  }

  getLessons() {
    let param = this.props.route.params.product ;
    
    db.transaction((tx) => {

      tx.executeSql('SELECT * FROM lessons where courseid=?', [param.courseid],
        (txObj, { rows: { _array } }) => this.setState({ items: _array,videoId: _array[0].video,type:_array[0].type })
        );

       

       
    });
    
  }
 
 
  renderList(){

    const { items } = this.state;
    console.log(this.props);
    
    if (items === null || items.length === 0) {
      return null;
    }
    return (
        <View>
          {
            items.map((item) =>{
              return (
                      
                       <Block center key={item.id}>
                          <Button
                            shadowless
                            style={styles.button}
                            color={materialTheme.COLORS.BUTTON_COLOR}
                            onPress={() => {
                                this.setState({ videoId: item.video,type:item.type})
                            
                            }}
                            >
                            {item.name}
                          </Button>
                      </Block>
                      
                    
              )

            })

          }

        </View>
    )

  }

  render() {

   
      
    //console.log(this.props);
    let param = this.props.route.params.product ;
    var oldDate =param.created;
    let videoHidden=styles.hidden;
    let youtubeHidden=styles.display;
    if(this.state.type==1){
       
        videoHidden=styles.display;
        youtubeHidden=styles.hidden;
        //this.setState({ videoHidden:styles.hidden,youtubeHidden:styles.display})
    }

    var dateObj = moment(oldDate, "YYYY-MM-DDTHH:mm:ssZ");
    //console.log(this.state.videoId);
    var videoId=this.state.videoId;
    var inFullscreen=this.state.inFullscreen;
    console.log(videoId);
    return (
      <Block flex style={styles.profile}>
        <Block flex>
       
            <View style={videoHidden}>
                  <StatusBar style="auto" />
                  
                  <Video
                    source={{ uri: videoId }}
                    resizeMode="cover"
                    shouldPlay
                    useNativeControls

                    style={{ height: 220 }}
                  />

            </View>
            <View  style={youtubeHidden}>      
                <YoutubePlayer height={400} play={this.state.playing} videoId={this.state.videoId} />     
                
            </View>
        </Block>
        <Block flex style={styles.options}>
          <ScrollView showsVerticalScrollIndicator={false}>
           
            <Block row space="between" style={{ paddingVertical: 7, alignItems: 'baseline' }}>
              <Text size={16}>{param.description}</Text>
            </Block>
            <Block row space="between" style={{ paddingVertical: 0, alignItems: 'baseline' }}>
              <Text size={16}>Lessons</Text>
             
            </Block>
             
            {this.renderList()}
           
          </ScrollView>
         
        </Block>
       
      </Block>
      
    );
  }
}

const styles = StyleSheet.create({
backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
  profile: {
   
  
  },
  profileImage: {
    width: width * 1.1,
    height: 'auto',
  },
  profileContainer: {
    width: width,
    height: height / 2,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  profileDetails: {
    paddingTop: theme.SIZES.BASE * 4,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  profileTexts: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
    zIndex: 2
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginRight: theme.SIZES.BASE / 2,
    borderRadius: 4,
    height: 19,
    width: 38,
  },
  seller: {
    marginRight: theme.SIZES.BASE / 2,
  },
  options: {
    position: 'relative',
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: -theme.SIZES.BASE * 14,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure
  }, container: {
    flex: 1,
    
  },
  formContent:{
    flexDirection: 'row',
    marginTop:3,
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      height:45,
      flexDirection: 'row',
      alignItems:'center',
      flex:1,
      margin:1,
  },
  icon:{
    width:30,
    height:30,
  },
  iconBtnSearch:{
    alignSelf:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    marginLeft:15,
    justifyContent: 'center'
  },
  notificationList:{
    marginTop:20,
    padding:10,
  },
  notificationBox: {
    paddingTop:10,
    paddingBottom:10,
    marginTop:5,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius:10,
  },
  image:{
    width:45,
    height:45,
    borderRadius:20,
    marginLeft:20
  },
  name:{
    fontSize:20,
    fontWeight: 'bold',
    color: "#000000",
    marginLeft:10,
    alignSelf: 'center'
  },
  gradient: {
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
    position: 'absolute',
  },hidden:{
    display:"none",
    marginLeft: 40

   },
   show:{
     display:"flex",
     marginLeft: 40
    }
});
