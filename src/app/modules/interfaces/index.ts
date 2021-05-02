import { Scenes } from "telegraf";

export interface Catalog {
  name: string;
  description: string;
}
export interface Context extends Scenes.SceneContext {}
