import React from 'react';
import { StyleSheet, Modal, Switch, FlatList, Platform, TouchableOpacity, Pressable, View,ActivityIndicator  } from "react-native";
import { Block, Text, theme, Icon,Button } from "galio-framework";
import * as SecureStore from 'expo-secure-store';
import { agreement,privacy,about } from '../constants/utils';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import axios from 'axios';
import {base_url} from '../constants/utils';
import Database from '../components/Database';
import materialTheme from '../constants/Theme';

const db = new Database().getInit();

export default class Settings extends React.Component {
  state = {showAgreement:false,
    showPrivacy:false,
    showAbout:false,
    showActivity: styles.hidden,
    syncDisabled: false,
  };

  toggleSwitch = switchNumber => this.setState({ [switchNumber]: !this.state[switchNumber] });

 recommended = [
    { title: "Use FaceID to sign in", id: "face", type: "switch" },
    { title: "Auto-Lock security", id: "autolock", type: "switch" },
    { title: "Notifications", id: "Notifications", type: "switch" },
  ];

  
  
 privacy = [
    { title: "Terms and Conditions", id: "Agreement", type: "button" },
    { title: "Privacy", id: "Privacy", type: "button" },
    { title: "About", id: "About", type: "button" },
  ];

  syncCourse(){
    this.setState({["showActivity"]:styles.show, ["syncDisabled"]: true});
    
    this.getLastCourse();
  }

