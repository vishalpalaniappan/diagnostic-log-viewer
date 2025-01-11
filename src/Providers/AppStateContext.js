import {createContext} from "react";


// Stores the global state of the application.
const AppStateContext = createContext({
    activeFile: null,
});

export default AppStateContext;
