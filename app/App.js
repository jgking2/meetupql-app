import React, { Component } from 'react';
import { 
    ApolloClient, 
    ApolloProvider, 
    IntrospectionFragmentMatcher,
    createNetworkInterface
} from 'react-apollo';
import { View, Text } from 'react-native';

import { AppNavigation } from './screens';

const uri = 'https://meetupql.appspot.com/graphql';

export class App extends Component {
    state = {
        client : undefined
    };

    componentWillMount() {
        const networkInterface = createNetworkInterface({
            uri
        });


        const fragmentMatcher = new IntrospectionFragmentMatcher({
            introspectionQueryResultData: {
                __schema: {
                    types: [
                        {
                            kind: 'INTERFACE',
                            name: 'PizzaPart',
                            possibleTypes: [
                                { name : 'Topping'},
                                { name : 'Sauce'},
                                { name : 'Crust'}                        
                            ]
                        }
                    ]
                }
            }
        })

        const client = new ApolloClient({
            networkInterface,
            fragmentMatcher
        });
        this.setState({
            client
        });
    }
    
    render() {
        const { client } = this.state;
        return (
            <ApolloProvider client={client}>
                <View style={{flex: 2}}>
                    <AppNavigation />
                </View>
            </ApolloProvider>
        )
    }
}