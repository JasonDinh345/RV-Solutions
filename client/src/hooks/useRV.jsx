import { useContext } from "react";
import { RVContext } from "../context/RVContext";

export const useRV =()=> useContext(RVContext);