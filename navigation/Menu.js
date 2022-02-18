import React from "react";
import { TouchableWithoutFeedback, ScrollView, StyleSheet, Image } from "react-native";
import { Block, Text, theme } from "galio-framework";
import { useSafeArea } from "react-native-safe-area-context";

import { Icon, Drawer as DrawerCustomItem } from '../components/';
import { Images, materialTheme } from "../constants/";
import storage from  '../components/DataStorage';
var uname="";
var email="";
storage
  .load({
    key: 'userDetails',
  })
  .then(ret => {
    // found data goes to then()
    var str = JSON.parse(ret);
    uname=str.user.name;
    email=str.user.email;
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

function CustomDrawerContent({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {
  const insets = useSafeArea();
  const screens = [
    "Home",
    "My Library",
    "All Courses",
    "Profile"
  ]; 
  return (
    <Block
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <Block flex={0.25} style={styles.header}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("Profile")}
        >
          <Block style={styles.profile}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            <Text h5 color={"white"}>
              {uname}
            </Text>
          </Block>
        </TouchableWithoutFeedback>
        <Block row>
          <Block middle style={styles.pro}>
            <Text size={16} color="white">
              {email}
            </Text>
          </Block>
          
        </Block>
      </Block>
      <Block flex style={{ paddingLeft: 7, paddingRight: 14 }}>
        <ScrollView
          contentContainerStyle={[
            {
              paddingTop: insets.top * 0.4,
              paddingLeft: drawerPosition === "left" ? insets.left : 0,
              paddingRight: drawerPosition === "right" ? insets.right : 0
            }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item}
                key={index}
                navigation={navigation}
                focused={state.index === index ? true : false}
              />
            );
          })}
        </ScrollView>
      </Block>
      <Block flex={0.3} style={{ paddingLeft: 7, paddingRight: 14 }}>
      <DrawerCustomItem
          title="Settings"
          navigation={navigation}
          focused={state.index === 9 ? true : false}
        />
        <DrawerCustomItem
          title="Logout"
          navigation={navigation}
          focused={state.index === 8 ? true : false}
        />
        
      </Block>
    </Block>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4B1958',
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 2,
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 28,
    justifyContent: 'flex-end'
  },
  profile: {
    marginBottom: theme.SIZES.BASE / 2,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginBottom: theme.SIZES.BASE,
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginRight: 8,
    borderRadius: 4,
    height: 19,
    width: 200,
  },
  seller: {
    marginRight: 16,
  }
});

export default CustomDrawerContent;
