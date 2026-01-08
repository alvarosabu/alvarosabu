---
title: Shader Editor Test
description: Testing the interactive shader editor component
status: draft
date: 2026-01-08
thumbnail: /avatar.png
---

# Shader Editor Test

This is a test of the interactive shader editor component.

::shader-editor
::

## Custom Shader Example

Here's a shader with custom code:

::shader-editor{initialCode="uniform float uTime;\\nuniform vec2 uMouse;\\nvarying vec2 vUv;\\n\\nvoid main() {\\n  vec2 uv = vUv;\\n  vec3 color = vec3(uv.x, uv.y, sin(uTime));\\n  gl_FragColor = vec4(color, 1.0);\\n}"}
::
