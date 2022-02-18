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

export default class MyLibrary extends React.Component {
    
  state = {
    items: null,
    myCourses:null,
    search:null
  };
  
  constructor() {
    super();
    
    
  }
  
  componentDidMount() {
    
    this.getMyCourses();
    
  }
  componentDidUpdate(prevProps) {
    if(this.state.search!=null){
      this.getMyCourses();
     
    }
  }


  getMyCourses() {
    db.transaction((tx) => {
    if(this.state.search==null){
      tx.executeSql('SELECT courses.id, courses.courseid, courses.lessons,courses.name, courses.image, courses.created FROM enrollment LEFT JOIN courses ON courses.courseid=enrollment.courseid order by courses.id desc', [],
      (txObj, { rows: { _array } }) => this.setState({ myCourses: _array })
      );
    }
    else{
      //console.log(this.state.search);
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
    
    return (
    <Block flex center style={styles.home}>
    <Block center style={{ backgroundColor: 'rgba(255,255,255,1)' },styles.shadow}>
      {this.renderSearch()}
    </Block>
     
     {this.renderMyCourses()}  
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
  },
  shadow: {
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
