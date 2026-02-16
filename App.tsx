import React, { useState, useCallback, useEffect } from 'react';
import { GamePhase, ACHIEVEMENT_LIST } from './types';
import { PhaseInput } from './components/PhaseInput';
import { PhaseShake } from './components/PhaseShake';
import { PhaseSeasoning } from './components/PhaseSeasoning';
import { PhaseFriesClick } from './components/PhaseFriesClick';
import { PhaseResult } from './components/PhaseResult';
import { CanvasLayer } from './components/CanvasLayer';
import { AchievementPanel } from './components/AchievementPanel';
import { CollectionPanel } from './components/CollectionPanel';

interface ToastData {
  title: string;
  desc: string;
  icon: string;
}

const STORAGE_KEYS = {
  ACHIEVEMENTS: 'potato_achievements',
  COLLECTION: 'potato_fortune_collection'
};

const FORTUNES = [
  // 上上签 (1-15)
  "上上签：薯条炸得刚刚好，生活也是。",
  "上上签：遇见命中注定的那根长薯条。",
  "上上签：今日宜加薪，如果不加，就加份薯条。",
  "上上签：不用顾虑卡路里，今日吃薯无忌。",
  "上上签：你就是那根最脆最完美的薯条。",
  "上上签：此刻的快乐是刚出锅的3分钟。",
  "上上签：这根薯条很长，象征好运绵延不绝。",
  "上上签：所有等待都是为了此刻的酥脆。",
  "上上签：心想事成，正如番茄酱配薯条般完美。",
  "上上签：今日运气爆棚，像刚出炉的薯饼一样金黄。",
  "上上签：万事胜意，脆爽可口。",
  "上上签：你的光芒如同金黄色的外皮般耀眼。",
  "上上签：今日宜大胆尝试，必有回响。",
  "上上签：生活就像蘸酱，甜多于酸。",
  "上上签：好运正在向你飞奔而来，接住！",

  // 大吉 (16-35)
  "大吉：今日宜暴饮暴食，特别是薯条。",
  "大吉：所有薯条都是直的，除了弯的那根更有趣。",
  "大吉：买一送一的好运气即将发生。",
  "大吉：现在的状态：如薯条般金黄耀眼。",
  "大吉：外酥里嫩，此刻的心情刚刚好。",
  "大吉：会有意想不到的美味降临。",
  "大吉：今日宜分享，快乐会加倍。",
  "大吉：此时此刻，你就是世界的主角。",
  "大吉：一切烦恼都将被炸得酥脆然后消失。",
  "大吉：保持热爱，奔赴山海，带上薯条。",
  "大吉：今日灵感迸发，如气泡水般涌现。",
  "大吉：你的笑容比番茄酱还要甜。",
  "大吉：宜见朋友，宜吃大餐。",
  "大吉：好消息正在路上，保持期待。",
  "大吉：生活明朗，万物可爱。",
  "大吉：今日运势：五星好评。",
  "大吉：做自己，你就是限量版口味。",
  "大吉：勇气爆棚，去挑战不可能吧。",
  "大吉：财运亨通，也许会捡到钱（或薯条）。",
  "大吉：今日无忌，百无禁忌。",

  // 上吉 (36-50)
  "上吉：只有一根薯条？不，是一整盒好运。",
  "上吉：刚出锅的热度，足以温暖你的胃和心。",
  "上吉：今天的薯条每一根都蘸满了完美的酱料。",
  "上吉：你的才华像薯条香气一样无法掩盖。",
  "上吉：小确幸正在发生。",
  "上吉：虽然平凡，但不可或缺。",
  "上吉：今日宜慢下来，享受每一口滋味。",
  "上吉：温暖的阳光和热腾腾的食物最配。",
  "上吉：你的努力，终将被看见。",
  "上吉：坚持下去，就像坚持吃到最后一口。",
  "上吉：今日宜打扮，惊艳全场。",
  "上吉：好运就像盐粒，均匀地洒在生活里。",
  "上吉：相信直觉，它会带你找到美味。",
  "上吉：今日宜听歌，心情会变好。",
  "上吉：一切都在慢慢变好。",

  // 中吉 (51-70)
  "中吉：番茄酱管够，快乐加倍。",
  "中吉：吃薯条不沾手，好运跟你走。",
  "中吉：哪怕是碎掉的薯条，也是生活的小确幸。",
  "中吉：偶尔放纵一下，也是对生活的尊重。",
  "中吉：慢点吃，好运就像美味一样需要细细品味。",
  "中吉：不管甜酱辣酱，适合你的就是好酱。",
  "中吉：今日宜摸鱼，休息是为了走更远。",
  "中吉：平平淡淡才是真，脆脆爽爽才是神。",
  "中吉：哪怕只有一点点甜，也是好日子。",
  "中吉：不必焦虑，该熟的都会熟。",
  "中吉：今日宜发呆，给大脑放个假。",
  "中吉：所有的弯路，都是为了遇见更美的风景。",
  "中吉：吃饱了，才有力气减肥。",
  "中吉：生活不易，全靠演技（和零食）。",
  "中吉：今日宜宅，享受独处时光。",
  "中吉：你的温柔，自有力量。",
  "中吉：别急，好事多磨。",
  "中吉：保持微笑，运气不会太差。",
  "中吉：今日宜读一页书，吃一包薯。",
  "中吉：把心放宽，把胃填满。",

  // 吉 (71-80)
  "吉：脆脆的，很安心。",
  "吉：只要有薯条，就没有过不去的坎。",
  "吉：薯条治愈一切不开心。",
  "吉：保持酥脆，切勿疲软。",
  "吉：既然不能改变世界，那就改变口味。",
  "吉：今日宜喝水，排毒养颜。",
  "吉：早点睡，梦里什么都有。",
  "吉：今日宜断舍离，扔掉烦恼。",
  "吉：虽有小波折，终能化险为夷。",
  "吉：安稳即是福。",

  // 特殊/趣味 (81-88)
  "隐藏款：去码头整点薯条。",
  "桃花签：那个愿意把最后一口薯条让给你的人。",
  "桃花签：转角遇到爱（和炸鸡店）。",
  "暴富签：今日含薯量超标，含金量也是。",
  "暴富签：即将实现薯条自由。",
  "暴富签：恭喜发财，大吉大利。",
  "锦鲤签：转发这根薯条，好运连连。",
  "特别签：薯门永存！",
];

