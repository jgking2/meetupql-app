import React from 'react';
// import { CreatePizza, SpecialtyPizzas } from './index';

import { CreatePizza } from './CreatePizza';
import { SpecialtyPizzas } from './SpecialtyPizzas';
import { 
    TabNavigator, 
    StackNavigator 
} from 'react-navigation';

import { CheckOrder } from './CheckOrder';



export const TabNav = TabNavigator({
    Specialties : { screen : SpecialtyPizzas },
    Create : { screen : CreatePizza }
    // Orders : { screen : CheckOrder }
}, {
    animationEnabled: true,
    lazy : true
});

export const AppNavigation = StackNavigator({
    Root : { screen : TabNav },
    order : { screen : CheckOrder }
});