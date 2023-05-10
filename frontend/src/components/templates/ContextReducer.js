import React, {createContext, useContext, useReducer} from 'react'

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) =>{
    switch(action.type) {
        case "Add":
            return [...state, {id: action.VendorID,
                bid: action.BuyerID,
                buyerEmail: action.BuyerEmail,
                vname: action.VendorName,
                name: action.foodItem,
                qty: action.Quantity,
                veg : action.Veg,
                addOn: action.AddOns,
                price: action.Total,
                date: action.Date,
                age: action.buyerAge,
                rating: action.Rating,
                batch: action.buyerBatch
                }]; 
        case "REMOVE":
            let newArr = [...state];
            newArr.splice(action.index, 1);
            return newArr;
        case "UPDATE":
            let arr = [...state]
            arr.find((food, index) => {
                if (food.name === action.foodItem){ 
                    arr[index] = {...food, qty: parseInt(action.qty) + food.qty, price: action.price + food.price}
                }
                return arr
            })
            return arr
        case "DROP":
            let empArr = []
            return empArr
        default:
            console.log("Error in Reducer")
    }
}

export const CartProvider = ({children}) => {

    const [state, dispatch] = useReducer(reducer, []);
    return (
        <CartDispatchContext.Provider value={dispatch}>
            <CartStateContext.Provider value={state}>
                {children}
            </CartStateContext.Provider>
        </CartDispatchContext.Provider>
    )
}



export const useCart = () => useContext(CartStateContext);

export const useDispatchCart = () => useContext(CartDispatchContext);