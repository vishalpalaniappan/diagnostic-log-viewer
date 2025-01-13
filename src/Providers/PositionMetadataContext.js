import {createContext} from "react";


// Stores the metadata (logType, variable stack, callstack)
// for the given position.
const PositionMetadataContext = createContext({});

export default PositionMetadataContext;
