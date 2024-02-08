import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

import AuthStack from "./AuthStack";
import MainStack from "./MainStack";
import navigationStrings from "./navigationStrings";

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={navigationStrings.LOGIN}>
        {AuthStack(Stack)}
        {MainStack(Stack)}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
