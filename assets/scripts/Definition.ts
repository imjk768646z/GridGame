/**
 * slot共用事件
 */
export enum SlotGameEvent {
    Spin,               //spin
    Stop,               //stop
    AutoSpin,           //auto spin
    Damping,            //Reel撞擊
    SpinDone,           //spin結束
    ShowLine,           //顯示押的線
    ShowMaxLine,        //顯示押的線
    HideLine,           //隱藏的線
    ShowWinFrame,       //顯示贏的框
    HideWinFrame,       //隱藏贏的框
    ShowJP,             //顯示JP動畫
    JPDone,             //JP結束
    UpdateCredit,       //更新credit
    QuickBet,           //押注列表事件
    UpdateBetInfo,      //更新線分資訊
    UpdateJackpot,      //更新彩金
    UpdateTotalWin,     //更新贏分
    UpdateFreeSpin,     //更新FreeSpin次數
    BreakpointFG,       //顯示FG(斷點使用)
    GetWin,             //取分
    CloseEffectAni,     //關閉動畫
}

// # 支援新版滾輪

// 定義統一格式 (支援新版滾輪) 字串為Code判斷用, 數字目前為圖片用 #TODO 等之後統一格式
// export enum SymbolID {
//     H1 = 0,
//     H2 = 1,
//     H3 = 2,
//     H4 = 3,
//     H5 = 4,
//     N1 = 5,
//     N2 = 6,
//     N3 = 7,
//     N4 = 8,
//     N5 = 9,
//     W = 10,
//     F = 11,
// }

// Server轉圖片用的數字編號
// export const ScoketSymbolID = {
// }

// 定義音效別名
export const SoundList = {
    // Bgm
    NGBGM: "Music_Base_Spin",
    FGBGM: "Music_Base_Combos",
    // JP
    JPTriggerBG: "JP_BGM",
    JPCountEnd: "JP_Count_End",
    // BigWin
    BigWinBG: "", //BGM_BIGWIN
    BigWin: "UI_Big_Win",
    MegaWin: "UI_Mega_Win",
    SuperWin: "UI_Super_Win",
    MoneyCount: "UI_Count(Loop)",
    CountEnd: "UI_Double",
    // FG
    FGTriggerBG: "Sound_Alarmbell",
    FGSettleBG: "UI_Final_Orchestra",
    FGSymbolTrigger: "SymbolF",
    //button
    SPINOUT: "Sound_Btn_Spin",
    SPININ: "Sound_SpinStop",
    STOP: "UI_Stop",
    REQULAR: "UI_Button",
    // Reel
    Reels: "reels",
    // 公版 Win UI Sound
    UI_ReTrigger: "UI_ReTrigger",
    UI_Normal_Link: "UI_Normal_Link",
    UI_Listen_Stop: "UI_Listen_Stop",
    UI_Stop: "UI_Stop",
    UI_Listen: "UI_Listen",
    UI_Count_Once: "UI_Count_Once",
    UI_Count_Small: "UI_Count_Small(Loop)",
    // Other todo:待補
    Hit: "Hit",
    JPHit: "JPHit",
    // Effect
    LuBuFire: "Sound_BG_Thor",
    FireBall: "Sound_ThorLighting",
    RunWinScore: "Sound_Base_Scoring",
    RunWinScoreEnd: "Sound_Base_ScoringEnd",
    ShowFrameStart: "Sound_BG_Delete1",
    ShowFrameEnd: "Sound_Symbol_Hit",
    MultipleSymbol: "Sound_Win_F1",
    NGSymbolEliminate: "Sound_BG_Symbol_Delete1",
    MultiplicationEnd: "Sound_F1_WinEnd",
    FreeGameSymbol: "Sound_Win_B1",
    FreeGameTransform: "Sound_Free_SpinStart",
}

// export const LinesData: Array<string> = new Array<string>(
// );

/**
 * 動畫&動作事件名稱
 */
