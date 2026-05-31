const { useState, useEffect } = React;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const WEEKEND = ["Saturday", "Sunday"];

const MEAL_TYPES = [
  { key: "breakfast", label: "Breakfast", emoji: "☀️", color: "#d97706" },
  { key: "lunch",     label: "Lunch",     emoji: "🥗", color: "#059669" },
  { key: "dinner",    label: "Dinner",    emoji: "🍽️", color: "#6366f1" },
  { key: "pudding",   label: "Pudding",   emoji: "🍫", color: "#db2777" },
];

const STAPLES = [
  "Extra virgin olive oil", "Turmeric", "Cumin", "Ginger", "Black pepper",
  "Salt", "Good stock", "Miso paste", "Ground flaxseed",
];

const CATEGORIES = {
  "🥬 Fresh & Fridge": [
    "full fat natural yoghurt", "eggs", "smoked salmon", "fresh salmon fillet",
    "firm tofu", "avocado", "mushrooms", "cherry tomatoes", "spinach", "asparagus",
    "celery", "carrot", "cucumber", "onions", "banana", "apple", "apples", "lemon",
    "orange", "cooked beetroot",
  ],
  "🥫 Cupboard": [
    "nairn's oatcakes", "rye bread", "rye crackers", "wholegrain pasta", "soba noodles",
    "tinned chickpeas", "tinned black beans", "tinned flageolet beans", "tinned butter beans",
    "tinned tomatoes", "tinned coconut milk", "tinned salmon", "precooked lentil pouch",
    "jarred artichoke hearts", "houmous", "sauerkraut", "wholegrain mustard", "cinnamon",
  ],
  "🥜 Nuts, Seeds & Extras": [
    "walnuts", "brain food nut butter", "ground flaxseed", "olives", "honey",
    "dark chocolate (85%)", "coconut collaborative pot",
  ],
  "🫙 Oils & Flavourings": [
    "extra virgin olive oil", "turmeric", "cumin", "ginger", "black pepper",
    "salt", "miso paste", "good stock",
  ],
  "🍵 Drinks": ["peppermint tea"],
};

const emptyWeek = () =>
  DAYS.reduce((acc, d) => ({
    ...acc,
    [d]: { breakfast: null, lunch: null, dinner: null, pudding: null },
  }), {});

function categoriseItems(items) {
  const result = {};
  const used = new Set();
  Object.entries(CATEGORIES).forEach(([cat, list]) => {
    items.forEach(item => {
      if (list.includes(item.toLowerCase())) {
        if (!result[cat]) result[cat] = [];
        result[cat].push(item);
        used.add(item);
      }
    });
  });
  const other = items.filter(i => !used.has(i));
  if (other.length) result["📦 Other"] = other;
  return result;
}

// ── BACK BUTTON ────────────────────────────────────────────────────────────────
function BackButton({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
      padding: "6px 14px", borderRadius: "20px", cursor: "pointer",
      fontFamily: "sans-serif", fontSize: "13px", marginBottom: "12px",
    }}>← Back</button>
  );
}

