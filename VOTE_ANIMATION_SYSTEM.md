# Vote Animation System Documentation

## Overview

The Vote Animation System is a reusable, extensible feature that visually animates incoming votes before they update the UI. When a vote is received for an item, a small animated token (emoji) spawns at the top-left corner, flies toward the corresponding vote bar, and triggers a particle burst effect when it arrives. The vote bar then increments with its existing smooth animations.

## Architecture

### Components

#### 1. **useVoteAnimation Hook** (`src/hooks/useVoteAnimation.ts`)

A custom React hook that manages the lifecycle of animated vote tokens and maintains references to vote bars.

**Key Features:**
- Tracks active animation tokens with unique IDs
- Stores references to vote bar DOM elements
- Provides functions to register bars and spawn animations
- Handles automatic cleanup after animation completes

**API:**

```typescript
const {
  activeTokens,           // Array of currently animating tokens
  registerBarRef,         // Function to register bar DOM refs
  getTargetPosition,      // Get bounding box of a vote bar
  animateVoteToTarget,    // Spawn an animated token to a target
  clearAnimations,        // Clear all active animations
  animationConfig,        // Config object with duration, originX, originY
} = useVoteAnimation({ 
  duration: 800,   // Total animation duration in ms
  originX: 20,     // Origin X position in pixels
  originY: 20,     // Origin Y position in pixels
});
```

**Usage Example:**

```typescript
// In a parent component
const animationHook = useVoteAnimation({ duration: 800 });

// When a vote arrives, trigger animation:
animationHook.animateVoteToTarget('item1');

// Register vote bars in child components:
animationHook.registerBarRef('item1', voteBarRef);
```

#### 2. **VoteAnimationLayer Component** (`src/components/Shared/VoteAnimationLayer.tsx`)

A fixed-position overlay component that renders animated vote tokens as they fly toward their target bars.

**Props:**

```typescript
interface VoteAnimationLayerProps {
  activeTokens: VoteToken[];                              // Array of animating tokens
  getTargetPosition: (itemId: 'item1' | 'item2') => ({
    x: number;
    y: number;
    width: number;
    height: number;
  } | null);                                               // Function to get target bar position
  animationDuration: number;                              // Duration in ms
  originX: number;                                        // Origin X coordinate
  originY: number;                                        // Origin Y coordinate
}
```

**Features:**
- Renders emoji tokens (🔥1️⃣ or 🔥2️⃣) that animate from origin to target
- Creates 3-5 small particle burst effects at the impact point
- Uses framer-motion for smooth easing (cubic-ease-out)
- Automatically removes DOM elements after animation completes

### Integration Points

#### 1. **VoteBar Component** (`src/components/Shared/Votebar.tsx`)

Updated to register itself with the animation hook:

```typescript
// New prop
registerBarRef?: (itemId: 'item1' | 'item2', ref: React.RefObject<HTMLDivElement>) => void;

// In component
useEffect(() => {
  if (registerBarRef) {
    registerBarRef(itemId, barRef);
  }
}, [registerBarRef, itemId]);
```

#### 2. **TournamentItem Component** (`src/components/Tournament/TournamentItem.tsx`)

Passes the registration callback through to VoteBar:

```typescript
<VoteBar 
  votedUsers={votedUsers} 
  number={number} 
  registerBarRef={registerBarRef}  // New prop
/>
```

#### 3. **ActiveMatchView Component** (`src/components/Tournament/ActiveMatchView.tsx`)

Initializes the animation system and exposes the trigger function via ref:

```typescript
// Initialize hook
const {
  activeTokens,
  registerBarRef,
  getTargetPosition,
  animateVoteToTarget,
  animationConfig,
} = useVoteAnimation({ duration: 800 });

// Expose to parent via ref
React.useEffect(() => {
  if (animateVoteToTargetRef) {
    animateVoteToTargetRef.current = animateVoteToTarget;
  }
}, [animateVoteToTarget, animateVoteToTargetRef]);

// Render animation layer
<VoteAnimationLayer
  activeTokens={activeTokens}
  getTargetPosition={getTargetPosition}
  animationDuration={animationConfig.duration}
  originX={animationConfig.originX}
  originY={animationConfig.originY}
/>

// Pass registration callback to participant cards
<ParticipantCard
  registerBarRef={registerBarRef}
  // ... other props
/>
```

#### 4. **useTmiClient Hook** (`src/hooks/useTmiClient.ts`)

Updated to trigger animations when votes arrive:

```typescript
// New optional callback prop
interface UseTmiClientProps {
  // ... existing props
  onVoteReceived?: (itemKey: 'item1' | 'item2') => void;
}

// In message handler
if (votedItem) {
  votedUsers.current.add({username, votedItem});
  
  // Trigger animation before updating score
  if (onVoteReceived) {
    onVoteReceived(votedItem);
  }
  
  onScoreUpdate(currentMatchIndex, votedItem);
}
```

#### 5. **TournamentLivePage** (`src/app/tournaments/[id]/live/page.tsx`)

Connects everything together:

```typescript
// Create ref to hold animation function
const animateVoteToTargetRef = React.useRef<((itemId: 'item1' | 'item2') => void) | null>(null);

// Pass to useTmiClient
const { ... } = useTmiClient({
  // ... other props
  onVoteReceived: animateVoteToTargetRef.current || undefined,
});

// Pass ref to ActiveMatchView
<ActiveMatchView
  // ... other props
  animateVoteToTargetRef={animateVoteToTargetRef}
/>
```

## Data Flow

### Vote Animation Sequence