export enum SignalType {
    // # load
    Test,
    Write,
    ShowSymbolFrame,
    ShowSymbolDynamic,         //顯示所有消除中的圖標動畫
    ShowFreeSymbolDynamic,     //顯示FG圖標的動畫
    ShowSingleSymbolDynamic,   //顯示單一圖標的動畫
    ShowMultipleOnReel,        //在滾輪上顯示獲得的倍數(待實作)
    RunScoreOnWinBoard,        //在贏分上顯示倍數滾分(待實作)
    RunScoreOnRemoveBoard,     //在消除贏分上顯示倍數滾分(待實作)
    RunWinScore,               //贏分跑分
    ResetWinScore,             //贏分歸零
    ShowSymbolEliminate,       //顯示消除動畫
    ShowEliminateScore,        //顯示消除贏分
    CloseEliminateScore,       //關閉消除贏分
    AdditionEliminateScore,          //計算消除贏分(加上前一個分數) //todo: 這個沒用到可以刪除
    MultiplicationEliminateScore,    //計算消除贏分(乘以倍數)
    RunEliminateScore,         //消除贏分跑分(NG階段)
    RunEliminateScoreFGState,  //消除贏分跑分(FG階段)
    EliminateScoreMoveLeft,    //消除贏分往左移動
    EliminateScoreMoveBack,    //消除贏分移動至原點
    ShowMathematicalSymbol,    //顯示運算符號
    CloseMathematicalSymbol,   //關閉運算符號
    ShowMultipleValue,         //顯示倍數數字
    MultipleValueMoveLeftAndDisappear, //倍數數字往左移動並消失
    RemoveSymbol,
    FillSymbol,
    ShowLuBuFire,
    ShowFireBall,
    UpdateMultipleText,
    UpdateCredit,
    CoverMultiple,              //將倍數預製體覆蓋在Symbol上
    CloseSymbolMultiple,        //關閉Symbol的倍數標籤
    ChangeMultipleScale,
    ShowMultipleFly,
    ShowEnterFG,                //顯示進入FG畫面(獲得局數)
    CloseEnterFG,
    ShowFeature,                //顯示特色遊戲(節點)
    CloseFeature,
    ShowTriggerText,
    CloseTriggerText,
    ShowRoundText,
    CloseRoundText,
    ShowFGRound,
    CloseFGRound,
    ShowFGTransition,
    CloseFGTransition,
    ShowFGShowWin,
    CloseFGShowWin,
    ShowNGBackground,
    CloseNGBackground,
    ShowFGBackground,
    CloseFGBackground,
    Loading,
    EnableGameScene,
    LoadingSetting,             // 載入 localStorage
    // # Broken or Init (斷點處會自行判斷)
    HideLoading,
    HideCredit,
    StartGame,
    GotoNG,
    GotoFG,
    GotoBG,
    // # text
    TotalWinRunScore,           // 一般贏分滾分 (totalWin)
    TotalWinRunScoreAuto,       // Auto贏分滾分 (totalWin)
    TotalWinRunScoreFree,       // FG贏分滾分(會清空) (totalWin)
    TotalWinRunScoreFreeAccum,  // FG贏分滾分(會累積) (totalWin)
    LineTotalWinRunScore,       // 一般贏分滾分 (line totalWin)
    LineTotalWinRunScoreAuto,   // Auto贏分滾分 (line totalWin)
    CreditAddJGTotalWin,        // 玩家點數 += JG特殊分數
    CreditAddBGTotalWin,        // 玩家點數 += BG特殊分數
    CreditAddFGTotalWin,        // 玩家點數 += FG特殊分數
    ClearTotalWinText,          // 清空總贏分
    OpenUITextFg,               // 顯示FG 介面
    HideFGCountText,            // FG 隱藏FreeSpin文字
    ShowFGCountText,            // FG 顯示FreeSpin文字
    UpdateFgCount,              // 更新次數
    ShowHistoryScoreFG,           // 顯示歷史得分
    // # Background
    BackgroundToNG,             // 背景切換NG
    BackgroundToFG,             // 背景切換FG
    // # Menu
    ShowMenu,
    HideMenu,
    // # Button
    HideButton,          // 隱藏按鈕
    ShowButton,          // 顯示按鈕
    // # line
    ShowWinLine,         // 輪閃贏的線
    ShowWinLineAll,      // 顯示贏的線(ALL)
    HideLine,            // 隱藏贏的線
    FGShowWinLineAll,    // FG顯示贏分
    // # Show Win 
    ShowWinSymbol,       // NG 顯示贏的Symbol
    ShowWinSymbolAll,    // NG 顯示贏的Symbol (靜態)
    FGShowWinSymbol,     // FG 顯示贏的Symbol
    FGShowWinSymbolAll,  // FG 顯示贏的Symbol (靜態)
    ClearSymbol,         // 清除觸發Symbol動畫
    // # Symbol frame
    ShowWinSymbolFrame,  // 顯示贏的邊框 (NG)
    ShowWinSymbolFrameAll, // 顯示贏的邊框ALL
    FGShowWinSymbolFrameAll, // 顯示贏的邊框ALL (FG)
    HideSymbolFrame,        // 隱藏symbol的邊框ALL
    // # JP
    ShowJPSymbolFrame,    //顯示JP邊框
    ShowJPSymbolAni,    // 顯示JP動畫    
    ShowJP,             // 顯示JP動畫
    JPDone,             // JP結束
    // # BigWin
    ShowNGBigWin,          // 顯示BigWin
    ShowFGBigWin,          // 顯示BigWin
    // # FG
    ShowFreeSymbolAni,      // 秀Fg symbol動畫
    ShowFreeSymbolAniFG,      // 秀Fg symbol動畫FG
    ShowFGTriSymbolFrame,   // 觸發 FG Symbol Trigger框
    ShowFGReTriSymbolFrame, // 觸發 FG Symbol ReTrigger框
    HideRollingFS,          // 隱藏滾輪條的靜態Free Symbol(自己算位置)
    TriggerFGTime,       // FG進場
    // TriggerFGFirstCount, // FG進場 顯示FreeSpin文字 備註: 目前不需要, Count text綁在動畫裡面
    ReTriggerAddCount,   // Fg中又中F
    ShowFGComplete,      // 顯示FG結束畫面
    // LogoNgToFg,          // NG到FG (logo)
    // LogoFgToNg,          // FG到NG (logo)
    NGToFgGame,          // Reel NG進入FG (Reel)
    FGToNgGame,          // Reel FG回到NG (Reel) 把FG的滾輪畫面換回原本的NG畫面
    BrokenFGToNgGame,    // 斷點方式回到FG
    // BackNGSoundDelay,    // 播放NG背景音樂 用於FG結算畫面後(延遲效果)
    // # BG Symbol    
    HideRollingBS,          // 隱藏滾輪條的靜態Symbol
    ShowBonusSymbolAni,     // 觸發BonusSymbol動畫
    ShowBonusSymbolFrame,   // 觸發BonusSymbol動畫框
    // BG Action
    TriggerBg,           // 觸發Bonus
    BonusGameWait,       //進入Bonus待機模式 (轉場)
    BonusOpenBtn,        // 開放按鈕可以點擊 (BG)
    BonusSelect,         // 收到結果顯示 寶相金額 (BG)
    BonusComplete,       // 進入結算
    BonusWin,            // 顯示BG贏分動畫
    BonusBroken,         // BG銜接斷點 (BG)
    PlayBonusBackFGAudio, // Bonus回到FG播放FG音樂
    // # other
    // OpenMaskButton,      //開啟遮罩按鈕(全畫面)
    // HideMaskButton,      //隱藏遮罩按鈕(全畫面)
    BackToNgSound,             // JP回到NG Sound
    BackToFgSound,             // JP回到FG Sound
    ReSetOtherMask,       // 重設Reel滾遮罩
    AllReelFadeOut,       // 滾輪畫面漸隱
    AllReelFadeIn,        // 滾輪表畫面漸顯
    // GetWinUpdateCreditNG,    // 更新取分後的點數 (NG)
    // GetWinUpdateCreditFG,    // 更新取分後的點數 (FG)
    UIFreeGameSpin,       // FG Spin後 UI更新Free Count;
    ShowRollingSymbolAll,       //還原滾輪條的靜態Symbol顯示All
    HideNGGirl,           // 隱藏NG女孩
    ShowNGGirl,           // 顯示NG女孩
    HideFGGirl,           // 隱藏FG女孩
    ShowFGGirl,           // 顯示FG女孩
    ShowNGGirlAni,        // 顯示NG女孩(轉場用FGSellet[Complete])
    ShowFGGirlAni,        // 顯示FG女孩(轉場用Trigger)
    FGWinOverClearEft,    // 用來清除小獎動畫(沒清除下一局會繼續堆疊)
}

