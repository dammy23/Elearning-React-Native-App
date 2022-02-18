import React, { useState } from 'react';
import { ImageBackground, StyleSheet, StatusBar, Dimensions,ActivityIndicator } from 'react-native';
import { Block, Button, Text, theme,Input } from 'galio-framework';
import axios from 'axios';
import storage from  './DataStorage';

const { height, width } = Dimensions.get('screen');

import materialTheme from '../constants/Theme';
import Images from '../constants/Images';

const RegisterWidget = (props) => {
    const [uname, setUname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showactivity, setShowActivity] = useState(styles.hidden);
    const loginUser = () => {
      axios.post('http://172.20.10.6:3333/user/authenticate', {
          email: email,
          password: password
        })
        .then(function (response) {
          console.log(response.data);
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
          console.log(error);
          setLoading(false);
          setShowActivity(styles.hidden);
        });
    }
    const registerUser = () => {
        setLoading(true);
        setShowActivity(null);
        axios.post('http://172.20.10.6:3333/user/create', {
          email: email,
          name: uname,
          password: password
        })
        .then(function (response) {
          console.log(response.data.email);

          loginUser();
        })
        .catch(function (error) {
          console.log(error);
          setLoading(false);
          setShowActivity(styles.hidden);
        });
      }
    

  return (
            <><Block center style={{ paddingHorizontal: theme.SIZES.BASE }}>
            <Input
              right
              placeholder="Name"
              placeholderTextColor={materialTheme.COLORS.DEFAULT}
              style={{ borderRadius: 3, borderColor: materialTheme.COLORS.INPUT }}
              color="#000000"
              transparent
              onChangeText={value => setUname(value)}
              defaultValue={uname}
            />
          </Block> 
          <Block center style={{ paddingHorizontal: theme.SIZES.BASE }}>
            <Input
              right
              placeholder="Email"
              placeholderTextColor={materialTheme.COLORS.DEFAULT}
              style={{ borderRadius: 3, borderColor: materialTheme.COLORS.INPUT }}
              color="#000000"
              transparent
              onChangeText={value => setEmail(value.toLowerCase())}
              defaultValue={email}
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
              defaultValue={password}
            />
          </Block>
          <Block center>
              <Button
                shadowless
                disabled={loading}
                style={styles.button}
                color={materialTheme.COLORS.BUTTON_COLOR}
                onPress={registerUser}>
                Register
              </Button>
              <ActivityIndicator style={showactivity}  />
              <Text onPress={() => props.navigation.navigate('Login')} size={16} color='rgba(255,255,255,0.6)'>
                Already have an account? Sign In
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
  

export default RegisterWidget;