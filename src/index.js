import { StackNavigator } from 'react-navigation';
import HomeScreen from './scenes/Home_Scene';
import CircleListScreen from './scenes/CircleList_Scene';
import MaskViewScreen from './scenes/MaskView_Scene';
import SwipeableListViewScreen from './scenes/SwipeableListItem_Scene';
import SwitchButtonScreen from './scenes/SwitchButton_Scene';
import ScalePickerScreen from './scenes/ScalePicker_Scene';

export default StackNavigator({
  Home: { screen: HomeScreen },
  CircleList: { screen: CircleListScreen },
  MaskView: { screen: MaskViewScreen },
  SwipeableList: { screen: SwipeableListViewScreen },
  SwitchButton: { screen: SwitchButtonScreen },
  ScalePicker: { screen: ScalePickerScreen },
});
