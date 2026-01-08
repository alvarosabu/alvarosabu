# Interactive Shader Editor Component - Implementation Plan

## Overview
Create an MDC component (`::shader-editor`) for Nuxt Content blog posts that allows readers to edit fragment shaders with live preview, similar to The Book of Shaders.

## User Requirements
- **Fragment shaders only** (vertex shader fixed/default)
- **Tabbed UI**: Switch between editor and canvas output
- **Built-in uniforms**: `uTime`, `uResolution`, `uMouse` auto-injected
- **Error display**: Live validation with error messages
- **Export functionality**: Copy shader code
- **Monaco Editor + TresJS** for future extensibility (later showing full TresJS Vue components)
- **SSG compatible**: Lazy-load Monaco client-side only

## Architecture

### Component Structure
```
app/components/shader-editor/
├── ShaderEditor.vue              # Main MDC component (tabs, state, export)
├── ShaderEditorCanvas.vue        # TresCanvas wrapper
├── ShaderEditorExperience.vue    # 3D scene with shader plane
├── ShaderEditorMonaco.vue        # Monaco editor (client-only)
├── composables/
│   ├── useShaderCompiler.ts      # Error parsing & validation
│   ├── useShaderUniforms.ts      # Uniform management (uTime, uResolution, uMouse)
│   └── useMonacoGLSL.ts          # GLSL language registration
├── shaders/
│   ├── default-vertex.glsl       # Fixed vertex shader (full-screen quad)
│   └── default-fragment.glsl     # Example fragment shader
└── types.ts                      # TypeScript interfaces
```

### Data Flow
1. User edits code in Monaco → emits `update:modelValue`
2. `ShaderEditor.vue` updates `shaderCode` ref
3. Code passed to `ShaderEditorCanvas` → `ShaderEditorExperience`
4. Experience creates `ShaderMaterial` with custom fragment shader
5. Compilation errors caught → emitted back to `ShaderEditor` → displayed in `<UAlert>`

## Key Implementation Details

### 1. ShaderEditor.vue (Main Component)
- **Props**: `initialCode`, `height`, `showLineNumbers`, `readonly`
- **State**: `activeTab` ('editor' | 'preview'), `shaderCode`, `compilationError`
- **UI**: Nuxt UI v4 components (`<UTabs>`, `<UCard>`, `<UButton>`, `<UAlert>`)
- **Features**:
  - Tab switching between editor and preview
  - Copy code button with clipboard API
  - Error display with line numbers
  - Dark mode support via `useDarkMode()`
- **Usage in markdown**: `::shader-editor{initialCode="..."}`

### 2. ShaderEditorCanvas.vue (TresCanvas Wrapper)
- Follows pattern from `app/components/home/raging-sea/index.vue`
- Props: `shaderCode` (reactive)
- Emits: `compile-error`
- Uses `window-size` for auto-resizing
- Dark mode: Dynamic `clear-color` based on `isDark`

### 3. ShaderEditorExperience.vue (3D Scene)
- Follows pattern from `app/components/home/raging-sea/Experience.vue`
- **Geometry**: `TresPlaneGeometry` (full-screen quad, 2x2)
- **Camera**: `TresOrthographicCamera` at `[0, 0, 1]`
- **Uniforms**: Auto-injected via `useShaderUniforms()`
  - `uTime`: Updated via `useLoop().onBeforeRender()`
  - `uResolution`: Updated on window resize
  - `uMouse`: Normalized coordinates (-1 to 1), tracked via `usePointer()`
- **Shader Material**: Computed property that creates `ShaderMaterial` with:
  - Fixed vertex shader (default-vertex.glsl)
  - Dynamic fragment shader (from props)
  - Try-catch for compilation errors → emit to parent
- **Reactivity**: Watch `normalizedMouse` to update uniform

### 4. ShaderEditorMonaco.vue (Editor)
- **Client-only**: Wrapped in `<ClientOnly>` with loading fallback
- **Props**: `modelValue` (v-model), `readonly`, `showLineNumbers`
- **Emits**: `update:modelValue` on code change
- **Setup**:
  - Register GLSL language via `useMonacoGLSL()`
  - Create editor with dynamic theme (dark/light)
  - Listen for content changes → emit to parent
  - Watch for external code changes → update editor
  - Watch for theme changes → update Monaco theme
  - Dispose on unmount
- **Config**: No minimap, auto-layout, 14px font, no scroll beyond last line

### 5. Composables

#### useShaderUniforms.ts
- Creates reactive uniforms object with `new Uniform()`
- Uses `usePointer()` from `@vueuse/core` for mouse tracking
- Uses `useLoop().onBeforeRender()` for time updates
- Handles window resize for resolution updates
- Returns: `{ uniforms, normalizedMouse, updateResolution }`

#### useShaderCompiler.ts
- `parseWebGLError()`: Extract line numbers and messages from WebGL errors (e.g., "ERROR: 0:5: 'foo' : undeclared identifier")
- `validateShaderSyntax()`: Basic checks (has `main()`, sets `gl_FragColor`)
- Returns: `{ success, error, lineNumber, message }`

#### useMonacoGLSL.ts
- Registers GLSL as custom language in Monaco
- Defines tokenizer with keywords, types, built-ins
- Configures comments, brackets, auto-closing pairs
- Prevents duplicate registration via `isRegistered` ref

### 6. Default Shaders

**default-vertex.glsl** (fixed):
```glsl
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
```

