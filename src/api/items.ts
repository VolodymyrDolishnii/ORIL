import { items } from "./Fetch";
import { Item } from "../types/item";

export const getItems = () => {
    return items.get<Item[]>(`/list`);
};