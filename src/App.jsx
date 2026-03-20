import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "march-madness-full-tracker-v4";

const initialOwners = [
  {
    owners: "Jones/Joosart",
    teamName: "Adero Mafia",
    picks: [
      { seed: 3, team: "Virginia" },
      { seed: 3, team: "Gonzaga" },
      { seed: 5, team: "St John's" },
      { seed: 7, team: "Kentucky" },
      { seed: 10, team: "Texas A&M" },
      { seed: 6, team: "Louisville" },
      { seed: 14, team: "Penn" },
      { seed: 15, team: "Queens N.C." },
    ],
  },
  {
    owners: "Walsh/Huhn",
    teamName: "Team Tuna",
    picks: [
      { seed: 1, team: "Florida" },
      { seed: 2, team: "Iowa State" },
      { seed: 5, team: "Vanderbilt" },
      { seed: 5, team: "Texas Tech" },
      { seed: 8, team: "Ohio State" },
      { seed: 9, team: "Utah State" },
      { seed: 13, team: "Hawaii" },
      { seed: 16, team: "Prairie View / Lehigh" },
    ],
  },
  {
    owners: "B. Diehl/Allen",
    teamName: "Havesupai",
    picks: [
      { seed: 2, team: "UConn" },
      { seed: 2, team: "Purdue" },
      { seed: 6, team: "BYU" },
      { seed: 11, team: "Troy" },
      { seed: 7, team: "St Mary's" },
      { seed: 8, team: "Georgia" },
      { seed: 15, team: "Tennessee State" },
      { seed: 16, team: "UMBC / Howard" },
    ],
  },
  {
    owners: "Purnell/Taylor",
    teamName: "Team Dei",
    picks: [
      { seed: 11, team: "VCU" },
      { seed: 10, team: "Santa Clara" },
      { seed: 10, team: "Missouri" },
      { seed: 11, team: "St. Florida" },
      { seed: 8, team: "Villanova" },
      { seed: 13, team: "Cal Baptist" },
      { seed: 12, team: "High Point" },
      { seed: 15, team: "Idaho" },
    ],
  },
  {
    owners: "Mitchell/K. Diehl",
    teamName: "Rehabilitators",
    picks: [
      { seed: 2, team: "Houston" },
      { seed: 3, team: "Michigan State" },
      { seed: 4, team: "Arkansas" },
      { seed: 9, team: "Iowa" },
      { seed: 12, team: "Akron" },
      { seed: 11, team: "Texas / NC State" },
      { seed: 14, team: "Wright State" },
      { seed: 14, team: "Kennesaw State" },
    ],
  },
  {
    owners: "Samuelson/Samuelson",
    teamName: "Milk Duds",
    picks: [
      { seed: 1, team: "Duke" },
      { seed: 4, team: "Alabama" },
      { seed: 3, team: "Illinois" },
      { seed: 12, team: "McNeese" },
      { seed: 14, team: "N.D. State" },
      { seed: 12, team: "N. Iowa" },
      { seed: 16, team: "Long Island" },
    ],
  },
  {
    owners: "Solvine/Davis",
    teamName: "Double D's",
    picks: [
      { seed: 1, team: "Arizona" },
      { seed: 4, team: "Kansas" },
      { seed: 4, team: "Nebraska" },
      { seed: 6, team: "Tennessee" },
      { seed: 8, team: "Clemson" },
      { seed: 9, team: "St. Louis" },
      { seed: 10, team: "UCF" },
      { seed: 16, team: "Siena" },
    ],
  },
  {
    owners: "Owensby/Goldan",
    teamName: "OG's",
    picks: [
      { seed: 1, team: "Michigan" },
      { seed: 6, team: "N. Carolina" },
      { seed: 7, team: "Miami FL" },
      { seed: 7, team: "UCLA" },
      { seed: 11, team: "Miami (OH) / SMU" },
      { seed: 9, team: "TCU" },
      { seed: 13, team: "Hofstra" },
      { seed: 5, team: "Wisconsin" },
      { seed: 15, team: "Furman" },
    ],
  },
];

const basePoints = {
  r64: 2,
  r32: 2,
  r16: 4,
  r8: 1,
  r4: 3,
  champ: 5,
};

const roundOrder = ["r64", "r32", "r16", "r8", "r4", "champ"];
const roundLabels = {
  r64: "Round of 64",
  r32: "Round of 32",
  r16: "Sweet 16",
  r8: "Elite 8",
  r4: "Final Four",
  champ: "Championship",
};

