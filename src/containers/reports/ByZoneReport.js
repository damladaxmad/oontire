import { Typography } from "@material-ui/core"
import { useSelector } from "react-redux"
import MyTable from "../../utils/MyTable"
import PrintableTableComponent from "./PintableTableComponent"
import { useReactToPrint } from 'react-to-print';
import CustomButton from "../../reusables/CustomButton";
import Select from "react-select"
import useReadData from "../../hooks/useReadData";
import { constants } from "../../Helpers/constantsFile";
import { useState } from "react";
import { setZoneDataFetched, setZones } from "../zone/zoneSlice";

const ByZoneReport = ({name, type}) => {

    const customers = JSON.parse(JSON.stringify(useSelector(state => state.customers.customers)))
    const [selectedZone, setSelectedZone] = useState(null); // Track selected area
    const {business} = useSelector(state => state.login.activeUser)
    const zones = useSelector(state => state.zones.zones);
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/deentire-application.appspot.com/o/LOGO%2Fliibaan.jpeg?alt=media&token=f5b0b3e7-a5e0-4e0d-b3d2-20a920f97fde`;
    const zoneUrl = `${constants.baseUrl}/business-zones/get-business-zones/${business?._id}`
    
    useReadData(
      zoneUrl,
      setZones,
      setZoneDataFetched,
      state => state.zones.isZoneDataFetched,
      "zones"
    );
    let customerTotal = 0

    let realCustomers = []
    customers?.map(customer => {
        if (selectedZone && customer?.zone?._id !== selectedZone?.value) return

        realCustomers.push(customer)
        customerTotal += customer.balance
        
    })

    const columns = [
        { title: "Full Name", field: "name",    cellStyle: {
            whiteSpace: 'nowrap'
           }, },
        { title: "Phone", field: "phone", width: "20%" },
        { title: "Zone", field: "zone", render: (data) => <p> {data.zone?.zoneName}</p> },
        { title: "Guri.No.", field: "houseNo"},
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
            reportTitle = {`Zone Report (${selectedZone ? realCustomers[0]?.zone?.zoneName : "All"})`}> 
            </PrintableTableComponent>
            <div style = {{display: "flex", justifyContent: "space-between"}}>
            <div>
                <Typography style = {{
                    fontWeight: "bold",
                    fontSize: "20px"
                }}> Zones Report</Typography>
                <Typography style = {{
                    fontSize: "18px",
                    color: "#6C6C6C"
                }}> {realCustomers?.length} {name}</Typography>
            </div>

            <Select
                    placeholder="Select Zone"
                    options={zones?.map(zone => ({ value: zone._id, label: zone.zoneName }))}
                    onChange={selectedOption => setSelectedZone(selectedOption)} // Handle selected area
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

export default ByZoneReport