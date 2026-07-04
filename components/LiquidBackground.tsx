"use client";
import { useEffect, useRef } from "react";

const FRAG = [
  "precision highp float;",
  "uniform vec2 iResolution; uniform float iTime; uniform vec2 iMouse;",
  "float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }",
  "float noise(vec2 p){ vec2 i=floor(p),f=fract(p); float a=hash(i),b=hash(i+vec2(1.0,0.0)),c=hash(i+vec2(0.0,1.0)),d=hash(i+vec2(1.0,1.0)); vec2 u=f*f*(3.0-2.0*f); return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }",
  "float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5; } return v; }",
  "void main(){",
  "  vec2 uv=gl_FragCoord.xy/iResolution.xy;",
  "  vec2 p=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;",
  "  float t=iTime*0.08;",
  "  vec3 col=mix(vec3(0.008,0.028,0.065), vec3(0.02,0.055,0.125), uv.y);",
  "  float h=fbm(p*1.8 + vec2(t*1.6, -t*1.2));",
  "  float h2=fbm(p*2.6 + vec2(-t*1.1, t*0.9) + h);",
  "  vec2 c1=vec2(sin(t*0.7)*0.65, cos(t*0.5)*0.42);",
  "  vec2 c2=vec2(cos(t*0.42)*0.75+0.35, sin(t*0.6)*0.5-0.2);",
  "  vec2 c3=vec2(sin(t*0.9+2.0)*0.55-0.35, cos(t*0.7+1.0)*0.42+0.22);",
  "  float g1=exp(-dot(p-c1,p-c1)*2.1);",
  "  float g2=exp(-dot(p-c2,p-c2)*2.7);",
  "  float g3=exp(-dot(p-c3,p-c3)*3.1);",
  "  float mod1=0.45+0.55*h; float mod2=0.45+0.55*h2;",
  "  col += vec3(0.0,0.55,0.92)*g1*mod1*0.62;",
  "  col += vec3(0.05,0.28,0.80)*g2*mod2*0.55;",
  "  col += vec3(0.12,0.82,0.68)*g3*mod1*0.42;",
  "  vec2 m=iMouse*vec2(1.25,0.95); float gm=exp(-dot(p-m,p-m)*3.0);",
  "  col += vec3(0.0,0.6,0.95)*gm*0.28;",
  "  float ribbon=smoothstep(0.52,0.72,fbm(p*2.2+vec2(t*2.4, 0.0)));",
  "  col += vec3(0.05,0.6,0.85)*ribbon*0.18;",
  "  col *= 1.0-0.34*length(p*vec2(0.72,1.0));",
  "  col=pow(max(col,0.0),vec3(0.94));",
  "  gl_FragColor=vec4(col,1.0);",
  "}",
].join("\n");

export default function LiquidBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = ref.current;
    if (reduced || !canvas) return;

    let raf = 0;
    let renderer: any = null;
    let cleanup = () => {};
    let cancelled = false;

    import("three")
      .then((THREE) => {
        if (cancelled || !canvas) return;
        try {
          renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
          const scale = window.innerWidth < 820 ? 0.5 : 0.72;
          renderer.setPixelRatio(1);
          const scene = new THREE.Scene();
          const camera = new THREE.Camera();
          const uniforms = {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2() },
            iMouse: { value: new THREE.Vector2(0, 0) },
          };
          const mat = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: "void main(){ gl_Position=vec4(position.xy,0.0,1.0); }",
            fragmentShader: FRAG,
          });
          scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
          const resize = () => {
            const w = Math.floor(window.innerWidth * scale);
            const h = Math.floor(window.innerHeight * scale);
            renderer.setSize(w, h, false);
            uniforms.iResolution.value.set(w, h);
          };
          window.addEventListener("resize", resize);
          resize();

          let pmx = 0, pmy = 0, lmx = 0, lmy = 0, lastPtr = 0;
          const onPtr = (e: PointerEvent) => {
            pmx = (e.clientX / window.innerWidth) * 2 - 1;
            pmy = -((e.clientY / window.innerHeight) * 2 - 1);
            lastPtr = performance.now();
          };
          window.addEventListener("pointermove", onPtr, { passive: true });
          const onScroll = () => {
            const k = Math.min(window.scrollY / (window.innerHeight * 0.85), 1);
            canvas.style.opacity = (1 - k * 0.35).toFixed(3);
          };
          window.addEventListener("scroll", onScroll, { passive: true });
          onScroll();
          cleanup = () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", onPtr);
            window.removeEventListener("scroll", onScroll);
          };
          const loop = (tm: number) => {
            if (performance.now() - lastPtr > 3000) {
              pmx = Math.sin(tm * 0.00016) * 0.5;
              pmy = Math.cos(tm * 0.00013) * 0.36;
            }
            lmx += (pmx - lmx) * 0.05;
            lmy += (pmy - lmy) * 0.05;
            if (!document.hidden) {
              uniforms.iTime.value = tm * 0.001;
              uniforms.iMouse.value.set(lmx, lmy);
              try { renderer.render(scene, camera); } catch (e) {}
            }
            raf = requestAnimationFrame(loop);
          };
          raf = requestAnimationFrame(loop);
        } catch (e) { renderer = null; }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanup();
      if (renderer) { try { renderer.dispose(); } catch (e) {} }
    };
  }, []);

  return <canvas id="liquid" ref={ref} />;
}