/**
 * 狀態行為註冊 表現動畫與事件
 * 可設定不同模式的行為事件
 * 此為二維數組, 可併發或順序
 */
export const SignalAction = {
    // 主遊戲
    "NG": {
        "Test": [[SignalType.Test, SignalType.Write]],
        "Load": [
            [SignalType.Loading],
            [SignalType.LoadingSetting],
        ],
        // 初始畫面(例如:可加入自動彈跳此遊戲提示說明事件等)
        // "Init": [], // 已經轉移到Broken那邊判斷
        "Init": [
            [SignalType.EnableGameScene],
            [SignalType.HideLoading],
            [SignalType.GotoNG],
        ],
        "SpinStart": [
            [SignalType.ResetWinScore]
        ],
        "BeforeSpinEnd": [
            [SignalType.ShowLuBuFire]
        ],
        "Remove": [
            [SignalType.ShowEliminateScore, SignalType.AdditionEliminateScore, SignalType.ShowSymbolFrame, SignalType.ShowSymbolDynamic, SignalType.ShowMultipleOnReel, SignalType.RunEliminateScore, SignalType.RunWinScore],
            [SignalType.ShowSymbolEliminate],
            [SignalType.RemoveSymbol, SignalType.FillSymbol, SignalType.ShowLuBuFire, SignalType.ShowFireBall, SignalType.UpdateMultipleText],
        ],
        "MultipleHandle": [
            [SignalType.CoverMultiple, SignalType.CloseSymbolMultiple],
            [SignalType.ShowSingleSymbolDynamic, SignalType.ChangeMultipleScale],
            [SignalType.ShowMultipleFly, SignalType.EliminateScoreMoveLeft, SignalType.ShowMathematicalSymbol],
            [SignalType.ShowMultipleValue],
            [SignalType.CloseMathematicalSymbol, SignalType.EliminateScoreMoveBack, SignalType.MultipleValueMoveLeftAndDisappear],
            [SignalType.MultiplicationEliminateScore],
            [SignalType.RunWinScore]
        ],
        // 轉動收到結果
        "Result": [],
        // 轉動結束觸發
        "SpinDone": [],
        "BeforeShowWin": [
            [SignalType.ShowNGBigWin],
        ],
        // 贏分
        "Win": [
            // [SignalType.ShowWinLine, SignalType.ShowWinSymbolFrame, SignalType.ShowWinSymbol, SignalType.TotalWinRunScore],
            [SignalType.UpdateCredit]
        ],
        "AllComplete": [
            [SignalType.CloseEliminateScore]
        ],
        "AutoWin": [
            [SignalType.ShowWinLineAll, SignalType.ShowWinSymbolFrameAll, SignalType.ShowWinSymbolAll, SignalType.TotalWinRunScoreAuto],
        ],
        // 特殊
        "WinExtra": [],
        // 沒中
        "NoWin": [],
        // ReSpin
        "BeforeReSpin": [],
        // Bonus
        "BonusEnter": [],
        "BonusIdle": [],
        "BonusPlay": [],
        "BonusComplete": [],
        // Jackpot
        "JackpotTrigger": [
            [SignalType.ShowJPSymbolAni, SignalType.ShowJPSymbolFrame],
            [SignalType.ShowJP, SignalType.ShowRollingSymbolAll, SignalType.ClearSymbol, SignalType.HideSymbolFrame],
            [SignalType.BackToNgSound],
        ],
    },
    // 免費模式 
    "FG": {
        "TriggerFG": [
            [SignalType.ShowFeature, SignalType.ShowTriggerText, SignalType.ShowFreeSymbolDynamic, SignalType.ShowEliminateScore, SignalType.RunEliminateScoreFGState, SignalType.RunWinScore],
            [SignalType.ShowEnterFG],
            [SignalType.ShowFGTransition],
            [SignalType.CloseNGBackground, SignalType.ShowFGBackground, SignalType.CloseEnterFG, SignalType.CloseFGTransition]
        ],
        // 轉動前觸發
        "BeforeSpin": [
            [SignalType.CloseTriggerText, SignalType.ShowRoundText, SignalType.ShowFGRound]
        ],
        "Remove": [
            [SignalType.ShowEliminateScore, SignalType.AdditionEliminateScore, SignalType.ShowSymbolFrame, SignalType.ShowSymbolDynamic, SignalType.ShowMultipleOnReel, SignalType.RunEliminateScoreFGState, SignalType.RunWinScore],
            [SignalType.ShowSymbolEliminate],
            [SignalType.RemoveSymbol, SignalType.FillSymbol, SignalType.ShowLuBuFire, SignalType.ShowFireBall, SignalType.UpdateMultipleText],
        ],
        "MultipleHandle": [
            [SignalType.CoverMultiple, SignalType.CloseSymbolMultiple],
            [SignalType.ShowSingleSymbolDynamic, SignalType.ChangeMultipleScale],
            [SignalType.ShowMultipleFly, SignalType.EliminateScoreMoveLeft, SignalType.ShowMathematicalSymbol],
            [SignalType.ShowMultipleValue],
            [SignalType.CloseMathematicalSymbol, SignalType.EliminateScoreMoveBack, SignalType.MultipleValueMoveLeftAndDisappear],
            [SignalType.MultiplicationEliminateScore],
            [SignalType.RunWinScore]
        ],
        // 轉動收到結果
        "Result": [],
        // 轉動結束觸發
        "SpinDone": [[SignalType.ShowFGBigWin, SignalType.ShowFGCountText]],
        // 轉動結束在秀分前
        "BeforeShowWin": [
        ],
        "ShowWin": [
            [SignalType.ShowFGShowWin]
        ],
        // 贏分
        "Win": [
            // [SignalType.ShowFGCountText],
            // [SignalType.FGShowWinLineAll, SignalType.FGShowWinSymbolAll, SignalType.FGShowWinSymbolFrameAll, SignalType.TotalWinRunScoreFreeAccum],
            // [SignalType.HideSymbolFrame, SignalType.ShowRollingSymbolAll, SignalType.ClearSymbol, SignalType.ReSetOtherMask],
        ],
        "AllComplete": [
            [SignalType.UpdateCredit, SignalType.CloseEliminateScore, SignalType.CloseFGShowWin, SignalType.CloseFeature, SignalType.CloseFGRound, SignalType.CloseRoundText, SignalType.CloseFGBackground, SignalType.ShowNGBackground]
        ],
        "Idle": [
            // [ SignalType.CreditAddFGTotalWin ], // 目前改用累積在TotalWin那邊
            [SignalType.FGWinOverClearEft],   // 清除小獎閃爍動畫(程式控)
        ],
        "NoWin": [],
        // ReSpin
        "BeforeReSpin": [],
        "FirstTriggerEnterFg": [
            [SignalType.ShowFreeSymbolAni, SignalType.HideRollingFS, SignalType.ShowFGTriSymbolFrame],
            [SignalType.ClearSymbol, SignalType.TriggerFGTime, SignalType.NGToFgGame, SignalType.ShowRollingSymbolAll, SignalType.HideSymbolFrame],
            [SignalType.HideButton, SignalType.BackgroundToFG, SignalType.ShowFGGirlAni, SignalType.ShowFGCountText],
            [SignalType.HideNGGirl],
        ],
        "ReTrigger": [
            [SignalType.ShowFreeSymbolAni, SignalType.HideRollingFS, SignalType.ShowFGReTriSymbolFrame],
            [SignalType.ReTriggerAddCount, SignalType.ClearSymbol, SignalType.ShowRollingSymbolAll, SignalType.HideSymbolFrame],
        ],
        "FreeSettleComplete": [
            [SignalType.ShowFGComplete],
            [SignalType.HideFGGirl],
            [SignalType.AllReelFadeOut, SignalType.ShowButton, SignalType.HideFGCountText, SignalType.BackgroundToNG],
            [SignalType.FGToNgGame],
            [SignalType.AllReelFadeIn],
            [SignalType.ShowNGGirlAni],
        ],
        // Bonus
        "BonusEnter": [],
        "BonusIdle": [],
        "BonusPlay": [],
        "BonusComplete": [],
        // Jackpot
        "JackpotTrigger": [
            [SignalType.ShowJPSymbolAni],
            [SignalType.ShowJP, SignalType.ShowRollingSymbolAll, SignalType.ClearSymbol],
            [SignalType.BackToFgSound],
        ],
    },
    "BG": {
        "BonusEnter": [
            [SignalType.TriggerBg],
            [SignalType.ShowBonusSymbolAni]
        ],
        "BonusIdle": [
            [SignalType.BonusGameWait], // 打開黑幕，設置Bonus Symbol按鈕方法
        ],
        "BonusPlay": [
            [SignalType.BonusSelect], // 收到封包後顯示選擇內容
        ],
        "BonusComplete": [
            [SignalType.BonusComplete],
        ],
    }
}

