/**
 * Start the lab server, or say exactly who is already holding the port.
 *
 * `next start` on a bound port prints a bare EADDRINUSE and stops, which tells
 * you nothing about the process still answering requests on it — and on
 * 2026-08-20 that process was an orphaned server handing out a forty-minute-old
 * build while the harness measured it. Stopping the launcher does not stop
 * `next start`; the child survives and keeps the socket.
 *
 * So this probes the port first and, if it is taken, names the PID and its
 * command line and gives the command that ends it.
 *
 *   node scripts/lab-serve.mjs [port]
 */
import { createConnection } from "node:net";
import { spawn, execSync } from "node:child_process";

const PORT = Number(process.argv[2] ?? 3210);

/**
 * CONNECT rather than bind. A trial bind on 0.0.0.0 does NOT see a server
 * listening on `::`, which is exactly what `next start` binds — so the probe
 * reported the port free and the spawn then died on EADDRINUSE, which is the
 * bare error this script exists to replace. Connecting asks the question that
 * actually matters: is something already answering here?
 */
const canConnect = (host) =>
  new Promise((resolve) => {
    const s = createConnection({ port: PORT, host });
    const done = (v) => {
      s.destroy();
      resolve(v);
    };
    s.once("connect", () => done(true));
    s.once("error", () => done(false));
    s.setTimeout(1500, () => done(false));
  });

const probe = async () =>
  (await canConnect("127.0.0.1")) || (await canConnect("::1")) ? "EADDRINUSE" : null;

function listenerPids(port) {
  try {
    const out = execSync("netstat -ano -p TCP", { encoding: "utf8", windowsHide: true });
    const pids = new Set();
    for (const line of out.split(/\r?\n/)) {
      const m = line.match(/^\s*TCP\s+\S+?:(\d+)\s+\S+\s+LISTENING\s+(\d+)\s*$/);
      if (m && Number(m[1]) === port) pids.add(m[2]);
    }
    return [...pids];
  } catch {
    return [];
  }
}

function commandLine(pid) {
  try {
    const ps = `(Get-CimInstance Win32_Process -Filter "ProcessId=${pid}").CommandLine`;
    const out = execSync(`powershell -NoProfile -Command "${ps.replace(/"/g, '\\"')}"`, {
      encoding: "utf8",
      windowsHide: true,
    }).trim();
    return out || "(command line unavailable)";
  } catch {
    return "(command line unavailable)";
  }
}

const busy = await probe();

if (busy === "EADDRINUSE") {
  const pids = listenerPids(PORT);
  console.error("");
  console.error(`  ══ PORT ${PORT} IS ALREADY BOUND ══`);
  console.error("");
  if (pids.length === 0) {
    console.error("  Could not identify the owning process from netstat.");
  } else {
    for (const pid of pids) {
      console.error(`  PID ${pid}`);
      console.error(`      ${commandLine(pid)}`);
    }
  }
  console.error("");
  console.error("  That process still answers 200, from whatever build it started with.");
  console.error("  A harness pointed at it measures THAT build, not the one in .next,");
  console.error("  and every check passes while describing the wrong page.");
  console.error("");
  if (pids.length) {
    console.error(`  Stop it:  powershell -NoProfile -Command "Stop-Process -Id ${pids.join(",")} -Force"`);
  }
  console.error("");
  process.exit(1);
}

if (busy) {
  console.error(`\n  Could not bind port ${PORT}: ${busy}\n`);
  process.exit(1);
}

const child = spawn("npx", ["next", "start", "-p", String(PORT)], {
  stdio: "inherit",
  shell: true,
});
child.on("exit", (code) => process.exit(code ?? 0));
