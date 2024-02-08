//import liraries
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
} from "react-native";
import colors from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  responsiveHeight as h,
  responsiveWidth as w,
  responsiveFontSize as f,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import navigationStrings from "../../navigations/navigationStrings";
import AuthNavigate from "../../components/AuthNavigate";

// create a component
const Register = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    console.warn("Register pressed");
  };
  const navigation = useNavigation();
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: w(6),
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
          {/* Back button to Login */}
          <Ionicons
            name="arrow-back-outline"
            size={h(4)}
            color="white"
            style={{ marginVertical: h(3.5) }}
            onPress={() =>
              navigation.canGoBack()
                ? navigation.goBack()
                : navigation.navigate(navigationStrings.LOGIN)
            }
          />

          {/* Main Create account Text */}
          <Text
            style={{
              color: colors.whitefont,
              fontSize: f(4),
              fontWeight: "bold",
            }}
          >
            Create Account
          </Text>

          {/* info about screen */}
          <Text
            style={{
              color: colors.secondfontcolor,
              fontSize: f(2.5),
              fontWeight: "bold",
              marginBottom: h(5),
            }}
          >
            Please fill the input blow here
          </Text>

          <Input
            text={"Email"}
            placeholder={"divyesh@gmail.com"}
            iconName={"mail"}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <Input
            text={"User Name"}
            placeholder={"Jhoe Williams"}
            iconName={"user"}
            value={userName}
            onChangeText={(text) => setUserName(text)}
          />

          <Input
            text={"Password"}
            placeholder={"***********"}
            iconName={"lock"}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <Input
            text={"Confirm Password"}
            placeholder={"***********"}
            iconName={"lock"}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />

          <Button onPress={() => handleSignUp()} text={"SIGN UP"} />

          <AuthNavigate
            onPress={() =>
              navigation.canGoBack()
                ? navigation.goBack()
                : navigation.navigate(navigationStrings.LOGIN)
            }
            text1={"Already have an account?"}
            text2={" Login"}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

//make this component available to the app
export default Register;
