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
import Typography from '@mui/material/Typography';
import PieChart, {
    Series,
    Label,
    Margin,
    Export,
    Legend,
    Animation,
  } from 'devextreme-react/pie-chart';
  
  function formatText(arg) {
    return `${arg.argumentText} (${arg.percentText})`;
  }

const Statistics = (props) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const userID = user._id;

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        console.log(userID);
        
        axios
            .get(`http://localhost:4000/order?vendorid=${userID}`)
            .then((response) => {
                setOrders(response.data);
                const id_orders = Array.from(orders.reduce((prev, order) => {
                    if (order.Status === 'COMPLETED') console.log(order);
                    prev.set(order.BuyerID, (prev.get(order.BuyerID) || 0) + (order.Status === 'COMPLETED'));
                    return prev;
                }, new Map()));
                const age = new Map(); const batch = new Map();
                for (let i = 0; i < orders.length; i++) {
                    axios.get(`http://localhost:4000/user?id=${id_orders[i][0]}`)
                        .then((response) => {
                            age.set(response.data.Age, (age.get(response.data.Age) || 0) + id_orders[i][1]);
                        })
                }
                Promise.all(age);
                for (let i = 0; i < orders.length; i++) {
                    axios.get(`http://localhost:4000/user?id=${id_orders[i][0]}`)
                        .then((response) => {
                            batch.set(response.data.BatchName, (batch.get(response.data.BatchName) || 0) + id_orders[i][1]);
                        })
                }
                Promise.all(batch);
        console.log(age);

            })
            .catch(err => {
                console.log('Err.Message: ', err)
            });
    }, []);
    return (
    <div align={'center'} spacing={10}>
        <Typography variant="h4" component='div' gutterBottom>
            Statistics
        </Typography>
        <Grid item xs={12} md={9} lg={9}>
            <Paper>
                <Table >
                    <TableHead>
                        <TableRow>
                                <TableCell> Orders placed </TableCell>
                                <TableCell> Orders pending </TableCell>
                                <TableCell> Completed orders </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow >
                            <TableCell>{orders.reduce((prev, order) => prev + (order.Status === 'PLACED' ? 1 : 0), 0)}</TableCell>
                            <TableCell>{orders.reduce((prev, order) => prev + ((['REJECTED', 'COMPLETED']).includes(order.Status) ? 0 : 1 ), 0)}</TableCell>
                            <TableCell>{orders.reduce((prev, order) => prev + (order.Status === 'COMPLETED' ? 1 : 0), 0)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
          </Paper>
        </Grid>
        <br />
        <Typography variant="h5" component='div' gutterBottom>
            Top orders
        </Typography>
        <Grid item xs={12} md={9} lg={9}>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell> Food item </TableCell>
                            <TableCell> Orders </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                        (Array.from(orders.reduce((prev, order) => prev.set(order.foodItem, (prev.get(order.foodItem) || 0) + 1), new Map())))
                            .sort((x, y) => (y[1] - x[1]))
                            .slice(0, 5)
                            .map((x) => (
                                <TableRow>
                                    <TableCell>{x[0]}</TableCell>
                                    <TableCell>{x[1]}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
          </Paper>
        </Grid>
        <Grid container align={'center'}>
            <Grid item xs={6}>
                <PieChart
                    id="pie"
                    dataSource={Array.from(orders.reduce((prev, order) => prev.set(order.buyerBatch, (prev.get(order.buyerBatch) || 0)
                                + (order.Status === 'COMPLETED')), new Map())).map((x) => ({
                                    Batch: x[0],
                                    Orders: x[1] 
                                }))}
                    palette="Bright"
                    title="Orders from batches"
                    resolveLabelOverlapping={'shift'}
                    >
                    <Series
                        argumentField="Batch"
                        valueField="Orders"
                    >
                        <Label visible={true} customizeText={formatText} />
                    </Series>
                    <Margin bottom={20} />
                    <Export enabled={true} />
                    <Legend visible={false} />
                    <Animation enabled={false} />
                </PieChart>
            </Grid>
            <Grid item xs={6}>
                <PieChart
                    id="pie"
                    dataSource={Array.from(orders.reduce((prev, order) => prev.set(order.buyerAge, (prev.get(order.buyerAge) || 0)
                        + (order.Status === 'COMPLETED')), new Map())).map((x) => ({
                            Age: x[0],
                            Orders: x[1] 
                        }))}
                    palette="Bright"
                    title="Orders from different age groups"
                    resolveLabelOverlapping={'shift'}
                    >
                    <Series
                        argumentField="Age"
                        valueField="Orders"
                    >
                        <Label visible={true} customizeText={formatText} />
                    </Series>
                    <Margin bottom={20} />
                    <Export enabled={true} />
                    <Legend visible={false} />
                    <Animation enabled={false} />
                </PieChart>
            </Grid>
        </Grid>
    </div>
  );
};

export default Statistics;
