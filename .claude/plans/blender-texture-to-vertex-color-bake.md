# Blender Script: Bake Base Color Texture to Vertex Colors

## Requirements

- **Blender Version**: 5.0+ compatible
- **Target Engine**: Cycles native bake
- **Selection**: Process all selected mesh objects
- **Multi-material Support**: Bake per-face material assignment (vertex colors match the material slot assigned to each face)
- **No Texture Handling**: Skip objects without base color textures
- **Existing Vertex Colors**: Overwrite (replace or create new attribute)
- **Texture Preservation**: NEVER modify original textures, use temporary textures for baking only
- **Material State**: Restore all original material node setups after baking

## Architecture

### Core Components

1. **Object Validator**
   - Filter selected objects for mesh types only
   - Check if object has materials with node trees
   - Verify objects have UV maps
   - Check materials have base color textures connected

2. **Material State Manager**
   - Store original material node setup (active nodes, connections)
   - Create temporary image for baking (resolution based on UV density or user setting)
   - Insert temporary Image Texture node into each material
   - Set temp node as active for baking target
   - Restore original material state after processing

3. **Cycles Bake Controller**
   - Configure bake settings (type: DIFFUSE, pass: COLOR only)
   - Set render engine to Cycles temporarily if needed
   - Execute `bpy.ops.object.bake()` per object
   - Handle bake errors and failures

4. **Vertex Color Manager**
   - Create or replace vertex color attribute (CORNER domain for UV accuracy)
   - Handle attribute naming (attribute name: "Color")
   - Manage color data structure

5. **Texture to Vertex Color Converter**
   - Read pixel data from baked temporary image
   - Map UV coordinates to pixel coordinates
   - Iterate through mesh loops (face corners)
   - Assign sampled colors to vertex color attribute

6. **Cleanup Manager**
   - Remove temporary bake images from `bpy.data.images`
   - Remove temporary Image Texture nodes from materials
   - Restore original active nodes
   - Clear orphaned data blocks

## Workflow

```
1. Store current render engine
   ↓
2. Switch to Cycles if needed
   ↓
3. Get selected objects
   ↓
4. Filter for mesh objects with materials and UV maps
   ↓
5. For each valid object:
   │
   ├─ SETUP PHASE
   │  ├─ Validate object has materials with base color textures
   │  ├─ Store original material state for ALL materials:
   │  │  - Active node in each material
   │  │  - Current selection state
   │  │
   │  ├─ Create temporary bake image (e.g., 2048x2048, RGBA)
   │  │  - Name: "_TEMP_BAKE_[object_name]"
   │  │  - Float: False (8-bit sufficient for vertex colors)
   │  │  - Alpha: True
   │  │
   │  └─ For each material in object:
   │     ├─ Add temporary Image Texture node
   │     ├─ Assign temp bake image to node
   │     ├─ Select node and set as active (required for bake target)
   │     └─ Store reference to temp node for cleanup
   │
   ├─ BAKE PHASE
   │  ├─ Select object (ensure it's the only active object)
   │  ├─ Configure bake settings:
   │  │  - bake_type: 'DIFFUSE'
   │  │  - pass_filter: {'COLOR'}  (exclude Direct/Indirect)
   │  │  - use_clear: True
   │  │  - margin: 0 (no margin needed for vertex colors)
   │  │
   │  ├─ Execute: bpy.ops.object.bake(type='DIFFUSE')
   │  └─ Wait for bake completion
   │
   ├─ TRANSFER PHASE
   │  ├─ Create/replace "Color" vertex color attribute (CORNER domain)
   │  ├─ Get active UV layer
   │  ├─ Get temp baked image pixel data
   │  │
   │  ├─ For each mesh loop (face corner):
   │  │  ├─ Get UV coordinate from loop
   │  │  ├─ Convert UV to pixel coords (u*width, v*height)
   │  │  ├─ Sample pixel color from baked image
   │  │  └─ Assign to vertex color attribute at loop index
   │  │
   │  └─ Update mesh data
   │
   ├─ CLEANUP PHASE
   │  ├─ For each material in object:
   │  │  ├─ Remove temporary Image Texture node
   │  │  └─ Restore original active node
   │  │
   │  ├─ Remove temporary bake image from bpy.data.images
   │  └─ Clear unused data (bpy.data.images.remove(...))
   │
   └─ Report success/failure

6. Restore original render engine
   ↓
7. Report summary (processed, skipped, failed objects)
```

## Technical Challenges

### 1. Material State Preservation
- **Critical**: Store and restore original active nodes in each material
- Handle materials that may not have any active node initially
- Preserve node selection state during bake process
- Use `material.node_tree.nodes.active` to get/set active node

### 2. Cycles Bake Target Setup
- Temporary Image Texture node MUST be:
  - Added to each material's node tree
  - Set as the active node (not just selected)
  - Does NOT need to be connected to shader output
