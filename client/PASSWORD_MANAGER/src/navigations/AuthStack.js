import * as Screens from "../screens";
import navigationStrings from "./navigationStrings";

export default function (Stack) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.INITIAL}
        component={Screens.Initial}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.LOGIN}
        component={Screens.Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.REGISTER}
        component={Screens.Register}
        options={{ headerShown: false }}
      />
    </>
  );
}
