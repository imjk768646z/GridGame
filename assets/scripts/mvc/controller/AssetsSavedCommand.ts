import { AudioClip, dragonBones, JsonAsset, SpriteFrame } from "cc";
import { INotification, SimpleCommand } from "../../puremvc-typescript-standard-framework";
import { AssetsProxy } from "../model/AssetsProxy";

export type AssetsProperty = {
    symbols: Map<string, SpriteFrame>,
    audioClips: Map<string, AudioClip>,
    dragonBones: Map<string, dragonBones.DragonBonesAsset>
    dragonBonesAtlas: Map<string, dragonBones.DragonBonesAtlasAsset>
}

export class AssetsSavedCommand extends SimpleCommand {
    public execute(notification: INotification): void {
        console.log("AssetsSavedCommand => ", notification);
        const Assets = notification.body;
        this.facade.registerProxy(new AssetsProxy(Assets));
        this.facade.sendNotification("SET_ASSETS", Assets);
    }
}


