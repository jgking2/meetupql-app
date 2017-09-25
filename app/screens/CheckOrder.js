import React, { Component } from 'react';
import { 
    View, 
    Text, 
    FlatList,
    TextInput,
    TouchableWithoutFeedback,
    Button,
    Image,
    Dimensions
} from 'react-native';
import dismissKeyboard from 'dismissKeyboard';
import { graphql, gql } from 'react-apollo';
import { LoadingScreen } from '../components';
import { queries } from '../graphql';

const mapResultToProps = ({ 
    data : { 
        loading, 
        order 
    } }) => ({ loading, order });

@graphql(queries.checkOrder, { 
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
        const status = this._mapStatus(order.status);
        const imageWidth = Dimensions.get("screen").width - 30;
        return ( 
            <View style={{ backgroundColor : "white", padding : 15 }}>
                <Text style={{ fontSize: 24 }}>{status.title}</Text>                
                <Text style={{ fontSize: 20, fontWeight: "200", paddingTop: 5, paddingBottom: 5 }}>{status.text}</Text>
                { 
                    status.uri && <Image style={{width: imageWidth, height: 250}} source={{ uri: status.uri }} /> 
                }
            </View>
        )
    }

    /**
     * 
     * @param {string} status 
     * @returns {{ title, text, uri? }}
     */
    _mapStatus(status) {
        const statusMap = {
            PLACED : { 
                title : 'Received',
                text: 'We have received your order, and we are preparing it fresh!'
            },
            OVEN : { 
                title: 'In the oven',
                text : 'Your order is in the oven, cooking to perf...mmmmmm...getting hungry just thinking about it.'
            },
            OUT_FOR_DELIVERY : { 
                title: 'Out for delivery',
                text: 'Your pizza is on the way to you... I wish I was so lucky 😥' 
            },
            DELIVERED : {
                title: 'Delivered',
                text : 'You should be eating - we show the pizza is in your hands!' 
            },
            DRIVER_ATE_YOUR_PIZZA_SORRY : {
                title: 'Whoops...',
                text : 'This is embarrassing, it appears the driver ate your pizza...damnit McLovin, this is the third time this week.',
                uri : 'https://static.independent.co.uk/s3fs-public/styles/article_small/public/thumbnails/image/2017/06/30/10/istock-501964582-0.jpg'
            }
        }
        return statusMap[status];
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
            <View>
                <Text style={{padding: 20}}>Current status of order {orderId}</Text>
                <OrderStatus orderId={orderId} />
            </View>
        )
    }
}