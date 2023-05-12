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
    const styles = {
        container: {
          height: '200vh',
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
        
      };


    const changeStatus = (orderId, status, refund, vendorName) => {
        const sum = orders.reduce((prev, order) => prev + (order.Status === 'ACCEPTED' || order.Status === 'COOKING'), 0) ;
        var email = ""
        for (const index in orders){
            const order = orders[index]
            if (order["_id"] === orderId){
                email = order["BuyerEmail"]
            }
        }

        if (sum >= 10 && 
            status === 'ACCEPTED') {
            swal('Order overload', 'Please tend to the pending orders first. You can come to this order later.', 'warning');
            return;
        }
        if (status === 'REJECTED') {
                console.log("rejected")
        }
        axios
            .post(`http://localhost:4000/order/status`, {_id: orderId, Status: status})
            .then((resp) => {

                if (status === 'ACCEPTED' || status === 'REJECTED') {
                    emailjs.send("service_mncnz8p","template_jxsko0t",{
                        from: user.Email,
                        to: email,
                        from_name: user.Name,
                        message: (status === 'ACCEPTED' ? 
                        `Your order has been accepted. Please wait for the chef to prepare it.`
                        : `Sorry for the inconvenience. Your order has been rejected. Please collect your money from reception and try again later.`)
                    }, "Fcvyj7SnnAUKrasQO").then((resp) => {
                        window.location='/vendor/orders';
                    }, (err) => console.log(err))
                } else {
                    window.location='/vendor/orders';
                }
            })
            .catch((err) => console.log("this is email error", err));
    }

    const Print = (props) => {
        const status = props.status;
        switch(status) {
            case 'PLACED': return(
                <>
                    <Box sx={{display: 'flex', justifyContent: 'center', '& > button': { m: 1 } }}>
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
    <div align={'center'} style={styles.container}>
    <div align={'center'} style={{width:"80%"}}>

        <Grid item xs={20} md={20} mt={3} mb={3} lg={20}>
            
                <Table size="medium" style={{borderRadius: '20px 20px 20px 20px', overflow: 'hidden',boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.2)',backgroundColor: '#3D72A4'}}>
                    <TableHead >
                        <TableRow>
                            <TableCell style={{ fontSize: '25px',color:"white" }} align="center"> Sr No.</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }}  align="center">Placed on</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }} align="center">Food item</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }}  align="center">Veg/Non-veg</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }}  align="center">Add ons</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }}  align="center">Quantity</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }}  align="center">Order total</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }}  align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order, ind) => (
                        <TableRow key={ind} style={{backgroundColor:'#fff5ee' , fontSize:'20px'}}>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{ind + 1}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{DateAndTime(order.date)}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{order.foodItem}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{order.Veg ? 'Veg' : 'Non-veg'}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{order.AddOns}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{order.Quantity}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{'₹ ' + order.Total}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">
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

        
        </Grid>
    </div>    
    </div>
);
};

export default VendorOrders;
