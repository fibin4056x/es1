import { useEffect, useRef } from "react";

export default function LivingCoreShader({ opacity = 1.0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;
    let resizeObserver;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    // Vertex Shader Source
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader Source
    const fsSource = `
      precision highp float;

      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      #define PI 3.14159265359
      #define CYAN vec3(0.3, 0.8, 0.9)
      #define INDIGO vec3(0.4, 0.4, 0.95)
      #define PURPLE vec3(0.6, 0.3, 0.9)
      #define BG_COLOR vec3(0.02, 0.02, 0.03)

      mat2 rotate2d(float _angle){
          return mat2(cos(_angle),-sin(_angle),
                      sin(_angle),cos(_angle));
      }

      float sdCapsule(vec2 p, vec2 a, vec2 b, float r) {
          vec2 pa = p - a, ba = b - a;
          float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          return length(pa - ba * h) - r;
      }

      void main() {
          vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
          vec2 mouse = (u_mouse.xy / u_resolution.xy) * 2.0 - 1.0;
          mouse.y *= -1.0;

          // Kinetic Interaction
          float mouseFocus = smoothstep(0.7, 0.0, length(uv - mouse));
          uv -= mouse * 0.06 * mouseFocus;

          vec3 color = BG_COLOR;
          float t = u_time * 0.4;

          // --- CENTRAL BLOSSOM CORE ---
          float coreDist = length(uv);
          float breathing = 0.9 + 0.1 * sin(u_time * 0.8);
          float coreGlow = 0.06 / pow(coreDist, 1.3);
          color += INDIGO * coreGlow * breathing;
          color += CYAN * (0.015 / coreDist) * breathing;

          // --- SPIRALING KNOWLEDGE PAGES ---
          for(int i = 0; i < 12; i++) {
              float fi = float(i);
              float offset = fi * (PI * 2.0 / 12.0);
              float dist = 0.35 + 0.15 * sin(t + fi);
              
              // Spiral path
              vec2 pPos = vec2(cos(t + offset), sin(t + offset)) * dist;
              vec2 pUv = uv - pPos;
              
              // Rotate page to face center or spiral direction
              pUv *= rotate2d(t + offset + PI/4.0);
              
              // Page shape
              float page = sdCapsule(pUv, vec2(-0.05, -0.08), vec2(0.05, 0.08), 0.01);
              float edge = smoothstep(0.003, 0.0, abs(page));
              float body = smoothstep(0.01, 0.0, page) * 0.1;
              
              vec3 pColor = mix(INDIGO, PURPLE, abs(sin(fi + t)));
              color += pColor * edge * (1.0 + mouseFocus);
              color += pColor * body;
              
              // Connecting line to core
              float line = sdCapsule(uv, vec2(0.0), pPos, 0.0005);
              color += pColor * smoothstep(0.001, 0.0, line) * 0.2 * (1.0 - smoothstep(0.0, dist, length(uv)));
          }

          // --- AMBIENT DATA FLOW ---
          for(int i = 0; i < 30; i++) {
              float fi = float(i);
              float speed = 0.1 + 0.1 * fract(fi * 0.123);
              float rad = 0.2 + 0.8 * fract(fi * 0.456);
              float ang = fi + u_time * speed;
              
              vec2 pPos = vec2(cos(ang), sin(ang)) * rad;
              // Attract to mouse
              pPos = mix(pPos, mouse, 0.2 * mouseFocus);
              
              float pDist = length(uv - pPos);
              color += mix(CYAN, INDIGO, fract(fi * 0.5)) * (0.0006 / pDist);
          }

          // Soft Bloom
          color *= 1.1;
          color *= 1.0 - smoothstep(0.6, 2.0, length(uv));

          gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Helper: Compile Shader
    function compileShader(source, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    // Link Program
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Setup Buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const posAttrib = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize handling
    function syncSize() {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => syncSize());
      resizeObserver.observe(canvas);
    }
    syncSize();

    // Render loop
    function render(time) {
      if (typeof ResizeObserver === "undefined") {
        syncSize();
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, time * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    render(0);

    // Cleanup resources on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        opacity: opacity,
        transition: "opacity 1000ms ease-in-out",
      }}
      aria-hidden="true"
    />
  );
}
