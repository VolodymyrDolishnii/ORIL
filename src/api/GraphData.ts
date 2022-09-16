import { items } from "./Fetch";
// import { Graph } from "../types/graph";
import { Graphs } from "../types/graphs";

export const getGraphData = (name: string) => {
    return items.get<Graphs>(`/item/${name}`);
};