const defaultGames = [
  { id: 1, round: "r64", region: "East", teamA: "Duke", seedA: 1, teamB: "Siena", seedB: 16, winner: "Duke" },
  { id: 2, round: "r64", region: "East", teamA: "Ohio State", seedA: 8, teamB: "TCU", seedB: 9, winner: "TCU" },
  { id: 3, round: "r64", region: "East", teamA: "St. John's", seedA: 5, teamB: "Northern Iowa", seedB: 12, winner: "" },
  { id: 4, round: "r64", region: "East", teamA: "Kansas", seedA: 4, teamB: "Cal Baptist", seedB: 13, winner: "" },
  { id: 5, round: "r64", region: "East", teamA: "Louisville", seedA: 6, teamB: "South Florida", seedB: 11, winner: "" },
  { id: 6, round: "r64", region: "East", teamA: "Michigan State", seedA: 3, teamB: "North Dakota State", seedB: 14, winner: "" },
  { id: 7, round: "r64", region: "East", teamA: "UCLA", seedA: 7, teamB: "UCF", seedB: 10, winner: "" },
  { id: 8, round: "r64", region: "East", teamA: "UConn", seedA: 2, teamB: "Furman", seedB: 15, winner: "" },

  { id: 9, round: "r64", region: "West", teamA: "Arizona", seedA: 1, teamB: "Long Island", seedB: 16, winner: "" },
  { id: 10, round: "r64", region: "West", teamA: "Villanova", seedA: 8, teamB: "Utah State", seedB: 9, winner: "" },
  { id: 11, round: "r64", region: "West", teamA: "Wisconsin", seedA: 5, teamB: "High Point", seedB: 12, winner: "High Point" },
  { id: 12, round: "r64", region: "West", teamA: "Arkansas", seedA: 4, teamB: "Hawaii", seedB: 13, winner: "" },
  { id: 13, round: "r64", region: "West", teamA: "BYU", seedA: 6, teamB: "Texas", seedB: 11, winner: "" },
  { id: 14, round: "r64", region: "West", teamA: "Gonzaga", seedA: 3, teamB: "Kennesaw State", seedB: 14, winner: "" },
  { id: 15, round: "r64", region: "West", teamA: "Miami (FL)", seedA: 7, teamB: "Missouri", seedB: 10, winner: "" },
  { id: 16, round: "r64", region: "West", teamA: "Purdue", seedA: 2, teamB: "Queens N.C.", seedB: 15, winner: "" },

  { id: 17, round: "r64", region: "South", teamA: "Florida", seedA: 1, teamB: "Prairie View", seedB: 16, winner: "" },
  { id: 18, round: "r64", region: "South", teamA: "Clemson", seedA: 8, teamB: "Iowa", seedB: 9, winner: "" },
  { id: 19, round: "r64", region: "South", teamA: "Vanderbilt", seedA: 5, teamB: "McNeese", seedB: 12, winner: "Vanderbilt" },
  { id: 20, round: "r64", region: "South", teamA: "Nebraska", seedA: 4, teamB: "Troy", seedB: 13, winner: "" },
  { id: 21, round: "r64", region: "South", teamA: "North Carolina", seedA: 6, teamB: "VCU", seedB: 11, winner: "VCU" },
  { id: 22, round: "r64", region: "South", teamA: "Illinois", seedA: 3, teamB: "Penn", seedB: 14, winner: "Illinois" },
  { id: 23, round: "r64", region: "South", teamA: "Saint Mary's", seedA: 7, teamB: "Texas A&M", seedB: 10, winner: "Texas A&M" },
  { id: 24, round: "r64", region: "South", teamA: "Houston", seedA: 2, teamB: "Idaho", seedB: 15, winner: "Houston" },

  { id: 25, round: "r64", region: "Midwest", teamA: "Michigan", seedA: 1, teamB: "Howard", seedB: 16, winner: "Michigan" },
  { id: 26, round: "r64", region: "Midwest", teamA: "Georgia", seedA: 8, teamB: "St. Louis", seedB: 9, winner: "" },
  { id: 27, round: "r64", region: "Midwest", teamA: "Texas Tech", seedA: 5, teamB: "Akron", seedB: 12, winner: "" },
  { id: 28, round: "r64", region: "Midwest", teamA: "Alabama", seedA: 4, teamB: "Hofstra", seedB: 13, winner: "" },
  { id: 29, round: "r64", region: "Midwest", teamA: "Tennessee", seedA: 6, teamB: "Miami (OH)", seedB: 11, winner: "" },
  { id: 30, round: "r64", region: "Midwest", teamA: "Virginia", seedA: 3, teamB: "Wright State", seedB: 14, winner: "" },
  { id: 31, round: "r64", region: "Midwest", teamA: "Kentucky", seedA: 7, teamB: "Santa Clara", seedB: 10, winner: "Kentucky" },
  { id: 32, round: "r64", region: "Midwest", teamA: "Iowa State", seedA: 2, teamB: "Tennessee State", seedB: 15, winner: "" },

  { id: 33, round: "r32", region: "East", teamA: "Duke", seedA: 1, teamB: "TCU", seedB: 9, winner: "" },
  { id: 34, round: "r32", region: "East", teamA: "Louisville", seedA: 6, teamB: "Michigan State", seedB: 3, winner: "" },
  { id: 35, round: "r32", region: "West", teamA: "Arizona", seedA: 1, teamB: "High Point", seedB: 12, winner: "" },
  { id: 36, round: "r32", region: "West", teamA: "Texas", seedA: 11, teamB: "Gonzaga", seedB: 3, winner: "" },
  { id: 37, round: "r32", region: "South", teamA: "Vanderbilt", seedA: 5, teamB: "Nebraska", seedB: 4, winner: "" },
  { id: 38, round: "r32", region: "South", teamA: "VCU", seedA: 11, teamB: "Illinois", seedB: 3, winner: "" },
  { id: 39, round: "r32", region: "South", teamA: "Texas A&M", seedA: 10, teamB: "Houston", seedB: 2, winner: "" },
  { id: 40, round: "r32", region: "Midwest", teamA: "Michigan", seedA: 1, teamB: "St. Louis", seedB: 9, winner: "" },
  { id: 41, round: "r16", region: "Final Four Path", teamA: "Florida", seedA: 1, teamB: "Duke", seedB: 1, winner: "" },
  { id: 42, round: "champ", region: "Finals", teamA: "Florida", seedA: 1, teamB: "Duke", seedB: 1, winner: "" },
];

