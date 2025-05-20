//
//  Notifier.ts
//  PureMVC TypeScript Standard
//
//  Copyright(c) 2024 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD-3-Clause License
//

import {INotifier} from "../../interfaces/INotifier";
import {IFacade} from "../../interfaces/IFacade";
import {Facade} from "../facade/Facade";

/**
 * A Base `Notifier` implementation.
 *
 * `MacroCommand, Command, Mediator` and `Proxy`
 * all have a need to send `Notifications`.
 *
 * The `Notifier` interface provides a common method called
 * `sendNotification` that relieves implementation code of
 * the necessity to actually construct `Notifications`.
 *
 * The `Notifier` class, which all the above-mentioned classes
 * extend, provides an initialized reference to the `Facade`
 * Singleton, which is required for the convenience method
 * for sending `Notifications`, but also eases implementation as these
 * classes have frequent `Facade` interactions and usually require
 * access to the facade anyway.
 *
 * @see {@link Proxy}
 * @see {@link Facade}
 * @see {@link Mediator}
 * @see {@link MacroCommand}
 * @see {@link SimpleCommand}
 *
 * @class Notifier
 */
export class Notifier implements INotifier {

    /**
     * Create and send an `Notification`.
     *
     * Keeps us from having to construct new Notification
     * instances in our implementation code.
     *
     * @param {string} notificationName - The name of the notification to be sent.
     * @param {any} [body] - Optional data to be included with the notification.
     * @param {string} [type] - Optional type of the notification.
     * @returns {void}
     */
    public sendNotification(notificationName: string, body?: any, type?: string): void {
        this.facade.sendNotification(notificationName, body, type);
    }

    /**
     * Return the Singleton Facade instance
     *
     * @returns {IFacade} The facade instance.
     */
    protected facade: IFacade = Facade.getInstance(() => new Facade());

}
