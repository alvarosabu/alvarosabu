void main()
{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 particle = texture2D(uParticles, uv);
    gl_FragColor = particle;
}