- Blender bakes to the active node's image regardless of connections
- Multi-material objects: Each material needs its own temp node with same image

### 3. Bake Settings and Context
- `bpy.ops.object.bake()` is context-sensitive
- Requires correct object selection and active object
- Must be in OBJECT mode (not edit mode)
- Bake type: 'DIFFUSE' with pass_filter={'COLOR'} for texture color only
- No lighting contribution needed (use_pass_direct=False, use_pass_indirect=False)

### 4. Texture to Vertex Color Transfer
- Baked image pixel data accessed via `image.pixels[:]` (linear RGBA array)
- UV coords (0-1 range) → pixel coords: `(int(u * width), int(v * height))`
- Handle UV wrapping/clamping at edges (0.0 and 1.0)
- Pixel array index: `((y * width) + x) * 4` for RGBA
- Color attributes in Blender 5.0: Use `mesh.color_attributes` API

### 5. Vertex Color Domain (CORNER vs POINT)
- **CORNER domain** (recommended): One color per loop (face corner)
  - Matches UV mapping exactly (one UV per loop)
  - Preserves color variation at UV seams
  - Better for multi-material objects
- **POINT domain**: One color per vertex
  - Averaged across all faces sharing vertex
  - Can cause color bleeding at material boundaries

### 6. Blender 5.0 API Changes
- Verify color attribute API: `mesh.color_attributes.new()` vs legacy `mesh.vertex_colors`
- Check if `bpy.ops.object.bake()` parameters changed
- Ensure Image Texture node creation compatible
- Handle potential deprecation warnings

### 7. Memory and Performance
- Temp bake image resolution affects quality and memory
- Suggested: 1024x1024 for low poly, 2048x2048 for medium, 4096x4096 for high detail
- Reading full pixel buffer (`image.pixels[:]`) loads entire image to memory
- Process objects sequentially to manage memory with large textures

## Implementation Steps

1. **Environment Setup**
   ```python
   - Check Blender version (5.0+)
   - Store original render engine (context.scene.render.engine)
   - Switch to 'CYCLES' if not already active
   - Store original bake settings for restoration
   ```

2. **Object Validation Function**
   ```python
   def validate_object(obj):
       # Check if mesh
       # Check has materials with node trees
       # Check has UV map
       # Check materials have base color textures
       # Return True/False and reason for failure
   ```

3. **Material State Management**
   ```python
   def store_material_state(obj):
       # Return dict: {material: {'active_node': node, 'temp_node': None}}

   def restore_material_state(obj, state_dict):
       # Restore active nodes
       # Remove temp nodes
   ```

4. **Temporary Bake Setup**
   ```python
   def create_bake_target(obj, resolution=2048):
       # Create temp image: bpy.data.images.new()
       # For each material in obj:
       #   - Create ShaderNodeTexImage
       #   - Assign temp image
       #   - Set as active node
       # Return temp_image, temp_nodes_dict
   ```

5. **Cycles Bake Execution**
   ```python
   def bake_object_textures(obj):
       # Ensure object is selected and active
       # Set mode to 'OBJECT'
       # Configure scene.render.bake settings
       # Execute: bpy.ops.object.bake(type='DIFFUSE')
       # Handle errors (try/except)
   ```

6. **Vertex Color Transfer**
   ```python
   def transfer_to_vertex_colors(obj, baked_image):
       # Create/replace "Color" attribute (CORNER domain)
       # Get UV layer
       # Get pixel data from baked_image
       # For each loop:
       #   - Get UV
       #   - Sample pixel at UV
       #   - Assign to color attribute
   ```

7. **Cleanup Function**
   ```python
   def cleanup_bake_data(temp_image, material_state):
       # Remove temp nodes from materials
       # Remove temp image from bpy.data.images
       # Restore original active nodes
   ```

8. **Main Orchestration**
   ```python
   def bake_textures_to_vertex_colors():
       # Setup environment
       # Filter and validate objects
       # For each object:
       #   - Store material state
       #   - Create bake target
       #   - Bake
       #   - Transfer to vertex colors
       #   - Cleanup
       # Restore render engine
       # Report summary
   ```

9. **Error Handling**
   - Bake operation failure (Cycles errors)
   - Missing UV maps
   - Materials without base color
   - Out of memory (large textures)
   - Blender version incompatibility

10. **User Feedback**
    - Progress per object (current/total)
    - Detailed warnings for skipped objects
    - Success/failure summary
    - Estimated time remaining for large batches

## Data Structures

### Material State Dictionary
```python
material_state = {
    material_ref: {
        'original_active_node': bpy.types.Node or None,
        'temp_texture_node': bpy.types.ShaderNodeTexImage,
        'has_base_color_texture': bool
    }
}
```

### Bake Configuration
```python
bake_config = {
    'resolution': int,              # Default: 2048
    'temp_image': bpy.types.Image,
    'bake_type': 'DIFFUSE',
    'pass_filter': {'COLOR'},
    'use_clear': True,
    'margin': 0
}
```