// ── PICKING SCREEN ─────────────────────────────────────────────────────────────
function PickingScreen({ picking, week, recipes, onSelect, onClear, onBack }) {
  const { day, mealType } = picking;
  const mt = MEAL_TYPES.find(m => m.key === mealType);
  const bank = recipes[mealType] || [];
  const current = week[day][mealType];

  return (
    <div style={{ minHeight: "100vh", background: "#0f1a0f", fontFamily: "Georgia, serif", paddingBottom: 40 }}>
      <div style={{ background: `linear-gradient(135deg, ${mt.color}cc, ${mt.color}66)`, padding: "24px 20px 20px" }}>
        <BackButton onClick={onBack} />
        <p style={{ color: "rgba(255,255,255,0.7)", margin: "0 0 4px", fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>
          {day} · {mt.emoji} {mt.label}
        </p>
        <h2 style={{ color: "#fff", margin: 0, fontSize: "22px", fontWeight: "normal" }}>Choose a {mt.label}</h2>
      </div>
      <div style={{ padding: 16 }}>
        {current && (
          <button onClick={() => { onClear(day, mealType); onBack(); }} style={{
            width: "100%", padding: 12, background: "rgba(255,80,80,0.1)",
            border: "1px solid rgba(255,80,80,0.3)", borderRadius: 10,
            color: "#ff6b6b", fontFamily: "sans-serif", fontSize: 13,
            cursor: "pointer", marginBottom: 12,
          }}>✕ Remove current selection</button>
        )}
        {bank.map(meal => {
          const isSelected = current && current.id === meal.id;
          return (
            <button key={meal.id} onClick={() => onSelect(day, mealType, meal)} style={{
              width: "100%", textAlign: "left", padding: 16, marginBottom: 10,
              background: isSelected ? `${mt.color}33` : "rgba(255,255,255,0.05)",
              border: `1px solid ${isSelected ? mt.color : "rgba(255,255,255,0.1)"}`,
              borderRadius: 12, cursor: "pointer",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontSize: 16, marginBottom: 4, fontFamily: "Georgia, serif" }}>{meal.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "sans-serif", lineHeight: 1.5 }}>{meal.desc}</div>
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {meal.ingredients.split("|").map(ing => (
                      <span key={ing} style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 10,
                        background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)",
                        fontFamily: "sans-serif",
                      }}>{ing}</span>
                    ))}
                  </div>
                </div>
                {isSelected && <span style={{ color: mt.color, fontSize: 20, marginLeft: 10 }}>✓</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── SHOPPING SCREEN ────────────────────────────────────────────────────────────
function ShoppingScreen({ week, onBack }) {
  const [checked, setChecked] = useState({});

  const allIngredients = new Set(["Apples"]);
  DAYS.forEach(day => {
    MEAL_TYPES.forEach(({ key }) => {
      const meal = week[day][key];
      if (meal) meal.ingredients.split("|").forEach(i => allIngredients.add(i.trim()));
    });
  });

  const sorted = Array.from(allIngredients).sort();
  const categorised = categoriseItems(sorted);
  const toggle = (item) => setChecked(c => ({ ...c, [item]: !c[item] }));

  return (
    <div style={{ minHeight: "100vh", background: "#0f1a0f", fontFamily: "Georgia, serif", paddingBottom: 40 }}>
      <div style={{ background: "linear-gradient(135deg, #2d4a2d, #4a7c59)", padding: "24px 20px 20px" }}>
        <BackButton onClick={onBack} />
        <h2 style={{ color: "#fff", margin: 0, fontSize: 24, fontWeight: "normal" }}>🛒 Shopping List</h2>
        <p style={{ color: "#a8d5b5", margin: "4px 0 0", fontFamily: "sans-serif", fontSize: 13 }}>Tap to check off as you shop</p>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{
          background: "rgba(255,255,255,0.04)", borderRadius: 12,
          padding: "14px 16px", marginBottom: 20,
          fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.7,
        }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Kitchen staples — check you have these:</span><br />
          {STAPLES.join(" · ")}
        </div>
        {Object.entries(categorised).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: 24 }}>
            <h3 style={{ color: "#6aaa7a", fontFamily: "sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 10px" }}>{cat}</h3>
            {items.map(item => (
              <button key={item} onClick={() => toggle(item)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px",
                background: checked[item] ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                border: "none", borderRadius: 8, marginBottom: 6,
                cursor: "pointer", textAlign: "left",
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                  border: `1.5px solid ${checked[item] ? "#6aaa7a" : "rgba(255,255,255,0.2)"}`,
                  background: checked[item] ? "#6aaa7a" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: "#fff",
                }}>{checked[item] ? "✓" : ""}</div>
                <span style={{
                  color: checked[item] ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.85)",
                  fontFamily: "sans-serif", fontSize: 14,
                  textDecoration: checked[item] ? "line-through" : "none",
                }}>{item}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SUMMARY SCREEN ─────────────────────────────────────────────────────────────
function SummaryScreen({ week, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0f1a0f", fontFamily: "Georgia, serif", paddingBottom: 40 }}>
      <div style={{ background: "linear-gradient(135deg, #2d4a2d, #4a7c59)", padding: "24px 20px 20px" }}>
        <BackButton onClick={onBack} />
        <h2 style={{ color: "#fff", margin: 0, fontSize: 24, fontWeight: "normal" }}>📋 Week at a Glance</h2>
        <p style={{ color: "#a8d5b5", margin: "4px 0 0", fontFamily: "sans-serif", fontSize: 13 }}>Screenshot this to save your plan</p>
      </div>
      <div style={{ padding: 16 }}>
        {DAYS.map(day => {
          const isWeekend = WEEKEND.includes(day);
          const dayMeals = week[day];
          const hasAny = MEAL_TYPES.some(m => dayMeals[m.key]);
          return (
            <div key={day} style={{
              marginBottom: 10, borderRadius: 14, overflow: "hidden",
              border: `1px solid ${isWeekend ? "rgba(106,170,106,0.25)" : "rgba(255,255,255,0.08)"}`,
              background: isWeekend ? "rgba(106,170,106,0.06)" : "rgba(255,255,255,0.03)",
            }}>
              <div style={{
                padding: "10px 16px",
                background: isWeekend ? "rgba(106,170,106,0.15)" : "rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ color: "#fff", fontSize: 15 }}>{day}</span>
                <span style={{ fontSize: 10, color: isWeekend ? "#6aaa7a" : "rgba(255,255,255,0.3)", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>
                  {isWeekend ? "🌿 Weekend" : "⚡ Weekday"}
                </span>
              </div>
              <div style={{ padding: "8px 16px 12px" }}>
                {hasAny ? MEAL_TYPES.map(({ key, label, emoji, color }) => {
                  const meal = dayMeals[key];
                  if (!meal) return null;
                  return (
                    <div key={key} style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: 1, flexShrink: 0, minWidth: 70 }}>{emoji} {label}</span>
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{meal.name}</span>
                    </div>
                  );
                }) : (
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.2)", fontFamily: "sans-serif" }}>No meals planned yet</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────────
function App() {
  const [recipes, setRecipes] = useState({});
  const [loading, setLoading] = useState(true);
  const [week, setWeek] = useState(emptyWeek());
  const [screen, setScreen] = useState("plan");
  const [picking, setPicking] = useState(null);
  const [expandedDay, setExpandedDay] = useState("Monday");

  useEffect(() => {
    Papa.parse("recipes.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const grouped = {};
        data.forEach(row => {
          if (!grouped[row.type]) grouped[row.type] = [];
          grouped[row.type].push(row);
        });
        setRecipes(grouped);
        setLoading(false);
      }
    });
  }, []);

  const selectMeal = (day, mealType, meal) => {
    setWeek(w => ({ ...w, [day]: { ...w[day], [mealType]: meal } }));
    setScreen("plan");
    setPicking(null);
  };

  const clearMeal = (day, mealType) => {
    setWeek(w => ({ ...w, [day]: { ...w[day], [mealType]: null } }));
  };

  const openPicking = (day, mealType) => {
    setPicking({ day, mealType });
    setScreen("picking");
  };

  const filledCount = DAYS.reduce((acc, d) =>
    acc + MEAL_TYPES.filter(m => week[d][m.key]).length, 0);
  const totalCount = DAYS.length * MEAL_TYPES.length;
  const pct = Math.round((filledCount / totalCount) * 100);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0f1a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#6aaa7a", fontFamily: "sans-serif" }}>Loading recipes...</p>
    </div>
  );

  if (screen === "picking" && picking) return (
    <PickingScreen picking={picking} week={week} recipes={recipes}
      onSelect={selectMeal} onClear={clearMeal} onBack={() => setScreen("plan")} />
  );

  if (screen === "shopping") return <ShoppingScreen week={week} onBack={() => setScreen("plan")} />;
  if (screen === "summary") return <SummaryScreen week={week} onBack={() => setScreen("plan")} />;

  return (
    <div style={{ minHeight: "100vh", background: "#0f1a0f", fontFamily: "Georgia, serif", paddingBottom: 40 }}>
      <div style={{
        background: "linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 60%, #3d6b3d 100%)",
        padding: "32px 20px 24px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle at 80% 20%, rgba(106,170,106,0.08) 0%, transparent 50%)" }} />
        <p style={{ color: "#6aaa7a", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", margin: "0 0 6px", fontFamily: "sans-serif" }}>
          Healthy Eating
        </p>
        <h1 style={{ color: "#fff", fontSize: 28, fontWeight: "normal", margin: "0 0 16px", letterSpacing: -0.3 }}>
          Weekly Meal Planner
        </h1>
        <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 20, height: 6, marginBottom: 8 }}>
          <div style={{ background: "#6aaa7a", height: 6, borderRadius: 20, width: `${pct}%`, transition: "width 0.4s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif", fontSize: 12 }}>
            {filledCount} of {totalCount} meals planned
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setScreen("summary")} style={{
              background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
              padding: "8px 14px", borderRadius: 20, cursor: "pointer",
              fontFamily: "sans-serif", fontSize: 12, fontWeight: 600,
            }}>📋 Summary</button>
            <button onClick={() => setScreen("shopping")} style={{
              background: "#6aaa7a", border: "none", color: "#fff",
              padding: "8px 14px", borderRadius: 20, cursor: "pointer",
              fontFamily: "sans-serif", fontSize: 12, fontWeight: 600,
            }}>🛒 Shop</button>
          </div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {DAYS.map(day => {
          const isWeekend = WEEKEND.includes(day);
          const isExpanded = expandedDay === day;
          const dayMeals = week[day];
          const dayFilled = MEAL_TYPES.filter(m => dayMeals[m.key]).length;

          return (
            <div key={day} style={{ marginBottom: 10, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
              <button onClick={() => setExpandedDay(isExpanded ? null : day)} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px",
                background: isWeekend ? "rgba(106,170,106,0.15)" : "rgba(255,255,255,0.06)",
                border: "none", cursor: "pointer", textAlign: "left",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "#fff", fontSize: 17 }}>{day}</span>
                  <span style={{ fontSize: 10, color: isWeekend ? "#6aaa7a" : "rgba(255,255,255,0.3)", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>
                    {isWeekend ? "🌿 Weekend" : "⚡ Weekday"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "sans-serif", fontSize: 12, color: dayFilled === 4 ? "#6aaa7a" : "rgba(255,255,255,0.3)" }}>{dayFilled}/4</span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>›</span>
                </div>
              </button>

              {isExpanded && (
                <div style={{ background: "rgba(0,0,0,0.3)" }}>
                  {MEAL_TYPES.map(({ key, label, emoji, color }) => {
                    const meal = dayMeals[key];
                    return (
                      <button key={key} onClick={() => openPicking(day, key)} style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 12,
                        padding: "13px 16px", background: meal ? `${color}18` : "transparent",
                        border: "none", borderTop: "1px solid rgba(255,255,255,0.05)",
                        cursor: "pointer", textAlign: "left",
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                          background: meal ? `${color}33` : "rgba(255,255,255,0.07)",
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
                        }}>{emoji}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 10, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2, color: meal ? color : "rgba(255,255,255,0.3)" }}>{label}</div>
                          <div style={{ fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: meal ? "#fff" : "rgba(255,255,255,0.25)", fontFamily: meal ? "Georgia, serif" : "sans-serif" }}>
                            {meal ? meal.name : `+ Add ${label.toLowerCase()}`}
                          </div>
                        </div>
                        <span style={{ color: meal ? color : "rgba(255,255,255,0.2)", fontSize: 14 }}>{meal ? "✎" : "+"}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filledCount > 0 && (
          <button onClick={() => setWeek(emptyWeek())} style={{
            width: "100%", padding: 12, background: "transparent",
            border: "1px solid rgba(255,80,80,0.2)", borderRadius: 10,
            color: "rgba(255,100,100,0.5)", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", marginTop: 8,
          }}>Reset week</button>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
