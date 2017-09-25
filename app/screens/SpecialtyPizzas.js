import React, { Component } from 'react';
import { 
    View, 
    Text, 
    FlatList
} from 'react-native';

import { graphql, gql } from 'react-apollo';

import { LoadingScreen, AppHeader } from '../components';

const SPECIALTY_PIZZAS = gql`
query SpecialtyPizzas {
    specialtyPizzas {
        name
    }
}
`;

const mapResultToProps = ({ 
    data : { 
        loading, 
        specialtyPizzas 
    } }) => ({ loading, specialtyPizzas });

@graphql(SPECIALTY_PIZZAS, { 
    props : mapResultToProps 
})
export class SpecialtyPizzas extends Component {
    static navigationOptions = {
        header : <AppHeader />,
        title : 'Order'
    };

    render() {
        const { loading, specialtyPizzas } = this.props;
        if(loading) {
            return <LoadingScreen />
        }
        return <FlatList
                    data={specialtyPizzas}
                    keyExtractor={(item, key) => key}
                    renderItem={({item})=> <Text>{item.name}</Text>}
        />
    }
}