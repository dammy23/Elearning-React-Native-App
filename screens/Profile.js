import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Image, ImageBackground, Platform,TouchableOpacity } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import { LinearGradient } from 'expo-linear-gradient';

import { Icon } from '../components';
import { Images, materialTheme } from '../constants';
import { HeaderHeight } from "../constants/utils";
import storage from  '../components/DataStorage';
import * as SQLite from 'expo-sqlite';
import { base_url } from '../constants/utils';


const db = SQLite.openDatabase("LearnDB.db");



const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;



export default class Profile extends React.Component {
  state = {
    name: null,
    email:null,
    myCourses:null,
    
  };
  constructor() {
    super();
    
    
  }
  
  componentDidMount() {
    storage.load({
      key: 'userDetails',
    })
    .then(ret => {
      // found data goes to then()
      var str = JSON.parse(ret);
      this.setState({name:str.user.name,email:str.user.email})
      
    })
    .catch(err => {
      // any exception including data not found
      // goes to catch()
      console.warn(err.message);
      switch (err.name) {
        case 'NotFoundError':
          // TODO;
          break;
        case 'ExpiredError':
          // TODO
          break;
      }
    });
    
    this.getMyCourses();
    
  }
  
 
  getMyCourses() {
    db.transaction((tx) => {
    
      tx.executeSql('SELECT courses.id, courses.courseid, courses.lessons,courses.name, courses.image, courses.created FROM enrollment LEFT JOIN courses ON courses.courseid=enrollment.courseid order by courses.id desc', [],
      (txObj, { rows: { _array } }) => this.setState({ myCourses: _array })
      );
   
  })

    
   
  }


  renderMyCourses = () => {
    
    const { myCourses } = this.state;
    const { navigation } = this.props;
    
    var items = myCourses;
    
    if (items === null || items.length === 0) {
      return null;
    }
    //console.log(items); 
   var indents = []; 
   items.forEach(element => {
    indents.push(<TouchableOpacity onPress={() => navigation.navigate('Player', {screen: 'Player',
    params: { product: element }})}
    ><Image 
                    source={{ uri: base_url+"uploads/"+element.image }}
                    key={"key"+element.courseid}  
                    resizeMode="cover"
                    style={styles.thumb}
                  /></TouchableOpacity>);
   });
    
    return (
      <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
              <Block row space="between" style={{ flexWrap: 'wrap' }} >
                {indents}
              </Block>
            </Block>
    )
  }

  

  render() {
    return (
      <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground
            source={{uri: Images.Profile}}
            style={styles.profileContainer}
            imageStyle={styles.profileImage}>
            <Block flex style={styles.profileDetails}>
              <Block style={styles.profileTexts}>
                <Text color="white" size={28} style={{ paddingBottom: 8 }}>{this.state.name}</Text>
                <Block row space="between">
                  <Block row>
                    <Block middle style={styles.pro}>
                      <Text size={16} color="white">Pro</Text>
                    </Block>
                    <Text color="white" size={16} muted style={styles.seller}>User</Text>
                    
                  </Block>
                  <Block>
                    <Text color={theme.COLORS.MUTED} size={16}>
                      <Icon name="envelope" family="font-awesome" color={theme.COLORS.MUTED} size={16} />
                       {"  "+this.state.email}
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
           
            <Block row space="between" style={{ paddingVertical: 16, alignItems: 'baseline' }}>
              <Text size={16}>My Courses</Text>
              <Text size={12} color={theme.COLORS.PRIMARY} onPress={() => this.props.navigation.navigate('MyLibrary')}>View All</Text>
            </Block>
            {this.renderMyCourses()}
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
  },
  gradient: {
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
    position: 'absolute',
  },
});
