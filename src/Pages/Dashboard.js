import { Avatar, Typography } from "@mui/material"
import { RiCoinsLine } from "react-icons/ri"
import Top5DeenCustomers from "../containers/dashboard/Top5DeenCustomers"
import LatestTransactions from "../containers/dashboard/LatestTransactions"
import { setCustomerDataFetched, setCustomers } from "../containers/customer/customerSlice";
import useReadData from "../hooks/useReadData";
import { useSelector } from "react-redux";
import { constants } from "../Helpers/constantsFile";

export default function Dashboard() {
  const { business, name } = useSelector(state => state.login.activeUser);
  const urlCustomer = `${constants.baseUrl}/customers/get-business-customers/${business?._id}`;
  const customers = JSON.parse(JSON.stringify(useSelector(state => state.customers?.customers || [])))

  useReadData(
    urlCustomer,
    setCustomers,
    setCustomerDataFetched,
    state => state.customers.isCustomerDataFetched,
    "customers"
  );


  let receivable = 0
  customers?.map(customer => {
    receivable += customer?.balance
  })


  const statusCards = [
    {title: "receivable", value: receivable, isMoney: true},
    {title: "customers", value: customers?.length},
    {title: "users", value: 3},
  ]
  return (
    <div style={{width: "95%", margin: "auto"}}>
      <h2> Dashboard</h2>

      <div style = {{display: "flex", flexDirection: "row",
      width: "100%", marginTop: "20px", justifyContent: "space-between"}}>

        <div style = {{width: "62%"}}>
          <div style = {{display: "flex", flexWrap: "wrap", width: "100%", gap: "20px"}}>
            {statusCards?.map(s => {
              return <StatusCard data = {s} />
            })}
          </div>

          <div style = {{marginTop: "30px", display: "flex", flexDirection: "column", gap: "14px"}}>
            <Typography style = {{fontSize: "16px", fontWeight: "bold",
          color: "#909090"}}> Top 5 Deen Customers</Typography>
            <Top5DeenCustomers />
          </div>
        </div>

        <div style = {{width: "35%"}}>
        <Typography style = {{fontSize: "16px", fontWeight: "bold",
          color: "#909090"}}> Latest Transactions</Typography>
          <LatestTransactions />
        </div>

      </div>

    </div>
  )
}

function StatusCard ({data}) {

  return (
    <div style = {{display: "flex", background: "white", padding: "20px", borderRadius: "10px",
    width: "30%", flexDirection: "row", gap: "15px",}}>

        <Avatar style = {{background: constants.backdropColor}}>
        <RiCoinsLine style = {{color: constants.pColor, fontSize: "20px"}} />
        </Avatar>

        <div style = {{display: "flex", flexDirection: "column"}}>
        <Typography style = {{fontWeight: "bold", fontSize: "16px",}}> 
        {data?.isMoney && "$"}{data.value} </Typography>
        <Typography style = {{color: "#979797", fontSize: "14px",}}> {data.title}</Typography>
        </div>

    </div>
  )
}