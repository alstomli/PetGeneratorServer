# Pet Evolution System - Feature Summary

A kid-friendly pet evolution game that uses Google Gemini AI to generate and evolve fantasy pet creatures. Built with Express.js backend and vanilla JavaScript frontend.

---

## Core Features

### 1. Pet Generation
- **Create new baby pets** (Stage 1) with customizable attributes:
  - **Personality**: Gentle, Bold, or Curious (unified with evolution paths)
  - **Color Palette**: 27 options across 6 categories, defaults to **Random**
    - 🔥 **Warm**: sunset orange, golden sun, cherry blossom pink, autumn leaves, coral reef, cinnamon spice
    - ❄️ **Cool**: ocean blue, forest green, arctic ice, lavender dreams, mint fresh, slate storm
    - 🎨 **Vibrant**: rainbow bright, neon electric, tropical paradise, berry blast
    - ✨ **Magical/Dark**: purple magic, starry night, midnight galaxy, mystic moonlight
    - 🎀 **Soft/Light**: pink princess, cotton candy, pastel sunrise, cream vanilla
    - 🌍 **Earthy**: mossy woodland, desert sand, volcanic ember
  - **Animal Inspirations**: Up to 2 animals that influence the creature's appearance
  - **Evolution Stages**: Fixed at 3 stages (Baby → Juvenile → Adult)

### 2. Pet Evolution
- **Three evolution paths** (unified with personality types):
  - **Gentle** (💚): Softer, fluffier, caring and peaceful
  - **Bold** (🔥): More powerful, confident and fearless
  - **Curious** (✨): Mystical, inquisitive and mysterious

- **Stage progression**:
  - Stage 1 → Stage 2: ~1.4x size increase, juvenile proportions
  - Stage 2 → Stage 3: ~2x size increase, adult proportions

- **Image-to-image evolution**: Uses the previous stage's image as reference to maintain visual continuity

### 3. Pet Merging
- **Combine two pets** from different family lines to create offspring
- **Requirements**:
  - Pets must be the **same stage** (e.g., both Stage 2)
  - Pets must be from **different family lineages** (no inbreeding)
- **Offspring inherits**:
  - Style from higher-stage parent (or random if equal)
  - Color palette blend
  - Combined animal traits (up to 2)
  - All augments from both parents (up to 4 max)
- **Rare merge outcomes**: Legendary, Chromatic, Elemental, Celestial (visual bonuses)

---

## Augment & Rarity System

### Augments
Special modifiers pets can gain that add visual effects and backstory. Each augment has:
- **Name**: Display name (e.g., "Fire-Blessed")
- **Story**: How the pet gained it (e.g., "Wandered into an ancient volcano...")
- **Visual Effects**: Array of visible changes (e.g., ["ember eyes", "flame wisps"])
- **Category**: elemental, celestial, nature, spirit, or arcane
- **Weight**: Rarity contribution (1-3 points)

### Augment Categories
| Category | Examples |
|----------|----------|
| Elemental | Fire-Blessed, Storm-Touched, Frost-Kissed, Tide-Born |
| Celestial | Starforged, Moonblessed, Sunborn, Void-Touched |
| Nature | Bloom-Keeper, Autumn-Soul, Forest-Heart, Beast-Bonded |
| Spirit | Dream-Walker, Ghost-Touched, Joy-Blessed, Ancestor-Bound |
| Arcane | Rune-Marked, Crystal-Heart, Spell-Woven, Grimoire-Born |

### Augment Acquisition
| Event | Base Chance | Bonuses |
|-------|-------------|---------|
| Generation | 15% | +10% curious style, +10% mythical animals |
| Evolution | 20% | +15% curious path, +10% if no augments (pity) |
| Merge | 30% | Guaranteed if both parents have 2+ augments |

### Rarity Tiers (derived from total augment weight)
| Tier | Weight Range | Badge Color |
|------|--------------|-------------|
| Common | 0 | Gray |
| Uncommon | 1-2 | Green |
| Rare | 3-4 | Blue |
| Legendary | 5-6 | Purple |
| Mythical | 7+ | Rainbow (animated) |

---

## Design Decisions

### Visual Style
- **Cartoony Pokemon/Digimon aesthetic** - simple clean lines, bright flat colors
- **NOT realistic** - stylized and cute, appealing to ages 7-11
- **Single creature portraits** - centered, full body, white/transparent background
- **No text in images** - clean game asset style

