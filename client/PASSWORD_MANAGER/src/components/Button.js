//import liraries
import React from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import colors from "../constants/colors";
import {
  responsiveHeight as h,
  responsiveWidth as w,
  responsiveFontSize as f,
} from "react-native-responsive-dimensions";

// create a component
const Button = ({ onPress, text, showLoading }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {showLoading ? (
        <ActivityIndicator size={"large"} color={"white"} />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neoncolor,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: h(1.7),
    height: h(7.2),
    width: w(60),
    alignSelf: "center",
    borderColor: "white",
    borderWidth: 0.8,
  },
  text: {
    color: "black",
    fontWeight: "bold",
    fontSize: f(2),
    letterSpacing: 1,
  },
});
export default Button;
