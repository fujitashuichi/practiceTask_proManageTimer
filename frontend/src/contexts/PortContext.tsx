import React, { useState } from "react";
import { PortContext } from "./PortContextType.tsx";

const PortProvider = ({ children }: { children: React.ReactNode }) => {
    const [backendPort, setBackendPort] = useState<number>(5137);
    return (
        <PortContext.Provider value={[backendPort, setBackendPort]}>
            {children}
        </PortContext.Provider>
    )
};


export default PortProvider;
