import React, { Component } from 'react';
import { 
    View, 
    Text, 
    FlatList,
    TextInput,
    TouchableWithoutFeedback,
    Button
} from 'react-native';
import dismissKeyboard from 'dismissKeyboard';
import { graphql, gql } from 'react-apollo';
import { LoadingScreen } from '../components';

const CHECK_ORDER = gql`
query CheckOrder($orderId : ID) {
    order : checkOrder(orderId:$orderId) {
      pizzas {
        toppings {
          name
        }
        extraCheese
        size
      },
      status
    }
  }
`;

const mapResultToProps = ({ 
    data : { 
        loading, 
        order 
    } }) => ({ loading, order });

@graphql(CHECK_ORDER, { 
    props : mapResultToProps,
    options: ({orderId}) => ({ 
        fetchPolicy : "network-only", 
        variables : { 
            orderId 
        }
    })
})
class OrderStatus extends Component {
    render() {
        const { loading, order, orderId } = this.props;
        if(loading) {
            return <LoadingScreen />
        }
        return ( 
            <View>
                <Text>Order : {orderId}</Text>
                <Text>Order status : {this._mapStatus(order.status)}</Text>
            </View>
        )
    }

    _mapStatus(status) {
        return status;
    }
}

export class CheckOrder extends Component {
    static navigationOptions = {
        title : 'Order Status'
    };

    render() {
        const {
            navigation : {
                navigate,
                state : {
                    params : {
                        orderId
                    }
                }
            }
        } = this.props;

        return (
            <TouchableWithoutFeedback style={{flex: 1000}}>
                <View>
                    {
                        orderId && <OrderStatus orderId={orderId} />
                    }
                </View>
            </TouchableWithoutFeedback>
        )
    }
}