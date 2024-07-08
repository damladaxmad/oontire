import React from 'react';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import logo from "../../assets/images/logo.png";
import { MdKeyboardArrowRight } from 'react-icons/md';
import "./PrintableTable.css";
import { useSelector } from 'react-redux';

const PrintableTableComponent = ({ reportTitle, columns, data, imageUrl, children }) => {
    const { business } = useSelector(state => state.login?.activeUser);
    console.log("Rendered!!!");

    // Ensure houseNo is recognized as a numeric field by MaterialTable
    const columnsWithTypes = columns.map(column => {
        if (column.field === "houseNo") {
            return { ...column, type: "numeric", cellStyle: { width: '20px', minWidth: '20px' }, // Adjust width here
            headerStyle: { width: '20px', minWidth: '20px' } };
        }
        return column;
    });

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
            <MaterialTable
                title="Printable Table"
                columns={columnsWithTypes}
                data={data}
                options={{
                    pageSize: 40,
                    paging: false,
                    toolbar: false,
                    sorting: true,
                    showTitle: false,
                    headerStyle: { fontWeight: "bold", background: "lightgray" },
                    // defaultSort: "houseNo" // Ensure default sorting by houseNo
                }}
                style={{ boxShadow: "none", border: "1px solid gray", marginTop: "15px",
                    fontSize: "18px"
                 }}
            />
            {children}
        </div>
    );
};

export default PrintableTableComponent;
