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
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';

const VendorOrders = (props) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const userID = user._id;
    const [orders, setOrders] = useState([]);
    const [open, setOpen] = useState(false);

    // variables for rating order
    const [orderID, setOrderID] = useState('');
    const [rating, setRating] = useState(2.5);
    const [vendorID, setVendorID] = useState('');
    const [foodName, setFoodName] = useState('');

    useEffect(() => {
        const post = {VendorID: userID};
        axios
            .get(`http://localhost:4000/order?buyerid=${userID}`)
            .then((response) => {
                setOrders(response.data);
            })
            .catch(err => {
                console.log('Err ')
            });
    }, []);

    const DateAndTime = (date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    }

    const changeStatus = (orderId, status) => {
        axios
            .post(`http://localhost:4000/order/status`, {_id: orderId, Status: status})
            .then((resp) => {
                window.location='/buyer/orders'
            })
            .catch((err) => console.log(err));
    }

    const handleClose = () => {
        setOpen(false);
    };
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

    const onRate = () => {
        axios
            .post(`http://localhost:4000/food/edit-item`, {
                rate: true,
                Name: foodName, 
                VendorID: vendorID,
                Rating: rating
            }).then((resp) => {
                console.log("Status ", resp.data);
            }).catch(err => console.log(err));

        axios
            .post(`http://localhost:4000/order/status`, {
                RateOrder: true,
                _id: orderID,
                Rating: rating
            }).then((resp) => console.log(`Updated rating is ${resp.data}.`))
            .catch(err => console.log(err.message));
        
        setOpen(false);
        setRating(2.5); 
        window.location.reload();
    }

    const Print = (props) => {
        const status = props.status;
        switch(status) {
            case 'PLACED': return(
                <>
                    <Typography gutterBottom>PLACED</Typography>
                </>
            );
            case 'ACCEPTED': return (
                <>
                    <Typography gutterBottom>ACCEPTED</Typography>
                </>
            );
            case 'REJECTED': return (
                <>
                    <Typography gutterBottom>REJECTED</Typography>
                </>
            );
            case 'COOKING': return (
                <>
                    <Typography gutterBottom>COOKING</Typography>
                </>
            );
            case 'READY FOR PICKUP': return (
                <>
                    <Typography gutterBottom>Your order is ready for pick up.</Typography>
                    <Button 
                        variant='contained'
                        onClick={() => changeStatus(props._id, 'COMPLETED')}
                        >
                        Picked Up
                    </Button>
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
            
                <Table size="medium"style={{borderRadius: '20px 20px 20px 20px', overflow: 'hidden',boxShadow: '0px 2px 8px 0px rgba(99, 99, 99, 0.2)',backgroundColor: '#ff6602'}}>
                    <TableHead >
                        <TableRow>
                            <TableCell style={{ fontSize: '25px',color:"white" }} align="center"> Sr No.</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }} align="center">Placed on</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }} align="center">Vendor Name</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }} align="center">Food item</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }} align="center">Veg/Non-veg</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }} align="center">Add ons</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }} align="center">Quantity</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }} align="center">Order total</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }} align="center">Status</TableCell>
                            <TableCell align={'center'} style={{ fontSize: '25px',color:"white" }} >Rating</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order, ind) => (
                        <TableRow key={ind} style={{backgroundColor:'#FEFEFA' , fontSize:'20px'}}>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{ind + 1}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{DateAndTime(order.date)}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{order.VendorName}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{order.foodItem}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{order.Veg ? 'Veg' : 'Non-veg'}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{order.AddOns}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{order.Quantity}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{'₹ ' + order.Total}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">
                                <Print status={order.Status} _id={order._id} />
                            </TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">
                                {order.Status === 'COMPLETED' ?
                                    (order.Rating === -1 ?
                                        (<Button onClick={() => {
                                            setRating(2.5); 
                                            setOrderID(order._id);
                                            setFoodName(order.foodItem);
                                            setVendorID(order.VendorID);
                                            setOpen(true);}}>
                                            <Typography gutterBottom>RATE</Typography>
                                        </Button>)
                                        : 
                                        <Rating name="half-rating" 
                                            defaultValue={order.Rating} 
                                            precision={0.5} 
                                            readOnly
                                        />
                                    )   
                                    : 
                                    (<Typography gutterBottom align={'center'}>---</Typography>)
                                }
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Rate Us!!!</DialogTitle>
                    <DialogContent>
                    <DialogContentText><br />
                    </DialogContentText>
                    <Grid item xs={12} align={'center'}>
                        <Rating name="half-rating" 
                            value={rating} 
                            precision={0.5} 
                            onChange={(event, newVal) => setRating(newVal)}
                        />
                    </Grid>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={onRate}>Rate</Button>
                    </DialogActions>
                </Dialog>
                </div>
       
        </Grid>
        </div>
    </div>
);
};

export default VendorOrders;
