<template>
  <figure class="not-prose my-8">
    <svg
      viewBox="0 0 600 280"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full max-w-2xl mx-auto"
      aria-label="Fresnel effect geometry diagram"
    >
      <defs>
        <marker id="arrow-fresnel" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="currentColor" />
        </marker>
      </defs>

      <!-- LEFT SCENARIO: Head-on -->
      <g transform="translate(30, 20)">
        <text x="110" y="18" text-anchor="middle" font-size="11" class="fill-current opacity-60">Head-on view</text>

        <!-- Surface -->
        <line x1="20" y1="160" x2="200" y2="160" stroke="currentColor" stroke-width="2" opacity="0.4" />
        <text x="110" y="178" text-anchor="middle" font-size="10" class="fill-current opacity-40">surface</text>

        <!-- Normal N -->
        <line x1="110" y1="160" x2="110" y2="60" stroke="#88ccff" stroke-width="2" marker-end="url(#arrow-fresnel)" />
        <text x="120" y="58" font-size="11" fill="#88ccff" font-weight="bold">N</text>

        <!-- View direction V (near-parallel to N) -->
        <line x1="110" y1="160" x2="120" y2="62" stroke="#ffd580" stroke-width="2" marker-end="url(#arrow-fresnel)" />
        <text x="130" y="62" font-size="11" fill="#ffd580" font-weight="bold">V</text>

        <!-- Angle arc -->
        <path d="M 110,110 A 10,10 0 0,1 117,108" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5" />
        <text x="122" y="112" font-size="10" class="fill-current opacity-60">θ≈0°</text>

        <!-- Formula result -->
        <rect x="40" y="195" width="140" height="58" rx="6" fill="currentColor" opacity="0.06" />
        <text x="110" y="213" text-anchor="middle" font-size="10" class="fill-current opacity-50">N·V ≈ 1</text>
        <text x="110" y="228" text-anchor="middle" font-size="10" class="fill-current opacity-50">(1 − 1)ᵖ = 0</text>
        <text x="110" y="245" text-anchor="middle" font-size="11" fill="#88ccff" font-weight="600">→ transparent core</text>
      </g>

      <!-- Divider -->
      <line x1="300" y1="20" x2="300" y2="265" stroke="currentColor" stroke-width="1" stroke-dasharray="4,4" opacity="0.2" />

      <!-- RIGHT SCENARIO: Grazing -->
      <g transform="translate(320, 20)">
        <text x="110" y="18" text-anchor="middle" font-size="11" class="fill-current opacity-60">Grazing view</text>

        <!-- Surface -->
        <line x1="20" y1="160" x2="200" y2="160" stroke="currentColor" stroke-width="2" opacity="0.4" />
        <text x="110" y="178" text-anchor="middle" font-size="10" class="fill-current opacity-40">surface</text>

        <!-- Normal N -->
        <line x1="110" y1="160" x2="110" y2="60" stroke="#88ccff" stroke-width="2" marker-end="url(#arrow-fresnel)" />
        <text x="120" y="58" font-size="11" fill="#88ccff" font-weight="bold">N</text>

        <!-- View direction V (near-horizontal, grazing) -->
        <line x1="110" y1="160" x2="30" y2="115" stroke="#ffd580" stroke-width="2" marker-end="url(#arrow-fresnel)" />
        <text x="16" y="112" font-size="11" fill="#ffd580" font-weight="bold">V</text>

        <!-- Angle arc -->
        <path d="M 110,110 A 30,30 0 0,0 90,142" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5" />
        <text x="68" y="130" font-size="10" class="fill-current opacity-60">θ≈90°</text>

        <!-- Formula result -->
        <rect x="40" y="195" width="140" height="58" rx="6" fill="currentColor" opacity="0.06" />
        <text x="110" y="213" text-anchor="middle" font-size="10" class="fill-current opacity-50">N·V ≈ 0</text>
        <text x="110" y="228" text-anchor="middle" font-size="10" class="fill-current opacity-50">(1 − 0)ᵖ = 1</text>
        <text x="110" y="245" text-anchor="middle" font-size="11" fill="#ffd580" font-weight="600">→ bright edge</text>
      </g>
    </svg>
    <figcaption class="text-center text-sm opacity-50 mt-2">
      N·V measures how directly you face a surface. At the edges, N and V diverge → N·V → 0 → bright rim.
    </figcaption>
  </figure>
</template>
