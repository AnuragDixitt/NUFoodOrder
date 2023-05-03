import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import swal from 'sweetalert';



import { useCart, useDispatchCart } from '../templates/ContextReducer';


export default function Cart(props) {

    const user = JSON.parse(localStorage.getItem('user'))

    const userID = user._id;

    const [orders, setOrders] = useState([]);

    const [open, setOpen] = useState(false);
    

    const [currOrder, setCurrOrder] = useState({food: {
        Name: '', ShopName: '', Price: 0, AddOns: []
    }, quantity: 0, addOn: ''});
    
    

    useEffect(() => {
        console.log("User : ", userID);
        const post = {VendorID: userID};
        axios
            .get(`http://localhost:4000/order?buyerid=${userID}`)
            .then((response) => {
                setOrders(response.data);

            })
            .catch(err => {
                console.log('Err.Message: ', err)
            });
    }, []);


    let [totalprice, setTotalPrice] = useState(0);

    useEffect(() => {
        let totalprice = data.reduce((total, order) => total + order.price, 0);
        setTotalPrice(totalprice);
    });

    let dispatch = useDispatchCart();
    let data = useCart();


    if (data.length === 0){
        return (
            <div align={'center'}>
                    <h1>This Cart is Empty!</h1>
            </div>
        )
    }

    const proceedToPay = async () => {

        const { data: { key } } = await axios.get("http://localhost:4000/api/getkey")
        console.log("Order : ", key)

        const options = {
            key,
            amount: totalprice*100,
            currency: "INR",
            name: "Yuvi",
            description: "Restaurent Payment",
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#121212"
            }
        };
        const razor = new window.Razorpay(options);
        razor.open();

        
        for(const d of data){
        axios
            .post('http://localhost:4000/order/place', {
                foodItem: d.name,
                VendorID: d.id,
                BuyerID: userID,
                VendorName: d.vname,
                buyerAge: user.Age,
                buyerBatch: user.BatchName,
                Price: d.price,
                Quantity: d.qty,
                AddOns: d.addOn,
                Veg: d.veg,
                Total: totalprice,
                Rating: -1,
                date: d.date,
                Status: 'PLACED'
            }).then((response) => {
                console.log("one : ",response.data);
                // data = []
                swal({
                    title: `Order placed!`, 
                    text: `Your order of ₹${totalprice} has been placed. Please wait till the chef prepares it.`, 
                    icon: `success`}).then(() => {
                        setOpen(false);
                        window.location='/buyer/orders';
                    });
              }).catch((err) => {
                console.log(err.message);
                setCurrOrder({food: {
                    Name: '', ShopName: '', Price: 0, AddOns: []
                }, quantity: 0, addOn: ''});
            });
            dispatch({type:"DROP"})
        }
    }

    return (
    <div align={'center'} >

        <Grid item xs={12} md={9} lg={9}>
            <Paper>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell> Sr No.</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Food item</TableCell>
                            <TableCell>Veg/Non-veg</TableCell>
                            <TableCell>Add ons</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((order, ind) => (
                        <TableRow key={ind}>
                            <TableCell>{ind + 1}</TableCell>
                            <TableCell>{order.vname}</TableCell>
                            <TableCell>{order.name}</TableCell>
                            <TableCell>{order.veg ? 'Veg' : 'Non-veg'}</TableCell>
                            <TableCell>{order.addOn}</TableCell>
                            <TableCell>{order.qty}</TableCell>
                            <TableCell>{'₹ ' + order.price}</TableCell>
                            <TableCell>
                                <Button onClick={()=> { dispatch({type: "REMOVE", index: ind}) }}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
        </Paper>
        </Grid>
        <div>
            <h1>Total Price : ₹ {totalprice} /-</h1>
        </div>
        <div>
            <Button onClick={proceedToPay}>Proceed to pay</Button>
        </div>
    </div>
  )
}
