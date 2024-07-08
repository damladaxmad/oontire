import React, { useMemo } from "react";
import { MdClose } from "react-icons/md";
import MaterialTable from "material-table";
import { constants } from "../Helpers/constantsFile";

const MyTable = React.memo((props) => {
  const columns = props.columns;

  const topValues = useMemo(() => {
    return props.data?.sort((a, b) => b.balance - a.balance).slice(0, props.data?.length);
  }, [props.data]);

  const columnsWithTypes = columns.map(column => {
    if (column.field === "houseNo") {
        return { ...column, type: "numeric" };
    }
    return column;
});

  return (
    <div style={{ width: props.page === "New Purchase" ? "98%" : "100%", margin: props.page === "New Purchase" ? "none" : "auto" }}>
      <MaterialTable
        columns={columnsWithTypes}
        data={topValues}
        options={{
          rowStyle: {},
          showTitle: false,
          sorting: true,
          paging: false,
          exportButton: true,
          sorting: false,
          showTextRowsSelected: false,
          toolbar: false,
          draggable: false,
          headerStyle: { display: "none" },
        }}
        components={
          props.kind === "Report" && {
            Row: (props) => (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  borderBottom: "0.5px solid #E3E3E3",
                  padding: "8px 0px",
                  fontSize: 15,
                }}
              >
                <p style={{ margin: "0px", width: "35%" }}>{props.data.name}</p>
                <p style={{ margin: "0px", width: "21%", textAlign: "end" }}>{props.data.phone}</p>
                <p style={{ margin: "0px", width: "21%", textAlign: "end" }}>{props.data.houseNo}</p>
                <p style={{ margin: "0px", width: "21%", textAlign: "end" }}>{props.data.aqrisHore}</p>
                <p style={{ margin: "0px", width: "21%", textAlign: "end" }}>{constants.moneySign}{props.data.balance?.toFixed(2)}</p>
              </div>
            ),
          }
        }
        style={{ borderRadius: "10px", boxShadow: "none", border: "none" }}
      />
    </div>
  );
});

export default MyTable;
