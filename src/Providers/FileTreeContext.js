import {createContext} from "react";


// Stores the global state of the application.
const FileTreeContext = createContext({
    activeFile: null,
});

export default FileTreeContext;