### Processing Result
```python
result = {
    'processed': [obj1, obj2, ...],
    'skipped': [
        {'object': obj, 'reason': 'No UV map'},
        {'object': obj, 'reason': 'No base color texture'}
    ],
    'failed': [
        {'object': obj, 'error': 'Bake operation failed'}
    ]
}
```

## Performance Considerations

- **Bake Resolution**: Balance quality vs speed/memory
  - 1024x1024: Fast, low memory, suitable for low-poly models
  - 2048x2048: Good balance (recommended default)
  - 4096x4096: High quality, slower, high memory usage

- **Sequential Processing**: Process one object at a time to manage memory
  - Each bake loads temp image into memory
  - Cleanup between objects prevents memory buildup

- **Pixel Data Access**: `image.pixels[:]` loads entire image buffer
  - For 2048x2048 RGBA: ~16MB per object
  - For 4096x4096 RGBA: ~64MB per object

- **Mesh Access**: Direct mesh data access is sufficient
  - No need for BMesh unless doing topology modifications
  - `mesh.loops` and `mesh.uv_layers` provide adequate performance

- **Bake Time**: Cycles baking is the bottleneck
  - Depends on shader complexity and bake resolution
  - GPU acceleration if available (check Cycles device settings)

- **Material Node Cleanup**: Use try/finally to ensure cleanup happens
  - Prevents orphaned temp nodes if errors occur
  - Prevents memory leaks from temp images

## Future Enhancements

- **Multiple Attribute Support**: Bake other maps to separate vertex color attributes
  - Metallic → "Metallic" attribute
  - Roughness → "Roughness" attribute
  - Normal maps → vertex normal manipulation

- **Configurable Bake Resolution**: Add user preference or auto-detect based on UV density

- **Batch Processing**: Command-line support for processing multiple files

- **Alternative Bake Types**:
  - COMBINED: Bake with lighting
  - EMIT: For emissive materials

- **Multiple UV Map Support**: Allow user to choose which UV map to use

- **Optimization**:
  - GPU acceleration detection and recommendation
  - Adaptive resolution based on object complexity
  - Multi-threading for pixel transfer phase

- **Quality Control**:
  - Preview before committing
  - Comparison view (texture vs vertex colors)
  - Quality metrics (color accuracy)

## Critical Implementation Notes

### Blender 5.0 Compatibility Checklist

1. **Color Attributes API**:
   ```python
   # Blender 4.0+/5.0 way
   color_attr = mesh.color_attributes.new(
       name="Color",
       type='BYTE_COLOR',  # or 'FLOAT_COLOR'
       domain='CORNER'     # or 'POINT'
   )
   # Access: mesh.color_attributes["Color"].data[loop_index].color
   ```

2. **Bake Operator Parameters** (verify in Blender 5.0):
   ```python
   bpy.ops.object.bake(
       type='DIFFUSE',
       pass_filter={'COLOR'},  # Exclude lighting
       use_clear=True,
       margin=0
   )
   ```

3. **Image Texture Node Creation**:
   ```python
   node = material.node_tree.nodes.new('ShaderNodeTexImage')
   node.image = temp_bake_image
   material.node_tree.nodes.active = node  # Critical for bake target
   ```

### Safety Guarantees

1. **Original Texture Preservation**:
   - NEVER modify `node.image` on existing Image Texture nodes
   - Only create NEW temp nodes, never reuse existing ones
   - Temp images have unique names: `_TEMP_BAKE_{obj.name}_{timestamp}`

2. **Material State Restoration**:
   - Store active node BEFORE any modifications
   - Use try/finally blocks to guarantee restoration
   - Handle None case (materials with no active node)

3. **Cleanup Verification**:
   ```python
   try:
       # Setup and bake
   finally:
       # ALWAYS execute:
       # - Remove temp nodes
       # - Remove temp images
       # - Restore active nodes
   ```

### Common Pitfalls to Avoid

1. **Don't connect temp bake node**: Blender bakes to active node's image regardless of connections
2. **Don't forget multi-material objects**: Each material needs a temp node
3. **Don't skip OBJECT mode check**: Bake operator fails in EDIT mode
4. **Don't use wrong domain**: CORNER domain required for per-face material accuracy
5. **Don't skip cleanup on errors**: Use finally blocks to prevent orphaned data

### Testing Checklist

- [ ] Single object, single material
- [ ] Single object, multiple materials
- [ ] Multiple objects, mixed materials
- [ ] Object without UV map (should skip)
- [ ] Material without base color texture (should skip)
- [ ] Very high poly object (performance test)
- [ ] Different bake resolutions (1024, 2048, 4096)
- [ ] Error during bake (verify cleanup happens)
- [ ] Blender 5.0 API compatibility
