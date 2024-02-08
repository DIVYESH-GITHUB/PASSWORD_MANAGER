//import liraries
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
  Image,
} from "react-native";
import colors from "../../constants/colors";
import {
  responsiveHeight as h,
  responsiveFontSize as f,
  responsiveScreenWidth as w,
} from "react-native-responsive-dimensions";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import navigationStrings from "../../navigations/navigationStrings";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthNavigate from "../../components/AuthNavigate";

// create a component
const Login = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const handleLogin = async () => {
    Keyboard.dismiss();

    setShowLoading(true);

    await axios
      .post("http://172.16.104.87:3000/api/v1/users/login", {
        emailOrUsername: email.trim(),
        password: password.trim(),
      })
      .then((response) => {
        Alert.alert("Login", response.data.message);
        setShowLoading(false);
      })
      .catch((error) => {
        Alert.alert("Login error", error.response.data.errorMessage);
        setShowLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: w(5),
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={colors.background}
        />
        <View>
          {/* Image */}
          <Image
            source={require("../../../assets/login.png")}
            style={{
              height: h(32),
              width: h(30),
              alignSelf: "center",
              marginTop: h(5),
            }}
          />

          {/* Main Login Text */}
          <Text
            style={{
              color: "white",
              fontSize: f(4.4),
              fontWeight: "600",
              letterSpacing: 1,
            }}
          >
            Login
          </Text>

          {/* Info about Screen */}
          <Text
            style={{
              color: colors.secondfontcolor,
              fontSize: f(2.6),
              fontWeight: "600",
              letterSpacing: 1,
              marginTop: h(0.9),
              marginBottom: h(1.3),
            }}
          >
            Please sign in to continue
          </Text>

          <Input
            iconName={"mail"}
            onChangeText={(text) => setEmail(text)}
            placeholder={"user123@gmail.com"}
            text={"Email"}
            value={email}
          />

          <Input
            iconName={"lock"}
            onChangeText={(text) => setPassword(text)}
            placeholder={"#123Hello"}
            text={"Password "}
            value={password}
          />

          <Button
            onPress={async () => await handleLogin()}
            text={"LOGIN"}
            showLoading={showLoading}
          />

          <Text
            style={{
              color: colors.neoncolor,
              marginTop: h(3),
              alignSelf: "center",
              fontSize: f(2.2),
              padding: h(0.5),
            }}
          >
            Forgot Password?
          </Text>

          <AuthNavigate
            onPress={() => navigation.navigate(navigationStrings.REGISTER)}
            text1={"Don't have an account?"}
            text2={" Sign Up"}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
