import React from 'react';
import { StyleSheet, Dimensions,View, ScrollView,TouchableHighlight,TextInput,SafeAreaView ,FlatList, Image, ImageBackground, Platform,ActivityIndicator } from 'react-native';


import { Block, Text, theme,Button } from 'galio-framework';
import { LinearGradient } from 'expo-linear-gradient';
import * as SQLite from 'expo-sqlite';
import { Icon } from '../components';
import { Images, materialTheme } from '../constants';
import { HeaderHeight,base_url } from "../constants/utils";
import moment from 'moment';
import Toast from 'react-native-root-toast';
import axios from 'axios';


const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;
const db = SQLite.openDatabase("LearnDB.db");
 

export default class Course extends React.Component {
  

  param = this.props.route.params.product;

  state = {
    items: null,
    iconDisabled:true,
    regHidden:styles.hidden,
    playHidden:styles.hidden,
    showToast:false,
    toastMessage:"",
    toastColor:"success",
    showActivity: styles.hidden,
    syncDisabled: false,
    params:this.param

  };

  deleteCourse(id) {
        
      db.transaction((tx) => {
        tx.executeSql('DELETE FROM courses WHERE courseid = ?', [id])
      })
  
  }

  deleteLesson(id) {
       
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM lessons WHERE courseid = ?', [id])
    })

  }

  syncCourse(id){

    this.setState({showActivity:styles.show, syncDisabled: true});
    this.fetchLatestCourse(id); 

  }



  addCourse(prod) {

    // console.log(prod);
    this.fetchLatestLesson(prod.id);
    db.transaction((tx) => {
        
      tx.executeSql('INSERT INTO courses (courseid, lessons,name, image,description, created) VALUES (?, ?, ?, ?,?, ?)', [prod.id, prod.lessons, prod.name, prod.image,prod.description, prod.created_at],(tx, results) => {
        //console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('Data Insertedddd Successfully....');
        } else  console.log('Failed....')});
    })



  } 

  addLesson(prod) {


    db.transaction((tx) => {
      tx.executeSql('INSERT INTO lessons (lessonid, courseid, name, description, video, duration, created,type) VALUES (?, ?, ?, ?, ?, ?, ?,?)', [prod.id, prod.course_id, prod.name, prod.description, prod.video_id, prod.duration, prod.created_at,prod.type],(tx, results) => {
      // console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
        // console.log('Data Inserted Successfully....');
        } else  console.log('Failed....');
      });
    
    });

  } 

  fetchLatestCourse=(id) => {
        
    const _this=this;
    let durl =base_url+'course/search/'+id;
     
   /// console.log(durl);
    axios.get(durl)
        .then(function (response) { 
        
            const res=response.data;
            console.log(res);
            if(res.length==0)
            {
              //console.log(response.data.length);
              _this.setState({showActivity:styles.hidden, syncDisabled: false});
            }else{
              _this.deleteCourse(id);
              _this.deleteLesson(id)
             
                            
                _this.addCourse(res);   
             
            }
            
        
        })
        .catch(function (error) {
        
        
        });

  }

  fetchLatestLesson=(id) => {
    const _this=this;
    let durl=base_url+'lesson/list/'+id; 

    axios.get(durl).then(function (response) { 
          
            const res=response.data;
            //console.log(res);
            res.forEach(element => {
              //console.log(element);
              _this.addLesson(element);   
            });
           
            _this.setState({showActivity:styles.hidden, syncDisabled: false,items: res });
      
        
        })
        .catch(function (error) {
      
        
        });

  }


  handleSync= () => {
    let param = this.props.route.params.product ;
    let id=param.courseid;
   
    this.syncCourse(id)
  }

  enrollCourse = () => {
    
    let param = this.props.route.params.product ;
    var currentDate = moment().format("YYYY-MM-DDTHH:mm:ssZ");

    this.setState({ icon: "spinner", iconDisabled:true})
    db.transaction((tx) => {
                
      tx.executeSql('INSERT INTO enrollment (courseid, created) VALUES (?, ?)', [param.courseid, currentDate],(tx, results) => {
        //console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          this.setState({ iconDisabled:false,playHidden:styles.show,regHidden:styles.hidden,showToast:true,toastMessage:""})
          let toast = Toast.show('You have successfully enrolled for this course', {
            duration: Toast.durations.LONG,
          });
        }
    })

  });
  
}

