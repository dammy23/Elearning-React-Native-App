import React, { useState } from 'react';
import { StyleSheet, StatusBar, Dimensions,ActivityIndicator } from 'react-native';
import { Block, Button, Text, theme,Input } from 'galio-framework';
import axios from 'axios';
import storage from  './DataStorage';
import { base_url } from '../constants/utils';

const { height, width } = Dimensions.get('screen');

import materialTheme from '../constants/Theme';

const LoginWidget = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showactivity, setShowActivity] = useState(styles.hidden);
    const loginUser = () => {
        setLoading(true);
        setShowActivity(null);
      axios.post(base_url+'user/authenticate', {
          email: email,
          password: password
        })
        .then(function (response) {
          
          storage.save({
            key: 'userDetails', // Note: Do not use underscore("_") in key!
            data: JSON.stringify(response.data),
          
            // if expires not specified, the defaultExpires will be applied instead.
            // if set to null, then it will never expire.
            expires: 1000 * 3600
          });
          
          setLoading(false);
          setShowActivity(styles.hidden);
          props.navigation.navigate("App");
        })
        .catch(function (error) {
          
          setLoading(false);
          setShowActivity(styles.hidden);
        });
    }
    
    

  return (
            <> 
          <Block center style={{ paddingHorizontal: theme.SIZES.BASE }}>
            <Input
              right
              placeholder="Email"
              placeholderTextColor={materialTheme.COLORS.DEFAULT}
              style={{ borderRadius: 3, borderColor: materialTheme.COLORS.INPUT }}
              color="#000000"
              transparent
              onChangeText={value => setEmail(value.toLowerCase())}
              defaultValue="damiisaac23@gmail.com"
            />
          </Block> 
  
          <Block center style={{ paddingHorizontal: theme.SIZES.BASE }}>
            <Input
              right
              placeholder="Password"
              password 
              viewPass
              placeholderTextColor={materialTheme.COLORS.DEFAULT}
              style={{ borderRadius: 3, borderColor: materialTheme.COLORS.INPUT }}
              color="#000000"
              transparent
              onChangeText={value => setPassword(value)}
              defaultValue="123456"
            />
          </Block>
          <Block center>
              <Button
                shadowless
                disabled={loading}
                style={styles.button}
                color={materialTheme.COLORS.BUTTON_COLOR}
                onPress={loginUser}>
                Login
              </Button>
              <ActivityIndicator style={showactivity}  />
              <Text onPress={() => props.navigation.navigate('Register')} size={16} color='rgba(255,255,255,0.6)'>
                Don`t have an account? Sign Up
              </Text>
            </Block>
          </>  
  );
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
    hidden:{
      display:"none"
     },
     show:{
       display:"flex"
      }
     
  });
  

export default LoginWidget;