**default-fragment.glsl** (example):
```glsl
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec3 color = vec3(
    0.5 + 0.5 * sin(uTime + uv.x * 3.0 + uMouse.x),
    0.5 + 0.5 * cos(uTime + uv.y * 3.0 + uMouse.y),
    0.5 + 0.5 * sin(uTime * 2.0)
  );
  gl_FragColor = vec4(color, 1.0);
}
```

## Technical Solutions

### SSG/SSR Compatibility
- Monaco Editor wrapped in `<ClientOnly>` tag
- Skeleton loader during hydration
- No server-side rendering of Monaco code
- Prevents DOM API errors during build

### Shader Compilation Error Handling
- Try-catch around `ShaderMaterial` creation
- Parse WebGL error messages for line numbers
- Display in `<UAlert>` with clear formatting
- Pre-validation before WebGL compilation

### Real-time Performance
- Uniforms as `new Uniform()` instances (Three.js pattern)
- `useLoop().onBeforeRender()` for per-frame updates (not `useRenderLoop`)
- Vue `watch()` for mouse position (not every frame)
- Window resize listener (debounced via event)

### Dark Mode
- Sync Monaco theme with `useDarkMode().isDark`
- Watch and update via `monaco.editor.setTheme()`
- TresCanvas `clear-color` reactive prop
- Consistent with existing patterns

## Dependencies

Add to `package.json`:
```json
{
  "dependencies": {
    "monaco-editor": "^0.45.0"
  }
}
```

## Implementation Sequence

### Phase 1: Infrastructure (Shaders & Types)
- [ ] Create `app/components/shader-editor/` directory
- [ ] Create `shaders/default-vertex.glsl`
- [ ] Create `shaders/default-fragment.glsl`
- [ ] Create `types.ts` with interfaces
- [ ] Install `monaco-editor` dependency

### Phase 2: Composables
- [ ] Implement `composables/useShaderUniforms.ts`
- [ ] Implement `composables/useShaderCompiler.ts`
- [ ] Implement `composables/useMonacoGLSL.ts`

### Phase 3: 3D Components
- [ ] Create `ShaderEditorExperience.vue` (shader plane + uniforms)
- [ ] Create `ShaderEditorCanvas.vue` (TresCanvas wrapper)
- [ ] Test shader rendering and uniform updates in isolation

### Phase 4: Editor
- [ ] Create `ShaderEditorMonaco.vue` (client-only wrapper)
- [ ] Test GLSL syntax highlighting
- [ ] Verify SSG compatibility (no build errors)

### Phase 5: Main Component
- [ ] Create `ShaderEditor.vue` (tabs, state, export)
- [ ] Integrate Monaco and Canvas components
- [ ] Implement error display with `<UAlert>`
- [ ] Add copy functionality with Clipboard API

### Phase 6: Polish
- [ ] Dark mode styling (watch `isDark` in all components)
- [ ] Mobile responsive design (test tab switching)
- [ ] Loading states (skeleton during Monaco load)
- [ ] Error message formatting improvements

### Phase 7: Integration & Testing
- [ ] Test in blog post via MDC (`::shader-editor`)
- [ ] Verify SSG build (`pnpm generate`)
- [ ] Test all features end-to-end

## Verification Checklist

After implementation, verify:
- [ ] SSG build completes without errors (`pnpm generate`)
- [ ] Monaco loads only client-side (check Network tab)
- [ ] Shader compiles and renders on canvas
- [ ] Mouse movement affects shader output
- [ ] Time-based animation works (`uTime` increments)
- [ ] Compilation errors display with line numbers
- [ ] Copy code button works (clipboard API)
- [ ] Dark mode switches Monaco theme and canvas background
- [ ] Mobile tabs work (no overflow issues)
- [ ] Component works in markdown: `::shader-editor{initialCode="..."}`
- [ ] No console errors or warnings
- [ ] Performance is smooth (60fps)

## Critical Reference Files

Follow patterns from:
- `app/components/home/raging-sea/Experience.vue` - Shader uniforms, `useLoop()`, reactive ShaderMaterial
- `app/components/home/raging-sea/index.vue` - TresCanvas wrapper with dark mode
- `app/components/home/raging-sea/shaders/fragment.glsl` - GLSL import pattern
- `app/composables/useDarkMode.ts` - Dark mode integration
- `app/pages/blog/[slug].vue` - MDC ContentRenderer usage
- `app/components/ImageCarousel.vue` - Example MDC component with `::` syntax

## Future Extensibility

This architecture supports:
1. **Full TresJS Vue components**: Switch Monaco language from 'glsl' to 'typescript', add Vue SFC runtime compilation
2. **Shader presets**: Add dropdown with example shaders
3. **Custom uniform controls**: UI sliders/inputs for user-defined uniforms
4. **Multiple geometries**: Choose between plane, sphere, torus, etc.
5. **Export as URL**: Generate shareable shader links with code in query params

## Notes

- Follow project standards: TypeScript, named exports, interfaces, TailwindCSS classes
- Use Nuxt UI v4 components (`<UTabs>`, `<UCard>`, `<UButton>`, `<UAlert>`, `<UIcon>`, `<USeparator>`)
- Dev server runs on `localhost:2590` with HMR - no need to restart
- Keep types alongside code (no separate `types/` folder needed)
- GLSL import support already enabled via `tres.glsl: true` in nuxt.config.ts
- Project uses `@nuxt/ui: ^4.3.0`
