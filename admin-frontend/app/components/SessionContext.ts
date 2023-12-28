import { createContext } from "react";
import { Session } from "../types";

const SessionContext = createContext({} as Session);

export default SessionContext;
