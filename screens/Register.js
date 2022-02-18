import React from 'react';
import { ImageBackground, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { Block, Button, theme} from 'galio-framework';
import axios from 'axios';

const { height, width } = Dimensions.get('screen');

import Images from '../constants/Images';
import RegisterWidget from '../components/RegisterWidget';




 

export default class Register extends React.Component {
 
  render() {
    

    const { navigation } = this.props;
    
    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />
       
        <Block flex="1" center>
          <ImageBackground
            source={{  uri: Images.LoginBackground }}
            style={{ height: height, width: width, marginTop: '-5%', zIndex: 1 }}
          />
        </Block>
        <Block flex="4" space="between" style={styles.padded}>
        
        <Block style={styles.group}>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Block row center space="between">
           
            <Block flex middle center>
              <Button
                round
                onlyIcon
                shadowless
                icon="book"
                iconFamily="font-awesome"
                iconColor={theme.COLORS.WHITE}
                iconSize={theme.SIZES.BASE * 3.625}
                color={theme.COLORS.DRIBBBLE}
                style={[styles.social, styles.shadow]}
              />
            </Block>
           
          </Block>
        </Block>
      </Block>
      
          <Block flex  style={{ zIndex: 2 }}>   
            <RegisterWidget
              navigation={navigation}
            /> 
            
          </Block>
        </Block>
      </Block>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: 'relative',
    bottom: theme.SIZES.BASE,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
});
