# OBSCURA design direction

## Visual direction

Graphite, aluminium, soft copper highlights and wide, restrained typography form a dark acoustic world. The main composition is central and axial. A large membrane occupies the scene, with SOUND TAKES SHAPE floating across it. There is no standard text-left, object-right hero.

The membrane is an original radial mesh. A vertex shader gives the surface real depth, opens a central passage, and resolves the same radial surface into a speaker cone. Fragment lighting uses the deformed surface derivatives, directional highlights, a copper strip and subtle concentric tooling. The driver basket, rim, hardware, coil and magnet are modeled independently.

## Reversible scene map

| Chapter | State | Meaning |
| --- | --- | --- |
| Sound takes shape | Close, centred metallic wave | Sound can be understood as movement |
| Go deeper | Membrane opens, camera passes through a sequence of thin wave rims | The visitor moves inside the same axial field |
| Nothing between | Camera returns at an oblique angle as the membrane becomes a driver cone | The wave has a physical source |
| A small revelation | Cone, rim, basket and magnet separate along the depth axis | The construction supports the experience |

All major camera and object transforms derive from native scroll. Pausing and reversing scroll preserves the current spatial state. The visual frequency and character are separate visitor-controlled parameters. Continuous wave motion and optional tone start only after a deliberate button click.

## Primary references and evidence limits

The following public pages were opened as text during this implementation:

- https://horizonx.so/tools/cobalt-sphere describes live folded geometry, surface parameters, rotation and reduced motion.
- https://horizonx.so/tools/tunnel-fold-slider describes an axial WebGL passage, depth changes, controlled deformation and rendering paused offscreen or hidden.
- https://horizonx.so/explore/vigil describes a real spatial passage into an architectural interior, rather than swapping unrelated hero images.

These are descriptions read from the author's primary pages, not a claim that their animations were watched by this subagent. No paid files, source exports, models, photos or textures were downloaded.

The main integrator separately reported actually watching Marcelo's reel DegAGlrtsJL, including a central dark helmet and an optical assembly separating along its longitudinal axis. The transferable principle used here is axial construction, small light-catching rims and precise material reveals. The acoustic model and scene are original, and do not reproduce the optical assembly.

## Performance architecture

The main membrane is one GPU-deformed mesh, with fewer radial and angular segments on narrow screens. The tunnel rings, basket struts and screws each submit as instanced sets. Lighting has no shadow passes. Reflections for conventional metal parts come from a small local procedural environment, prepared once. There is no full-page blur, video or postprocessing chain.

RAF stops once scroll and pointer state settle. Continuous movement is an explicit interaction, limited to approximately 30 render opportunities per second. Hidden and offscreen state cancel pending frames, and audio stops. DPR is capped and can reduce conservatively after sustained expensive CPU submissions. No device FPS or GPU timings are claimed from this heuristic.

Diagnostics on documentElement.dataset report renderFrames, drawCalls, triangles, renderDpr and renderMode. The counter increments immediately after a real renderer.render call, not for queued RAF callbacks.

## Interaction truth

The frequency is a visual and synthetic tone study. It is not a measurement of a physical acoustic product. The local specification records the selected frequency and character. No signup, order, payment or enquiry is implied. A CSS static illustration, semantic controls and downloadable notes remain if WebGL is unavailable.
