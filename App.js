import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Home from "./screens/HomeForInstrument";
import HomeNew from "./screens/HomeforPiece";
import Settings from "./screens/Settings";
import Player from "./screens/Player";
import { firebase } from "./Firebase/firebase";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function App() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const HomeStack = createNativeStackNavigator();
  const HomeStackScreens = ({ navigation }) => {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen
          name="HomeScreen"
          component={HomeNew}
          options={{ headerShown: false }}
        />
        <HomeStack.Screen
          name="HomeForInstrument"
          component={Home}
          options={{ headerShown: false }}
        />
      </HomeStack.Navigator>
    );
  };

  // A state variable determine whether a user is signin or not
  const [issignIn, setIsSignIn] = useState(true);

  // useEffect(()=>{
  //   firebase.auth().onAuthStateChanged()
  // })

  if (issignIn) {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = focused ? "ios-home" : "ios-home-outline";
              } else if (route.name === "Settings") {
                iconName = focused ? "ios-list" : "ios-list-outline";
              } else if (route.name === "Player") {
                iconName = focused ? "ios-play" : "ios-play-outline";
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#FF665A",
            tabBarInactiveTintColor: "#A3A1A8",
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeStackScreens}
            options={{ headerShown: false }}
          />
          {/* <Tab.Screen
            name="Player"
            component={Player}
            options={{ headerShown: false }}
          /> */}
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  } else {
    // SignIn Page
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Sign In"
            component={SignIn}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Sign Up"
            component={SignUp}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    fontSize: 40,
    marginTop: 100,
    color: "pink",
  },
});