### Evolution Intensity
- **Non-augmented pets**: Natural, grounded evolution
  - Trait descriptions are softened (removed "DRAMATICALLY", "SIGNIFICANTLY", etc.)
  - Abilities still present but toned down
  - Standard size progression

- **Augmented pets**: Enhanced, visually striking evolution
  - Full dramatic trait descriptions
  - Augment effects prominently displayed
  - Extra visual flair and impressiveness

This design ensures augmented pets **stand out** compared to regular pets.

### Color Preservation
- Strong emphasis on maintaining the original color palette through evolutions
- Multiple prompt reminders to prevent color drift
- Especially important for curious path (prevents purple/twilight drift)

### Family Trees
- Pets organized into family trees by lineage
- Merged pets get their own distinct family tree (cyan theme)
- Visual parent thumbnails show which pets were combined

---

## UI Features

### Pet Cards Display
- Timestamp and rarity badge in header
- Pet image (clickable for details)
- Metadata: Personality, Colors, Animals, Evolution Path
- **For merged pets**: Parent thumbnails showing source pets
- **Merge Bonus indicator**: Shows rare merge outcome type
- **Augments section**: Badges with hover tooltips showing stories
- Action buttons: Evolve (3 paths), Select for Merge, Load Settings, Delete

### Merge Panel ("Pet Fusion Chamber")
- Two selection slots for parent pets
- Preview showing expected outcome before merging
- Validates same-stage requirement
- Shows inherited traits and rare outcome possibility

### Test Features
- **Bonus Potion checkbox**: Guarantees augment on generation/evolution (for testing)

---

## Technical Architecture

### Directory Structure
```
src/
├── api/
│   ├── routes/          # Express route handlers
│   │   ├── generate.js  # POST /api/google/generate-pet
│   │   ├── evolve.js    # POST /api/google/evolve-pet
│   │   ├── merge.js     # POST /api/google/merge-pets
│   │   └── pets.js      # CRUD for saved pets
│   ├── services/
│   │   └── pet-service.js  # Orchestrates generation/evolution/merge
│   └── middleware/
├── core/
│   ├── augments/        # Augment system
│   │   ├── pool.js      # 30 curated augments
│   │   ├── acquisition.js  # Roll logic
│   │   └── rarity.js    # Tier calculations
│   ├── evolution/       # Evolution rules
│   ├── merge/           # Merge rules and outcomes
│   ├── pet/             # Pet model
│   └── traits/          # Evolution trait pools
├── prompting/
│   ├── templates/       # Prompt templates
│   │   ├── generate.js  # Baby pet prompts
│   │   ├── evolve.js    # Evolution prompts
│   │   └── merge.js     # Merge prompts
│   └── augment-visuals.js  # Augment effect descriptions
├── generation/
│   └── adapters/
│       └── gemini-adapter.js  # Google Gemini AI integration
└── web/                 # Alternative web UI components
```

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| POST | /api/google/generate-pet | Generate new baby pet |
| POST | /api/google/evolve-pet | Evolve pet (supports image upload) |
| POST | /api/google/merge-pets | Merge two pets |
| GET | /api/google/merge-pets/preview | Preview merge outcome |
| POST | /api/pets/save | Save pet to disk |
| GET | /api/pets | Get all saved pets |
| GET | /api/pets/:id | Get single pet |
| DELETE | /api/pets/:id | Delete pet |

### Data Flow
1. **Generation**: UI → generate route → pet-service → augment roll → prompt builder → Gemini API → pet model → storage
2. **Evolution**: UI (with image) → evolve route → pet-service → augment roll → prompt builder → Gemini API (image-to-image) → pet model
3. **Merge**: UI → merge route → pet-service → outcome selector → augment inheritance → prompt builder → Gemini API → merged pet model

---

## Storage
- Pets saved as JSON files in `pets/` directory
- Images stored as base64 data URLs within pet JSON
- Each pet has unique ID based on timestamp
- Family lineage tracked via ID patterns (e.g., `{rootId}-{stage}-{timestamp}`)
- Merged pets use `merge-{timestamp}` ID format

---

## Future Considerations
- Gemini-generated unique augments (10% of acquisitions) - infrastructure exists but not fully implemented
- Pet trading/sharing between users
- Achievement system based on augment collection
- Battle or competition features using pet stats
