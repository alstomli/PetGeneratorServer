/**
 * Evolution trait pools for variety in pet evolution.
 * Pure data - no framework dependencies.
 * @module core/traits/pools
 */

/**
 * Trait pools organized by evolution path.
 * Each path has physical, abilities, and aesthetic traits.
 */
export const evolutionTraitPools = {
  gentle: {
    physical: [
      'DRAMATICALLY fluffier, voluminous fur that nearly doubles body size visually',
      'SIGNIFICANTLY larger, more expressive eyes (1.5x size increase)',
      'MUCH rounder, softer body shape with visible plumpness',
      'BRIGHT soft glow emanating from within in the base color (clearly visible)',
      'ENLARGED soft paw pads that are prominently displayed',
      'MUCH larger floppy or rounded ears (noticeable size increase)',
      'SIGNIFICANTLY broader, more embraceable body structure',
      'PROMINENT bioluminescent patterns in the base color across large body areas',
      'LARGE flower-like features or nature accents as focal points',
      'THICK bubble-like or cloud-like fur texture (very visible)',
      'BOLD heart-shaped markings or features (prominent)',
      'THICK, plush-looking scales or skin texture',
      'LONG, flowing ribbon-like appendages',
      'ABUNDANT feather-light wisps creating a halo effect'
    ],
    abilities: [
      'emanates calming energy visible as soft ripples',
      'leaves gentle trails of sparkles when moving',
      'can create small comforting lights',
      'produces soothing sounds or melodies',
      'attracts friendly butterflies or fireflies',
      'creates protective bubble shields',
      'radiates warmth that others can feel',
      'purifies air with sweet scents'
    ],
    aesthetic: [
      'softer, more gentle gradient within the SAME color family',
      'subtle shimmer like morning dew on the existing colors',
      'constellation-like spots that gently glow in the base color',
      'mother-of-pearl iridescence adding shine to base colors',
      'soft glow effects that pulse gently',
      'watercolor-like blending within the same hue',
      'lighter highlights on existing colors',
      'gentle luminescence in the original color palette'
    ]
  },
  bold: {
    physical: [
      'defined muscle structure appropriate for age',
      'thicker, armor-like hide or plating',
      'prominent claws built for digging or gripping',
      'powerful jaw structure',
      'ridge-like spines along back or limbs',
      'reinforced bone structure visible at joints',
      'broader stance and more grounded posture',
      'sharp, angular features',
      'rocky or crystalline protrusions',
      'metallic-sheen plating',
      'thick, protective mane',
      'enlarged limbs for power',
      'intimidating horns or tusks',
      'armored tail with defensive features'
    ],
    abilities: [
      'energy crackles along body when excited (in the base color)',
      'leaves small cracks in ground when landing',
      'can create minor shockwaves by stomping',
      'generates brief protective force fields',
      'channels elemental power visibly (glowing in base color)',
      'releases energy bursts from markings',
      'can temporarily harden skin to stone texture',
      'emanates visible intimidating aura'
    ],
    aesthetic: [
      'bold, contrasting patterns within the SAME color family',
      'metallic sheen or accents on existing colors',
      'tiger or zebra-like stripes in darker/lighter shades of base color',
      'geometric patterns in the existing color palette',
      'battle-scarred texture variations (same colors, worn look)',
      'crystalline facets reflecting the base colors',
      'deeper, more saturated version of the original colors',
      'dramatic shadows and highlights in the same hue'
    ]
  },
  curious: {
    physical: [
      'DRAMATICALLY elongated, graceful proportions (1.5x length increase)',
      'LONG, flowing ribbon-like appendages that trail visibly',
      'LARGE crystalline or glass-like features as focal points',
      'MULTIPLE tails (2-4 tails) with distinct shapes and purposes',
      'ELABORATE ornate crown or crest formations (prominent headpiece)',
      'LARGE translucent fins or membranes extending from body',
      'PROMINENT elaborate antennae or sensory organs (clearly visible)',
      'FLOATING accessories or features that levitate around creature',
      'BRILLIANT prismatic scales or feathers (shimmering in the base color)',
      'PROMINENT third eye or large mystical facial markings',
      'LARGE ethereal, semi-transparent sections in the BASE COLOR (not purple/blue)',
      'GLOWING rune-like patterns in the base color covering large body areas',
      'THICK sparkle particles in the BASE COLOR creating a mystical effect in fur/scales',
      'LARGE moon-phase or star-shaped features as body focal points (in the base color)'
    ],
    abilities: [
      'causes small objects nearby to float briefly',
      'leaves trails of stardust or cosmic particles',
      'becomes semi-transparent when concentrating',
      'opens tiny temporary portals (visual effect)',
      'bends light creating shimmering auras',
      'creates illusion duplicates briefly',
      'makes objects around it feel lighter',
      'channels raw magical energy as visible streams'
    ],
    aesthetic: [
      'swirling mystical patterns in the SAME base colors (NOT purple)',
      'subtle shimmer within the original hue only',
      'flowing energy patterns using ONLY the base color palette',
      'starlight sparkles and glitter effects on existing colors (same hue)',
      'prismatic shine that reflects the base colors only',
      'ethereal glow in the ORIGINAL color family (not twilight/purple)',
      'mystical luminescence enhancing the base colors (same color family)',
      'arcane rune patterns glowing in the ORIGINAL palette (not blue/purple)'
    ]
  }
};

export default evolutionTraitPools;
