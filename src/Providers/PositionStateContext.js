import {createContext} from "react";


// Stores the global state of the application.
const PositionStateContext = createContext({
    activeFile: null,
});

export default PositionStateContext;
