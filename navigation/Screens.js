import React, { useState, useEffect } from 'react';
import { Easing, Animated, Dimensions } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";

import { Block, Text, theme } from "galio-framework";

import ComponentsScreen from '../screens/Components';
import HomeScreen from '../screens/Home';
import OnboardingScreen from '../screens/Onboarding';
import ProfileScreen from '../screens/Profile';
import ProScreen from '../screens/Pro';
import SettingsScreen from '../screens/Settings';
import RegisterScreen from '../screens/Register';
import LoginScreen from '../screens/Login';
import CourseScreen from '../screens/Course';
import PlayerScreen from '../screens/Player';
import AllCoursesScreen from '../screens/AllCourses';
import MyLibraryScreen from '../screens/MyLibrary';
import LogoutScreen from '../screens/Logout';

import CustomDrawerContent from './Menu';
import { Icon, Header } from '../components';
import { Images, materialTheme,utils } from "../constants/";
import Database from '../components/Database';
import ServerResources from '../components/ServerResources';
const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const sr = new ServerResources();
const db = new Database();
db.getLastCourse();

  
 

 
const profile = {
  avatar: Images.Profile,
  name: "Rachel Brown",
  type: "Seller",
  plan: "Pro",
  rating: 4.8
};
function RegisterStack(props) {
  return (
    <Stack.Navigator initialRouteName="Sign Up" mode="card" headerMode="none">
      <Stack.Screen
        name="Sign Up"
        component={RegisterScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              white
              transparent
              title="Sign Up"
              scene={scene}
              navigation={navigation}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen name="Login" component={LoginStack} />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}

function LoginStack(props) {
  return (
    <Stack.Navigator initialRouteName="Login" mode="card" headerMode="none">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          
          headerTransparent: true
        }}
      />
      <Stack.Screen name="Register" component={RegisterStack} />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}

function ProfileStack(props) {
  return (
    <Stack.Navigator initialRouteName="Profile" mode="card" headerMode="screen">
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              white
              transparent
              title="Profile"
              scene={scene}
              navigation={navigation}
            />
          ),
          headerTransparent: true
        }}
      />
       <Stack.Screen name="MyLibrary" component={MyLibraryStack1}  options={{ title: 'My Library' }} />
      <Stack.Screen name="Player" component={PlayerStack} options={{ title: 'Take Course' }} />
     
    </Stack.Navigator>
  );
}

function CourseStack(props) {
  return (
    <Stack.Navigator initialRouteName="Course" mode="card" headerMode="none">
      <Stack.Screen
        name="Course"
        component={CourseScreen}
        options={{ title: 'Course Details' }}
       
      />

      
    </Stack.Navigator>
  );
}

function AllCoursesStack(props) {
  
  return (
    <Stack.Navigator initialRouteName="All Courses" mode="card" headerMode="screen">
      <Stack.Screen
        name="All Courses"
        component={AllCoursesScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header 
              
              title="All Courses"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
       
      />

<Stack.Screen name="Course" component={CourseStack} options={{ title: 'Course Details' }} />
      <Stack.Screen name="Player" component={PlayerStack} options={{ title: 'Take Course' }} />
    </Stack.Navigator>
  );
}

function MyLibraryStack(props) {
  return (
    <Stack.Navigator initialRouteName="MyLibrary" mode="card" headerMode="screen">
      <Stack.Screen
        name="MyLibrary"
        component={MyLibraryScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header 
              
              
              title="My Library"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
       
      />
<Stack.Screen name="Course" component={CourseStack} options={{ title: 'Course Details' }} />
      <Stack.Screen name="Player" component={PlayerStack} options={{ title: 'Take Course' }} />
      
    </Stack.Navigator>
  );
}

function MyLibraryStack1(props) {
  return (
    <Stack.Navigator initialRouteName="MyLibrary" mode="card" headerMode="none">
      <Stack.Screen
        name="MyLibrary"
        component={MyLibraryScreen}
        
       
      />
<Stack.Screen name="Course" component={CourseStack} options={{ title: 'Course Details' }} />
       
    </Stack.Navigator>
  );
}

function SettingsStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      mode="card"
      headerMode="screen"
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Settings" scene={scene} navigation={navigation} />
          )
        }}
      />
    </Stack.Navigator>
  );
}

function ComponentsStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Components"
        component={ComponentsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Components" scene={scene} navigation={navigation} />
          )
        }}
      />
    </Stack.Navigator>
  );
}

function HomeStack(props) {
  
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen 
        name="Home"
        component={HomeScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header 
              
              title="Home"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      
      <Stack.Screen name="Course" component={CourseStack} options={{ title: 'Course Details' }} />
      <Stack.Screen name="Player" component={PlayerStack} options={{ title: 'Take Course' }} />
    </Stack.Navigator>
  );
}
function LogoutStack(props) {
  
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen 
        name="Logout"
        component={LogoutScreen}
       
      />
      
      <Stack.Screen name="Sign In" component={LoginStack} options={{ title: 'Sign In' }} />
   
    </Stack.Navigator>
  );
}


