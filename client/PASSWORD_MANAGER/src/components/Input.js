//import liraries
import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import colors from "../constants/colors";
import { AntDesign } from "@expo/vector-icons";
import {
  responsiveHeight as h,
  responsiveWidth as w,
  responsiveFontSize as f,
} from "react-native-responsive-dimensions";

// create a component
const Input = ({ iconName, text, value, onChangeText, placeholder }) => {
  return (
    <View style={styles.container}>
      <AntDesign
        name={iconName}
        size={24}
        color="white"
        style={{ alignSelf: "center" }}
      />
      <View style={{ marginLeft: w(2.4) }}>
        <Text style={styles.text}>{text}</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.whitefont}
          style={styles.textInput}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.lightcolor,
    padding: h(1.5),
    marginBottom: h(1.7),
    borderRadius: 18,
  },
  text: {
    color: colors.secondfontcolor,
    fontSize: f(2),
    marginBottom: h(0.5),
    letterSpacing: 1,
    fontWeight: "400",
  },
  textInput: {
    color: colors.whitefont,
    fontSize: f(2),
    padding: h(0.3),
  },
});

export default Input;
