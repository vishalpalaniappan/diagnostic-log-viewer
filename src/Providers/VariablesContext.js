import {createContext} from "react";

// This context stores the variables for the current stack position.
// It is consumed by the variables container.
const VariablesContext = createContext();

export default VariablesContext;
