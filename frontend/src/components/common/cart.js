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
import { Box } from '@mui/material';



import { useCart, useDispatchCart } from '../templates/ContextReducer';


export default function Cart(props) {

    const user = JSON.parse(localStorage.getItem('user'));

    const userID = user._id;

    const [orders, setOrders] = useState([]);

    const [open, setOpen] = useState(false);


    const [currOrder, setCurrOrder] = useState({food: {
        Name: '', ShopName: '', Price: 0, AddOns: []
    }, quantity: 0, addOn: ''});
    
    

    useEffect(() => {
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
    const styles = {
        container: {
          height: '93.9vh',
        //   backgroundImage: `url(${backgroundImage})`,
          backgroundColor:"lightblue",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'Top',
          padding: '0px',
          margin: '0px'
        },
        tableContainer: {
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.2) 100%)',
          borderRadius: '20px',
          boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)',
          padding: '20px',
          width: "60%"
        },
      };

    const proceedToPay = async () => {

        const { data: { key } } = await axios.get("http://localhost:4000/api/getkey")
        console.log("Order : ", key)
        const options = {
            key,
            amount: totalprice*100,
            currency: "INR",
            name: "Yuvi",
            description: "Restaurent Payment",
            handler : function (){
                for(const d of data){
                    axios
                        .post('http://localhost:4000/order/place', {
                            foodItem: d.name,
                            VendorID: d.id,
                            BuyerID: userID,
                            BuyerEmail: user.Email,
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
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#121212"
            }
        };
        const razor = new window.Razorpay(options);
        razor.open();

    }

    return (
        <div align={'center'} style={styles.container}>
        <div align={'center'} style={styles.tableContainer}>

        <Grid item xs={12} md={9} lg={9}>
            
                <Table size="medium" style={{borderRadius: '20px 20px 20px 20px', overflow: 'hidden',boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.5)',backgroundColor: 'lightblue'}}>
                    <TableHead >
                        <TableRow>
                            <TableCell style={{ fontSize: '20px' }}  align="center"> Sr No.</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">Vendor Name</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">Food item</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">Veg/Non-veg</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">Add ons</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">Quantity</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((order, ind) => (
                        <TableRow key={ind} style={{backgroundColor:'#fff5ee' , fontSize:'20px'}}>
                            <TableCell style={{ fontSize: '15px' }}  align="center">{ind + 1}</TableCell>
                            <TableCell style={{ fontSize: '15px' }}  align="center">{order.vname}</TableCell>
                            <TableCell style={{ fontSize: '15px' }}  align="center">{order.name}</TableCell>
                            <TableCell style={{ fontSize: '15px' }}  align="center">{order.veg ? 'Veg' : 'Non-veg'}</TableCell>
                            <TableCell style={{ fontSize: '15px' }}  align="center">{order.addOn}</TableCell>
                            <TableCell style={{ fontSize: '15px' }}  align="center">{order.qty}</TableCell>
                            <TableCell style={{ fontSize: '15px' }}  align="center">{'₹ ' + order.price}</TableCell>
                            <TableCell style={{ fontSize: '15px' }}  align="center">
                                <Box sx={{ display: 'inline-block', bgcolor: 'red', borderRadius: '5px', p: '5px' }}>
                                <Button sx={{ color: 'white' }} onClick={()=> { dispatch({type: "REMOVE", index: ind}) }}>
                                    Delete
                                </Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
        
        </Grid>
        <div>
            <h1>Total Price : ₹ {totalprice} /-</h1>
        </div>
        <div>
            <Box sx={{ display: 'inline-block', bgcolor: 'lightgreen', borderRadius: '5px', p: '5px' }}>
            <Button sx={{ color: 'white' }} onClick={proceedToPay}>Proceed to pay</Button>
            </Box>
        </div>
    </div>
    </div>
  )
}