const App: React.FC = () => {
  // Global State
  const [phase, setPhase] = useState<GamePhase>(GamePhase.INPUT);
  const [petitionText, setPetitionText] = useState<string>('');
  const [fortuneText, setFortuneText] = useState<string>('');
  
  // Game Logic State
  const [dropTrigger, setDropTrigger] = useState<number>(0);
  const [isThrowing, setIsThrowing] = useState<boolean>(false);
  const [failCount, setFailCount] = useState<number>(0);
  const [isSuccessTransition, setIsSuccessTransition] = useState<boolean>(false);

  // Persistent State (Achievements)
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [collectedFortunes, setCollectedFortunes] = useState<string[]>([]);
  
  // UI State
  const [activeToast, setActiveToast] = useState<ToastData | null>(null);
  const [isAchievementPanelOpen, setIsAchievementPanelOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);

  // --- Load Data from LocalStorage ---
  useEffect(() => {
    try {
      const savedAch = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      const savedCol = localStorage.getItem(STORAGE_KEYS.COLLECTION);
      
      if (savedAch) setUnlockedAchievements(JSON.parse(savedAch));
      if (savedCol) setCollectedFortunes(JSON.parse(savedCol));
    } catch (e) {
      console.error("Failed to load game data", e);
    }
  }, []);

  // --- Achievement Unlock Logic ---
  const unlockAchievement = useCallback((id: string) => {
    setUnlockedAchievements(prev => {
      if (prev.includes(id)) return prev; // Already unlocked

      const next = [...prev, id];
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(next));
      
      // Trigger Toast
      const achDef = ACHIEVEMENT_LIST.find(a => a.id === id);
      if (achDef) {
        setActiveToast({ title: achDef.title, desc: achDef.desc, icon: achDef.icon });
        setTimeout(() => setActiveToast(null), 3000);
      }
      return next;
    });
  }, []);

  // --- Collection Logic ---
  const trackFortuneCollection = useCallback((fortune: string) => {
    setCollectedFortunes(prev => {
      if (prev.includes(fortune)) return prev;

      const next = [...prev, fortune];
      localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(next));
      
      // Check Achievement: Collect 5 "上上签"
      const superLuckCount = next.filter(f => f.startsWith("上上签")).length;
      if (superLuckCount >= 5) {
        unlockAchievement('COLLECT_5');
      }
      return next;
    });
  }, [unlockAchievement]);

  // Phase Transition Handler
  const handlePhaseChange = useCallback((nextPhase: GamePhase) => {
    setPhase(nextPhase);
  }, []);

  // Input Handler for Phase 1
  const handlePetitionSubmit = useCallback((text: string) => {
    setPetitionText(text);
    handlePhaseChange(GamePhase.SHAKE);
  }, [handlePhaseChange]);

  // Handler for Throwing Nuggets
  const handleThrow = useCallback(() => {
    if (isThrowing) return;
    setIsThrowing(true);
    setDropTrigger(Date.now());
  }, [isThrowing]);

  // Handler for Round Completion (CanvasLayer callback)
  const handleRoundComplete = useCallback((success: boolean) => {
    if (success) {
      setIsSuccessTransition(true);
      setTimeout(() => {
        setIsThrowing(false);
        setIsSuccessTransition(false);
        handlePhaseChange(GamePhase.DRAW);
      }, 1000);
    } else {
      setIsThrowing(false);
      // Increment Fail Count
      setFailCount(prev => {
        const newVal = prev + 1;
        // Achievement: Fail 10 Times
        if (newVal >= 10) {
          unlockAchievement('FAIL_10');
        }
        return newVal;
      });
    }
  }, [handlePhaseChange, unlockAchievement]);

  // Handler for generating fortune (Final Success)
  const handleFortuneGenerated = useCallback(() => {
    const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    setFortuneText(randomFortune);
    
    // Track for achievements
    trackFortuneCollection(randomFortune);
    
    handlePhaseChange(GamePhase.SHARE);
  }, [handlePhaseChange, trackFortuneCollection]);

  // Logic for CPS Achievement (Called from PhaseFriesClick)
  const handleCPSAchievement = useCallback(() => {
    unlockAchievement('CPS_8');
  }, [unlockAchievement]);

  // --- RESTART GAME LOGIC ---
  const handleRestart = useCallback(() => {
    // Reset Game State
    setPhase(GamePhase.INPUT);
    setPetitionText('');
    setFortuneText('');
    setDropTrigger(0);
    setIsThrowing(false);
    setIsSuccessTransition(false);
    setFailCount(0); // Reset fail count for "Single Round/Game" achievement tracking
  }, []);

  const renderPhaseContent = () => {
    switch (phase) {
      case GamePhase.INPUT:
        return (
          <PhaseInput 
            onSubmit={handlePetitionSubmit} 
          />
        );
      case GamePhase.SHAKE:
        return (
          <PhaseShake 
            onNext={() => handlePhaseChange(GamePhase.DRAW)} 
            onThrow={handleThrow} 
            disabled={isThrowing}
            isHidden={isSuccessTransition}
          />
        );
      case GamePhase.DRAW:
        return (
          <PhaseSeasoning 
            onNext={() => handlePhaseChange(GamePhase.INTERPRET)}
          />
        );
      case GamePhase.INTERPRET:
        return (
          <PhaseFriesClick 
            onSuccess={handleFortuneGenerated} 
            onAchievementUnlock={handleCPSAchievement}
          />
        );
      case GamePhase.SHARE:
        return (
          <PhaseResult 
             fortune={fortuneText} 
             petition={petitionText}
             onRestart={handleRestart} 
          />
        );
      default:
        return <div className="text-white">Unknown Phase</div>;
    }
  };

  const bgClass = phase === GamePhase.INPUT 
    ? "from-traditional-red via-red-900 to-deep-maroon"
    : "from-[#3a0000] to-black";

  return (
    <div className={`relative w-full h-screen bg-gradient-to-br ${bgClass} transition-colors duration-200 overflow-hidden font-serif`}>
      {/* Background/Canvas Layer */}
      <CanvasLayer 
        active={phase === GamePhase.SHAKE || phase === GamePhase.DRAW} 
        phase={phase}
        dropTrigger={dropTrigger}
        onRoundComplete={handleRoundComplete}
      />

      {/* Main UI Layer */}
      <main className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6">
        
        {/* Top Right Controls - Floating above everything */}
        <div className="absolute top-4 right-4 z-[60] flex gap-3">
           {/* 1. Achievements */}
           <button 
              onClick={() => setIsAchievementPanelOpen(true)}
              className="flex flex-col items-center gap-1 group transition-transform active:scale-95"
              title="我的成就"
            >
               <div className="w-10 h-10 rounded-full bg-black/20 border border-gold-accent/30 flex items-center justify-center backdrop-blur-sm group-hover:bg-gold-accent/20 transition-colors">
                  <span className="text-xl filter drop-shadow-md">🏆</span>
               </div>
               <span className="text-[10px] font-bold text-gold-accent/80 group-hover:text-gold-accent">成就</span>
            </button>

            {/* 2. Collection (New) */}
            <button 
              onClick={() => setIsCollectionOpen(true)}
              className="flex flex-col items-center gap-1 group transition-transform active:scale-95"
              title="薯门图鉴"
            >
               <div className="w-10 h-10 rounded-full bg-black/20 border border-gold-accent/30 flex items-center justify-center backdrop-blur-sm group-hover:bg-gold-accent/20 transition-colors">
                  <span className="text-xl filter drop-shadow-md">📜</span>
               </div>
               <span className="text-[10px] font-bold text-gold-accent/80 group-hover:text-gold-accent">图鉴</span>
            </button>
        </div>

        <h1 className={`absolute top-10 text-gold-accent text-3xl md:text-4xl font-artistic font-bold tracking-widest drop-shadow-lg text-center leading-relaxed transition-opacity duration-500 ${phase === GamePhase.INPUT ? 'opacity-100' : 'opacity-30'}`}>
          薯薯<br/>上上签
        </h1>
        
        <div className={`
            w-full max-w-md rounded-3xl p-8 border 
            flex flex-col items-center relative overflow-hidden mt-12
            transition-all duration-300
            ${phase === GamePhase.INPUT 
               ? 'bg-white/10 backdrop-blur-md border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]' 
               : 'bg-transparent border-transparent shadow-none backdrop-blur-0'} 
        `}>
           <div className={`absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none transition-opacity duration-300 ${phase === GamePhase.INPUT ? 'opacity-100' : 'opacity-0'}`}></div>
           
           <div className="relative z-10 w-full min-h-[300px] flex items-center justify-center">
             {renderPhaseContent()}
           </div>
        </div>

        {/* Achievement Toast (Floating Card) */}
        {activeToast && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] animate-bounce-in pointer-events-none w-64">
             <div className="bg-gradient-to-b from-gold-accent to-yellow-600 text-deep-maroon border-4 border-[#FFF8E1] p-6 rounded-xl shadow-[0_0_50px_rgba(255,215,0,0.8)] flex flex-col items-center text-center">
                <div className="text-5xl mb-2 filter drop-shadow-md">{activeToast.icon}</div>
                <h3 className="text-xl font-bold font-artistic mb-1 tracking-widest">成就解锁</h3>
                <div className="w-full h-px bg-deep-maroon/30 my-2"></div>
                <p className="text-lg font-bold">{activeToast.title}</p>
                <p className="text-xs opacity-80 mt-1 font-sans">{activeToast.desc}</p>
             </div>
          </div>
        )}

        {/* Panels */}
        <AchievementPanel 
           isOpen={isAchievementPanelOpen} 
           onClose={() => setIsAchievementPanelOpen(false)}
           unlockedIds={unlockedAchievements}
        />
        
        <CollectionPanel
           isOpen={isCollectionOpen}
           onClose={() => setIsCollectionOpen(false)}
           collectedFortunes={collectedFortunes}
        />

        <div className="absolute bottom-6 text-[10px] text-white/20 tracking-wider">
          PHASE: {GamePhase[phase]} {phase === GamePhase.SHAKE && `| FAILS: ${failCount}`}
        </div>
      </main>
    </div>
  );
};

export default App;