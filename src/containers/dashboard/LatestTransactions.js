import { Typography, CircularProgress } from "@mui/material";
import { constants } from "../../Helpers/constantsFile";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";

export default function LatestTransactions() {

    let today = new Date()

    const [transactions, setTransaction] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading indicator

    const { business } = useSelector(state => state.login?.activeUser);
    const token = useSelector(state => state.login?.token);

    const fetchTransactions = () => {
        axios.get(`${constants.baseUrl}/transactions/get-business-transactions/${business?._id}?customer=notnull&startDate=2024-03-01&endDate=${moment(today).format("YYYY-MM-DD")}`, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            console.log(res.data?.data)
            setTransaction(res?.data?.data?.transactions || []);
        }).catch(error => {
            console.error("Error fetching transactions:", error);
        }).finally(() => {
            setLoading(false); // Set loading to false when data fetching completes
        });
    };

    useEffect(() => {
        fetchTransactions();
    }, []);


    return (
        <div style={{
            marginTop: "15px", display: "flex", flexDirection: "column",
            gap: "16px", width: "100%"
        }}>
            {loading ? ( // Display loading indicator if loading is true
                <div style={{ textAlign: "center" }}>
                    <CircularProgress style = {{color: constants.pColor}} />
                    <Typography variant="body2" style={{ marginTop: 10 }}>Loading...</Typography>
                </div>
            ) : (
                <>
                    {transactions?.length > 0 ? (
                        transactions?.slice(-5).reverse().map((d, index) => {
                            const actualIndex = transactions?.length - index - 1;
                            return <Transaction key={actualIndex} data={d} index={index} />;
                        })
                    ) : (
                        <Typography variant="body2" style={{ textAlign: "center" }}>No data</Typography>
                    )}
                </>
            )}
        </div>
    )
}

function Transaction({ data, index }) {
    return (
        <div style={{
            display: "flex", flexDirection: "row", width: "100%",
            background:  "white", borderRadius: "8px", padding: "15px 20px",
            alignItems: "center", justifyContent: "space-between",
            color:  "black", position: "relative"
        }}>

            <div style={{
                position: 'absolute', top: "20%", bottom: "20%", left: 0, width: '6px',
                backgroundColor: data?.transactionType === "payment" ? constants.pColor : '#C8C8C8',
                borderRadius: "0px 6px 6px 0px"
            }}></div>

            <div style={{ display: "flex", flexDirection: "column",  flex: 1  }}>
                <Typography style={{ fontSize: "15px", fontWeight: "bold",}}> {data?.customer.name.substring(0, 17)}
              {data?.customer.name.length <= 17 ? null : "..."}</Typography>
                <Typography style={{ fontSize: "14px", color: "#B4B4B4" }}> {moment(data.date).format("YYYY-MM-DD")}</Typography>
            </div>
            <Typography style={{ fontSize: "15px", flex: 0.5,  }}> {data.transactionType}</Typography>
            <Typography style={{ fontSize: "15px", flex: 0.1 }}> ${data.transactionType == "charge" ? data.debit : data.credit}</Typography>
        </div>
    )
}
