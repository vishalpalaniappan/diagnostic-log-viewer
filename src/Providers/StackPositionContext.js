import {createContext} from "react";


// Stores the global state of the application.
const StackPositionContext = createContext({
    activeFile: null,
});

export default StackPositionContext;
