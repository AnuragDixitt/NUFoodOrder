import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from '@mui/material/Box';
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import swal from 'sweetalert';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';
import emailjs from '@emailjs/browser';
import{ init } from '@emailjs/browser';
init("user_0YkPXkJ69El9vlkEyQLad");

const VendorOrders = (props) => {

    const user = JSON.parse(localStorage.getItem('user'))
    const userID = user._id;

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        console.log(userID);
        const post = {VendorID: userID};
        axios
            .get(`http://localhost:4000/order?vendorid=${userID}`)
            .then((response) => {
                setOrders(response.data);
            })
            .catch(err => {
                console.log('Err.Message: ', err)
            });
    }, []);

    const DateAndTime = (date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    }


    const changeStatus = (orderId, status, refund, vendorName) => {
        const sum = orders.reduce((prev, order) => prev + (order.Status === 'ACCEPTED' || order.Status === 'COOKING'), 0) ;
        // console.log(sum); return;
        if (sum >= 10 && 
            status === 'ACCEPTED') {
            swal('Order overload', 'Please tend to the pending orders first. You can come to this order later.', 'warning');
            return;
        }
        if (status === 'REJECTED') {
            console.log({_id: refund._id, updateWallet: true, increment: refund.amount});
            axios
                .post(`http://localhost:4000/user/edit`, {_id: refund._id, updateWallet: true, increment: refund.amount})
                .then((response) => console.log(response, ` Refunded buyer ${refund.amount}`));
        }
        axios
            .post(`http://localhost:4000/order/status`, {_id: orderId, Status: status})
            .then((resp) => {
                console.log('Changed Status. ', resp);
                if (status === 'ACCEPTED' || status === 'REJECTED') {
                    emailjs.send("service_mncnz8p","template_jxsko0t",{
                        from_name: user.Name,
                        message: (status === 'ACCEPTED' ? 
                        `Your order has been accepted. Please wait for the chef to prepare it.`
                        : `Sorry for the inconvenience. Your order has been rejected. Try again later.`)
                    }).then((resp) => {
                        console.log('Email sent. ', resp.status, ' ', resp.text);
                        window.location='/vendor/orders';
                    }, (err) => console.log(err))
                } else {
                    window.location='/vendor/orders';
                }
            })
            .catch((err) => console.log(err));
    }

    const Print = (props) => {
        const status = props.status;
        switch(status) {
            case 'PLACED': return(
                <>
                    <Box sx={{ '& > button': { m: 1 } }}>
                        <Button 
                            variant='contained'
                            startIcon={<CheckIcon />}
                            color='success'
                            onClick={() => changeStatus(props._id, 'ACCEPTED', props.refundBuyer, props.vendorName)}
                            >Accept</Button>
                        <Button 
                            variant='contained'
                            startIcon={<ClearIcon />}
                            color='error'
                            onClick={() => changeStatus(props._id, 'REJECTED', props.refundBuyer, props.vendorName)}
                            >Reject</Button>
                    </Box>
                </>
            );
            case 'ACCEPTED': return (
                <>
                    <Typography gutterBottom>Order accepted. Start cooking?</Typography>
                    <Button 
                        variant='contained'
                        startIcon={<SoupKitchenIcon />}
                        color='warning'
                        onClick={() => changeStatus(props._id, 'COOKING')}
                        >
                        Cook
                    </Button>
                </>
            );
            case 'REJECTED': return (
                <>
                    <Typography gutterBottom>REJECTED</Typography>
                </>
            );
            case 'COOKING': return (
                <>
                    <Typography gutterBottom>In preparation. Notify buyer?</Typography>
                    <Button 
                        variant='contained'
                        startIcon={<TakeoutDiningIcon />}
                        onClick={() => changeStatus(props._id, 'READY FOR PICKUP')}
                        >
                        Ready for Pickup
                    </Button>
                </>
            );
            case 'READY FOR PICKUP': return (
                <>
                    <Typography gutterBottom>Buyer notified.</Typography>
                </>
            );
            case 'COMPLETED': return (
                <>
                    <Typography gutterBottom>COMPLETED</Typography>
                </>
            );
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
                            <TableCell>Placed on</TableCell>
                            <TableCell>Food item</TableCell>
                            <TableCell>Veg/Non-veg</TableCell>
                            <TableCell>Add ons</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Order total</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order, ind) => (
                        <TableRow key={ind}>
                            <TableCell>{ind + 1}</TableCell>
                            <TableCell>{DateAndTime(order.date)}</TableCell>
                            <TableCell>{order.foodItem}</TableCell>
                            <TableCell>{order.Veg ? 'Veg' : 'Non-veg'}</TableCell>
                            <TableCell>{order.AddOns}</TableCell>
                            <TableCell>{order.Quantity}</TableCell>
                            <TableCell>{'₹ ' + order.Total}</TableCell>
                            <TableCell>
                                <Print 
                                    status={order.Status} 
                                    _id={order._id} 
                                    refundBuyer={{_id: order.BuyerID, amount: order.Total}}
                                    vendorName={order.VendorName}
                                />
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>

        </Paper>
        </Grid>
    </div>
);
};

export default VendorOrders;
