import { BrowserDatabase } from "./BrowserDatabase";
import { FirebaseDatabase } from "./FirebaseDatabase";

export let LocalDatabase = new BrowserDatabase();
export let Database = new FirebaseDatabase();
