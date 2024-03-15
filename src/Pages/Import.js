import { useState } from "react";
import ImportCustomers from "../containers/customer/ImportCustomers";

export default function Import() {
    const [showingCustomers, setShowingCustomers] = useState(false)

   return (
    <div style = {{display: "flex", flexDirection: "column", gap: "35px"}}>

        <ImportCustomers showCustomers = {(data) => setShowingCustomers(data)}/>

    </div>
   )
}