import React from 'react';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import logo from "../../assets/images/logo.png";
import { MdKeyboardArrowRight } from 'react-icons/md';
import "./PrintableTable.css";
import { useSelector } from 'react-redux';

const ZonePrintTable = ({ reportTitle, data, imageUrl, children }) => {
    const { business } = useSelector(state => state.login?.activeUser);

    return (
        <div className="printable-table" style={{ padding: "15px 20px" }}>
            <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                <div>
                    <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {business?.businessName}
                    </Typography>
                    <Typography style={{ fontSize: "18px" }}>
                        {business?.businessLocation} - {business?.businessNumber}
                    </Typography>
                </div>
                <div style={{ width: "100px", height: "100px", background: "transparent" }}>
                    <img
                        src={business?.logoUrl || logo}
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row", gap: "6px", alignItems: "center" }}>
                <MdKeyboardArrowRight style={{ fontSize: "18px" }} />
                <Typography style={{ fontSize: "16px" }}>{reportTitle}</Typography>
            </div>

            {/* Header Row */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '0.5fr 3fr 1fr 1fr 1fr 1fr 1fr 1fr', // Keep the grid structure
                gap: '10px', 
                alignItems: 'center',
                fontWeight: 'bold',
                marginTop: '15px',
                marginBottom: '10px',
                borderTop: "1px solid lightGrey",
                borderBottom: "1px solid lightGrey",
                padding: '10px 5px'
            }}>
                <Typography style={{ textAlign: 'left', fontWeight: "bold" }}>No</Typography>
                <Typography style={{ textAlign: 'left', fontWeight: "bold" }}>Name</Typography>
                <Typography style={{ textAlign: 'right', fontWeight: "bold" }}>Phone</Typography>
                <Typography style={{ textAlign: 'right', fontWeight: "bold" }}>A.Hore</Typography>
                <Typography style={{ textAlign: 'right', fontWeight: "bold" }}>A.Danbe</Typography>
                <Typography style={{ textAlign: 'right', fontWeight: "bold" }}>Cost</Typography>
                <Typography style={{ textAlign: 'right' ,fontWeight: "bold" }}>Reesto</Typography>
                <Typography style={{ textAlign: 'right' ,fontWeight: "bold" }}>Balance</Typography>
            </div>

            <MaterialTable
                title="Printable Table"
                columns={[
                    {
                        title: "Details",
                        field: "details",
                        render: rowData => (
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '0.5fr 3fr 1fr 1fr 1fr 1fr 1fr 1fr', 
                                gap: '10px', 
                                alignItems: 'center'
                            }}>
                                <Typography style={{ textAlign: 'left' }}>{rowData.houseNo}</Typography>
                                <Typography noWrap style={{ textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {rowData.name?.length > 24 ? `${rowData.name.substring(0, 24)}...` : rowData.name}
                                </Typography>
                                <Typography style={{ textAlign: 'right' }}>{rowData.phone}</Typography>
                                <Typography style={{ textAlign: 'right' }}>{rowData.aqrisHore}</Typography>
                                <Typography style={{ textAlign: 'right' }}>{rowData.aqrisDanbe}</Typography>
                                <Typography style={{ textAlign: 'right' }}>
                                    {(rowData.aqrisHore - rowData.aqrisDanbe) * (rowData.rate || 1.5)}
                                </Typography>
                                <Typography style={{ textAlign: 'right' }}>
                                    {rowData.balance - (rowData.aqrisHore - rowData.aqrisDanbe) * (rowData.rate || 1.5)}
                                </Typography>
                                <Typography style={{ textAlign: 'right' }}>{rowData.balance}</Typography>
                            </div>
                        )
                    }
                ]}
                data={data}
                options={{
                    pageSize: 40,
                    paging: false,
                    toolbar: false,
                    sorting: false,
                    showTitle: false,
                    headerStyle: { display: 'none' }, // Hide the header
                    search: false,
                    padding: 'dense',
                }}
                style={{
                    boxShadow: "none",
                    border: "1px solid gray",
                    fontSize: "16px"
                }}
            />

            {children}
        </div>
    );
};

export default ZonePrintTable;