function PlayerStack(props) {
  
  return (
    <Stack.Navigator initialRouteName="Player" mode="card" headerMode="none">
      <Stack.Screen 
        name="Player"
        component={PlayerScreen}
        options={{ title: 'Take Course' }}
      />
      
      
    </Stack.Navigator>
  );
}


function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={props => (
        <CustomDrawerContent {...props} profile={profile} />
      )}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8
      }}
      drawerContentOptions={{
        activeTintColor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: materialTheme.COLORS.ACTIVE,
        inactiveBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.74,
          paddingHorizontal: 12,
          // paddingVertical: 4,
          justifyContent: "center",
          alignContent: "center",
          // alignItems: 'center',
          overflow: "hidden"
        },
        labelStyle: {
          fontSize: 18,
          fontWeight: "normal"
        }
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="shop"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="log-out"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
              style={{ marginLeft: 4, marginRight: 4 }}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Man"
        component={ProScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="man"
              family="entypo"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Kids"
        component={ProScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="baby"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name="New Collection"
        component={ProScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="grid-on"
              family="material"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="circle-10"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="gears"
              family="font-awesome"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
              style={{ marginRight: -3 }}
            />
          )
        }}
      />
      
      <Drawer.Screen
        name="All Courses"
        component={AllCoursesStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="archive"
            family="entypo"
              
              color={focused ? "white" : materialTheme.COLORS.MUTED}
              style={{ marginRight: -3 }}
            />
          )
        }}
      />

    <Drawer.Screen
        name="My Library"
        component={MyLibraryStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="md-book"
              family="ionicon"
              
              color={focused ? "white" : materialTheme.COLORS.MUTED}
              style={{ marginRight: -3 }}
            />
          )
        }}
      />
      
      <Drawer.Screen
        name="Components"
        component={ComponentsStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="md-switch"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
              style={{ marginRight: 2, marginLeft: 2 }}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Sign In"
        component={ProScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="ios-log-in"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Sign Up"
        component={ProScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="md-person-add"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
    </Drawer.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        option={{
          headerTransparent: true
        }}
      />
      <Stack.Screen name="Login" component={LoginStack} />
      <Stack.Screen name="Register" component={RegisterStack} />
    </Stack.Navigator>
  );
}

/*
const ProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Header white transparent title="Profile" navigation={navigation} />,
      headerTransparent: true,
    })
  },
}, {
  cardStyle: { backgroundColor: '#EEEEEE', },
  transitionConfig,
});

const SettingsStack = createStackNavigator({
  Settings: {
    screen: SettingsScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Header title="Settings" navigation={navigation} />,
    })
  },
}, {
  cardStyle: { backgroundColor: '#EEEEEE', },
  transitionConfig,
});

const ComponentsStack = createStackNavigator({
  Components: {
    screen: ComponentsScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Header title="Components" navigation={navigation} />,
    })
  },
}, {
  cardStyle: { backgroundColor: '#EEEEEE', },
  transitionConfig,
});


const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header search tabs title="Home" navigation={navigation} />,
    })
  },
  Pro: {
    screen: ProScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header back white transparent title="" navigation={navigation} />,
      headerTransparent: true,
    })
  },
},
{
  cardStyle: { 
    backgroundColor: '#EEEEEE', //this is the backgroundColor for the app
  },
  transitionConfig,
});

const AppStack = createDrawerNavigator(
  {
    Onboarding: {
      screen: OnboardingScreen,
      navigationOptions: {
        drawerLabel: () => {},
      },
    },
    Home: {
      screen: HomeStack,
      navigationOptions: {
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Home" title="Home" />
        )
      }
    },
    Woman: {
      screen: ProScreen,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Pro" title="Woman" />
        ),
      }),
    },
    Man: {
      screen: ProScreen,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Pro" title="Man" />
        ),
      }),
    },
    Kids: {
      screen: ProScreen,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Pro" title="Kids" />
        ),
      }),
    },
    NewCollection: {
      screen: ProScreen,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Pro" title="New Collection" />
        ),
      }),
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Profile" title="Profile" />
        ),
      }),
    },
    Settings: {
      screen: SettingsStack,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Settings" title="Settings" />
        ),
      }),
    },
    Components: {
      screen: ComponentsStack,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Components" title="Components" />
        ),
      }),
    },
    MenuDivider: {
      screen: HomeStack,
      navigationOptions: {
        drawerLabel: () => <Block style={{marginVertical: 8}}><Text>{` `}</Text></Block>,
      },
    },
    SignIn: {
      screen: ProScreen,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Pro" title="Sign In" />
        ),
      }),
    },
    SignUp: {
      screen: ProScreen,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Pro" title="Sign Up" />
        ),
      }),
    },
  },
  Menu
);

const AppContainer = createAppContainer(AppStack);
export default AppContainer;

*/