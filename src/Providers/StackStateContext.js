import {createContext} from "react";


// Stores the global state of the application.
const StackStateContext = createContext({
    activeFile: null,
});

export default StackStateContext;
