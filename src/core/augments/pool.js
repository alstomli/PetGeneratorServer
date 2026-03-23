/**
 * Curated augment pool for pet augmentations.
 * Contains ~30 augments across 5 categories with stories and visual effects.
 * @module core/augments/pool
 */

/**
 * Augment categories
 * @readonly
 * @enum {string}
 */
export const AUGMENT_CATEGORIES = {
  ELEMENTAL: 'elemental',
  CELESTIAL: 'celestial',
  NATURE: 'nature',
  SPIRIT: 'spirit',
  ARCANE: 'arcane'
};

/**
 * Full curated augment pool
 * @type {Object[]}
 */
export const AUGMENT_POOL = [
  // ============ ELEMENTAL (fire, water, lightning, ice, earth) ============
  {
    id: 'fire-blessed',
    name: 'Fire-Blessed',
    story: 'Wandered into an ancient volcano and bathed in its molten heart, emerging unscathed with flames dancing in its eyes.',
    visualEffects: ['ember-colored eyes', 'wisps of flame around paws', 'heat shimmer aura'],
    category: AUGMENT_CATEGORIES.ELEMENTAL,
    weight: 2
  },
  {
    id: 'storm-touched',
    name: 'Storm-Touched',
    story: 'Was struck by lightning during a magical tempest and absorbed its power, forever crackling with electric energy.',
    visualEffects: ['crackling fur', 'electric blue streaks', 'static discharge sparks'],
    category: AUGMENT_CATEGORIES.ELEMENTAL,
    weight: 2
  },
  {
    id: 'frost-kissed',
    name: 'Frost-Kissed',
    story: 'Slept through a century-long blizzard and woke with winter in its veins, forever touched by eternal cold.',
    visualEffects: ['ice crystal patterns on fur', 'frosted breath', 'pale blue highlights'],
    category: AUGMENT_CATEGORIES.ELEMENTAL,
    weight: 2
  },
  {
    id: 'tide-born',
    name: 'Tide-Born',
    story: 'Hatched from an egg found in the deepest ocean trench, carrying the mysteries of the abyss within.',
    visualEffects: ['bioluminescent markings', 'water droplet aura', 'iridescent scale patches'],
    category: AUGMENT_CATEGORIES.ELEMENTAL,
    weight: 2
  },
  {
    id: 'earth-bound',
    name: 'Earth-Bound',
    story: 'Burrowed into the heart of a mountain and emerged carrying ancient stones embedded in its form.',
    visualEffects: ['crystalline growths on shoulders', 'dusty earthen markings', 'gem-encrusted claws'],
    category: AUGMENT_CATEGORIES.ELEMENTAL,
    weight: 2
  },
  {
    id: 'ember-soul',
    name: 'Ember-Soul',
    story: 'Befriended a dying campfire spirit that chose to live on within its heart, granting warmth eternal.',
    visualEffects: ['warm inner glow', 'smoke wisps from ears', 'coal-like patches that pulse with heat'],
    category: AUGMENT_CATEGORIES.ELEMENTAL,
    weight: 1
  },

  // ============ CELESTIAL (sun, moon, stars, void) ============
  {
    id: 'starforged',
    name: 'Starforged',
    story: 'Born from a fallen meteor that crashed in an enchanted grove, carrying stardust in its very essence.',
    visualEffects: ['constellation patterns in fur', 'cosmic sparkle effects', 'nebula-colored eyes'],
    category: AUGMENT_CATEGORIES.CELESTIAL,
    weight: 3
  },
  {
    id: 'moonblessed',
    name: 'Moonblessed',
    story: 'Bathed in the light of a rare triple moon eclipse, forever marked by lunar grace and mystery.',
    visualEffects: ['silver luminescence', 'crescent moon markings', 'soft ethereal glow'],
    category: AUGMENT_CATEGORIES.CELESTIAL,
    weight: 2
  },
  {
    id: 'sunborn',
    name: 'Sunborn',
    story: 'Emerged from a sunflower that bloomed at high noon on summer solstice, blessed with solar radiance.',
    visualEffects: ['golden radiance aura', 'warm light corona', 'sun-shaped marking on forehead'],
    category: AUGMENT_CATEGORIES.CELESTIAL,
    weight: 2
  },
  {
    id: 'void-touched',
    name: 'Void-Touched',
    story: 'Glimpsed through a tear in reality and returned... changed. Part of it now exists between dimensions.',
    visualEffects: ['semi-transparent sections', 'star-speckled shadow', 'hints of impossible geometry'],
    category: AUGMENT_CATEGORIES.CELESTIAL,
    weight: 3
  },
  {
    id: 'twilight-walker',
    name: 'Twilight-Walker',
    story: 'Wandered the boundary between day and night for so long that it became one with the in-between.',
    visualEffects: ['gradient fur from gold to purple', 'dusk-colored eyes', 'shifting shadows'],
    category: AUGMENT_CATEGORIES.CELESTIAL,
    weight: 2
  },
  {
    id: 'comet-chaser',
    name: 'Comet-Chaser',
    story: 'Caught a piece of a passing comet in its jaws and swallowed the cosmic ice before it could melt.',
    visualEffects: ['trailing light particles', 'ice-blue tail glow', 'stellar dust in movement'],
    category: AUGMENT_CATEGORIES.CELESTIAL,
    weight: 2
  },

  // ============ NATURE (flora, fauna, seasons) ============
  {
    id: 'bloom-keeper',
    name: 'Bloom-Keeper',
    story: 'Befriended the spirit of an ancient garden and carries its blessing, always surrounded by gentle growth.',
    visualEffects: ['flower patterns on fur', 'leaves growing from mane', 'pollen sparkles'],
    category: AUGMENT_CATEGORIES.NATURE,
    weight: 1
  },
  {
    id: 'autumn-soul',
    name: 'Autumn-Soul',
    story: 'Witnessed the last leaf fall from the World Tree and caught the essence of endings and beginnings.',
    visualEffects: ['warm gradient colors (red-orange-gold)', 'falling leaf particles', 'amber eyes'],
    category: AUGMENT_CATEGORIES.NATURE,
    weight: 1
  },
  {
    id: 'forest-heart',
    name: 'Forest-Heart',
    story: 'Was raised by the eldest trees in the Whispering Woods and grew to embody their ancient wisdom.',
    visualEffects: ['bark-textured patches', 'moss accents on shoulders', 'small wooden horn growths'],
    category: AUGMENT_CATEGORIES.NATURE,
    weight: 2
  },
  {
    id: 'beast-bonded',
    name: 'Beast-Bonded',
    story: 'Formed a soul-link with a legendary wild creature, forever carrying a piece of primal power.',
    visualEffects: ['faint spectral companion aura', 'enhanced primal features', 'wild untamed mane'],
    category: AUGMENT_CATEGORIES.NATURE,
    weight: 2
  },
  {
    id: 'spring-born',
    name: 'Spring-Born',
    story: 'First opened its eyes during the moment of spring\'s awakening and carries renewal in its heart.',
    visualEffects: ['budding flower accents', 'dewdrop sparkles', 'vibrant fresh-green highlights'],
    category: AUGMENT_CATEGORIES.NATURE,
    weight: 1
  },
  {
    id: 'winter-keeper',
    name: 'Winter-Keeper',
    story: 'Guarded a frozen lake for a hundred years and learned patience from the eternal ice.',
    visualEffects: ['snowflake patterns', 'misty cold breath', 'fur that glitters like fresh snow'],
    category: AUGMENT_CATEGORIES.NATURE,
    weight: 2
  },

  // ============ SPIRIT (ghosts, dreams, emotions) ============
  {
    id: 'dream-walker',
    name: 'Dream-Walker',
    story: 'Learned to travel through sleeping minds and brought back impossible colors from the dream realm.',
    visualEffects: ['swirling pastel aura', 'cloud-like fur sections', 'dreamy eye reflections'],
    category: AUGMENT_CATEGORIES.SPIRIT,
    weight: 2
  },
  {
    id: 'ghost-touched',
    name: 'Ghost-Touched',
    story: 'Was befriended by a lonely spirit who shared its ethereal essence, blurring the line between worlds.',
    visualEffects: ['partial transparency', 'floating spirit particles', 'pale phantom glow'],
    category: AUGMENT_CATEGORIES.SPIRIT,
    weight: 2
  },
  {
    id: 'joy-blessed',
    name: 'Joy-Blessed',
    story: 'Absorbed pure happiness from a laughing spring and now radiates infectious delight wherever it goes.',
    visualEffects: ['perpetual sparkle', 'rainbow tear marks', 'contagious smile aura'],
    category: AUGMENT_CATEGORIES.SPIRIT,
    weight: 1
  },
  {
    id: 'ancestor-bound',
    name: 'Ancestor-Bound',
    story: 'Received the memories of a thousand generations through an ancient ritual, eyes now holding ages of wisdom.',
    visualEffects: ['ancient symbol markings', 'wise aged eyes', 'temporal shimmer effect'],
    category: AUGMENT_CATEGORIES.SPIRIT,
    weight: 3
  },
  {
    id: 'echo-singer',
    name: 'Echo-Singer',
    story: 'Sang into the Cavern of Souls and had its voice returned a thousandfold, forever resonating with echoes.',
    visualEffects: ['sound wave patterns on fur', 'musical note sparkles', 'voice-like aura wisps'],
    category: AUGMENT_CATEGORIES.SPIRIT,
    weight: 1
  },
  {
    id: 'memory-keeper',
    name: 'Memory-Keeper',
    story: 'Drank from the Pool of Remembrance and now carries fragments of forgotten dreams visible in its eyes.',
    visualEffects: ['shifting eye colors', 'floating memory fragments around head', 'nostalgic glow'],
    category: AUGMENT_CATEGORIES.SPIRIT,
    weight: 2
  },

  // ============ ARCANE (magic, runes, crystals) ============
  {
    id: 'rune-marked',
    name: 'Rune-Marked',
    story: 'Wandered into a wizard\'s abandoned tower and absorbed its residual magic, now etched with ancient symbols.',
    visualEffects: ['glowing runic symbols', 'magical circuit patterns', 'faint arcane hum aura'],
    category: AUGMENT_CATEGORIES.ARCANE,
    weight: 2
  },
  {
    id: 'crystal-heart',
    name: 'Crystal-Heart',
    story: 'Ate a shard of pure crystallized magic and now grows prismatic crystals from its very being.',
    visualEffects: ['crystalline growths', 'prismatic light refraction', 'gem-like faceted eyes'],
    category: AUGMENT_CATEGORIES.ARCANE,
    weight: 2
  },
  {
    id: 'spell-woven',
    name: 'Spell-Woven',
    story: 'Was accidentally enchanted by a clumsy but powerful mage, forever wrapped in threads of magic.',
    visualEffects: ['visible spell threads', 'floating magical symbols', 'enchanted shimmer'],
    category: AUGMENT_CATEGORIES.ARCANE,
    weight: 1
  },
  {
    id: 'grimoire-born',
    name: 'Grimoire-Born',
    story: 'Emerged from the pages of an ancient spellbook when a drop of moonlight touched the right incantation.',
    visualEffects: ['text-like patterns on fur', 'page texture on ears/wings', 'ink-drop accent marks'],
    category: AUGMENT_CATEGORIES.ARCANE,
    weight: 3
  },
  {
    id: 'mana-touched',
    name: 'Mana-Touched',
    story: 'Napped on a ley line intersection and woke saturated with raw magical energy that now flows visibly.',
    visualEffects: ['glowing vein-like patterns', 'mana particle trails', 'arcane energy aura'],
    category: AUGMENT_CATEGORIES.ARCANE,
    weight: 2
  },
  {
    id: 'potion-blessed',
    name: 'Potion-Blessed',
    story: 'Accidentally knocked over an alchemist\'s masterwork and was forever changed by the rainbow of effects.',
    visualEffects: ['bubbling color patches', 'potion bottle-shaped markings', 'effervescent sparkles'],
    category: AUGMENT_CATEGORIES.ARCANE,
    weight: 1
  }
];

/**
 * Get augments by category.
 * @param {string} category - Category to filter by
 * @returns {Object[]} Augments in that category
 */
export const getAugmentsByCategory = (category) => {
  return AUGMENT_POOL.filter(aug => aug.category === category);
};

/**
 * Get an augment by ID.
 * @param {string} id - Augment ID
 * @returns {Object|undefined} The augment or undefined
 */
export const getAugmentById = (id) => {
  return AUGMENT_POOL.find(aug => aug.id === id);
};

/**
 * Get augments by weight.
 * @param {number} weight - Weight value (1-3)
 * @returns {Object[]} Augments with that weight
 */
export const getAugmentsByWeight = (weight) => {
  return AUGMENT_POOL.filter(aug => aug.weight === weight);
};

/**
 * Get all category names.
 * @returns {string[]} Array of category names
 */
export const getAllCategories = () => {
  return Object.values(AUGMENT_CATEGORIES);
};

export default AUGMENT_POOL;
