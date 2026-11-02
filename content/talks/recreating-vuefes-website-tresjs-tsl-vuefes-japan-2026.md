---
title: "How I recreated Vue Fes Japan 2025 website using TresJS and TSL (WebGPU)"
description: "A walkthrough of how I rebuilt the Vue Fes Japan 2025 website 3D visuals with TresJS and the Three.js Shading Language (TSL) on WebGPU."
date: "2026-10-24"
url: ""
event:
  name: "Vue Fes Japan 2026"
  url: "https://vuefes.jp/2026/en/speaker/alvarosabu"
location: "Tokyo, Japan"
media: ""
slides: "https://vuefesjapan-2026.alvarosabu.dev/1"
pdf: ""
tags: ["TresJS", "Vue", "3D", "WebGPU", "TSL", "ThreeJS", "Shaders"]
---

# How I recreated Vue Fes Japan 2025 website using TresJS and TSL (WebGPU)

A walkthrough of how I rebuilt the Vue Fes Japan 2025 website 3D visuals with TresJS and the Three.js Shading Language (TSL) on WebGPU.

The original hero scene was built with raw Three.js r178. It pairs a V-shaped cone for Vue with a sphere inspired by the Japanese Hinomaru flag, masked by a custom suminagashi (ink-marbling) shader.

In this talk I show how I:

- Ported the scene into Vue with TresJS components
- Moved the GLSL shader logic to TSL
- Built the marbling effect from FBM noise and warped vector fields
- Animated the scene through a cycle of color palettes
- Handled the changes that come with WebGPU instead of WebGL

The goal is to show how to port an existing Three.js scene into Vue and keep complex shader effects organized in a component-driven architecture.

## Event Details

**Event:** [Vue Fes Japan 2026](https://vuefes.jp/2026/en/speaker/alvarosabu)
**Date:** October 24, 2026, 15:50 to 16:20
**Location:** OtemachiPlace Hall & Conference, Tokyo, Japan (MedPeer Track)
**Slides:** [View the slides](https://vuefesjapan-2026.alvarosabu.dev/1)
**Live demo:** [TresJS Lab experiment](https://lab.tresjs.org/experiments/vuefes-japan-2025)
