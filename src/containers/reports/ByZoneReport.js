import { Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import MyTable from "../../utils/MyTable";
import PrintableTableComponent from "./PintableTableComponent";
import { useReactToPrint } from 'react-to-print';
import CustomButton from "../../reusables/CustomButton";
import Select from "react-select";
import useReadData from "../../hooks/useReadData";
import { constants } from "../../Helpers/constantsFile";
import { useState } from "react";
import { setZoneDataFetched, setZones } from "../zone/zoneSlice";
import ZonePrintTable from "./ZonePrintTable";

const ByZoneReport = ({name, type}) => {
    const customers = useSelector(state => state.customers.customers).map(customer => ({ ...customer }));
    const [selectedZone, setSelectedZone] = useState(null); // Track selected area
    const [selectedBalanceFilter, setSelectedBalanceFilter] = useState({ value: 'all', label: 'All' }); // Track selected balance filter
    const { business } = useSelector(state => state.login.activeUser);
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/deentire-application.appspot.com/o/LOGO%2Fliibaan.jpeg?alt=media&token=f5b0b3e7-a5e0-4e0d-b3d2-20a920f97fde`;
    const zoneUrl = `${constants.baseUrl}/business-zones/get-business-zones/${business?._id}`;
    const zones = useSelector(state => state.zones.zones);

    useReadData(
        zoneUrl,
        setZones,
        setZoneDataFetched,
        state => state.zones.isZoneDataFetched,
        "zones"
    );

    let customerTotal = 0;
    let realCustomers = [];

    customers?.map(customer => {
        if (selectedZone && customer?.zone?._id !== selectedZone?.value) return;
        if (selectedBalanceFilter.value === 'deynle' && customer.balance <= 0) return;

        realCustomers.push(customer);
        customerTotal += customer.balance;
    });
    const columns = [
        { title: "No", field: "houseNo", defaultSort: "asc" },
        { 
            title: "Full Name", 
            field: "name", 
            width: "10%",  // Increase the width
            render: (data) => (
                <Typography style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {data?.name?.length > 24 ? `${data.name?.toLowerCase().substring(0, 24)}...` : data.name?.toLowerCase()}
                </Typography>
            )
        },
        { title: "Phone", field: "phone", width: "15%" },  // Adjust widths to fit content
        { title: "A.Hore", field: "aqrisHore", width: "15%" },
        { title: "A.Danb", field: "aqrisDanbe", width: "15%" },
        { 
            title: "Cost", 
            field: "cost", 
            render: rowData => <p>{(rowData?.aqrisHore - rowData?.aqrisDanbe) * (rowData?.rate || 1.5)}</p>,
            width: "15%"
        },
        { 
            title: "Reesto", 
            field: "cost", 
            render: rowData => <p>{rowData?.balance - (rowData?.aqrisHore - rowData?.aqrisDanbe) * (rowData?.rate || 1.5)}</p>,
            width: "15%"
        },
        { title: "Balance", field: "balance", width: "20%" },
    ];
    

    const handlePrint = useReactToPrint({
        content: () => document.querySelector('.printable-table'),
        documentTitle: `Zone Report (${selectedZone ? realCustomers[0]?.zone?.zoneName : "All"})`
    });

    const balanceFilterOptions = [
        { value: 'all', label: 'All' },
        { value: 'deynle', label: 'Deynle' },
    ];

    return (
        <div style={{
            background: "white",
            borderRadius: "8px",
            padding: "30px 50px",
            display: "flex",
            gap: "30px",
            flexDirection: "column",
            width: "100%"
        }}>
            <ZonePrintTable columns={columns} data={realCustomers} imageUrl={imageUrl}
                reportTitle={`Zone Report (${selectedZone ? realCustomers[0]?.zone?.zoneName : "All"})`}>
                <div style={{ marginTop: "10px" }}>
                    <Typography style={{ fontSize: "16px" }}>  TOTAL:
                        <span style={{ fontWeight: "bold", fontSize: "18px" }}> ${customerTotal} </span></Typography>
                </div>
            </ZonePrintTable>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <Typography style={{ fontWeight: "bold", fontSize: "20px" }}> Zones Report</Typography>
                    <Typography style={{ fontSize: "18px", color: "#6C6C6C" }}> {realCustomers?.length} {name}</Typography>
                </div>

                <Select
                    placeholder="Select Zone"
                    options={zones?.map(zone => ({ value: zone._id, label: zone.zoneName }))}
                    onChange={selectedOption => setSelectedZone(selectedOption)} // Handle selected area
                    isClearable={true}
                    isSearchable={true}
                    style={{ width: '30%' }}
                />

                <Select
                    placeholder="Select Balance Filter"
                    options={balanceFilterOptions}
                    onChange={setSelectedBalanceFilter}
                    value={selectedBalanceFilter}
                    isClearable={true}
                    isSearchable={true}
                    style={{ width: '30%' }}
                />

                <CustomButton text="Print" onClick={handlePrint} height="35px" fontSize="14px" />

                <Typography style={{ fontWeight: "bold", fontSize: "20px" }}> ${customerTotal?.toFixed(2)}</Typography>
            </div>

            {name === "customers" && <MyTable columns={columns} data={realCustomers} kind="Report" />}
        </div>
    );
}

export default ByZoneReport;
