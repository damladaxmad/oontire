import { Button, Divider, Typography } from "@material-ui/core";
import MyModal from "../../Modal/Modal";
import { MdCheckBox } from "react-icons/md";
import { RiWallet3Fill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { constants } from "../../Helpers/constantsFile";

const parentDivStyle = {
  width: "300px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "10px",
};

const SmsSuccess = (props) => {

    console.log(props.successData)
  const data = [
    {
      title: "Sent to",
      value: props.successData?.customersThoseWeSentToTheSMS?.length,
      icon: <MdCheckBox style={{ fontSize: "18px", color: "green" }} />,
    },
    {
      title: "Haraagaagu waa",
      value: props.successData?.smsBalance,
      icon: <RiWallet3Fill style={{ fontSize: "17px", color: "black" }} />,
    },
  ];

  const macaamiisha = props.successData?.customersThoseWeFailedToSendTheSMS
  ;

  return (
    <MyModal onClose={props.hideModal} width="300px" top="30%">
      <div style={parentDivStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          <Typography variant="body1">
            <span
              style={{ color: constants.pColor, fontSize: "15px", fontWeight: "bold" }}
            >
              OON
            </span>
            <span style={{ fontSize: "15px", fontWeight: "bold" }}>TIRE</span>
          </Typography>
          <Divider style={{ width: "100%" }} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: "start",
          }}
        >
          {data?.map((d) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                {d.icon}
                <Typography style={{ fontSize: "17px" }}> {d.title}</Typography>
                <Typography style={{ fontSize: "17px", fontWeight: "bold" }}>
                  {" "}
                  {d.value}
                </Typography>
              </div>
            );
          })}
        </div>

        {macaamiisha.length > 0 && <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: "start",
            maxHeight: '130px',
            overflowY: 'auto'
          }}
        >
          <Typography
            style={{ fontSize: "17px", color: "#A5A5A5", fontWeight: "bold" }}
          >
            Macaamiisha aan loo dirin
          </Typography>

          {macaamiisha.length > 0 ? (
  macaamiisha.map((m) => (
    <div
      key={m.name} // Ensure to add a unique key when using map
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        alignItems: "center",
      }}
    >
      <MdCancel style={{ fontSize: "16px", color: "lightgrey" }} />
      <Typography style={{ fontSize: "14px" }}> {m.name}</Typography>
    </div>
  ))
) : (
  null // Render nothing when the array is empty
)}
        </div>}

        <Button
          onClick={props.hideModal}
          style={{
            width: "100%",
            marginLeft: "auto",
            fontSize: "16px",
            backgroundColor: constants.pColor,
            fontWeight: "600",
            color: "white",
            height: "35px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          OK
        </Button>
      </div>
    </MyModal>
  );
};

export default SmsSuccess;
