"use client";
import { useEffect, useRef } from "react";

const FRAG = [
  "precision highp float;",
  "uniform vec2 iResolution; uniform float iTime; uniform vec2 iMouse;",
  "float smin(float a,float b,float k){ float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0); return mix(b,a,h)-k*h*(1.0-h); }",
  "float sph(vec3 p,float r){ return length(p)-r; }",
  "float map(vec3 p){",
  "  float t=iTime*0.32; float d=10.0;",
  "  vec3 b1=vec3(sin(t*0.9)*1.5, cos(t*0.7)*1.0, sin(t*0.5)*0.8);",
  "  vec3 b2=vec3(cos(t*0.6)*1.7, sin(t*1.05)*1.2, cos(t*0.8)*0.7);",
  "  vec3 b3=vec3(sin(t*1.25+2.0)*1.3, cos(t*0.55+1.0)*1.35, sin(t*0.9)*1.0);",
  "  vec3 b4=vec3(cos(t*0.8+1.5)*1.1, sin(t*0.95+2.0)*0.9, cos(t*1.15)*1.2);",
  "  vec3 b5=vec3(sin(t*0.4)*0.6, cos(t*0.45)*0.5, 0.2);",
  "  vec3 bm=vec3(iMouse.x*2.4, iMouse.y*1.5, 0.7);",
  "  float k=0.78;",
  "  d=smin(d,sph(p-b1,0.80),k); d=smin(d,sph(p-b2,0.68),k);",
  "  d=smin(d,sph(p-b3,0.62),k); d=smin(d,sph(p-b4,0.55),k);",
  "  d=smin(d,sph(p-b5,0.95),k); d=smin(d,sph(p-bm,0.72),k);",
  "  return d;",
  "}",
  "vec3 nrm(vec3 p){ vec2 e=vec2(0.002,0.0);",
  "  return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx))); }",
  "void main(){",
  "  vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;",
  "  vec3 ro=vec3(0.0,0.0,4.3); vec3 rd=normalize(vec3(uv*1.15,-1.7));",
  "  float t=0.0; bool hit=false; vec3 p=ro;",
  "  for(int i=0;i<52;i++){ p=ro+rd*t; float d=map(p); if(d<0.0018){hit=true;break;} t+=d*0.92; if(t>9.0)break; }",
  "  vec3 top=vec3(0.016,0.05,0.11), bot=vec3(0.02,0.085,0.185);",
  "  vec3 col=mix(bot,top,clamp(uv.y*0.6+0.5,0.0,1.0));",
  "  col+=vec3(0.0,0.06,0.12)*smoothstep(1.15,0.0,length(uv));",
  "  if(hit){",
  "    vec3 n=nrm(p); vec3 L=normalize(vec3(0.55,0.75,0.65));",
  "    float diff=clamp(dot(n,L),0.0,1.0);",
  "    float rim=pow(1.0-clamp(dot(n,-rd),0.0,1.0),2.5);",
  "    vec3 hh=normalize(L-rd); float spec=pow(clamp(dot(n,hh),0.0,1.0),48.0);",
  "    vec3 deep=vec3(0.02,0.22,0.55), cyan=vec3(0.0,0.68,0.94), mint=vec3(0.12,0.86,0.74);",
  "    vec3 base=mix(deep,cyan,diff); base=mix(base,mint,rim*0.55);",
  "    col=base*(0.35+0.75*diff)+spec*vec3(0.9,0.98,1.0)+rim*vec3(0.06,0.35,0.5);",
  "    col=mix(col, mix(bot,top,0.5), clamp((t-3.0)/6.0,0.0,0.55));",
  "  }",
  "  col*=1.0-0.28*length(uv);",
  "  col=pow(max(col,0.0),vec3(0.92));",
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
    let cleanupScroll = () => {};
    let cancelled = false;

    import("three")
      .then((THREE) => {
        if (cancelled || !canvas) return;
        try {
          renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
          });
          const scale = window.innerWidth < 820 ? 0.55 : 0.8;
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
            canvas.style.opacity = (1 - k * 0.55).toFixed(3);
          };
          window.addEventListener("scroll", onScroll, { passive: true });
          onScroll();

          cleanupScroll = () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", onPtr);
            window.removeEventListener("scroll", onScroll);
          };

          const loop = (t: number) => {
            if (performance.now() - lastPtr > 3000) {
              pmx = Math.sin(t * 0.00022) * 0.55;
              pmy = Math.cos(t * 0.00017) * 0.4;
            }
            lmx += (pmx - lmx) * 0.06;
            lmy += (pmy - lmy) * 0.06;
            if (!document.hidden) {
              uniforms.iTime.value = t * 0.001;
              uniforms.iMouse.value.set(lmx, lmy);
              try { renderer.render(scene, camera); } catch (e) {}
            }
            raf = requestAnimationFrame(loop);
          };
          raf = requestAnimationFrame(loop);
        } catch (e) {
          renderer = null;
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanupScroll();
      if (renderer) { try { renderer.dispose(); } catch (e) {} }
    };
  }, []);

  return <canvas id="liquid" ref={ref} />;
}
