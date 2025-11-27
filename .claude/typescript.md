# TypeScript Best Practices

- Always use TypeScript for all code in this project
- Never use `any`, always look for a better type

## Type Definitions

### Type vs Interface
- Use `type` for unions, intersections, mapped types, and utility types
- Use `interface` for object shapes that may be extended or implemented
- Prefer `interface` for public API definitions (composable returns, component props)
- Use `type` for internal utility types and type transformations

```ts
// ✅ Interface for public API
export interface UseCameraReturn {
  activeCamera: ComputedRef<TresCamera>
  cameras: Ref<TresCamera[]>
  registerCamera: (camera: TresCamera, active?: boolean) => void
}

// ✅ Type for unions
export type TresCamera = THREE.OrthographicCamera | THREE.PerspectiveCamera

// ✅ Type for transformations
export type NonFunctionKeys<P> = { [K in keyof P]-?: P[K] extends (...args: any[]) => any ? never : K }[keyof P]
```

### Type Exports
- ALWAYS use `export type` or `export interface` for type-only exports
- Group type exports together at the top of files or in dedicated `types/` directories
- Re-export types from barrel files (`index.ts`) for better discoverability

```ts
// ✅ Explicit type export
export type { TresPointerEvent } from '../utils/pointerEvents'

// ✅ Named type export
export type TresVector3 = VectorLike<THREE.Vector3>
```

## Type Annotations

### Function Return Types
- ALWAYS explicitly type function return values in public APIs
- ALWAYS explicitly type composable return values
- Use explicit return types for complex functions to catch errors early

```ts
// ✅ Explicit return type
export const useCameraManager = ({ sizes }: UseCameraParams): UseCameraReturn => {
  // ...
}

// ✅ Explicit return type for type guards
export const isCamera = (value: unknown): value is Camera => {
  // ...
}
```

### Function Parameters
- ALWAYS type parameters explicitly
- Use interfaces for complex parameter objects
- Destructure typed parameters when needed

```ts
// ✅ Typed parameters with interface
interface UseCameraParams {
  sizes: TresContext['sizes']
}

export const useCameraManager = ({ sizes }: UseCameraParams): UseCameraReturn => {
  // ...
}
```

## Type Guards

### Creating Type Guards
- Use the pattern `(value: unknown): value is Type` for type guards
- Create reusable type guard factories when appropriate
- Document type guards with JSDoc examples

```ts
// ✅ Reusable type guard factory
export const createTypeGuard = <T>(property: keyof T) =>
  (value: unknown): value is T =>
    isObject(value) && property in value && !!((value as T)[property])

// ✅ Specific type guard with JSDoc
/**
 * Type guard to check if a value is a Three.js Camera
 * @param value - The value to check
 * @returns True if the value is a Three.js Camera instance
 * @example
 * ```ts
 * if (isCamera(value)) {
 *   value.fov // TypeScript knows this is safe
 * }
 * ```
 */
export const isCamera = createTypeGuard<Camera>('isCamera')
```

## Generics

### Generic Constraints
- Use generic constraints to ensure type safety
- Provide sensible defaults for generics when possible
- Name generics descriptively (`T` for single generic, `TKey`, `TValue` for multiple)

```ts
// ✅ Constrained generics with defaults
export interface InstanceProps<T = any, P = any> {
  args?: Args<P>
  object?: T
  attach?: AttachType
}

// ✅ Utility type with generic constraints
export type Args<T> = T extends ConstructorRepresentation
  ? ConstructorParameters<T>
  : any[]
```

## Utility Types

### Built-in Utilities
- Prefer built-in utility types: `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`
- Use `Parameters<T>` and `ReturnType<T>` to extract function types
- Use `ConstructorParameters<T>` and `InstanceType<T>` for classes

```ts
// ✅ Using built-in utilities
export type Properties<T> = Pick<T, NonFunctionKeys<T>>
export type Overwrite<P, O> = Omit<P, NonFunctionKeys<O>> & O

// ✅ Extracting types from functions
export type TresLayers = THREE.Layers | Parameters<THREE.Layers['set']>[0]
```

### Custom Utility Types
- Create custom utility types for repeated patterns
- Document complex utility types with comments
- Keep utility types in a central `types/` directory

```ts
// ✅ Custom mapped type
export type Mutable<P> = {
  [K in keyof P]: P[K] | Readonly<P[K]>
}

// ✅ Conditional type with clear intent
export type NonFunctionKeys<P> = {
  [K in keyof P]-?: P[K] extends (...args: any[]) => any ? never : K
}[keyof P]
```

## Const Assertions

### Using `as const`
- Use `as const` for readonly arrays and objects
- Combine with `satisfies` to ensure type correctness while preserving literal types

