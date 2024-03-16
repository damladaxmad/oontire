import { Typography } from "@material-ui/core"
import { useSelector } from "react-redux"
import MyTable from "../../utils/MyTable"
import PrintableTableComponent from "./PintableTableComponent"
import { useReactToPrint } from 'react-to-print';
import CustomButton from "../../reusables/CustomButton";
import { setAreaDataFetched, setAreas } from "../area/areaSlice";
import Select from "react-select"
import useReadData from "../../hooks/useReadData";
import { constants } from "../../Helpers/constantsFile";
import { useState } from "react";

const InvoicingReport = ({name, type}) => {

    const customers = JSON.parse(JSON.stringify(useSelector(state => state.customers.customers)))
    const [selectedArea, setSelectedArea] = useState(null); // Track selected area
    const {business} = useSelector(state => state.login.activeUser)
    const areas = useSelector(state => state.areas.areas);
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/deentire-application.appspot.com/o/LOGO%2Fliibaan.jpeg?alt=media&token=f5b0b3e7-a5e0-4e0d-b3d2-20a920f97fde`;
    const areaUrl = `${constants.baseUrl}/business-areas/get-business-areas/${business?._id}`
    
    useReadData(
      areaUrl,
      setAreas,
      setAreaDataFetched,
      state => state.users.isAreasDataFetched,
      "areas"
    );
    let customerTotal = 0
    let vendorTotal = 0

    let realCustomers = []
    customers?.map(customer => {
        if (selectedArea && customer.area._id !== selectedArea?.value) return

        realCustomers.push(customer)
        customerTotal += customer.balance
        
    })

    const columns = [
        { title: "Full Name", field: "name",    cellStyle: {
            whiteSpace: 'nowrap'
           }, },
        { title: "Phone", field: "phone", width: "20%" },
        { title: "Zone", field: "zone", render: (data) => <p> {data.zone?.zoneName}</p> },
        { title: "House NO.", field: "houseNo"},
        { title: "A.Hore", field: "aqrisHore"},
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

            <PrintableTableComponent columns={columns} data={realCustomers} imageUrl={imageUrl} 
            reportTitle = {`${type} Report (${selectedArea ? realCustomers[0].area?.areaName : "All"})`}> 
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
                }}> {realCustomers?.length} {name}</Typography>
            </div>

            <Select
                    placeholder="Select Area"
                    options={areas.map(area => ({ value: area._id, label: area.areaName }))}
                    onChange={selectedOption => setSelectedArea(selectedOption)} // Handle selected area
                    isClearable={true}
                    isSearchable={true}
                    style={{ width: '45%' }}
                />
            
            <CustomButton text = "Print" onClick={handlePrint} height="35px" fontSize="14px"/>

            <Typography style = {{
                    fontWeight: "bold",
                    fontSize: "20px"
                }}> ${customerTotal?.toFixed(2)}</Typography>
            </div>
           
           {name == "customers" && <MyTable columns = {columns} data = {realCustomers}
            kind = "Report"/>}

        </div>
    )
}

export default InvoicingReport