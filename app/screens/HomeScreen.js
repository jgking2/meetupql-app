import React, { Component } from 'react';
import { 
    View, 
    Text, 
    FlatList,
    StyleSheet,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { graphql, gql } from 'react-apollo';

import { LoadingScreen, AppHeader } from '../components';
import { queries } from '../graphql';

const mapResultToProps = ({ 
    data : { 
        loading, 
        specialtyPizzas 
    } }) => ({ loading, specialtyPizzas });

@graphql(queries.getSpecialtyPizzas, { 
    props : mapResultToProps 
})
export class HomeScreen extends Component {
    static navigationOptions = {
        title : 'BoomshakaPIZZA',
        tabBarLabel : 'Home',
        tabBarIcon: ({tintColor}) => (
            <Ionicons name="ios-pizza" size={32} color={tintColor} />
        ),
    };

    render() {
        const { 
            loading, 
            specialtyPizzas 
        } = this.props;

        if(loading) {
            return <LoadingScreen />
        } 
        return (
            <View style={{paddingTop: 30}}>
                <Text style={[styles.subTitle, styles.aboutSection]}>Established today, out of business tomorrow, but the love of pizza is forever. 🍕😍</Text>
                <Text style={[styles.aboutSection]}>
                    Here, we deliver on pizza - not software.  Our app features...well, nothing really, it appears as if you can order a pizza, but it doesn't, and the status is randomly generated - and we fully believe databases are overrated.  Worry not fellow pizza-lover, we really love pizza, and through that we all unite.
                </Text>
                <Text style={[styles.aboutSection]}>
                    Check out {specialtyPizzas.length} specialty pizzas you can't order!
                </Text>
                <FlatList
                    contentContainerStyle={{padding: 10}}
                        data={specialtyPizzas}
                        horizontal={true}
                        keyExtractor={(item, key) => key}
                        renderItem={({item})=> <Special pizza={item} />}
                />
            </View>
        )
    }
}

const Special = (props) => {
    const { pizza } = props;
    //Hard coded glory.
    return (
        <View style={{ padding : 5,backgroundColor: 'white', alignItems: "center", justifyContent: "center", maxWidth: 160 }}>
            <Text style={{fontSize: 15, fontWeight:"bold"}} >{pizza.name}</Text>
            <Text style={{fontSize: 12, textAlign: "center"}}>{pizza.description}</Text>            
            <Image source={pizza} style={{ 
                height: 100, 
                width: 100 }} />            
            <Text>{pizza.price}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    aboutSection : {
        padding: 5,
        textAlign: "center"
    },
    title : {
        fontSize: 20,
        fontWeight: '700'
    },
    subTitle : {
        fontSize: 15,
        fontWeight: '400',
        fontStyle : "italic"
    }
});