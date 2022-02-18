import React from 'react';
import { ImageBackground, StyleSheet, StatusBar, Dimensions } from 'react-native';
import storage from  '../components/DataStorage';


export default class Logout extends React.Component {
constructor() {
    super();
    
    
  }
  componentDidMount(){
    const { navigation } = this.props;
    storage.clearMap();
    navigation.pop();
    navigation.navigate("Login");
    
  }
  render() {
    

    return null;
  }
}
