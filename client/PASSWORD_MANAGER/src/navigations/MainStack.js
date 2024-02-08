import * as Screens from "../screens";
import TabRoutes from "./TabRoutes";
import navigationStrings from "./navigationStrings";

export default function (Stack) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.TAB_ROUTES}
        component={TabRoutes}
        options={{ headerShown: false }}
      />
    </>
  );
}
