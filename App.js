import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { createClient } from '@supabase/supabase-js';

// Supabase Bağlantısı
const SUPABASE_URL = 'https://lgjiikseqkoqgfnmredw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_USGf7Zd5PIpfL_V5SHZlLw_L_RGnZzE';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Football-Data.org API
const API_KEY = 'ba0eca6705be489285d57b6554309c2e';

const teamDictionary = {
  "argentina": { tr: "Arjantin", flag: "🇦🇷" }, "brazil": { tr: "Brezilya", flag: "🇧🇷" },
  "france": { tr: "Fransa", flag: "🇫🇷" }, "germany": { tr: "Almanya", flag: "🇩🇪" },
  "spain": { tr: "İspanya", flag: "🇪🇸" }, "portugal": { tr: "Portekiz", flag: "🇵🇹" },
  "england": { tr: "İngiltere", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, "netherlands": { tr: "Hollanda", flag: "🇳🇱" },
  "italy": { tr: "İtalya", flag: "🇮🇹" }, "turkey": { tr: "Türkiye", flag: "🇹🇷" },
  "türkiye": { tr: "Türkiye", flag: "🇹🇷" }, "croatia": { tr: "Hırvatistan", flag: "🇭🇷" },
  "belgium": { tr: "Belçika", flag: "🇧🇪" }, "switzerland": { tr: "İsviçre", flag: "🇨🇭" },
  "denmark": { tr: "Danimarka", flag: "🇩🇰" }, "sweden": { tr: "İsveç", flag: "🇸🇪" },
  "poland": { tr: "Polonya", flag: "🇵🇱" }, "wales": { tr: "Galler", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  "ukraine": { tr: "Ukrayna", flag: "🇺🇦" }, "serbia": { tr: "Sırbistan", flag: "🇷🇸" },
  "austria": { tr: "Avusturya", flag: "🇦🇹" }, "czechia": { tr: "Çekya", flag: "🇨🇿" },
  "czech republic": { tr: "Çekya", flag: "🇨🇿" }, "hungary": { tr: "Macaristan", flag: "🇭🇺" },
  "scotland": { tr: "İskoçya", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" }, "romania": { tr: "Romanya", flag: "🇷🇴" },
  "slovakia": { tr: "Slovakya", flag: "🇸🇰" }, "norway": { tr: "Norveç", flag: "🇳🇴" },
  "republic of ireland": { tr: "İrlanda", flag: "🇮🇪" }, "slovenia": { tr: "Slovenya", flag: "🇸🇮" },
  "greece": { tr: "Yunanistan", flag: "🇬🇷" }, "northern ireland": { tr: "K. İrlanda", flag: "🏴󠁧󠁢󠁮󠁩󠁲󠁿" },
  "finland": { tr: "Finlandiya", flag: "🇫🇮" }, "albania": { tr: "Arnavutluk", flag: "🇦🇱" },
  "iceland": { tr: "İzlanda", flag: "🇮🇸" }, "bosnia and herzegovina": { tr: "Bosna Hersek", flag: "🇧🇦" },
  "georgia": { tr: "Gürcistan", flag: "🇬🇪" }, "montenegro": { tr: "Karadağ", flag: "🇲🇪" },
  "north macedonia": { tr: "K. Makedonya", flag: "🇲🇰" }, "bulgaria": { tr: "Bulgaristan", flag: "🇧🇬" },
  "uruguay": { tr: "Uruguay", flag: "🇺🇾" }, "colombia": { tr: "Kolombiya", flag: "🇨🇴" },
  "peru": { tr: "Peru", flag: "🇵🇪" }, "chile": { tr: "Şili", flag: "🇨🇱" },
  "ecuador": { tr: "Ekvador", flag: "🇪🇨" }, "paraguay": { tr: "Paraguay", flag: "🇵🇾" },
  "venezuela": { tr: "Venezuela", flag: "🇻🇪" }, "bolivia": { tr: "Bolivya", flag: "🇧🇴" },
  "united states": { tr: "ABD", flag: "🇺🇸" }, "usa": { tr: "ABD", flag: "🇺🇸" },
  "mexico": { tr: "Meksika", flag: "🇲🇽" }, "canada": { tr: "Kanada", flag: "🇨🇦" },
  "costa rica": { tr: "Kosta Rika", flag: "🇨🇷" }, "panama": { tr: "Panama", flag: "🇵🇦" },
  "jamaica": { tr: "Jamaika", flag: "🇯🇲" }, "el salvador": { tr: "El Salvador", flag: "🇸🇻" },
  "honduras": { tr: "Honduras", flag: "🇭🇳" },
  "senegal": { tr: "Senegal", flag: "🇸🇳" }, "morocco": { tr: "Fas", flag: "🇲🇦" },
  "nigeria": { tr: "Nijerya", flag: "🇳🇬" }, "egypt": { tr: "Mısır", flag: "🇪🇬" },
  "tunisia": { tr: "Tunus", flag: "🇹🇳" }, "cameroon": { tr: "Kamerun", flag: "🇨🇲" },
  "algeria": { tr: "Cezayir", flag: "🇩🇿" }, "mali": { tr: "Mali", flag: "🇲🇱" },
  "côte d'ivoire": { tr: "Fildişi Sahili", flag: "🇨🇮" }, "ivory coast": { tr: "Fildişi Sahili", flag: "🇨🇮" },
  "burkina faso": { tr: "Burkina Faso", flag: "🇧🇫" }, "ghana": { tr: "Gana", flag: "🇬🇭" },
  "south africa": { tr: "Güney Afrika", flag: "🇿🇦" },
  "cape verde": { tr: "Yeşil Burun Adaları", flag: "🇨🇻" }, "cabo verde": { tr: "Yeşil Burun Adaları", flag: "🇨🇻" },
  "cape verde islands": { tr: "Yeşil Burun Adaları", flag: "🇨🇻" }, 
  "japan": { tr: "Japonya", flag: "🇯🇵" }, "iran": { tr: "İran", flag: "🇮🇷" },
  "korea republic": { tr: "Güney Kore", flag: "🇰🇷" }, "south korea": { tr: "Güney Kore", flag: "🇰🇷" },
  "australia": { tr: "Avustralya", flag: "🇦🇺" }, "qatar": { tr: "Katar", flag: "🇶🇦" },
  "saudi arabia": { tr: "S. Arabistan", flag: "🇸🇦" }, "iraq": { tr: "Irak", flag: "🇮🇶" },
  "united arab emirates": { tr: "BAE", flag: "🇦🇪" }, "uzbekistan": { tr: "Özbekistan", flag: "🇺🇿" },
  "oman": { tr: "Umman", flag: "🇴🇲" }, "china pr": { tr: "Çin", flag: "🇨🇳" },
  "syria": { tr: "Suriye", flag: "🇸🇾" }, "new zealand": { tr: "Yeni Zelanda", flag: "🇳🇿" },
  "jordan": { tr: "Ürdün", flag: "🇯🇴" }
};

const getLocalTeamInfo = (englishName) => {
  if (!englishName) return { name: "Belli Değil", flag: "🏳️" };
  const cleanName = englishName.trim().toLowerCase();
  const foundTeam = teamDictionary[cleanName];
  if (foundTeam) return { name: foundTeam.tr, flag: foundTeam.flag };
  return { name: englishName, flag: "🌍" };
};

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);
  
  const [currentScreen, setCurrentScreen] = useState('home'); 
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiDebugMsg, setApiDebugMsg] = useState('');
  
  const [currentTime, setCurrentTime] = useState(new Date());

  const [predictions, setPredictions] = useState({}); 
  const [allUsersData, setAllUsersData] = useState([]); 
  const [dbLoading, setDbLoading] = useState(false);

  const [viewingUser, setViewingUser] = useState(null); 
  const [selectedMatchForStats, setSelectedMatchForStats] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ==================== GÜNCELLENMİŞ fetchMatches ====================
  const fetchMatches = async () => {
    setLoading(true); setApiDebugMsg('');
    try {
      const response = await fetch("https://api.football-data.org/v4/competitions/2000/matches", {
        method: "GET", headers: { "X-Auth-Token": API_KEY }
      });
      const data = await response.json();
      
      if (data.errorCode) { setApiDebugMsg(`API Hatası: ${data.message}`); setLoading(false); return; }
      if (!data.matches || data.matches.length === 0) { setApiDebugMsg("Turnuva verileri şu an API tarafından sağlanmıyor."); setLoading(false); return; }

      let formattedMatches = data.matches.map((item) => {
        let matchStatus = 'future';
        if (item.status === 'IN_PLAY' || item.status === 'PAUSED') matchStatus = 'live';
        if (item.status === 'FINISHED') matchStatus = 'past';

        const homeInfo = getLocalTeamInfo(item.homeTeam?.name);
        const awayInfo = getLocalTeamInfo(item.awayTeam?.name);

        return {
          id: item.id.toString(), status: matchStatus,
          homeTeam: homeInfo.name, homeFlag: homeInfo.flag,
          awayTeam: awayInfo.name, awayFlag: awayInfo.flag,
          rawDate: item.utcDate,
          dateText: new Date(item.utcDate).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' }),
          actualHomeScore: item.score?.fullTime?.home ?? null,
          actualAwayScore: item.score?.fullTime?.away ?? null,
        };
      });

      formattedMatches = formattedMatches.filter(m => m.homeTeam !== 'Belli Değil' && m.awayTeam !== 'Belli Değil');

      // ==================== YENİ KESİN FİLTRE ====================
      // 20 Haziran 2026 saat 20:00 UTC'den önceki maçlar kaldırılır.
      // Bundan sonraki maçlar bittikten sonra da listede kalır.
      const CUTOFF_TIME = new Date('2026-06-20T12:00:00Z');

      formattedMatches = formattedMatches.filter(m => 
        new Date(m.rawDate).getTime() >= CUTOFF_TIME.getTime()
      );
      // ========================================================

      formattedMatches.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
      
      setMatches(formattedMatches);
    } catch (error) { setApiDebugMsg(`Bağlantı Çöktü: ${error.message}`); }
    setLoading(false);
  };
  // ============================================================

  const fetchDatabase = async () => {
    if (!session) return;
    const { data, error } = await supabase.from('user_predictions').select('*');
    if (data) {
      setAllUsersData(data);
      const myData = data.find(d => d.user_id === session.user.id);
      if (myData) {
        if (myData.predictions) setPredictions(myData.predictions);
        if (myData.full_name) setFullName(myData.full_name); 
      }
    }
  };

  useEffect(() => {
    if (session) fetchDatabase();
  }, [session]);

  useEffect(() => {
    if (currentScreen === 'worldCup' || currentScreen === 'viewUser' || currentScreen === 'leaderboard') {
      fetchMatches();
      fetchDatabase(); 
    }
  }, [currentScreen]);

  const handleAuth = async () => {
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) Alert.alert("Hata", error.message);
    } else {
      if (!fullName.trim()) {
        Alert.alert("Eksik Bilgi", "Lütfen adınızı ve soyadınızı girin.");
        return;
      }
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) Alert.alert("Hata", error.message);
      else {
        if (data?.user) {
           await supabase.from('user_predictions').upsert({
             user_id: data.user.id,
             email: email,
             full_name: fullName,
             predictions: {}
           });
        }
        Alert.alert("Süper!", "Kayıt başarılı, giriş yapılıyor...");
        await supabase.auth.signInWithPassword({ email, password });
      }
    }
  };

  const handleScoreChange = (matchId, team, value) => {
    setPredictions(prev => ({ ...prev, [matchId]: { ...prev[matchId], [team]: value } }));
  };

  const handleSaveAll = async () => {
    setDbLoading(true);
    const { error } = await supabase.from('user_predictions').upsert({
      user_id: session.user.id,
      email: session.user.email,
      full_name: fullName || session.user.email.split('@')[0],
      predictions: predictions
    });
    setDbLoading(false);
    
    if (error) Alert.alert("Hata Oluştu", error.message);
    else {
      Alert.alert("Başarılı", "Tahminlerin veritabanına kaydedildi!");
      fetchDatabase(); 
    }
  };

  const formatCountdown = (diffMs) => {
    const d = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const h = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diffMs / 1000 / 60) % 60);
    const s = Math.floor((diffMs / 1000) % 60);
    let parts = [];
    if (d > 0) parts.push(`${d} Gün`);
    if (h > 0) parts.push(`${h} Saat`);
    if (m > 0) parts.push(`${m} Dakika`);
    parts.push(`${s} Saniye`);
    return `Skor girişine son ${parts.join(' ')}`;
  };

  const getBadgeStyle = (points) => {
    switch (points) {
      case 10: return { color: '#00BFFF', bg: 'rgba(0, 191, 255, 0.2)' }; 
      case 4: return { color: '#00D100', bg: 'rgba(0, 209, 0, 0.2)' };   
      case 2: return { color: '#FFD700', bg: 'rgba(255, 215, 0, 0.2)' }; 
      case 0: return { color: '#FF4444', bg: 'rgba(255, 68, 68, 0.2)' }; 
      default: return { color: '#A0A0A0', bg: 'rgba(160, 160, 160, 0.2)' };
    }
  };

  const calculateMatchPoints = (match, pHome, pAway) => {
    if (!pHome || !pAway || match.actualHomeScore === null) return null;
    const actualH = match.actualHomeScore; const actualA = match.actualAwayScore;
    const predH = parseInt(pHome); const predA = parseInt(pAway);

    const isExact = (actualH === predH && actualA === predA);
    const isResult = ((actualH > actualA && predH > predA) || (actualA > actualH && predA > predH) || (actualH === actualA && predH === predA));

    if (isExact) {
      let exactCount = 0;
      allUsersData.forEach(u => {
        const p = u.predictions?.[match.id];
        if (p && parseInt(p.home) === actualH && parseInt(p.away) === actualA) exactCount++;
      });
      return exactCount === 1 ? 10 : 4;
    }
    if (isResult) return 2;
    return 0; 
  };

  const generatedLeaderboard = allUsersData.map(user => {
    let totalPoints = 0; let exactScore = 0; let correctResult = 0; let singleKnow = 0;
    
    matches.forEach(m => {
      if (m.status === 'past' || m.status === 'live') {
        const p = user.predictions?.[m.id];
        const pts = calculateMatchPoints(m, p?.home, p?.away);
        if (pts !== null) {
          totalPoints += pts;
          if (pts === 10) { singleKnow++; exactScore++; }
          else if (pts === 4) exactScore++;
          else if (pts === 2) correctResult++;
        }
      }
    });

    return {
      id: user.user_id,
      name: user.full_name || user.email.split('@')[0], 
      points: totalPoints, exactScore, correctResult, singleKnow,
      rawPredictions: user.predictions || {}
    };
  }).sort((a, b) => b.points - a.points); 

  const TopNavigationBar = ({ showBack = true }) => (
    <View style={styles.topBar}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {showBack && (
          <TouchableOpacity onPress={() => setCurrentScreen(currentScreen === 'viewUser' ? 'leaderboard' : 'home')} style={{marginRight: 10}}>
            <Text style={styles.navButton}>⬅ Geri</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setCurrentScreen('home')}>
          <Text style={styles.homeNavButton}>🏠 Ana Sayfa</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setCurrentScreen('leaderboard')}>
        <Text style={styles.leaderboardButton}>📊 Puan Durumu</Text>
      </TouchableOpacity>
    </View>
  );

  // ==================== LİDERLİK EKRANI ====================
  if (session && currentScreen === 'leaderboard') {
    return (
      <View style={styles.container}>
        <TopNavigationBar />
        <Text style={styles.title}>Puan Durumu</Text>
        
        {generatedLeaderboard.length === 0 ? (
          <Text style={{color: '#A0A0A0', textAlign: 'center', marginTop: 20}}>Henüz tahmin yapan kimse yok.</Text>
        ) : (
          <ScrollView style={styles.scroll}>
            {generatedLeaderboard.map((user, index) => (
              <TouchableOpacity 
                key={user.id} 
                style={styles.leaderboardRow}
                onPress={() => {
                  if (session && user.id === session.user.id) {
                    setCurrentScreen('worldCup'); // Kendine tıklayınca düzenlenebilir ekrana git
                  } else {
                    setViewingUser(user);
                    setCurrentScreen('viewUser');
                  }
                }}
              >
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                  <Text style={styles.rankText}>{index + 1}.</Text>
                  <Text style={styles.usernameText}>{user.name}</Text>
                  <View style={{flex: 1}} />
                  <Text style={styles.pointsText}>{user.points} Pts</Text>
                </View>
                <View style={styles.statsRow}>
                  <Text style={styles.statBadge}>🎯 Skor: {user.exactScore}</Text>
                  <Text style={styles.statBadge}>✔️ Sonuç: {user.correctResult}</Text>
                  <Text style={styles.statBadge}>🔥 Tek Bilen: {user.singleKnow}</Text>
                </View>
                <Text style={styles.viewProfileHint}>👉 Tahminlerini Gör</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  }

  // ==================== DÜNYA KUPASI / BAŞKASINI GÖRME EKRANI ====================
  if (session && (currentScreen === 'worldCup' || currentScreen === 'viewUser')) {
    const isReadOnly = currentScreen === 'viewUser';
    const activePredictions = isReadOnly ? (viewingUser?.rawPredictions || {}) : predictions;
    const nextUpcomingMatch = matches.find(m => new Date(m.rawDate).getTime() > currentTime.getTime());

    return (
      <View style={styles.container}>
        <TopNavigationBar />

        <Text style={styles.title}>
          {isReadOnly ? `👀 ${viewingUser?.name} Tahminleri` : 'Dünya Kupası'}
        </Text>
        
        {!isReadOnly && (
          <TouchableOpacity style={styles.saveAllButton} onPress={handleSaveAll} disabled={dbLoading}>
            <Text style={styles.saveAllButtonText}>
              {dbLoading ? 'Kaydediliyor...' : '💾 Tüm Tahminleri Kaydet'}
            </Text>
          </TouchableOpacity>
        )}
        
        {loading ? (
          <ActivityIndicator size="large" color="#00D100" style={{marginTop: 50}} />
        ) : apiDebugMsg !== '' ? (
          <Text style={{color: '#FF4444', textAlign: 'center', fontSize: 16}}>{apiDebugMsg}</Text>
        ) : (
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {matches.map((match) => {
              const matchTimeMs = new Date(match.rawDate).getTime();
              const timeDiff = matchTimeMs - currentTime.getTime();
              const isTimeUp = timeDiff <= 0;
              const isLocked = match.status === 'past' || match.status === 'live' || isTimeUp || isReadOnly;
              
              const userPredHome = activePredictions[match.id]?.home;
              const userPredAway = activePredictions[match.id]?.away;
              const earnedPoints = (match.status === 'past' || match.status === 'live') ? calculateMatchPoints(match, userPredHome, userPredAway) : null;
              
              const isNextToStart = !isReadOnly && nextUpcomingMatch && nextUpcomingMatch.id === match.id;

              return (
                <View key={match.id} style={{marginBottom: 15}}>
                  {isNextToStart && timeDiff > 0 && (
                    <View style={styles.countdownBanner}>
                      <Text style={styles.countdownText}>⏳ {formatCountdown(timeDiff)}</Text>
                    </View>
                  )}

                  <View style={[styles.matchCard, isLocked && styles.lockedCard, match.status === 'live' && styles.liveCard, {marginBottom: 0}]}>
                    <Text style={[styles.matchDateText, match.status === 'live' && styles.liveDateText]}>
                      {match.status === 'live' ? `🔴 CANLI` : match.dateText}
                    </Text>
                    
                    <View style={styles.inlineTeamRow}>
                      <Text style={styles.teamTextRight} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.7}>{match.homeFlag} {match.homeTeam}</Text>
                      
                      {isLocked ? (
                         <View style={styles.finishedScoreBox}>
                           <Text style={styles.finishedScoreText}>{userPredHome !== undefined ? userPredHome : '?'}</Text>
                         </View>
                      ) : (
                         <TextInput style={styles.smallScoreInput} keyboardType="numeric" maxLength={2} placeholder="?" placeholderTextColor="#555" value={userPredHome || ''} onChangeText={(val) => handleScoreChange(match.id, 'home', val)} />
                      )}
                      
                      <Text style={styles.dashText}>-</Text>
                      
                      {isLocked ? (
                         <View style={styles.finishedScoreBox}>
                           <Text style={styles.finishedScoreText}>{userPredAway !== undefined ? userPredAway : '?'}</Text>
                         </View>
                      ) : (
                         <TextInput style={styles.smallScoreInput} keyboardType="numeric" maxLength={2} placeholder="?" placeholderTextColor="#555" value={userPredAway || ''} onChangeText={(val) => handleScoreChange(match.id, 'away', val)} />
                      )}
                      
                      <Text style={styles.teamTextLeft} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.7}>{match.awayTeam} {match.awayFlag}</Text>
                    </View>

                    {!isReadOnly && (
                      <TouchableOpacity style={styles.viewOthersBtn} onPress={() => setSelectedMatchForStats(match)}>
                        <Text style={styles.viewOthersText}>👁️ Diğer Tahminleri Gör</Text>
                      </TouchableOpacity>
                    )}

                    {(match.status === 'past' || match.status === 'live') && (
                      <View style={styles.resultInfoBox}>
                        <Text style={match.status === 'live' ? styles.liveResultText : styles.actualResultText}>
                          Gerçek Skor: {match.actualHomeScore} - {match.actualAwayScore}
                        </Text>
                        {earnedPoints !== null && (
                          <View style={[styles.pointsBadge, { backgroundColor: getBadgeStyle(earnedPoints).bg }]}>
                            <Text style={[styles.pointsEarnedText, { color: getBadgeStyle(earnedPoints).color }]}>
                              {earnedPoints > 0 ? '+' : ''}{earnedPoints} Puan
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        <Modal visible={!!selectedMatchForStats} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedMatchForStats?.homeTeam} - {selectedMatchForStats?.awayTeam}</Text>
              <Text style={styles.modalSubTitle}>Yarışmacıların Tahminleri</Text>
              
              <ScrollView style={{maxHeight: 300, width: '100%', marginTop: 15}}>
                {allUsersData.length === 0 && <Text style={{color:'#FFF', textAlign:'center'}}>Henüz kimse tahmin yapmadı.</Text>}
                
                {allUsersData.map(u => {
                  const uName = u.full_name || u.email.split('@')[0];
                  const uPred = u.predictions?.[selectedMatchForStats?.id];
                  const isMe = u.user_id === session.user.id;

                  return (
                    <View key={u.user_id} style={styles.modalRow}>
                      <Text style={[styles.modalUserText, isMe && {color: '#00D100'}]}>{uName} {isMe && "(Sen)"}</Text>
                      {uPred && uPred.home && uPred.away ? (
                        <Text style={styles.modalScoreText}>{uPred.home} - {uPred.away}</Text>
                      ) : (
                        <Text style={styles.modalNoPredText}>Tahmin Yapılmadı</Text>
                      )}
                    </View>
                  );
                })}
              </ScrollView>

              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedMatchForStats(null)}>
                <Text style={styles.modalCloseBtnText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    );
  }

  // ==================== ANA EKRAN ====================
  if (session && currentScreen === 'home') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🏆 Nereye tahmin yapmak istersin?</Text>
        <TouchableOpacity style={[styles.card, styles.activeCard]} onPress={() => setCurrentScreen('worldCup')}><Text style={styles.cardTitle}>🌍 Dünya Kupası</Text><Text style={styles.cardSub}>Kalan maçları tahmin et</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.card, styles.inactiveCard]} onPress={() => Alert.alert("Hooop!", "Kral daha Süper Lig'e var :)")}><Text style={[styles.cardTitle, styles.inactiveText]}>🇹🇷 Trendyol Süper Lig</Text><Text style={[styles.cardSub, styles.inactiveText]}>Yakında...</Text></TouchableOpacity>
        <TouchableOpacity style={{marginTop: 30, alignItems: 'center'}} onPress={() => supabase.auth.signOut()}><Text style={{color: '#FF4444', fontWeight: 'bold'}}>Çıkış Yap</Text></TouchableOpacity>
      </View>
    );
  }

  // ==================== GİRİŞ / KAYIT EKRANI ====================
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>🏆 TahminLig</Text>
        <Text style={styles.subtitle}>{isLogin ? 'Hoş Geldin! Giriş yap.' : 'Kayıt Ol!'}</Text>
      </View>
      <View style={styles.formContainer}>
        
        {!isLogin && (
          <TextInput 
            style={styles.input} 
            placeholder="Ad Soyad" 
            placeholderTextColor="#888" 
            value={fullName} 
            onChangeText={setFullName} 
            autoCapitalize="words"
          />
        )}
        
        <TextInput style={styles.input} placeholder="E-posta" placeholderTextColor="#888" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Şifre" placeholderTextColor="#888" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleAuth}><Text style={styles.buttonText}>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}><Text style={styles.switchText}>{isLogin ? 'Hesabın yok mu? Kayıt Ol' : 'Zaten hesabın var mı? Giriş Yap'}</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 20 },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#00D100', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#A0A0A0', textAlign: 'center' },
  formContainer: { backgroundColor: '#1E1E1E', padding: 25, borderRadius: 15 },
  input: { backgroundColor: '#2C2C2C', color: '#FFF', borderRadius: 8, padding: 15, marginBottom: 15 },
  button: { backgroundColor: '#00D100', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#121212', fontSize: 18, fontWeight: 'bold' },
  switchButton: { marginTop: 20, alignItems: 'center' },
  switchText: { color: '#00D100', fontSize: 14 },
  card: { padding: 25, borderRadius: 12, marginBottom: 20, alignItems: 'center' },
  activeCard: { backgroundColor: '#1E1E1E', borderColor: '#00D100', borderWidth: 2 },
  inactiveCard: { backgroundColor: '#1E1E1E', opacity: 0.5 },
  cardTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
  cardSub: { fontSize: 14, color: '#A0A0A0' },
  inactiveText: { color: '#666' },
  
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 20 },
  navButton: { color: '#FFF', fontSize: 14, fontWeight: 'bold', backgroundColor: '#333', padding: 10, borderRadius: 8, overflow: 'hidden' },
  homeNavButton: { color: '#121212', fontSize: 14, fontWeight: 'bold', backgroundColor: '#00BFFF', padding: 10, borderRadius: 8, overflow: 'hidden' },
  leaderboardButton: { color: '#121212', fontSize: 14, fontWeight: 'bold', backgroundColor: '#00D100', padding: 10, borderRadius: 8, overflow: 'hidden' },
  saveAllButton: { backgroundColor: '#00D100', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  saveAllButtonText: { color: '#121212', fontSize: 16, fontWeight: 'bold' },
  scroll: { flex: 1 },
  
  countdownBanner: { backgroundColor: '#FF8800', padding: 8, borderTopLeftRadius: 12, borderTopRightRadius: 12, alignItems: 'center' },
  countdownText: { color: '#121212', fontSize: 13, fontWeight: 'bold' },
  matchCard: { backgroundColor: '#1E1E1E', paddingVertical: 20, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  lockedCard: { backgroundColor: '#181818', borderColor: '#444' },
  liveCard: { borderColor: '#FF4444', borderWidth: 1.5 }, 
  matchDateText: { color: '#00D100', fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, letterSpacing: 0.5 },
  liveDateText: { color: '#FF4444', fontSize: 14, fontWeight: 'bold', textShadowColor: 'rgba(255, 68, 68, 0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 },
  inlineTeamRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  teamTextRight: { color: '#FFF', fontSize: 16, fontWeight: '600', flex: 1, textAlign: 'right', marginRight: 15 },
  teamTextLeft: { color: '#FFF', fontSize: 16, fontWeight: '600', flex: 1, textAlign: 'left', marginLeft: 15 },
  smallScoreInput: { backgroundColor: '#2C2C2C', color: '#FFF', fontSize: 20, fontWeight: 'bold', textAlign: 'center', width: 45, height: 45, borderRadius: 8 },
  dashText: { color: '#666', fontSize: 20, marginHorizontal: 10, fontWeight: 'bold' },
  
  finishedScoreBox: { backgroundColor: '#333', width: 45, height: 45, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  finishedScoreText: { color: '#A0A0A0', fontSize: 20, fontWeight: 'bold' },
  resultInfoBox: { marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#333', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actualResultText: { color: '#A0A0A0', fontSize: 14, fontWeight: '600' },
  liveResultText: { color: '#FF4444', fontSize: 14, fontWeight: 'bold' },
  pointsBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  pointsEarnedText: { fontSize: 14, fontWeight: 'bold' },

  viewOthersBtn: { marginTop: 15, backgroundColor: '#2C2C2C', padding: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#444' },
  viewOthersText: { color: '#00BFFF', fontSize: 14, fontWeight: 'bold' },

  leaderboardRow: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  rankText: { color: '#00D100', fontSize: 20, fontWeight: 'bold', marginRight: 15 },
  usernameText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  pointsText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#333' },
  statBadge: { color: '#A0A0A0', fontSize: 13, marginRight: 15, backgroundColor: '#2C2C2C', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  viewProfileHint: { color: '#00BFFF', fontSize: 12, marginTop: 10, textAlign: 'right', fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1E1E1E', width: '100%', borderRadius: 15, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  modalSubTitle: { color: '#00D100', fontSize: 14, marginBottom: 10 },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', backgroundColor: '#2C2C2C', padding: 15, borderRadius: 8, marginBottom: 8 },
  modalUserText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  modalScoreText: { color: '#00BFFF', fontSize: 18, fontWeight: 'bold' },
  modalNoPredText: { color: '#FF4444', fontSize: 14, fontStyle: 'italic' },
  modalCloseBtn: { marginTop: 20, backgroundColor: '#FF4444', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  modalCloseBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});