import { CircularProgress, Typography } from "@material-ui/core"
import MyModal from "../../Modal/Modal"


const Loading = (props) => {

    return (
        <MyModal width="350px" top="32%" left = "42%">
              <div style = {{width: "300px", display: "flex",
            flexDirection: "column", gap: "20px", alignItems: "center",
            padding: "20px"}}>
                <CircularProgress/>
                <Typography style = {{fontWeight: "bold"}}> SENDING SMS...</Typography>

                <Typography style = {{textAlign: "center", 
            fontSize: "15px"}}> Fadlan sug inta macaamiisha looga dirayo fariimaha. Mahadsanid.</Typography>
             </div>

        </MyModal>
    )
}

export default Loading