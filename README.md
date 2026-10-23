# OBSCURA O / 01

A standalone acoustic object study with a full-screen spatial membrane. Native scrolling opens the wave into a tunnel, carries the camera through it, then reveals an original driver assembly with cone, basket and magnet.

## Run

Serve this folder through any static HTTP server. No build, installation, CDN, remote fonts, remote models, backend or analytics are required. For GitHub Pages, publish the folder as a repository root. All resource paths are relative, and .nojekyll is included.

## Interactions

- Frequency changes the actual membrane pattern and optional synthetic tone.
- Pure, Overtone and Pulse change the wave's character.
- Move the wave enables continuous movement only after a click. The initial scene settles and stops rendering after scroll or pointer activity stops.
- Tone off is the initial audio state. Sound is created only by clicking the tone button, at a low fixed gain. The tone stops when the tab is hidden or the story leaves the viewport.
- Object notes show the current frequency and character. Download study notes creates a local text specification. No enquiry or order is sent.
- The native modal dialog supports Escape and normal focus return. Reduced motion uses discrete chapter states and suppresses autonomous wave movement.

## Performance and fallback

The membrane deforms in its vertex shader. Wave tunnel rings, basket supports and screws use instanced geometry. There are no shadow passes and no postprocessing pipeline. DPR starts at a cap of 1.4 on desktop and 1 on narrow screens. RAF runs on demand, and continuous movement after an explicit click is limited to approximately 30 render opportunities per second. Hidden and offscreen state cancels pending RAF.

The DOM exposes actual rendered frame count, calls, triangles, DPR and mode through documentElement.dataset. These are diagnostic observations, not proof of a particular device's FPS.

If WebGL cannot initialize, the local CSS acoustic illustration appears while the configuration and notes remain available. The object is a design concept, not a certified loudspeaker, acoustic measurement or product in production.

Independent concept by BlackStack Studio, 2026.

## iPhone Safari composition, October2026

The mobile experience now reserves explicit photographic or live-model frames in normal document flow. It does not move the hero object into arbitrary gaps between text blocks. Header, content, forms and footer share the mobile reading grid; desktop retains its cinematic composition. Exact local static font weights avoid variable-default differences across browser engines. Relevant touch interactions, portrait/landscape transitions and live scene visibility were checked in Playwright WebKit. This is browser emulation, not a physical iPhone test.