// 假滾輪資料
export const reelFakeRangeData: Array<Array<string>> = new Array<Array<string>>(
    // 第1輪 特色 此款遊戲第一個滾輪沒有W
    ["N1", "N2", "N3", "N1", "H4", "N4", "N4", "H4", "H3", "H1", "N2", "H4", "H4", "H2", "N4", "N1", "N4", "N3", "N4", "N4", "N1", "N3", "S1", "N4", "N4", "H2", "N4", "N3", "N2", "N4", "S1", "N4", "H1", "N2", "N3", "N4", "N4", "N4", "H1", "N2", "N3"],
    // 第2輪
    ["H2", "N4", "H3", "H3", "N4", "S1", "N3", "N4", "N4", "H2", "H3", "N4", "N4", "W", "N4", "N4", "H3", "N3", "H3", "S1", "N3", "N4", "H1", "N4", "N2", "W", "H4", "H3", "N4", "N4", "N3", "N4", "H1", "H3", "N4", "N4", "N2", "S1", "N4", "N4", "N4", "N4", "N4", "N3", "H2", "N3"],
    // 第3輪
    ["H1", "N4", "N4", "H3", "N4", "S1", "N3", "N4", "N4", "H2", "H3", "N4", "N4", "W", "H4", "N4", "N4", "H3", "N3", "H3", "S1", "N3", "N4", "H1", "N3", "N2", "W", "H4", "H3", "N4", "N4", "N3", "N4", "H1", "H3", "N4", "N4", "N2", "S1", "N4", "N4", "N4", "N4", "N4", "N3", "H2", "N3"],
    // 第4輪
    ["H2", "N4", "N4", "H3", "N4", "S1", "N3", "N4", "N4", "H2", "H3", "N4", "N4", "W", "N4", "N4", "H3", "N3", "H3", "S1", "N3", "N4", "H1", "N3", "N2", "W", "H4", "H4", "H3", "N4", "N4", "N3", "N4", "H1", "H3", "N4", "N4", "N2", "S1", "N4", "N4", "N4", "N4", "N4", "N3", "H2", "N3"],
    // 第5輪
    ["N1", "N2", "W", "N3", "N4", "H1", "N2", "N3", "H2", "N4", "H3", "N3", "N3", "H4", "N4", "N4", "H1", "H1", "H1", "N4", "N3", "N4", "N3", "N2", "N1", "N4", "H2", "H2", "S1", "H2", "N4", "N3", "N3", "N4", "N4", "N2", "N1", "H3", "H3", "H3", "N2", "N2", "W", "W", "N1", "N1", "N1", "N2", "N3", "S1", "N1", "H4", "N3", "N4", "H4", "H4", "H4", "N2", "N2", "N2", "W", "W", "W", "N3", "N3", "N3", "N4", "N4", "N4", "N3", "N4"]
);

export type ReelInfo = {
    NgSoundValue: number,
    FgSoundValue: number,
    SymbolHeight: number,
    SymbolWidth: number,
    SymbolSpaceY: number,
    //滾輪是否剪裁(因應W及H超過大小需offset才能對準，所以要取消trim)
    Trim: boolean,
    // 滾輪數與軸高數量
    ReelRow: Array<number>,
    // 滾輪 可視畫面 以外的 Reel 上下多1顆symbol
    SymbolUpdownCount: number,
    // 設定可取代的W
    ReplaceWild: Array<number>,
    // 註冊Wild對象
    WildSymbolList: Array<string>,
    // 秀全線贏分時間
    ShowWinLineTime: number,
    // 秀分完自動模式進入下一局的時間
    AutoNextSpinTime: number,
    // 輪閃每次撥放時間
    NGSymbolAnimTime: number,
    // Free秀全線時間
    FGShowWinLineTime: number,
    // 分數階段倍數
    StepScoreOdd: Array<number>,
    // 階段緩衝變大
    StepEaseOpen: boolean,
    // 彩金滾分時間
    JackPotPlayTime: number,
    //symbol動畫對象列表 0: no, 1: anim, 2: spine
    SymbolAnim: {},
};