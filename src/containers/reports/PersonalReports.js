import { Typography } from "@material-ui/core"
import { useSelector } from "react-redux"
import MyTable from "../../utils/MyTable"
import PrintableTableComponent from "./PintableTableComponent"
import { useReactToPrint } from 'react-to-print';
import CustomButton from "../../reusables/CustomButton";

const PersonalReport = ({name, type}) => {

    const customers = JSON.parse(JSON.stringify(useSelector(state => state.customers.customers)))

    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/deentire-application.appspot.com/o/LOGO%2Fliibaan.jpeg?alt=media&token=f5b0b3e7-a5e0-4e0d-b3d2-20a920f97fde`;

    let customerTotal = 0
    let vendorTotal = 0

    let realCustomers = []
    customers?.map(customer => {
        if (!customer?.type || customer?.type == "deynle")
        if (customer.balance > 0) {
        realCustomers.push(customer)
        customerTotal += customer.balance
        }
    })

    const decideTotal = () => {
        if (type == "Customers") return customerTotal
        if (type == "Vendors") return vendorTotal
        return 0
    }
    const decideCount = () => {
        if (type == "Customers") return realCustomers?.length
        return 0
    }

    const columns = [
        { title: "Guri.No.", field: "houseNo", defaultSort: "asc", cellStyle: {
            whiteSpace: 'nowrap',  },},
            { title: "Full Name", field: "name", render: (data) =>                 <Typography style={{ }}> {data?.name?.substring(0, 46)}
            {data?.name?.length <= 17 ? null : "..."}</Typography>,
          cellStyle: { whiteSpace: 'nowrap' } },
        { title: "Phone", field: "phone", width: "20%" },
        { title: "Area", field: "area", render: (data) => <p> {data?.area?.areaName}</p> },
        { title: "Zone", field: "zone", render: (data) => <p> {data.zone?.zoneName}</p> },
        { title: "M.Hore", field: "aqrisHore"},
        { title: "Balance", field: "balance" },
    ]

    const handlePrint = useReactToPrint({
        content: () => document.querySelector('.printable-table'),
    });

    return (
        <div style = {{
            background: "white",
            borderRadius: "8px",
            padding: "30px 50px",
            display: "flex",
            gap: "30px",
            flexDirection: "column",
            width: "100%"
        }}>

            <PrintableTableComponent columns={columns} data={type == "Customers" ? realCustomers : null} imageUrl={imageUrl} 
            reportTitle = {`${type} Report`}> 
             <div style = {{marginTop: "10px"}}>  
                <Typography style = {{ fontSize: "16px"}}>  TOTAL: 
                <span  style = {{fontWeight: "bold", fontSize: "18px"}}> ${customerTotal} </span></Typography>
            </div>
            </PrintableTableComponent>
            <div style = {{display: "flex", justifyContent: "space-between"}}>
            <div>
                <Typography style = {{
                    fontWeight: "bold",
                    fontSize: "20px"
                }}> {type} Report</Typography>
                <Typography style = {{
                    fontSize: "18px",
                    color: "#6C6C6C"
                }}> {decideCount()} {name}</Typography>
            </div>
            
            <CustomButton text = "Print" onClick={handlePrint} height="35px" fontSize="14px"/>

            <Typography style = {{
                    fontWeight: "bold",
                    fontSize: "20px"
                }}> ${decideTotal().toFixed(2)}</Typography>
            </div>
           
           {name == "customers" && <MyTable columns = {columns} data = {realCustomers}
            kind = "Report"/>}

        </div>
    )
}

export default PersonalReport