import { SlotProxy } from "../model/SlotProxy";
import { GameMediator } from "../view/GameMediator";
import { ReelBarMediator } from "../view/ReelBarMediator";
import { INotification, SimpleCommand } from "../../puremvc-typescript-standard-framework";
import { FSMProxy } from "../model/FSMProxy";
import { LoadMediator } from "../view/LoadMediator";
import { BackgroundMediator } from "../view/BackgroundMediator";
import { EffectMediator } from "../view/EffectMediator";
import { MultipleProxy } from "../model/MultipleProxy";
import { EliminateScoreMediator } from "../view/EliminateScoreMediator";
import { MainInformationMediator } from "../view/MainInformationMediator";
import { ScoreProxy } from "../model/ScoreProxy";
import { BetProxy } from "../model/BetProxy";
import { TransitionMediator } from "../view/TransitionMediator";
import { ButtonMediator } from "../view/ButtonMediator";

/**
 * 初始化流程
 * @registerProxy 註冊代理 
 * @registerMediator 註冊中介 
 */
export class StartCommand extends SimpleCommand {
    public execute(notification: INotification): void {
        // 註冊代理與中介
        this.facade.registerProxy(new SlotProxy());
        this.facade.registerProxy(new MultipleProxy());
        this.facade.registerProxy(new ScoreProxy());
        this.facade.registerProxy(new BetProxy());

        const Main = notification.body;
        this.facade.registerProxy(new FSMProxy(Main));
        this.facade.registerMediator(new LoadMediator(Main.loadScene));
        this.facade.registerMediator(new GameMediator(Main.gameScene));
        this.facade.registerMediator(new BackgroundMediator(Main.backgroundComponent));
        this.facade.registerMediator(new EffectMediator(Main.effectComponent));
        this.facade.registerMediator(new EliminateScoreMediator(Main.eliminateScoreComponent));
        this.facade.registerMediator(new MainInformationMediator(Main.mainInformationComponent));
        this.facade.registerMediator(new TransitionMediator(Main.transitionComponent));
        this.facade.registerMediator(new ButtonMediator(Main.buttonComponent));
        // this.facade.registerMediator(new GameMediator(gameScene.SpinButton));
        // this.facade.registerMediator(new ReelBarMediator(gameScene.ReelBarInstance));
    }
}