const defaultTrashTalk = [
  { teamName: "Adero Mafia", text: "We didn't draft chalk. We drafted destiny.", votes: 7 },
  { teamName: "Team Dei", text: "If your 2-seed loses to my 11, I need silence for 24 hours.", votes: 12 },
];

function normalizeName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[.'’]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitPickOptions(teamName) {
  const raw = String(teamName || "");
  const slashParts = raw.split("/").map((part) => part.trim()).filter(Boolean);

  const expanded = slashParts.flatMap((part) => {
    const n = normalizeName(part);
    const aliases = new Set([part, n]);

    if (n === "st johns") aliases.add("st. john's");
    if (n === "st johns") aliases.add("saint johns");
    if (n === "saint marys") aliases.add("st marys");
    if (n === "st marys") aliases.add("saint marys");
    if (n === "n carolina") aliases.add("north carolina");
    if (n === "north carolina") aliases.add("n carolina");
    if (n === "nd state") aliases.add("north dakota state");
    if (n === "north dakota state") aliases.add("nd state");
    if (n === "n iowa") aliases.add("northern iowa");
    if (n === "northern iowa") aliases.add("n iowa");
    if (n === "miami fl") aliases.add("miami (fl)");
    if (n === "miami (fl)") aliases.add("miami fl");
    if (n === "hawaii") aliases.add("hawai'i");
    if (n === "hawai'i") aliases.add("hawaii");
    if (n === "st florida") aliases.add("south florida");
    if (n === "south florida") aliases.add("st florida");

    return [...aliases];
  });

  return [...new Set(expanded.map((x) => normalizeName(x)))];
}

function teamMatchesPick(pickTeam, winnerTeam) {
  const winner = normalizeName(winnerTeam);
  return splitPickOptions(pickTeam).includes(winner);
}

function getUpsetBonus(winnerSeed, loserSeed) {
  if (loserSeed === "" || loserSeed === null || loserSeed === undefined) return 0;
  return Number(winnerSeed) > Number(loserSeed)
    ? Number(winnerSeed) - Number(loserSeed)
    : 0;
}

function scorePick(results) {
  let total = 0;
  const breakdown = { r64: 0, r32: 0, r16: 0, r8: 0, r4: 0, champ: 0 };

  for (const round of roundOrder) {
    const entry = results?.[round];
    if (entry?.won) {
      const pts = basePoints[round] + getUpsetBonus(entry.seed, entry.opponentSeed);
      breakdown[round] += pts;
      total += pts;
    }
  }

  return { total, breakdown };
}

function buildResultsFromGames(games) {
  const state = {};

  initialOwners.forEach((owner) => {
    state[owner.teamName] = {};
    owner.picks.forEach((pick) => {
      state[owner.teamName][pick.team] = {
        r64: { won: false, seed: pick.seed, opponentSeed: "" },
        r32: { won: false, seed: pick.seed, opponentSeed: "" },
        r16: { won: false, seed: pick.seed, opponentSeed: "" },
        r8: { won: false, seed: pick.seed, opponentSeed: "" },
        r4: { won: false, seed: pick.seed, opponentSeed: "" },
        champ: { won: false, seed: pick.seed, opponentSeed: "" },
      };
    });
  });

  games.forEach((game) => {
    if (!game.winner) return;

    const loserSeed =
      game.winner === game.teamA
        ? game.seedB
        : game.winner === game.teamB
        ? game.seedA
        : "";

    initialOwners.forEach((owner) => {
      owner.picks.forEach((pick) => {
        if (teamMatchesPick(pick.team, game.winner)) {
          state[owner.teamName][pick.team][game.round] = {
            won: true,
            seed: pick.seed,
            opponentSeed: loserSeed,
          };
        }
      });
    });
  });

  return state;
}

function getTeamProgress(teamName, games) {
  const options = splitPickOptions(teamName);
  let lastRoundReached = null;
  let eliminated = false;
  let appeared = false;

  const orderedGames = [...games].sort(
    (a, b) => roundOrder.indexOf(a.round) - roundOrder.indexOf(b.round)
  );

  for (const game of orderedGames) {
    const teamA = normalizeName(game.teamA);
    const teamB = normalizeName(game.teamB);

    const isInGame = options.includes(teamA) || options.includes(teamB);
    if (!isInGame) continue;

    appeared = true;
    lastRoundReached = game.round;

    if (game.winner) {
      const winner = normalizeName(game.winner);
      if (!options.includes(winner)) {
        eliminated = true;
        break;
      }
    }
  }

  return { lastRoundReached, eliminated, appeared };
}

function getTeamStatusLabel(teamName, games) {
  const progress = getTeamProgress(teamName, games);
  if (progress.eliminated) return "Eliminated";
  if (progress.lastRoundReached) return `Alive (${roundLabels[progress.lastRoundReached]})`;
  if (progress.appeared) return "Alive";
  return "Not yet in tracked games";
}

function encodeState(state) {
  return btoa(encodeURIComponent(JSON.stringify(state)));
}

function decodeState(encoded) {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}