  getLastCourse() {

    const _this=this;
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM courses ORDER BY id DESC LIMIT 1', null,
      (txObj, res) => {
        
        let ele = res.rows.item(0); 
        
        if(res.rows.length==0){
          _this.fetchLatestCourse("");
        }else{
          _this.fetchLatestCourse(ele.courseid); 
        }
        


      } 
      
      )


      
      });
  

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
    let durl="";
    if(id==""){
        durl=base_url+'course/list'; 
    }else{
        durl=base_url+'course/listlatest/'+id;
    }
   
    axios.get(durl)
        .then(function (response) { 
         
            const res=response.data;
            if(res.length==0)
            {
              //console.log(response.data.length);
              _this.setState({["showActivity"]:styles.hidden, ["syncDisabled"]: false});
            }else{
              //console.log(res);
              res.forEach(element => {
                            
                _this.addCourse(element);   
              });
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

            _this.setState({["showActivity"]:styles.hidden, ["syncDisabled"]: false});
      
        
        })
        .catch(function (error) {
      
        
        });

  }

  componentDidMount(){
    this.recommended.forEach(element => {
      this.getValueFor(element.id);
     
     }); 
     //this.setState({["showActivity"]:styles.hidden, ["syncDisabled"]: false});
  }

  renderItem = ({ item }) => {
    const {navigate} = this.props.navigation;

    switch(item.type) {
      case 'switch': 
        return (
          <Block row middle space="between" style={styles.rows}>
            <Text size={14}>{item.title}</Text>
            <Switch
              onValueChange={() => {
                this.toggleSwitch(item.id);
                
                
              }}
              ios_backgroundColor={materialTheme.COLORS.SWITCH_OFF}
              thumbColor={Platform.OS === 'android' ? materialTheme.COLORS.SWITCH_OFF : null}
              trackColor={{ false: materialTheme.COLORS.SWITCH_OFF, true: materialTheme.COLORS.SWITCH_ON }}
              value={this.state[item.id]}
            />
          </Block>
        );
      case 'button': 
        return (
          <Block style={styles.rows}>
            <TouchableOpacity onPress={() =>this.setState({ ["show"+item.id]: !this.state["show"+item.id] })}>
              <Block row middle space="between" style={{paddingTop:7}}>
                <Text size={14}>{item.title}</Text>
                <Icon name="angle-right" family="font-awesome" style={{ paddingRight: 5 }} />
              </Block>
            </TouchableOpacity>
          </Block>);
       
     
      default:
        break;
    }
  }

  renderAgreement(){
    var showAgreement="showAgreement";
    return(<Modal
      animationType="slide"
      transparent={true}
      visible={this.state[showAgreement]}
      onRequestClose={() => {
        this.setState({[showAgreement]:!this.state[showAgreement]})
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
       
      
          <WebView
            style={styles.container,{width:300,minHeight:300}}
           
              source={{ html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=0.7"></head><body>'+agreement+'</body></html>' }}
              originWhitelist={['*']}
              scrollEnabled={true}
              startInLoadingState={true}
              renderLoading={() => <Text>Loading...</Text>}
          />
        
   
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => this.setState({[showAgreement]:!this.state[showAgreement]})}>
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>);

  }


  renderPrivacy(){
    var showPrivacy="showPrivacy";
    return(<View style={styles.centeredView}><Modal
      animationType="slide"
      transparent={true}
      visible={this.state[showPrivacy]}
      onRequestClose={() => {
        this.setState({[showPrivacy]:!this.state[showPrivacy]})
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <WebView
            style={styles.container,{width:300}}
           
            source={{ html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=0.7"></head><body>'+privacy+'</body></html>'}}
              originWhitelist={['*']}
              scrollEnabled={true}
              startInLoadingState={true}
              renderLoading={() => <Text>Loading...</Text>}
          />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => this.setState({[showPrivacy]:!this.state[showPrivacy]})}>
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal></View>);

  }


  renderAbout(){
    var showAbout="showAbout";
    return(<View style={styles.centeredView,{height:50}}><Modal
      animationType="slide"
      style={{height:50}}
      transparent={true}
      visible={this.state[showAbout]}
      onRequestClose={() => {
        this.setState({[showAbout]:!this.state[showAbout]})
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <WebView
            style={styles.container,{width:300}}
           
            source={{ html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>'+about+'</body></html>'}}
              originWhitelist={['*']}
              scrollEnabled={true}
              startInLoadingState={true}
              renderLoading={() => <Text>Loading...</Text>}
          />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => this.setState({[showAbout]:!this.state[showAbout]})}>
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal></View>);

  }

  render() {

    this.recommended.forEach(element => {
      
      if(this.state[element.id]!=null){
       
        this.save(element.id, this.state[element.id].toString());
      } 
     });
      
    return (
      <View
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.settings}>
        <FlatList
          data={this.recommended}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderItem}
          ListHeaderComponent={
            <Block style={styles.title}>
              <Text bold center size={theme.SIZES.BASE} style={{ paddingBottom: 5 }}>
                Recommended Settings
              </Text>
              <Text center muted size={12}>
                These are the most important settings
              </Text>
            </Block>
          }
        />
       
        <Block style={styles.title}>
          <Text bold center size={theme.SIZES.BASE} style={{ paddingBottom: 5 }}>
          Privacy Settings
          </Text>
          <Text center muted size={12}>
          Third most important settings
          </Text>
        </Block>
        <FlatList
          data={this.privacy}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderItem}
        />
         {this.renderAgreement()}
         {this.renderPrivacy()}
         {this.renderAbout()}
         <Block center>
            <Button disabled={this.state["syncDisabled"]} onPress={() => {this.syncCourse()}} shadowless style={[styles.button, styles.shadow]}>
              SYNC
            </Button>
            <ActivityIndicator style={this.state["showActivity"]}  />
          </Block>
         
      </View>
      
    );
  }


  async save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  
  async getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    ///console.log(result);
    var isTrueSet = (result === 'true');
    this.setState({[key]:isTrueSet});
    
  }
}



const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  settings: {
    paddingVertical: theme.SIZES.BASE / 3,
  },
  title: {
    paddingTop: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE / 2,
  },container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    fontSize:30
  },
  rows: {
    height: theme.SIZES.BASE * 2,
    paddingHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE / 2,
  },hidden:{
    display:"none"
   },
   show:{
     display:"flex"
    }
});
