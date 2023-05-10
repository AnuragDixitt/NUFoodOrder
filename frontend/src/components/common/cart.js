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
import DeleteIcon from "@mui/icons-material/Delete";
import CreditScoreIcon from '@mui/icons-material/CreditScore';



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
                console.log('Err')
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
            <div style={{ backgroundColor: "#F5FEFD", height: "100vh" }}>
                <div align={'center'}>
                        <h1>This Cart is Empty!</h1>
                </div>
            </div>
        )
    }
    const styles = {
        container: {
          height: '93.9vh',
          backgroundColor:"#F5FEFD",
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
        
      };

    const proceedToPay = async () => {

        const { data: { key } } = await axios.get("http://localhost:4000/api/getkey")

        const { data: { order } } = await axios.post("http://localhost:4000/api/checkout", {
            totalprice: totalprice*100,
        })

        const options = {
            key,
            amount: totalprice*100,
            currency: "INR",
            order_id: order.id,
            name: data[0].vname,
            name: "NuOrder",
            description: "Restaurent Payment",
            handler : function (response){
                axios.post("http://localhost:4000/api/saveinfo",{
                    orderid : response.razorpay_payment_id,
                    paymentid : response.razorpay_order_id,
                    signature : response.razorpay_signature,
                    amt : totalprice,
                    orderId : order.id
                })
                .then( () => {
                    console.log("Saved")
                })
                .catch( (err) => {
                    console.log("Error in mongodb",)
                })
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
        <div align={'center'} style={{width:"80%"}}>

        <Grid item xs={20} md={20} mt={3} mb={3} lg={20}>
                
                <Table  size="medium" style={{borderRadius: '20px 20px 20px 20px', overflow: 'hidden',boxShadow: '0px 2px 8px 0px rgba(99, 99, 99, 0.2)',backgroundColor: '#ff6602'}}>
                    <TableHead >
                        <TableRow>
                            <TableCell style={{ fontSize: '25px',color:"white" }}  align="center"> Sr No.</TableCell>
                            <TableCell  style={{ fontSize: '25px',color:"white" }}align="center">Vendor Name</TableCell>
                            <TableCell  style={{ fontSize: '25px',color:"white" }} align="center">Food item</TableCell>
                            <TableCell  style={{ fontSize: '25px',color:"white" }}  align="center">Veg/Non-veg</TableCell>
                            <TableCell  style={{ fontSize: '25px',color:"white" }} align="center">Add ons</TableCell>
                            <TableCell  style={{ fontSize: '25px',color:"white" }}  align="center">Quantity</TableCell>
                            <TableCell  style={{ fontSize: '25px',color:"white" }} align="center">Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((order, ind) => (
                        <TableRow key={ind} style={{backgroundColor:'#FEFEFA' , fontSize:'20px'}}>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{ind + 1}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{order.vname}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{order.name}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{order.veg ? 'Veg' : 'Non-veg'}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{order.addOn}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{order.qty}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{'₹ ' + order.price}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">
                                <Box sx={{ display: 'inline-block', bgcolor: 'red', borderRadius: '5px', p: '5px' }}>
                                <Button sx={{ color: 'white' }} onClick={()=> { dispatch({type: "REMOVE", index: ind}) }}>
                                    <DeleteIcon style={{ marginRight: '8px' }}/>
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
            <Box sx={{ display: 'inline-block', bgcolor: 'black', borderRadius: '5px', p: '5px' }}>
            <Button sx={{ color: 'white' }} onClick={proceedToPay}>
                <CreditScoreIcon style={{ marginRight: '8px' }}/>  Proceed to pay
            </Button>
            </Box>
        </div>
    </div>
    </div>
  )
}
