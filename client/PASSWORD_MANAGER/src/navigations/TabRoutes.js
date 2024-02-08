import * as Screens from "../screens";
import navigationStrings from "./navigationStrings";
import {
  createBottomTabNavigator,
  BottomTabBar,
} from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

const TabRoutes = (props) => {
  return (
    <Tab.Navigator
      tabBar={(tabsProps) => (
        <>
          <BottomTabBar {...tabsProps} />
        </>
      )}
      initialRouteName={navigationStrings.HOME}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name={navigationStrings.HOME} component={Screens.Home} />
      <Tab.Screen
        name={navigationStrings.PROFILE}
        component={Screens.Profile}
      />
    </Tab.Navigator>
  );
};

export default TabRoutes;
