import { gql } from 'react-apollo';

export const checkOrder = gql`
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

const getPizzaComponents = gql`
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
const getSpecialtyPizzas = gql`
query SpecialtyPizzas {
    specialtyPizzas {
        name
        description
        price,
        uri : imageUrl
    }
}
`;

export const queries = {
    checkOrder,
    getPizzaComponents,
    getSpecialtyPizzas
}