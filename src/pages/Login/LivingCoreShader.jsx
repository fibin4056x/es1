import { useEffect, useRef } from "react";

export default function LivingCoreShader({ opacity = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    let animationFrameId = null;
    let resizeObserver = null;
    let destroyed = false;

    const isMobile =
      window.matchMedia("(max-width: 768px)").matches;

    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /*
     * Respect accessibility settings.
     * The canvas remains visible but does not animate.
     */
    const shouldAnimate = !prefersReducedMotion;

    const gl =
      canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
        preserveDrawingBuffer: false,
      }) ||
      canvas.getContext("experimental-webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
        preserveDrawingBuffer: false,
      });

    if (!gl) {
      console.warn("WebGL is not supported on this device.");
      return;
    }

    /* ============================================================
       SHADERS
    ============================================================ */

    const vertexShaderSource = `
      attribute vec2 a_position;

      varying vec2 v_texCoord;

      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
      #else
        precision mediump float;
      #endif

      varying vec2 v_texCoord;

      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      #define PI 3.14159265359

      #define CYAN vec3(0.30, 0.80, 0.90)
      #define INDIGO vec3(0.40, 0.40, 0.95)
      #define PURPLE vec3(0.60, 0.30, 0.90)

      #define BG_COLOR vec3(0.02, 0.02, 0.03)

      mat2 rotate2d(float angle) {
        float c = cos(angle);
        float s = sin(angle);

        return mat2(
          c, -s,
          s,  c
        );
      }

      float sdCapsule(
        vec2 p,
        vec2 a,
        vec2 b,
        float radius
      ) {
        vec2 pa = p - a;
        vec2 ba = b - a;

        float denominator = max(dot(ba, ba), 0.0001);

        float h = clamp(
          dot(pa, ba) / denominator,
          0.0,
          1.0
        );

        return length(pa - ba * h) - radius;
      }

      void main() {

        vec2 uv =
          (
            gl_FragCoord.xy * 2.0 -
            u_resolution.xy
          )
          /
          min(
            u_resolution.x,
            u_resolution.y
          );

        vec2 mouse =
          (u_mouse / u_resolution) * 2.0 - 1.0;

        mouse.y *= -1.0;

        /* ========================================================
           MOUSE INTERACTION
        ======================================================== */

        float mouseDistance =
          length(uv - mouse);

        float mouseFocus =
          smoothstep(
            0.75,
            0.0,
            mouseDistance
          );

        uv -=
          mouse *
          0.045 *
          mouseFocus;

        /* ========================================================
           BASE
        ======================================================== */

        vec3 color = BG_COLOR;

        float time = u_time * 0.4;

        /* ========================================================
           CENTRAL CORE
        ======================================================== */

        float coreDistance =
          max(length(uv), 0.001);

        float breathing =
          0.9 +
          0.1 *
          sin(u_time * 0.8);

        float coreGlow =
          0.055 /
          pow(coreDistance, 1.3);

        color +=
          INDIGO *
          coreGlow *
          breathing;

        color +=
          CYAN *
          (0.014 / coreDistance) *
          breathing;

        /* ========================================================
           SPIRAL KNOWLEDGE PAGES
        ======================================================== */

        for (int i = 0; i < 10; i++) {

          float fi = float(i);

          float offset =
            fi *
            (PI * 2.0 / 10.0);

          float distance =
            0.35 +
            0.15 *
            sin(time + fi);

          vec2 position =
            vec2(
              cos(time + offset),
              sin(time + offset)
            )
            *
            distance;

          vec2 pageUv =
            uv -
            position;

          pageUv *=
            rotate2d(
              time +
              offset +
              PI / 4.0
            );

          float page =
            sdCapsule(
              pageUv,
              vec2(-0.05, -0.08),
              vec2(0.05, 0.08),
              0.01
            );

          float edge =
            smoothstep(
              0.003,
              0.0,
              abs(page)
            );

          float body =
            smoothstep(
              0.01,
              0.0,
              page
            )
            *
            0.09;

          vec3 pageColor =
            mix(
              INDIGO,
              PURPLE,
              abs(sin(fi + time))
            );

          color +=
            pageColor *
            edge *
            (1.0 + mouseFocus);

          color +=
            pageColor *
            body;

          /* Connecting lines */

          float line =
            sdCapsule(
              uv,
              vec2(0.0),
              position,
              0.0005
            );

          color +=
            pageColor *
            smoothstep(
              0.001,
              0.0,
              line
            )
            *
            0.18
            *
            (
              1.0 -
              smoothstep(
                0.0,
                distance,
                length(uv)
              )
            );
        }

        /* ========================================================
           AMBIENT DATA FLOW
        ======================================================== */

        for (int i = 0; i < 20; i++) {

          float fi = float(i);

          float speed =
            0.08 +
            0.08 *
            fract(fi * 0.123);

          float radius =
            0.2 +
            0.8 *
            fract(fi * 0.456);

          float angle =
            fi +
            u_time *
            speed;

          vec2 particlePosition =
            vec2(
              cos(angle),
              sin(angle)
            )
            *
            radius;

          particlePosition =
            mix(
              particlePosition,
              mouse,
              0.15 *
              mouseFocus
            );

          float particleDistance =
            max(
              length(
                uv -
                particlePosition
              ),
              0.003
            );

          vec3 particleColor =
            mix(
              CYAN,
              INDIGO,
              fract(fi * 0.5)
            );

          color +=
            particleColor *
            (0.00045 / particleDistance);
        }

        /* ========================================================
           SOFT BLOOM
        ======================================================== */

        color *= 1.08;

        color *=
          1.0 -
          smoothstep(
            0.65,
            2.0,
            length(uv)
          );

        gl_FragColor =
          vec4(
            color,
            1.0
          );
      }
    `;

    /* ============================================================
       SHADER COMPILATION
    ============================================================ */

    const compileShader = (source, type) => {
      const shader = gl.createShader(type);

      if (!shader) {
        console.error("Unable to create WebGL shader.");
        return null;
      }

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(
          "WebGL shader compilation failed:",
          gl.getShaderInfoLog(shader)
        );

        gl.deleteShader(shader);

        return null;
      }

      return shader;
    };

    const vertexShader = compileShader(
      vertexShaderSource,
      gl.VERTEX_SHADER
    );

    const fragmentShader = compileShader(
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    );

    if (!vertexShader || !fragmentShader) {
      return;
    }

    /* ============================================================
       PROGRAM
    ============================================================ */

    const program = gl.createProgram();

    if (!program) {
      console.error("Unable to create WebGL program.");
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(
        "WebGL program linking failed:",
        gl.getProgramInfoLog(program)
      );

      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);

      return;
    }

    gl.useProgram(program);

    /* ============================================================
       FULL SCREEN QUAD
    ============================================================ */

    const buffer = gl.createBuffer();

    if (!buffer) {
      console.error("Unable to create WebGL buffer.");
      return;
    }

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      buffer
    );

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation =
      gl.getAttribLocation(
        program,
        "a_position"
      );

    gl.enableVertexAttribArray(
      positionLocation
    );

    gl.vertexAttribPointer(
      positionLocation,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );

    /* ============================================================
       UNIFORMS
    ============================================================ */

    const timeLocation =
      gl.getUniformLocation(
        program,
        "u_time"
      );

    const resolutionLocation =
      gl.getUniformLocation(
        program,
        "u_resolution"
      );

    const mouseLocation =
      gl.getUniformLocation(
        program,
        "u_mouse"
      );

    /* ============================================================
       DEVICE PIXEL RATIO
    ============================================================ */

    const getPixelRatio = () => {
      /*
       * Do not render the login animation at huge 3x/4x
       * resolutions on high-DPI phones.
       */

      const dpr =
        window.devicePixelRatio || 1;

      return Math.min(
        dpr,
        isMobile ? 1.25 : 1.75
      );
    };

    /* ============================================================
       MOUSE
    ============================================================ */

    const mouse = {
      x: 0.5,
      y: 0.5,
    };

    const handlePointerMove = (event) => {

      /*
       * Touch devices don't need mouse tracking.
       */

      if (isMobile) return;

      const rect =
        canvas.getBoundingClientRect();

      if (
        rect.width <= 0 ||
        rect.height <= 0
      ) {
        return;
      }

      mouse.x =
        (
          event.clientX -
          rect.left
        ) /
        rect.width;

      mouse.y =
        1 -
        (
          event.clientY -
          rect.top
        ) /
        rect.height;

      mouse.x =
        Math.max(
          0,
          Math.min(1, mouse.x)
        );

      mouse.y =
        Math.max(
          0,
          Math.min(1, mouse.y)
        );
    };

    if (!isMobile) {
      window.addEventListener(
        "pointermove",
        handlePointerMove,
        {
          passive: true,
        }
      );
    }

    /* ============================================================
       RESIZE
    ============================================================ */

    const resizeCanvas = () => {

      const rect =
        canvas.getBoundingClientRect();

      const width =
        Math.max(
          1,
          Math.floor(
            rect.width *
            getPixelRatio()
          )
        );

      const height =
        Math.max(
          1,
          Math.floor(
            rect.height *
            getPixelRatio()
          )
        );

      if (
        canvas.width !== width ||
        canvas.height !== height
      ) {
        canvas.width = width;
        canvas.height = height;

        gl.viewport(
          0,
          0,
          width,
          height
        );
      }
    };

    if (
      typeof ResizeObserver !==
      "undefined"
    ) {
      resizeObserver =
        new ResizeObserver(
          resizeCanvas
        );

      resizeObserver.observe(canvas);
    }

    resizeCanvas();

    /* ============================================================
       WEBGL CONTEXT LOSS
    ============================================================ */

    const handleContextLost = (event) => {
      event.preventDefault();

      if (animationFrameId) {
        cancelAnimationFrame(
          animationFrameId
        );
      }

      animationFrameId = null;
    };

    const handleContextRestored = () => {
      if (!destroyed) {
        render(performance.now());
      }
    };

    canvas.addEventListener(
      "webglcontextlost",
      handleContextLost,
      false
    );

    canvas.addEventListener(
      "webglcontextrestored",
      handleContextRestored,
      false
    );

    /* ============================================================
       RENDER LOOP
    ============================================================ */

    let lastFrameTime = 0;

    /*
     * Desktop:
     *   ~60 FPS
     *
     * Mobile:
     *   ~30 FPS
     *
     * This significantly reduces unnecessary GPU usage.
     */

    const frameInterval =
      isMobile
        ? 1000 / 30
        : 1000 / 60;

    const render = (time) => {

      if (destroyed) return;

      if (
        time - lastFrameTime <
        frameInterval
      ) {
        animationFrameId =
          requestAnimationFrame(render);

        return;
      }

      lastFrameTime = time;

      resizeCanvas();

      gl.viewport(
        0,
        0,
        canvas.width,
        canvas.height
      );

      if (timeLocation) {
        gl.uniform1f(
          timeLocation,
          shouldAnimate
            ? time * 0.001
            : 0
        );
      }

      if (resolutionLocation) {
        gl.uniform2f(
          resolutionLocation,
          canvas.width,
          canvas.height
        );
      }

      if (mouseLocation) {
        gl.uniform2f(
          mouseLocation,
          mouse.x *
            canvas.width,
          mouse.y *
            canvas.height
        );
      }

      gl.drawArrays(
        gl.TRIANGLE_STRIP,
        0,
        4
      );

      if (shouldAnimate) {
        animationFrameId =
          requestAnimationFrame(render);
      }
    };

    render(0);

    /* ============================================================
       CLEANUP
    ============================================================ */

    return () => {

      destroyed = true;

      if (animationFrameId) {
        cancelAnimationFrame(
          animationFrameId
        );
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      if (!isMobile) {
        window.removeEventListener(
          "pointermove",
          handlePointerMove
        );
      }

      canvas.removeEventListener(
        "webglcontextlost",
        handleContextLost
      );

      canvas.removeEventListener(
        "webglcontextrestored",
        handleContextRestored
      );

      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);

      gl.useProgram(null);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        opacity,
        transition:
          "opacity 1000ms ease-in-out",
        pointerEvents: "none",
      }}
    />
  );
}