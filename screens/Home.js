import React,{ useState, useEffect } from 'react';
import { StyleSheet, Dimensions, ScrollView,View } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';

import { Icon, Product } from '../components/';

const { width } = Dimensions.get('screen');
import products from '../constants/products';

//import Database from '../components/Database';
import * as SQLite from 'expo-sqlite';
import LoginWidget from '../components/LoginWidget';

const db = SQLite.openDatabase("LearnDB.db");

export default class Home extends React.Component {
    
  state = {
    items: null,
    myCourses:null,
    search:null,
    tab:'Explore'
  };
  
  constructor() {
    super();
    
    
  }
  componentDidMount() {
    this.getCourses();
    this.getMyCourses();
    
  }

  componentDidUpdate(prevProps) {
    if(this.state.search!=null && this.state.tab=="Course"){
      this.getMyCourses();
     
    }else if(this.state.search!=null && this.state.tab=="Explore"){
      this.getCourses();
    }
  }



  getCourses() {

    
    db.transaction((tx) => {

      if(this.state.search==null){
        tx.executeSql('SELECT id, courseid, lessons,name, image, created FROM courses order by id desc', [],
        (txObj, { rows: { _array } }) => this.setState({ items: _array })
        );
      }
      else{
        tx.executeSql("SELECT id, courseid, lessons,name, image, created FROM courses where name LIKE ? order by id desc", [`%${this.state.search}%`],
        (txObj, { rows: { _array } }) => this.setState({ items: _array })
        );
      }   
    });
    
  }

  getMyCourses() {

    db.transaction((tx) => {
      if(this.state.search==null){
        tx.executeSql('SELECT courses.id, courses.courseid, courses.lessons,courses.name, courses.image, courses.created FROM enrollment LEFT JOIN courses ON courses.courseid=enrollment.courseid order by courses.id desc', [],
        (txObj, { rows: { _array } }) => this.setState({ myCourses: _array })
        );
      }
      else{
        tx.executeSql("SELECT courses.id, courses.courseid, courses.lessons,courses.name, courses.image, courses.created FROM enrollment LEFT JOIN courses ON courses.courseid=enrollment.courseid where courses.name LIKE ? order by courses.id desc", [`%${this.state.search}%`],
        (txObj, { rows: { _array } }) => this.setState({ myCourses: _array })
        );
      }
    })
  
     
  }
  
  
  renderSearch = () => {
    const { navigation } = this.props;
    const iconCamera = <Icon size={16} color={theme.COLORS.MUTED} name="zoom-in" family="material" />

    return (
      <Input
        right
        color="black"
        style={styles.search}
        iconContent={iconCamera}
        placeholder="What are you looking for?"
        onChangeText={value => {
          var val=value.trim().toLowerCase();
          if(val==""){
            this.setState({ search:null})
          }
          else{
            this.setState({ search:val})
          }
        }
        }
        
      />
    )
  }
  
  
  renderTabs = () => {
    const { navigation } = this.props;
    

    return (
      <Block row style={styles.tabs}>
        <Button shadowless style={[styles.tab, styles.divider]} onPress={() => this.setState({tab: 'Explore'})}>
          <Block row middle>
            <Icon name="grid" family="feather" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>Explore</Text>
          </Block>
        </Button>
        <Button shadowless style={styles.tab} onPress={() => this.setState({tab: 'Course'})}>
          <Block row middle>
            <Icon size={16} name="camera-18" family="GalioExtra" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>My Courses</Text>
          </Block>
        </Button>
      </Block>
    )
  }

  renderCourses = () => {
    
    const { items } = this.state;
    
    
    if (items === null || items.length === 0) {
      return null;
    }
  
   var indents = [];
    for (var i = 0; i < items.length; i++) {
      if(i==1 && items.length<=2){
        indents.push(<Product key={i} product={items[i]} full />);
      }else if((i==1) && items.length>2){
        indents.push( <Block flex row>
          <Product key={1} product={items[1]} style={{ marginRight: theme.SIZES.BASE }} />
          <Product key={2} product={items[2]} />
        </Block>);
      }else if(i == 0 ){
        indents.push( <Product key={i} product={items[i]} horizontal />);
      }else if( i > 2){
        indents.push( <Product key={i} product={items[i]} full />);
      }
      
    }
    
    
    
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}>
        <Block flex>
          {indents}
        </Block>
      </ScrollView>
    )
  }

  renderMyCourses = () => {
    
    const { myCourses } = this.state;
    
    var items = myCourses;
    //console.log(items);
    if (items === null || items.length === 0) {
      return null;
    }
  
   var indents = [];
    for (var i = 0; i < items.length; i++) {
      
        indents.push(<Product key={i} product={items[i]} full />);
      
    }
     
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}>
        <Block flex>
          {indents}
        </Block>
      </ScrollView>
    )
  }


  render() {
    //console.log(this.props);
    var param=this.state.tab;
    
    if(param=="Course"){
      return (
        <Block flex center style={styles.home}>
          <Block center style={{ backgroundColor: 'rgba(255,255,255,1)' },styles.shadow}>
            {this.renderSearch()}
            {this.renderTabs()}
          </Block>
          {this.renderMyCourses()}
        </Block>
      );
    }
    return (
      <Block flex center style={styles.home}>
          <Block center style={{ backgroundColor: 'rgba(255,255,255,1)' },styles.shadow}>
            {this.renderSearch()}
            {this.renderTabs()}
          </Block>
        {this.renderCourses()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
    zIndex: 2,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.50,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300'
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  products: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
  },
});
