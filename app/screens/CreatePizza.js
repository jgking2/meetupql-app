import React, {Component} from 'react';
import { 
    Text, 
    View, 
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    Button,
    Clipboard
} from 'react-native';
import { gql, graphql } from 'react-apollo';

import { LoadingScreen, AppHeader } from '../components';
import { submitOrder } from '../graphql';

const PIZZA_COMPONENT_QUERY = gql`
query PizzaQuery {
    toppings : getPizzaPartOptions(partType : TOPPING) {
      ...pizzaPartFragment
      ...toppingsFragment 
    },
    crusts : getPizzaPartOptions(partType : CRUST) {
        ...pizzaPartFragment
        ...crustsFragment 
    },
    sauces : getPizzaPartOptions(partType : SAUCE) {
        ...pizzaPartFragment
    }
}

fragment pizzaPartFragment on PizzaPart {
    id
    name
    description
  }
  
  fragment toppingsFragment on Topping {
    price,
    category
  }
  
  fragment crustsFragment on Crust {
    additionalCost
  }
`
const mapResultsToProps = ({ data : { 
    loading, toppings, crusts, sauces }}) => ({ loading, toppings, crusts, sauces });

const mapMutateToProps = ({ mutate, ...extra }) => ({
    submit : (order) => mutate({ variables : { order }}),
    ...extra
});

@graphql(submitOrder, { 
    props : mapMutateToProps 
})
@graphql(PIZZA_COMPONENT_QUERY, { 
    props : mapResultsToProps
})
export class CreatePizza extends Component {
    static navigationOptions = {
        header : <AppHeader />
    };

    componentWillMount() {
        this._resetSelections();
    }

    state : {
        pizzas : [],
        placingOrder: undefined,
        orderId : undefined
    };

    _resetSelections() {
        this.setState({
            ...this.state,
            orderId: undefined,
            selectedToppings : [],
            selectedCrust : undefined,
            selectedSauce : undefined,
        });
    }

    render() {
        const { 
            loading, 
            toppings, 
            crusts, 
            sauces, 
            navigation : {
                navigate
            }         
        } = this.props;

        const { 
            selectedToppings, 
            selectedCrust, 
            selectedSauce,
            placingOrder,
            orderId
        } = this.state;
        if(placingOrder) {
            return <LoadingScreen text={"Placing order...please hold"} />
        }
        if(loading) {
            return <LoadingScreen text={"Loading glorious options"} />
        }
        if(!!orderId) {
            return (
                <View>
                    <TouchableOpacity onPress={() => navigate('order', { orderId })}>
                        <View style={{justifyContent:"center",alignItems:"center"}}>
                            <Text style={{fontWeight: '100'}}>Your order number</Text>
                            <Text style={{fontWeight: '600', fontSize: 20}}>{orderId}</Text>
                            <Text style={{ fontStyle: "italic", fontSize : 13 }}>Track your order!</Text>
                        </View>
                    </TouchableOpacity>
                    <Button title="Place another order" onPress={this._resetSelections.bind(this)} />
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <Text>Create a pizza!</Text>
                <Text>Choose a topping!</Text>
                <FlatList 
                    numColumns={3}
                    data={toppings}
                    keyExtractor={(item) => item.id}
                    extraData={selectedToppings}
                    renderItem={({item}) => <Topping onPress={this._toggleTopping.bind(this)} topping={item} currentSelections={selectedToppings} />}
                    />
                <Text>Choose a crust!</Text>
                <FlatList 
                    numColumns={3}
                    data={crusts}
                    extraData={selectedCrust}
                    renderItem={({item}) => <Crust onPress={this._selectCrust.bind(this)} crust={item} currentSelection={selectedCrust} />}
                    keyExtractor={(item) => item.id}
                    />
                <Text>Choose a sauce!</Text>
                <FlatList 
                    numColumns={3}
                    data={sauces}
                    extraData={selectedSauce}
                    renderItem={({item}) => <Sauce onPress={this._selectSauce.bind(this)} currentSelection={selectedSauce} sauce={item} />}
                    keyExtractor={(item) => item.id}
                    />
                <Button title={"Submit Order"}  onPress={this._submit.bind(this)}/>
            </View>
        )
    }
    
    _submit() {
        const { submit } = this.props;
        const { 
            selectedCrust : crust, 
            selectedSauce : sauce,
            selectedToppings : toppings
        } = this.state;
        this.setState({
            placingOrder : true
        });
        submit({ 
            pizzas: [{ 
                crust, 
                sauce, 
                toppings 
            }],
            price : 10.99
        }).then(res => { 
            const { 
                data: { 
                    placeOrder  : { 
                        id 
                    }
                }
            } = res;

            this.setState({
                placingOrder: false,
                orderId : id
            });
        });
    }

    _selectCrust({ id }) {
        this.setState({
            selectedCrust : id
        });
    }

    _selectSauce({ id }) {
        this.setState({
            selectedSauce : id
        });
    }

    /**
     * 
     * @param {{id, name}} topping 
     */
    _toggleTopping({ id, extra }) {
        const { selectedToppings } = this.state;
        const index = selectedToppings.findIndex(topp => topp.id === id);
        const toppings = [...selectedToppings];

        if(index > -1) {
            toppings.splice(index, 1);
        } else {
            toppings.push({ id, extra });
        }
        this.setState({
            selectedToppings : toppings
        });
    }
}

const Topping = (props) => {
    const { 
        topping : { 
            name, 
            id, 
            description,
            price
        },
        currentSelections,
        onPress
    } = props;

    const selected = currentSelections.some(cs => cs.id === id);
    
    return (
        <TouchableOpacity style={[styles.pizzaPartContainer, selected && styles.selected]} onPress={() => onPress({ id, extra : false })}> 
            <Text style={[styles.textCenter]}>{name}</Text>
            <Text style={[styles.partDescription, styles.textCenter]}>{description}</Text>
            <Text style={[styles.textCenter]}>{price}</Text>
        </TouchableOpacity>
    )
};

const Sauce = (props) => {
    const {
        sauce : {
            id,
            name,
            description
        },
        currentSelection,
        onPress
    } = props;
    const selected = id === currentSelection;
    return (
        <TouchableOpacity style={[styles.pizzaPartContainer, selected && styles.selected]} onPress={() => onPress({ id })}> 
            <Text style={[styles.textCenter]}>{name}</Text>
            <Text style={[styles.partDescription, styles.textCenter]}>{description}</Text>
        </TouchableOpacity>
    )
};

const Crust = (props) => {
    const {
        crust : {
            id,
            name,
            description,
            additionalCost
        },
        currentSelection,
        onPress
    } = props;
    const selected = id === currentSelection;
    return (
        <TouchableOpacity style={[styles.pizzaPartContainer, selected && styles.selected]} onPress={() => onPress({ id })}> 
            <Text style={[styles.textCenter]}>{name}</Text>
            <Text style={[styles.partDescription, styles.textCenter]}>{description}</Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    listContainer : {

    },
    container : {
        flex : 3,
        paddingTop: 20,
        justifyContent : 'center',
        alignItems : 'center'
    },
    pizzaPartContainer : {
        padding: 5,
        borderRadius: 5,
        maxWidth: (Dimensions.get("screen").width / 3)
    },
    selected: {
        backgroundColor : 'rgba(0,0,0,.1)'
    },
    partText : {

    },
    partDescription : {
        fontSize: 10
    },
    textCenter : { 
        textAlign:"center" 
    }
});