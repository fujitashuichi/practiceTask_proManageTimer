import React, { createContext } from "react";

export const PortContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>]>([0, () => {}]);
