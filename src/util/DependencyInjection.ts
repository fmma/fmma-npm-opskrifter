import { AbstractDatabase } from "./AbstractDatabase";
import { AbstractMedia } from "./AbstractMedia";
import { BrowserDatabase } from "./BrowserDatabase";
import { FirebaseDatabase } from "./FirebaseDatabase";
import { FirebaseMedia } from "./FirebaseMedia";

export let LocalDatabase: AbstractDatabase = new BrowserDatabase();
export let Database: AbstractDatabase = new FirebaseDatabase();
export let Media: AbstractMedia = new FirebaseMedia();
