import React from 'react';
// import { CreatePizza, SpecialtyPizzas } from './index';

import { CreatePizza } from './CreatePizza';
import { HomeScreen } from './HomeScreen';
import { 
    TabNavigator, 
    StackNavigator 
} from 'react-navigation';

import { CheckOrder } from './CheckOrder';



export const TabNav = TabNavigator({
    Home : { screen : HomeScreen },
    Create : { screen : CreatePizza }
    // Orders : { screen : CheckOrder }
}, {
    swipeEnabled : true,
    animationEnabled: true
    // lazy : true
});

export const AppNavigation = StackNavigator({
    Root : { screen : TabNav },
    order : { screen : CheckOrder }
});