function formatLastUpdated(value) {
  if (!value) return "Not updated yet";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function buttonStyle(active, isMobile = false) {
  return {
    padding: isMobile ? "14px 12px" : "10px 12px",
    borderRadius: 10,
    border: active ? "1px solid #111827" : "1px solid #d1d5db",
    background: active ? "#111827" : "white",
    color: active ? "white" : "#111827",
    cursor: "pointer",
    textAlign: "left",
    fontWeight: 600,
    width: isMobile ? "100%" : "auto",
  };
}

function cardStyle(extra = {}) {
  return {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 16,
    ...extra,
  };
}

function teamRowStyle(isEliminated) {
  if (!isEliminated) {
    return {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
      flexWrap: "wrap",
      background: "#f8fafc",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      padding: 10,
      marginBottom: 8,
    };
  }

  return {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
    background:
      "linear-gradient(135deg, transparent 47%, #dc2626 47%, #dc2626 53%, transparent 53%), #f8fafc",
    border: "1px solid #fecaca",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    opacity: 0.8,
  };
}

function getOwnerTeamNameForSchool(teamName) {
  for (const owner of initialOwners) {
    for (const pick of owner.picks) {
      if (teamMatchesPick(pick.team, teamName)) {
        return owner.teamName;
      }
    }
  }
  return "";
}

function formatBracketTeamLabel(teamName) {
  const draftedBy = getOwnerTeamNameForSchool(teamName);
  return draftedBy ? `${teamName} (${draftedBy})` : teamName;
}

function getRegionGames(games, region, round) {
  return games.filter((game) => game.region === region && game.round === round);
}

function bracketTeamStyle(isWinner, isEliminated) {
  return {
    padding: "10px 12px",
    borderRadius: 10,
    border: isWinner ? "1px solid #111827" : "1px solid #d1d5db",
    background: isWinner ? "#111827" : "#ffffff",
    color: isWinner ? "#ffffff" : "#111827",
    fontWeight: 600,
    fontSize: 14,
    lineHeight: 1.3,
    opacity: isEliminated ? 0.55 : 1,
    position: "relative",
    overflow: "hidden",
  };
}

export default function App() {
  const [tab, setTab] = useState("leaderboard");
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(initialOwners[0].teamName);
  const [viewMode, setViewMode] = useState("public");
  const [games, setGames] = useState(defaultGames);
  const [trashTalkText, setTrashTalkText] = useState("");
  const [trashTalkEntries, setTrashTalkEntries] = useState(defaultTrashTalk);
  const [lastUpdated, setLastUpdated] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const shared = params.get("data");
      const lockParam = params.get("lock");

      if (shared) {
        const decoded = decodeState(shared);
        if (decoded?.games) setGames(decoded.games);
        if (decoded?.trashTalkEntries) setTrashTalkEntries(decoded.trashTalkEntries);
        if (decoded?.lastUpdated) setLastUpdated(decoded.lastUpdated);
      } else {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.games) setGames(saved.games);
          if (saved.viewMode) setViewMode(saved.viewMode);
          if (saved.trashTalkEntries) setTrashTalkEntries(saved.trashTalkEntries);
          if (saved.lastUpdated) setLastUpdated(saved.lastUpdated);
        }
      }

      if (lockParam === "1") setIsLocked(true);
    } catch (e) {
      console.error("Failed to load saved data", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ games, viewMode, trashTalkEntries, lastUpdated })
    );
  }, [games, viewMode, trashTalkEntries, lastUpdated]);

  const results = useMemo(() => buildResultsFromGames(games), [games]);

  const championSchool = useMemo(() => {
    const champGame = games.find((g) => g.round === "champ");
    return champGame?.winner || "";
  }, [games]);

  const scoredOwners = useMemo(() => {
    return initialOwners
      .map((owner) => {
        const totals = owner.picks.map((pick) =>
          scorePick(results[owner.teamName]?.[pick.team])
        );

        const score = totals.reduce((sum, item) => sum + item.total, 0);

        const byRound = roundOrder.reduce((acc, round) => {
          acc[round] = totals.reduce((sum, item) => sum + item.breakdown[round], 0);
          return acc;
        }, {});

        const hasChampion =
          championSchool && owner.picks.some((pick) => teamMatchesPick(pick.team, championSchool));

        const finalFourPoints =
          byRound.r64 + byRound.r32 + byRound.r16 + byRound.r8 + byRound.r4;

        return { ...owner, score, byRound, hasChampion, finalFourPoints };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.hasChampion !== b.hasChampion) return a.hasChampion ? -1 : 1;
        return b.finalFourPoints - a.finalFourPoints;
      });
  }, [results, championSchool]);

  const championOwner = scoredOwners.find((owner) => owner.hasChampion);

  const filteredOwners = useMemo(() => {
    if (!search.trim()) return scoredOwners;
    const q = search.toLowerCase();
    return scoredOwners.filter(
      (owner) =>
        owner.owners.toLowerCase().includes(q) ||
        owner.teamName.toLowerCase().includes(q) ||
        owner.picks.some((pick) => pick.team.toLowerCase().includes(q))
    );
  }, [scoredOwners, search]);

  const activeOwner =
    initialOwners.find((owner) => owner.teamName === selectedTeam) || initialOwners[0];

  function stampUpdate() {
    setLastUpdated(new Date().toISOString());
  }

  function updateGameWinner(gameId, winner) {
    if (isLocked) return;
    setGames((prev) =>
      prev.map((game) =>
        game.id === gameId
          ? { ...game, winner: game.winner === winner ? "" : winner }
          : game
      )
    );
    stampUpdate();
  }

  function resetAll() {
    if (isLocked) return;
    setGames(defaultGames);
    setTrashTalkEntries(defaultTrashTalk);
    stampUpdate();
  }

  function exportData() {
    const blob = new Blob(
      [JSON.stringify({ games, trashTalkEntries, lastUpdated }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "march-madness-pool-data.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function addTrashTalk() {
    if (isLocked) return;
    if (!trashTalkText.trim()) return;
    setTrashTalkEntries((prev) => [
      { teamName: activeOwner.teamName, text: trashTalkText.trim(), votes: 0 },
      ...prev,
    ]);
    setTrashTalkText("");
    stampUpdate();
  }

  function voteTrashTalk(entryIndex) {
    if (isLocked) return;
    setTrashTalkEntries((prev) =>
      prev.map((item, idx) =>
        idx === entryIndex ? { ...item, votes: item.votes + 1 } : item
      )
    );
    stampUpdate();
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Link copied to clipboard!");
    } catch {
      alert(text);
    }
  }

  function generateShareLink(locked = true) {
    const state = { games, trashTalkEntries, lastUpdated };
    const encoded = encodeState(state);
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}${locked ? "&lock=1" : ""}`;
    copyToClipboard(url);
  }

  const totalTrackedGames = games.filter((g) => g.winner).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
        fontFamily: "Arial, sans-serif",
        padding: isMobile ? 10 : 20,
      }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div style={{ ...cardStyle(), marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: isMobile ? 24 : 28 }}>🏀</span>
                <span
                  style={{
                    background: "#111827",
                    color: "white",
                    borderRadius: 999,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  2026 Pool Tracker
                </span>
                <span
                  style={{
                    border: "1px solid #d1d5db",
                    borderRadius: 999,
                    padding: "6px 12px",
                    fontSize: 12,
                  }}
                >
                  {viewMode === "public" ? "Public view" : "Admin view"}
                </span>
                <span
                  style={{
                    border: "1px solid #d1d5db",
                    borderRadius: 999,
                    padding: "6px 12px",
                    fontSize: 12,
                    background: isLocked ? "#fee2e2" : "#ecfccb",
                    borderColor: isLocked ? "#fca5a5" : "#bef264",
                  }}
                >
                  {isLocked ? "Locked link" : "Editable"}
                </span>
              </div>

              <h1 style={{ margin: "0 0 8px", fontSize: isMobile ? 24 : 34, lineHeight: 1.15 }}>
                March Madness Tourney Dashboard
              </h1>
              <p style={{ margin: 0, color: "#475569", fontSize: isMobile ? 14 : 16 }}>
                Click winners manually and let the tracker calculate the scoring.
              </p>
              <div style={{ marginTop: 10, fontSize: 14, color: "#475569" }}>
                Last updated: <strong>{formatLastUpdated(lastUpdated)}</strong>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 12,
                minWidth: 0,
                flex: 1,
                width: "100%",
              }}
            >
              <div style={cardStyle()}>
                <div style={{ fontSize: 12, color: "#64748b" }}>Buy-in</div>
                <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700 }}>$200</div>
              </div>
              <div style={cardStyle()}>
                <div style={{ fontSize: 12, color: "#64748b" }}>Games tracked</div>
                <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700 }}>
                  {totalTrackedGames}/{games.length}
                </div>
              </div>
              <div style={cardStyle()}>
                <div style={{ fontSize: 12, color: "#64748b" }}>Scoring formula</div>
                <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700 }}>Round + upset</div>
              </div>
              <div style={cardStyle()}>
                <div style={{ fontSize: 12, color: "#64748b" }}>Champion holder</div>
                <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700 }}>
                  {championOwner ? championOwner.teamName : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            ...cardStyle(),
            marginBottom: 16,
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, max-content)",
            gap: 8,
          }}
        >
          {["leaderboard", "bracket", "bracket-map", "trash-talk", "rules"].map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={buttonStyle(tab === key, isMobile)}
            >
              {key === "leaderboard"
                ? "Leaderboard"
                : key === "bracket"
                ? "Bracket"
                : key === "bracket-map"
                ? "Bracket Map"
                : key === "trash-talk"
                ? "Trash Talk"
                : "Rules"}
            </button>
          ))}
        </div>

        {tab === "leaderboard" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div style={cardStyle()}>
                <div style={{ fontSize: 13, color: "#64748b" }}>How upset scoring works</div>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>
                  Round points + seed difference
                </div>
                <div style={{ fontSize: 14, color: "#475569", marginTop: 6 }}>
                  Example: 12 over 5 in Round 1 = 2 + 7 = 9 points.
                </div>
              </div>
              <div style={cardStyle()}>
                <div style={{ fontSize: 13, color: "#64748b" }}>Tie-break rule</div>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>
                  Champion holder wins tie
                </div>
                <div style={{ fontSize: 14, color: "#475569", marginTop: 6 }}>
                  If neither tied team has the champ, highest points through Final Four wins.
                </div>
              </div>
              <div style={cardStyle()}>
                <div style={{ fontSize: 13, color: "#64748b" }}>Storage</div>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>
                  Auto-saved in browser
                </div>
                <div style={{ fontSize: 14, color: "#475569", marginTop: 6 }}>
                  Your winner picks stay after refresh on this device.
                </div>
              </div>
              <div style={cardStyle()}>
                <div style={{ fontSize: 13, color: "#64748b" }}>Share mode</div>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>
                  Locked share links
                </div>
                <div style={{ fontSize: 14, color: "#475569", marginTop: 6 }}>
                  Recipients can view but not edit.
                </div>
              </div>
            </div>

            <div style={{ ...cardStyle(), marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: isMobile ? "stretch" : "center",
                  flexWrap: "wrap",
                  marginBottom: 16,
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <h2 style={{ margin: 0 }}>Standings</h2>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search owner, team, or school"
                  style={{
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: 10,
                    minWidth: isMobile ? 0 : 260,
                    width: isMobile ? "100%" : "auto",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ color: "#64748b", textAlign: "left" }}>
                      <th style={{ padding: "10px 8px", borderBottom: "1px solid #e5e7eb" }}>Rank</th>
                      <th style={{ padding: "10px 8px", borderBottom: "1px solid #e5e7eb" }}>Owners</th>
                      <th style={{ padding: "10px 8px", borderBottom: "1px solid #e5e7eb" }}>Team</th>
                      <th style={{ padding: "10px 8px", borderBottom: "1px solid #e5e7eb" }}>64</th>
                      <th style={{ padding: "10px 8px", borderBottom: "1px solid #e5e7eb" }}>32</th>
                      <th style={{ padding: "10px 8px", borderBottom: "1px solid #e5e7eb" }}>16</th>
                      <th style={{ padding: "10px 8px", borderBottom: "1px solid #e5e7eb" }}>8</th>
                      <th style={{ padding: "10px 8px", borderBottom: "1px solid #e5e7eb" }}>4</th>
                      <th style={{ padding: "10px 8px", borderBottom: "1px solid #e5e7eb" }}>Champ</th>
                      <th style={{ padding: "10px 8px", borderBottom: "1px solid #e5e7eb" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOwners.map((owner, index) => (
                      <tr key={owner.teamName}>
                        <td style={{ padding: "12px 8px", borderBottom: "1px solid #f1f5f9" }}>
                          {index === 0 ? "👑 " : index < 3 ? "🏅 " : ""}
                          {index + 1}
                        </td>
                        <td style={{ padding: "12px 8px", borderBottom: "1px solid #f1f5f9" }}>{owner.owners}</td>
                        <td style={{ padding: "12px 8px", borderBottom: "1px solid #f1f5f9" }}>{owner.teamName}</td>
                        <td style={{ padding: "12px 8px", borderBottom: "1px solid #f1f5f9" }}>{owner.byRound.r64}</td>
                        <td style={{ padding: "12px 8px", borderBottom: "1px solid #f1f5f9" }}>{owner.byRound.r32}</td>
                        <td style={{ padding: "12px 8px", borderBottom: "1px solid #f1f5f9" }}>{owner.byRound.r16}</td>
                        <td style={{ padding: "12px 8px", borderBottom: "1px solid #f1f5f9" }}>{owner.byRound.r8}</td>
                        <td style={{ padding: "12px 8px", borderBottom: "1px solid #f1f5f9" }}>{owner.byRound.r4}</td>
                        <td style={{ padding: "12px 8px", borderBottom: "1px solid #f1f5f9" }}>{owner.byRound.champ}</td>
                        <td
                          style={{
                            padding: "12px 8px",
                            borderBottom: "1px solid #f1f5f9",
                            fontWeight: 700,
                          }}
                        >
                          {owner.score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 12,
              }}
            >
              {filteredOwners.map((owner) => (
                <div key={owner.teamName} style={cardStyle()}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      marginBottom: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{owner.teamName}</div>
                      <div style={{ fontSize: 14, color: "#64748b" }}>{owner.owners}</div>
                    </div>
                    <div
                      style={{
                        borderRadius: 999,
                        background: "#111827",
                        color: "white",
                        padding: "8px 12px",
                        fontWeight: 700,
                        height: "fit-content",
                      }}
                    >
                      {owner.score} pts
                    </div>
                  </div>

                  {owner.picks.map((pick) => {
                    const progress = getTeamProgress(pick.team, games);

                    return (
                      <div key={pick.team} style={teamRowStyle(progress.eliminated)}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontWeight: 600, wordBreak: "break-word" }}>{pick.team}</div>
                          <div style={{ fontSize: 12, color: "#64748b" }}>
                            Seed {pick.seed} • {getTeamStatusLabel(pick.team, games)}
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                          {scorePick(results[owner.teamName]?.[pick.team]).total} pts
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "bracket" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 2fr) minmax(320px, 1fr)",
              gap: 16,
            }}
          >
            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Manual Winner Entry</h2>

              {roundOrder.map((round) => {
                const roundGames = games.filter((game) => game.round === round);
                if (!roundGames.length) return null;

                return (
                  <div key={round} style={{ marginBottom: 20 }}>
                    <h3 style={{ marginBottom: 12 }}>{roundLabels[round]}</h3>

                    {roundGames.map((game) => (
                      <div
                        key={game.id}
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: 14,
                          padding: 14,
                          marginBottom: 12,
                          opacity: isLocked ? 0.9 : 1,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 10,
                            alignItems: "center",
                            marginBottom: 10,
                            flexWrap: "wrap",
                          }}
                        >
                          <div style={{ fontSize: 12, textTransform: "uppercase", color: "#64748b" }}>
                            {game.region}
                          </div>
                          <div
                            style={{
                              borderRadius: 999,
                              border: "1px solid #d1d5db",
                              padding: "4px 10px",
                              fontSize: 12,
                            }}
                          >
                            {game.winner ? "Winner set" : "Pending"}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
                            gap: 10,
                          }}
                        >
                          <button
                            disabled={isLocked}
                            onClick={() => updateGameWinner(game.id, game.teamA)}
                            style={{
                              ...buttonStyle(game.winner === game.teamA, isMobile),
                              cursor: isLocked ? "not-allowed" : "pointer",
                              opacity: isLocked ? 0.7 : 1,
                            }}
                          >
                            <div style={{ fontSize: 12, opacity: 0.8 }}>Seed {game.seedA}</div>
                            <div>{game.teamA}</div>
                          </button>

                          <button
                            disabled={isLocked}
                            onClick={() => updateGameWinner(game.id, game.teamB)}
                            style={{
                              ...buttonStyle(game.winner === game.teamB, isMobile),
                              cursor: isLocked ? "not-allowed" : "pointer",
                              opacity: isLocked ? 0.7 : 1,
                            }}
                          >
                            <div style={{ fontSize: 12, opacity: 0.8 }}>Seed {game.seedB}</div>
                            <div>{game.teamB}</div>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Controls</h2>

              <div style={{ ...cardStyle({ background: "#f8fafc", marginBottom: 10 }) }}>
                Last updated: <strong>{formatLastUpdated(lastUpdated)}</strong>
              </div>
              <div style={{ ...cardStyle({ background: "#f8fafc", marginBottom: 10 }) }}>
                Lock mode: <strong>{isLocked ? "On" : "Off"}</strong>
              </div>
              <div style={{ ...cardStyle({ background: "#f8fafc", marginBottom: 10 }) }}>
                Scoring formula: round base points + (winning seed number - losing seed number) when the underdog wins.
              </div>
              <div style={{ ...cardStyle({ background: "#f8fafc", marginBottom: 10 }) }}>
                Correct example: 12 over 5 in Round 1 = 2 base points + 7 upset bonus = 9 total points.
              </div>
              <div style={{ ...cardStyle({ background: "#f8fafc", marginBottom: 16 }) }}>
                {isLocked
                  ? "This shared link is locked. View-only mode is active."
                  : "Click the selected winner again to clear that game."}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <button onClick={exportData} style={buttonStyle(false, isMobile)}>
                  Export data
                </button>
                <button onClick={() => generateShareLink(true)} style={buttonStyle(false, isMobile)}>
                  Generate Share Link
                </button>
                <button onClick={() => generateShareLink(false)} style={buttonStyle(false, isMobile)}>
                  Generate Editable Link
                </button>
                <button
                  disabled={isLocked}
                  onClick={resetAll}
                  style={{
                    ...buttonStyle(false, isMobile),
                    borderColor: "#dc2626",
                    color: "#dc2626",
                    cursor: isLocked ? "not-allowed" : "pointer",
                    opacity: isLocked ? 0.6 : 1,
                  }}
                >
                  Reset demo data
                </button>
              </div>

              <div style={{ marginBottom: 12, fontWeight: 700 }}>View mode</div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <button onClick={() => setViewMode("public")} style={buttonStyle(viewMode === "public", isMobile)}>
                  Public
                </button>
                <button onClick={() => setViewMode("admin")} style={buttonStyle(viewMode === "admin", isMobile)}>
                  Admin
                </button>
              </div>

              {!isLocked && (
                <>
                  <div style={{ marginBottom: 12, fontWeight: 700 }}>Local lock toggle</div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    <button onClick={() => setIsLocked(false)} style={buttonStyle(!isLocked, isMobile)}>
                      Unlocked
                    </button>
                    <button onClick={() => setIsLocked(true)} style={buttonStyle(isLocked, isMobile)}>
                      Locked
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {tab === "bracket-map" && (
  <div style={cardStyle()}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        alignItems: isMobile ? "flex-start" : "center",
        flexDirection: isMobile ? "column" : "row",
        marginBottom: 16,
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>Full Bracket Map</h2>
        <div style={{ color: "#475569", marginTop: 6, fontSize: 14 }}>
          NCAA teams are shown with the drafted pool team in parentheses.
        </div>
      </div>
      <div style={{ fontSize: 14, color: "#475569" }}>
        Example: <strong>Houston (Rehabilitators)</strong>
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
        gap: 16,
      }}
    >
      {["East", "West", "South", "Midwest"].map((region) => (
        <div
          key={region}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 14,
            background: "#f8fafc",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>{region}</h3>

          {["r64", "r32", "r16"].map((round) => {
            const roundGames = getRegionGames(games, region, round);
            if (!roundGames.length) return null;

            return (
              <div key={`${region}-${round}`} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "#64748b",
                    marginBottom: 8,
                  }}
                >
                  {roundLabels[round]}
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  {roundGames.map((game) => {
                    const teamAEliminated =
                      game.winner && !teamMatchesPick(game.teamA, game.winner);
                    const teamBEliminated =
                      game.winner && !teamMatchesPick(game.teamB, game.winner);

                    return (
                      <div
                        key={game.id}
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: 12,
                          padding: 10,
                          background: "white",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gap: 8,
                          }}
                        >
                          <div style={bracketTeamStyle(game.winner === game.teamA, teamAEliminated)}>
                            {formatBracketTeamLabel(game.teamA)} ({game.seedA})
                            {teamAEliminated && (
                              <div
                                style={{
                                  position: "absolute",
                                  left: "-10%",
                                  top: "50%",
                                  width: "120%",
                                  height: 2,
                                  background: "#dc2626",
                                  transform: "rotate(-12deg)",
                                }}
                              />
                            )}
                          </div>

                          <div style={bracketTeamStyle(game.winner === game.teamB, teamBEliminated)}>
                            {formatBracketTeamLabel(game.teamB)} ({game.seedB})
                            {teamBEliminated && (
                              <div
                                style={{
                                  position: "absolute",
                                  left: "-10%",
                                  top: "50%",
                                  width: "120%",
                                  height: 2,
                                  background: "#dc2626",
                                  transform: "rotate(-12deg)",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>

    <div style={{ marginTop: 20 }}>
      <div
        style={{
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "#64748b",
          marginBottom: 8,
        }}
      >
        Cross-region rounds
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {["r8", "r4", "champ"].map((round) => {
          const roundGames = games.filter((game) => game.round === round);
          if (!roundGames.length) return null;

          return (
            <div
              key={round}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 12,
                background: "#f8fafc",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 10 }}>{roundLabels[round]}</div>

              <div style={{ display: "grid", gap: 10 }}>
                {roundGames.map((game) => {
                  const teamAEliminated =
                    game.winner && !teamMatchesPick(game.teamA, game.winner);
                  const teamBEliminated =
                    game.winner && !teamMatchesPick(game.teamB, game.winner);

                  return (
                    <div
                      key={game.id}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        padding: 10,
                        background: "white",
                      }}
                    >
                      <div style={{ display: "grid", gap: 8 }}>
                        <div style={bracketTeamStyle(game.winner === game.teamA, teamAEliminated)}>
                          {formatBracketTeamLabel(game.teamA)} ({game.seedA})
                          {teamAEliminated && (
                            <div
                              style={{
                                position: "absolute",
                                left: "-10%",
                                top: "50%",
                                width: "120%",
                                height: 2,
                                background: "#dc2626",
                                transform: "rotate(-12deg)",
                              }}
                            />
                          )}
                        </div>

                        <div style={bracketTeamStyle(game.winner === game.teamB, teamBEliminated)}>
                          {formatBracketTeamLabel(game.teamB)} ({game.seedB})
                          {teamBEliminated && (
                            <div
                              style={{
                                position: "absolute",
                                left: "-10%",
                                top: "50%",
                                width: "120%",
                                height: 2,
                                background: "#dc2626",
                                transform: "rotate(-12deg)",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}

        {tab === "trash-talk" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(280px, 1fr) minmax(0, 1.2fr)",
              gap: 16,
            }}
          >
            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Submit a contender</h2>

              <div style={{ marginBottom: 10 }}>
                <select
                  disabled={isLocked}
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 10,
                    border: "1px solid #d1d5db",
                    opacity: isLocked ? 0.7 : 1,
                    boxSizing: "border-box",
                  }}
                >
                  {initialOwners.map((owner) => (
                    <option key={owner.teamName} value={owner.teamName}>
                      {owner.teamName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ ...cardStyle({ background: "#f8fafc", marginBottom: 10 }) }}>
                New award this year: single most pithy trash line of the tourney.
              </div>

              <input
                disabled={isLocked}
                value={trashTalkText}
                onChange={(e) => setTrashTalkText(e.target.value)}
                placeholder="Enter a beautiful, disrespectful one-liner"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 10,
                  marginBottom: 10,
                  boxSizing: "border-box",
                  opacity: isLocked ? 0.7 : 1,
                }}
              />

              <button
                disabled={isLocked}
                onClick={addTrashTalk}
                style={{
                  ...buttonStyle(false, isMobile),
                  cursor: isLocked ? "not-allowed" : "pointer",
                  opacity: isLocked ? 0.6 : 1,
                }}
              >
                Submit line
              </button>
            </div>

            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Trash Talk Leaderboard</h2>

              {trashTalkEntries
                .slice()
                .sort((a, b) => b.votes - a.votes)
                .map((entry, index) => (
                  <div
                    key={`${entry.teamName}-${index}`}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 14,
                      padding: 14,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{entry.teamName}</div>
                        <div style={{ color: "#334155", marginTop: 6, wordBreak: "break-word" }}>
                          “{entry.text}”
                        </div>
                      </div>

                      <button
                        disabled={isLocked}
                        onClick={() => voteTrashTalk(trashTalkEntries.indexOf(entry))}
                        style={{
                          ...buttonStyle(false, isMobile),
                          cursor: isLocked ? "not-allowed" : "pointer",
                          opacity: isLocked ? 0.6 : 1,
                          width: isMobile ? "100%" : "auto",
                        }}
                      >
                        ✅ {entry.votes}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {tab === "rules" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Prize Pool</h2>
              <div style={{ lineHeight: 1.9 }}>
                <div>$1,600 to 1st place</div>
                <div>$800 to 2nd place</div>
                <div>$400 to 3rd place</div>
                <div>$200 to the team holding the champion school</div>
                <div>$200 to the single most pithy trash text</div>
              </div>
            </div>

            <div style={cardStyle()}>
              <h2 style={{ marginTop: 0 }}>Scoring Rules</h2>
              <div style={{ lineHeight: 1.9 }}>
                <div>Play-in games: 0 points</div>
                <div>Round of 64: 2 points</div>
                <div>Round of 32: 2 points</div>
                <div>Sweet 16: 4 points</div>
                <div>Elite 8: 1 point</div>
                <div>Final Four: 3 points</div>
                <div>Champion: 5 points</div>
                <div style={{ marginTop: 12, fontWeight: 700 }}>
                  Upset bonus = winning seed number - losing seed number, added on top of round points when the underdog wins.
                </div>
                <div>Example: 12 over 5 in the Round of 64 = 2 + 7 = 9 points.</div>
              </div>
            </div>

            <div style={{ ...cardStyle(), gridColumn: isMobile ? "auto" : "1 / -1" }}>
              <h2 style={{ marginTop: 0 }}>What this version includes</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 10,
                }}
              >
                {[
                  "Clear upset-scoring examples",
                  "Manual winner tracking",
                  "Automatic standings recalculation",
                  "Champion-holder tie-break logic",
                  "Play-in winner name matching",
                  "Elimination slash on leaderboard",
                  "Shareable snapshot links",
                  "Last updated time",
                  "Lock mode for view-only sharing",
                  "Mobile-friendly layout",
                  "Trash-talk submission and voting",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: 12,
                      fontWeight: 600,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}