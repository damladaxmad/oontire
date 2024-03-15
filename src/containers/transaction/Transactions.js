import React, { useState, useRef, useEffect } from "react";
import MaterialTable from "material-table";
import moment from "moment";
import { Typography } from "@mui/material";
import { constants } from "../../Helpers/constantsFile";
import { BiArrowBack } from "react-icons/bi";
import CustomButton from "../../reusables/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addTransaction, deleteTransaction, setTransactions, updateTransaction } from "./transactionSlice";
import TransactionForm from "./TransactionForm";
import io from 'socket.io-client';

const Transactions = ({ instance, client, url, hideTransactions, }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [type, setType] = useState(null)
    const [update, setUpdate] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [transaction, setTransaction] = useState(null)
    const token = useSelector(state => state.login.token)
    const { business } = useSelector(state => state?.login?.activeUser)
    const mySocketId = useSelector(state => state?.login?.mySocketId)
    const transactions = JSON.parse(JSON.stringify(useSelector(state => state.transactions.transactions)))

    const calculateBalance = (transactions, currentTransaction) => {
        let balance = 0;
        transactions.forEach(transaction => {
            if (transaction.id <= currentTransaction.id) {
                balance += transaction.debit - transaction.credit;
            }
        });
        return balance;
    };

    const dispatch = useDispatch()

    useEffect(() => {
        let source = axios.CancelToken.source();
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(url, {
                    headers: {
                        'authorization': token
                    },
                    cancelToken: source.token
                });
                setLoading(false);
                dispatch(setTransactions(response?.data?.data?.transactions))
            } catch (error) {
                if (!axios.isCancel(error)) {
                    setError("Error getting the data");
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            source.cancel();
        };
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(setTransactions([]));
        };
    }, [dispatch]);

    const materialOptions = {
        showTitle: false,
        padding: "20px",
        exportButton: true,
        sorting: true,
        showTextRowsSelected: false,
        toolbar: false,
        paging: false,
        pageSizeOptions: [2, 5, 8, 10, 20, 25, 50, 100],
        pageSize: 4,
        draggable: false,
        actionsColumnIndex: -1,
        rowStyle: (rowData) => {
            return {
                backgroundColor: rowData?.credit !== 0 && "#C8DAFD",
                borderBottom: "1px solid #A6A6A6",
            };
        },
        headerStyle: {
            background: "white",
            fontSize: "12px",
            borderRadius: "10px 10px 0px 0px",
            fontWeight: "bold",
            border: "1p solid #ABABAB"
        },
    };

    let balance = null
    transactions?.map(transaction => {
        balance += transaction?.debit - transaction?.credit
    })


    const columns = [
        {
            title: "Description",
            field: "description", width: "25%",
            cellStyle: { border: "none" },
        },

        {
            title: "Date",
            field: "date",
            type: 'date',
            render: (data) => {
                const formatted = moment(data.date).format("YYYY/MM/DD");
                return <p>{formatted}</p>;
            },
            cellStyle: { border: "none" },
        },
        { title: "User", field: "user", render: (data)=> <p> {data.user.name}</p> ,
        cellStyle: { border: "none" }, width: "20%" },
        {
            title: "Debit", field: "debit",
            editable: rowData => rowData.debit == 0 && "never",
            cellStyle: { border: "none" }
        },
        {
            title: "Credit", field: "credit",
            editable: rowData => rowData.credit == 0 && "never",
            cellStyle: { border: "none" }
        },
        {
            title: "Balance",
            cellStyle: { border: "none" },
            render: rowData => (
                <>
                    {calculateBalance(transactions, rowData)}
                </>
            )
        },


    ];

    useEffect(() => {

        const socket = io.connect('https://booktire-api.onrender.com');
        socket.on('transactionEvent', (data) => {
            handleTransactionEvent(data)
        });

        return () => {
            socket.disconnect();
        };
    }, []);


    const handleTransactionEvent = (data) => {

        const { socketId, businessId, transaction, eventType } = data;
        if (mySocketId == socketId) return
        if (business?._id !== businessId) return
        if (eventType === 'add') {
            alert("add")
            dispatch(addTransaction(transaction))
        } else if (eventType === 'delete') {
            dispatch(deleteTransaction(transaction?._id))
        } else if (eventType === 'update') {
            dispatch(updateTransaction({
                id: transaction._id,
                updatedTransaction: transaction
            }));
        }

    };


    return (
        <>

            {showForm && <TransactionForm type={type} instance={instance}
             client={client}
                update={update} transaction={transaction}
                hideModal={() => {
                    setShowForm(false)
                    setUpdate(false)
                }} />}

            <div style={{
                display: "flex",
                width: "100%",
                margin: "10px auto",
                justifyContent: "space-between"
            }}>

                <div style={{ display: "flex", gap: "20px" }}>

                    <CustomButton bgColor="white"
                        color="black" width="150px"
                        text="Bixin"
                        onClick={() => {
                            setType("bixin")
                            setShowForm(true)
                        }} />

                    <CustomButton bgColor={constants.pColor}
                        text="Deen Cusub" width="150px"
                        onClick={() => {
                            setType("deen")
                            setShowForm(true)
                        }} />

                </div>

                <CustomButton
                    text="Go Back" color="black"
                    bgColor="white"
                    width="150px"
                    startIcon={
                        <BiArrowBack
                            style={{
                                color: "black",
                            }}
                        />
                    }
                    onClick={() => {
                        dispatch(setTransactions([]))
                        hideTransactions()
                    }}
                />

            </div>


            <div style={{
                display: "flex",
                width: "100%",
                alignItems: "flex-end",
                margin: "7px auto",
                justifyContent: "space-between"
            }}>

                <div style={{
                    display: "flex", flexDirection: "column",
                }}>
                    <Typography style={{
                        fontSize: "18px", fontWeight: "bold"
                    }}>
                        {instance.name}
                    </Typography>
                    <Typography style={{
                        color: "#7F7F7F",
                        fontSize: "18px"
                    }}>
                        {instance.phone}
                    </Typography>
                </div>


                <div style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "end"
                }}>
                    <Typography style={{
                        fontSize: "20px", fontWeight: "bold"
                    }}>
                        {constants?.moneySign}{balance ? balance?.toFixed(2) : instance?.balance?.toFixed(2)}
                    </Typography>
                </div>

            </div>

            <MaterialTable
                columns={columns}
                data={transactions}
                localization={{
                    body: {
                        emptyDataSourceMessage: loading ? "loading.." : error ? error : "no data to display",
                    },
                }}
                options={materialOptions}
                style={{
                    borderRadius: "5px",
                    boxShadow: "none",
                    width: "100%",
                    margin: "10px auto",
                    border: "1px solid #A6A6A6",
                    marginTop: "15px",
                    background: constants.backdropColor,
                }}
                onRowClick={(e, rowData) => {
                    setTransaction(rowData)
                    setUpdate(true)
                    setShowForm(true)
                }}
            />

        </>
    );
};


export default Transactions;
