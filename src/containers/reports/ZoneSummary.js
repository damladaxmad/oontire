import React from "react";
import { useSelector } from "react-redux";
import Typography from '@material-ui/core/Typography';

export default function ZoneSummary() {
    const customers = useSelector(state => state.customers.customers);

    // Step 1: Group customers by zone
    const zones = customers?.reduce((acc, customer) => {
        const zoneName = customer?.zone?.zoneName;
        if (!acc[zoneName]) {
            acc[zoneName] = { count: 0, balance: 0 };
        }
        acc[zoneName].count += 1;
        acc[zoneName].balance += customer.balance;
        return acc;
    }, {});

    // Step 2: Calculate the total number of customers and total balance
    const totalCustomers = Object.values(zones).reduce((sum, zone) => sum + zone.count, 0);
    const totalBalance = Object.values(zones).reduce((sum, zone) => sum + zone.balance, 0);

    // Step 3: Prepare data for rendering
    const data = [
        ...Object.entries(zones).map(([zoneName, { count, balance }]) => ({
            title: zoneName,
            customers: count,
            balance: balance.toLocaleString(),
        })),
        {
            title: "TOTAL",
            customers: totalCustomers,
            balance: totalBalance.toLocaleString(),
        }
    ];

    return (
        <div style={{
            width: "50%",
            marginTop: "80px",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "10px 25px",
            borderRadius: "12px",
            border: "1px solid lightgray",
            background: "white"
        }}>
            <Typography variant="h6" style={{ fontWeight: "bold", marginBottom: "10px" }}>Zone Summary</Typography>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {data.map((d, index) => (
                    <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: index < data.length - 1 ? "1px solid lightgray" : "none" }}>
                        <Typography style={{ width: "35%", fontSize: "14px", color: "black", fontWeight: d.title === "TOTAL" ? "bold" : "normal" }}>{d.title}</Typography>
                        <Typography style={{ width: "25%", fontSize: "14px", color: "black", textAlign: "right", fontWeight: d.title === "TOTAL" ? "bold" : "normal" }}>{d.customers} customers</Typography>
                        <Typography style={{ width: "25%", fontSize: "14px", color: "black", textAlign: "right", fontWeight: d.title === "TOTAL" ? "bold" : "normal" }}>${d.balance}</Typography>
                    </div>
                ))}
            </div>
        </div>
    );
}