playCourse(params,navigation){
  navigation.navigate('Player', {screen: 'Player',
        params: { product: params }})
  
  //console.log(params);
 
}
  constructor(props) {
    super(props);
    //console.log(this.props);
    
  }

  componentDidMount() {
    this.getLessons();
    this.checkEnrollment();
  }

  getLessons() {
    let param = this.props.route.params.product ;
    
    db.transaction((tx) => {

      tx.executeSql('SELECT * FROM lessons where courseid=?', [param.courseid],
        (txObj, { rows: { _array } }) => this.setState({ items: _array })
        );

       

       
    });
    
  }
  checkEnrollment(){
    let param = this.props.route.params.product ;


    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM enrollment where courseid=?', [param.courseid],
          (txObj, { rows: { _array } }) => {
            if( _array.length>0){
              this.setState({ iconDisabled:false, playHidden:styles.show,regHidden:styles.hidden})
            }else{
              this.setState({iconDisabled:false, playHidden:styles.hidden,regHidden:styles.show})
            }
          
          });
      });
  }
  
 
  renderList(){

    const { items } = this.state;
    
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

    var dateObj = moment(oldDate, "YYYY-MM-DDTHH:mm:ssZ");

    return (
      <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground
            source={{uri: base_url+"uploads/"+param.image}}
            style={styles.profileContainer}
            imageStyle={styles.profileImage}>
            <Block flex style={styles.profileDetails}>
              <Block style={styles.profileTexts}>
                <Text color="white" size={28} style={{ paddingBottom: 8 }}>{param.name}</Text>
                <Block row space="between">
                  <Block row>
                    <Block middle style={styles.pro}>
                      <Text size={16} color="white">ProProProProProProPro</Text>
                    </Block>
                    <Text color="white" size={16} muted style={styles.seller}>Seller</Text>
                    <Text size={16} color={materialTheme.COLORS.WARNING}>
                      4.8 <Icon name="shape-star" family="GalioExtra" size={14} />
                    </Text>
                  </Block>
                  <Block>
                    <Text color={theme.COLORS.MUTED} size={16}>
                      <Icon name="map-marker" family="font-awesome" color={theme.COLORS.MUTED} size={16} />
                      {` `} Los Angeles, CA
                      </Text>
                  </Block>
                </Block>
              </Block>
              <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']} style={styles.gradient} />
            </Block>
          </ImageBackground>
        </Block>
        <Block flex style={styles.options}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Block row space="between" style={{ padding: theme.SIZES.BASE, }}>
              <Block middle>
                <Text bold size={12} style={{marginBottom: 8}}>{param.lessons}</Text>
                <Text muted size={12}>Lesson</Text>
              </Block>
              <Block middle>
                <Button
                  round
                  onlyIcon
                  shadowless
                  icon="registered"
                  disabled={this.state.iconDisabled}
                  iconFamily="font-awesome"
                  iconColor={theme.COLORS.WHITE}
                  iconSize={theme.SIZES.BASE * 1.325}
                  color={theme.COLORS.TWITTER}
                  style={this.state.regHidden}
                  onPress={this.enrollCourse}
                > </Button>
                 <Button
                  round
                  onlyIcon
                  shadowless
                  icon="play"
                  iconFamily="font-awesome"
                  iconColor={theme.COLORS.WHITE}
                  iconSize={theme.SIZES.BASE * 1.325}
                  color={theme.COLORS.TWITTER}
                  style={this.state.playHidden}
                  onPress={() => {
                    const {params} = this.state; 
                    this.playCourse(params,this.props.navigation)
                    
                    }}
                > </Button>
              </Block>
              <Block middle>
                <Text bold size={12} style={{marginBottom: 8}}>{dateObj.format("MMM DD, YYYY")}</Text>
                <Text muted size={12}>Created</Text>
              </Block>
            </Block>
            <Block row space="between" style={{ paddingVertical: 7, alignItems: 'baseline' }}>
              <Text size={16}>{param.description}</Text>
            </Block>
            <Block row space="between" style={{ paddingVertical: 0, alignItems: 'baseline' }}>
              <Text size={16}>Lessons</Text>
             
            </Block>
             
            {this.renderList()}
            <Block center>
            <Button disabled={this.state.syncDisabled} color="success" onPress={() => {this.handleSync()}} round shadowless style={[styles.button, styles.shadow,{marginTop:50}]}>
              Refresh Course
            </Button>
            <ActivityIndicator style={this.state.showActivity}  />
          </Block>
          </ScrollView>
         
        </Block>

       
       
      </Block>
      
    );
  }
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
    marginBottom: -HeaderHeight * 2,
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
    marginTop: -theme.SIZES.BASE * 7,
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
  },
  hidden:{
    display:"none",
    marginLeft: 40

   },
   show:{
     display:"flex",
     marginLeft: 40
    }
});