1. **Vote Received** (Twitch Chat)
   - TMI client receives message in chat
   - `useTmiClient` validates and processes vote
   - Calls `onVoteReceived(itemId)` callback

2. **Animation Triggered**
   - `animateVoteToTarget(itemId)` is called
   - Hook creates new `VoteToken` with unique ID
   - Token added to `activeTokens` state

3. **Rendering**
   - `VoteAnimationLayer` receives updated `activeTokens`
   - Renders emoji token at origin position with animation
   - Particle burst effect starts as token reaches bar

4. **Animation Complete**
   - Token removed from `activeTokens` after ~850ms
   - Vote bar updates with framer-motion scale/glow effects
   - DOM elements cleaned up

5. **Vote Count Incremented**
   - Vote bar width animates to new percentage
   - Vote count updates (handled by existing Votebar logic)

## Customization

### Adjusting Animation Duration

```typescript
// In ActiveMatchView
const animationHook = useVoteAnimation({ 
  duration: 1200  // Increase to 1.2 seconds
});
```

### Changing Origin Position

```typescript
const animationHook = useVoteAnimation({ 
  originX: 40,    // Move origin further from left edge
  originY: 40,    // Move origin further from top edge
});
```

### Modifying Easing Function

Edit `VoteAnimationLayer.tsx`:

```typescript
<motion.div
  animate={{ ... }}
  transition={{
    duration: animationDuration / 1000,
    ease: 'easeInOut',  // Change easing curve here
  }}
/>
```

Available easing functions: `linear`, `easeIn`, `easeOut`, `easeInOut`, `circIn`, `circOut`, `circInOut`, `backIn`, `backOut`, `backInOut`, `anticipate`

### Changing Particle Count

Edit `VoteAnimationLayer.tsx`:

```typescript
const particleCount = 5;  // Increase from 3 to 5
```

### Changing Token Emoji

Edit `VoteAnimationLayer.tsx`:

```typescript
const emoji = token.itemId === 'item1' ? '✨' : '🌟';  // Custom emojis
```

## Testing

### Manual Testing Checklist

- [ ] Vote for Item 1 in Twitch chat
  - Animated token appears at top-left
  - Token flies to Item 1's vote bar
  - Particle burst occurs at target
  - Vote bar increments
  
- [ ] Vote for Item 2
  - Same behavior for Item 2
  
- [ ] Multiple simultaneous votes
  - Send multiple votes rapidly
  - Verify all tokens animate smoothly
  - No animation conflicts or overlaps
  
- [ ] Animation parameters
  - Duration feels natural (not too fast/slow)
  - Origin position appropriate
  - Particles visible but not overwhelming
  
- [ ] Edge cases
  - Vote bar not yet visible (animation targets null)
  - Rapid match changes
  - Tournament end/restart

### Browser DevTools

1. Open DevTools → Performance tab
2. Record during vote animation
3. Check for smooth 60fps animation
4. Verify no memory leaks

## Performance Considerations

- **Max Simultaneous Animations:** System designed for 10-20 concurrent animations without performance issues
- **DOM Nodes:** Each token creates 1 DOM node + 3-5 particle nodes (~25 nodes max)
- **Re-renders:** Animation state isolated to layer component only
- **CPU:** GPU-accelerated CSS transforms via framer-motion

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires ES6+ and CSS Transforms support

## Future Enhancements

- [ ] Sound effects on vote arrival
- [ ] Vote counter animation at origin point
- [ ] Custom emoji per item configuration
- [ ] Theme-based particle colors
- [ ] Vote streak effects (multiple votes same user)
- [ ] Replay animation queue on tournament end

## Troubleshooting

### Animation not appearing

**Check:**
1. Is `animateVoteToTargetRef` properly connected in TournamentLivePage?
2. Are vote bars rendering (not returning null)?
3. Is `VoteAnimationLayer` rendered in DOM?

**Debug:**
```typescript
// In useVoteAnimation
console.log('Token spawned:', tokenId);
console.log('Target position:', getTargetPosition(itemId));
```

### Animations stuttering

**Possible causes:**
- Duration too short for current hardware
- Other heavy animations running
- Browser tab not in focus (requestAnimationFrame throttling)

**Solution:**
- Increase duration to 1000+ms
- Close other tabs
- Check browser performance settings

### Vote bars not registering refs

**Check:**
1. Is `registerBarRef` prop being passed?
2. Is `useEffect` calling `registerBarRef` in VoteBar component?
3. Check browser console for errors

**Debug:**
```typescript
// In VoteBar useEffect
console.log('Registering ref for', itemId);
```

## API Reference

### useVoteAnimation(config)

```typescript
interface AnimationConfig {
  duration?: number;  // Default: 800
  originX?: number;   // Default: 20
  originY?: number;   // Default: 20
}

returns {
  activeTokens: VoteToken[];
  registerBarRef: (itemId: 'item1' | 'item2', ref: React.RefObject<HTMLDivElement>) => void;
  getTargetPosition: (itemId: 'item1' | 'item2') => TargetPosition | null;
  animateVoteToTarget: (itemId: 'item1' | 'item2') => void;
  clearAnimations: () => void;
  animationConfig: AnimationConfig;
}
```

### VoteToken

```typescript
interface VoteToken {
  id: string;                    // Unique identifier
  itemId: 'item1' | 'item2';    // Target item
  startTime: number;            // Timestamp when created
}
```

### TargetPosition

```typescript
interface TargetPosition {
  x: number;      // Center X of target bar
  y: number;      // Center Y of target bar
  width: number;  // Width of target bar
  height: number; // Height of target bar
}
```

---

**Last Updated:** December 9, 2025
**System Version:** 1.0