```ts
// ✅ Const assertion with type validation
const SUPPORTED_EVENTS = [
  'onClick',
  'onPointerMove',
  'onPointerDown',
] as const satisfies readonly SupportedPointerEvents[]
```

## Type Safety Patterns

### Avoiding `any`
- Minimize use of `any` - use `unknown` instead when type is truly unknown
- Use type parameters and constraints instead of `any` in generics
- If `any` is necessary, document why with a comment

```ts
// ❌ Avoid
function process(data: any) { }

// ✅ Better - use unknown
function process(data: unknown) {
  if (typeof data === 'string') {
    // TypeScript knows data is string here
  }
}

// ✅ Best - use generics
function process<T>(data: T): T {
  return data
}
```

### Strict Null Checks
- ALWAYS have `strict: true` in `tsconfig.json`
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Type optional properties with `?` or `| undefined`

```ts
// ✅ Optional properties
interface Config {
  value?: string  // string | undefined
  count: number | null  // explicitly nullable
}

// ✅ Safe property access
const result = config.value?.toUpperCase() ?? 'DEFAULT'
```

## JSDoc Comments

### Public APIs
- ALWAYS document public functions, types, and interfaces with JSDoc
- Include `@param` for each parameter
- Include `@returns` for return values
- Include `@example` for non-obvious usage

```ts
/**
 * Composable for managing cameras in a Three.js scene
 * @param params - The parameters for the composable
 * @param params.sizes - The sizes object containing window dimensions
 * @returns The camera management functions and state
 */
export const useCameraManager = ({ sizes }: UseCameraParams): UseCameraReturn => {
  // ...
}
```

### Type Documentation
- Document complex types with inline comments
- Explain the purpose of utility types
- Document type constraints and limitations

```ts
/**
 * Union type covering all common Three.js material types
 * This provides better TypeScript intellisense and type checking
 * when accessing specific material properties
 */
export type TresMaterial =
  | THREE.MeshBasicMaterial
  | THREE.MeshStandardMaterial
  // ...
```

## Import/Export Patterns

### Type-only Imports
- Use `import type` for type-only imports to ensure they're erased at runtime
- Group type imports separately from value imports

```ts
// ✅ Type-only imports
import type { ComputedRef, Ref } from 'vue'
import type { TresContext } from '../useTresContextProvider'
import type { TresCamera } from '../../types'

// ✅ Value imports
import { computed, ref, watchEffect } from 'vue'
import { isCamera, isPerspectiveCamera } from '../../utils/is'
```

### Barrel Exports
- Use barrel files (`index.ts`) to organize exports
- Re-export everything from submodules
- Maintain flat export structure for better tree-shaking

```ts
// ✅ Barrel export in index.ts
export * from './dom'
export * from './three'
export * from './tres'
export * from './typed'
```

## tsconfig.json Settings

### Recommended Settings
Always use these compiler options:

```jsonc
{
  "compilerOptions": {
    "strict": true,                        // Enable all strict checks
    "noFallthroughCasesInSwitch": true,   // Catch switch fallthrough bugs
    "noUnusedLocals": true,               // Flag unused variables
    "noUnusedParameters": true,           // Flag unused parameters
    "isolatedModules": true,              // Ensure files can be transpiled individually
    "skipLibCheck": true,                 // Speed up compilation
    "moduleResolution": "bundler",        // Modern module resolution
    "resolveJsonModule": true,            // Import JSON files
    "allowImportingTsExtensions": true    // Allow .ts imports in source
  }
}
```

## Advanced Patterns

### Conditional Types
- Use conditional types for flexible type transformations
- Chain conditions for complex type logic
- Document conditional types clearly

```ts
// ✅ Conditional type for math props
export type MathType<T extends MathRepresentation | THREE.Euler> =
  T extends THREE.Color
    ? ConstructorParameters<typeof THREE.Color> | THREE.ColorRepresentation
    : T extends VectorRepresentation | THREE.Layers | THREE.Euler
      ? T | Parameters<T['set']> | number | VectorCoordinates
      : T | Parameters<T['set']>
```

### Template Literal Types
- Use template literal types for string manipulation at type level
- Combine with mapped types for powerful transformations

```ts
// ✅ Template literal type for component naming
type TresComponents = {
  [K in keyof ThreeInstances as `Tres${Capitalize<string & K>}`]: DefineComponent<ThreeInstances[K]>
}
```

### Module Augmentation
- Use module augmentation to extend third-party types
- Place augmentations in type definition files
- Document what you're augmenting and why

```ts
// ✅ Augmenting Vue's global components
declare module 'vue' {
  export interface GlobalComponents extends TresComponents {
    primitive: DefineComponent<TresPrimitive>
  }
}
```
