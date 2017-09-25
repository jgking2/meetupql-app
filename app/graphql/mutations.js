import { gql } from 'react-apollo';

export const submitOrder = gql`
    mutation PizzaMutation(
        $order : OrderInput
    ) {
        placeOrder(order: $order) {
            id,
            pizzas {
                name
                extraCheese
                toppings {
                    name,
                    description
                }
            },
            status
        }
    }
`;