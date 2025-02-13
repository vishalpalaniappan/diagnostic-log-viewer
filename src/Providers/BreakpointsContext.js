import {createContext} from "react";

// This context stores the breakpoints in this program.
// It is consumed by the monaco instance component.
const BreakpointsContext = createContext();

export default BreakpointsContext;
