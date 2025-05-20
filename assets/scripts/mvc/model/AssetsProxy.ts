import { Proxy } from '../../puremvc-typescript-standard-framework';

/**
 * 管理所有資源
 */
export class AssetsProxy extends Proxy {
    public static NAME: string = "AssetsProxy";

    constructor(data) {
        super(AssetsProxy.NAME, data);
    }

    public onRegister(): void {
        // console.log("AssetsProxy with all assets:", this.data);
    }
}


