import { useState, useCallback, useRef } from "react";
import { VideoScene, ANIMATION_DURATION } from "./VideoScene";
import { rawRecords } from "../data/datasets";
import { getSizeLegendStops } from "../data/colors";

/* Sub-datasets for the treemap overlay */
const BRAIN_DATASETS = [
  { name: "ROSMAP Compass", cells: 22_000_000, color: "#e53935" },
  { name: "ASAP (snRNA-seq)", cells: 2_800_000, color: "#8e24aa" },
  { name: "AMP PD (snRNA-seq)", cells: 2_100_000, color: "#3949ab" },
  { name: "Organoid Atlas", cells: 1_770_000, color: "#00897b" },
  { name: "SEAAD (snRNA-seq)", cells: 1_200_000, color: "#f4511e" },
];
const BRAIN_TOTAL = BRAIN_DATASETS.reduce((s, d) => s + d.cells, 0);

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return String(n);
}

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function TreemapOverlay({ opacity }: { opacity: number }) {
  if (opacity <= 0.01) return null;

  const sorted = [...BRAIN_DATASETS].sort((a, b) => b.cells - a.cells);
  const largest = sorted[0];
  const rest = sorted.slice(1);
  const leftPct = (largest.cells / BRAIN_TOTAL) * 100;

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none", opacity, transition: "opacity 0.6s ease",
    }}>
      <div style={{
        width: "70%", maxWidth: 700,
        background: "rgba(255,255,255,0.92)", borderRadius: 10,
        padding: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        border: "1px solid #e0e0e0", fontFamily: FONT,
      }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", fontFamily: FONT }}>
            Human Brain scRNA-seq
          </div>
          <div style={{ fontSize: 14, color: "#666", fontFamily: FONT }}>
            ~{fmt(BRAIN_TOTAL)} cells across {BRAIN_DATASETS.length} datasets
          </div>
        </div>

        <div style={{
          display: "flex", height: 200, borderRadius: 6,
          overflow: "hidden", border: "1px solid #d0d4da",
        }}>
          <div style={{
            width: `${leftPct}%`, background: largest.color,
            display: "flex", flexDirection: "column",
            justifyContent: "center", alignItems: "center",
            padding: 8, color: "#fff", borderRight: "2px solid #fff",
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, fontFamily: FONT }}>{largest.name}</div>
            <div style={{ fontSize: 14, opacity: 0.9, fontFamily: FONT }}>{fmt(largest.cells)}</div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {rest.map((d, i) => (
              <div key={d.name} style={{
                flex: d.cells, background: d.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "2px 6px", color: "#fff",
                borderBottom: i < rest.length - 1 ? "2px solid #fff" : undefined,
                minHeight: 0,
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, textAlign: "center", lineHeight: 1.2, fontFamily: FONT }}>
                  {d.name} — {fmt(d.cells)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const maxSize = Math.max(...rawRecords.map(r => r.datasetSize));
const legendStops = getSizeLegendStops(maxSize);

function CubeLegend({ onTime: _ }: { onTime: (t: number) => void }) {
  const [opacity, setOpacity] = useState(1);
  // We piggyback on the same onTime callback pattern
  // Legend visible during cube phase (t=0..14), fades out during dissolve
  const origOnTime = useRef(_);
  origOnTime.current = _;

  const legendOnTime = useCallback((t: number) => {
    const fadeOut = Math.min(1, Math.max(0, (14 - t) / 1.5));
    const fadeIn = Math.min(1, Math.max(0, t / 1));
    setOpacity(prev => {
      const v = Math.min(fadeIn, fadeOut);
      return Math.abs(prev - v) > 0.02 ? v : prev;
    });
  }, []);

  // Register as a secondary time listener via the parent
  // Actually, we need the time from the scene. Let's just use a simple approach:
  // read time from a shared ref. But for simplicity, let's use requestAnimationFrame.
  const rafRef = useRef(0);
  const startRef = useRef(0);
  useState(() => {
    startRef.current = performance.now();
    const tick = () => {
      const t = (performance.now() - startRef.current) / 1000;
      legendOnTime(t);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  });

  if (opacity <= 0.01) return null;

  return (
    <div style={{
      position: "absolute", bottom: 20, left: 20, zIndex: 10,
      pointerEvents: "none", opacity, transition: "opacity 0.3s ease",
      fontFamily: FONT,
    }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: "#5a5a7a", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
        Dataset Size
      </div>
      <div style={{ display: "flex", height: 12, width: 160, borderRadius: 2, overflow: "hidden", border: "1px solid #d0d4da" }}>
        {legendStops.map((s, i) => (
          <div key={i} style={{ flex: 1, background: s.color }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#999", marginTop: 2, width: 160 }}>
        <span>0</span>
        <span>{(maxSize / 1e6).toFixed(0)}M</span>
      </div>
      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
        <LegendItem border="#cc2222" bg="rgba(204,34,34,0.08)" label="Origin" />
        <LegendItem border="#b0bcc5" bg="rgba(180,190,200,0.15)" label="Unexplored" />
        <LegendItem border="#c44000" bg="#e65100" label="Dataset" />
      </div>
    </div>
  );
}

function LegendItem({ border, bg, label }: { border: string; bg: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 14, height: 14, border: `1.5px solid ${border}`, borderRadius: 2, background: bg }} />
      <span style={{ fontSize: 11, color: "#555", fontFamily: FONT }}>{label}</span>
    </div>
  );
}

export function VideoApp() {
  const [treemapOpacity, setTreemapOpacity] = useState(0);
  const [recording, setRecording] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const onTime = useCallback((t: number) => {
    // Treemap visible during t=5.5..10 (longer hold)
    const fadeIn = Math.min(1, Math.max(0, (t - 5.5) / 0.8));
    const fadeOut = Math.min(1, Math.max(0, (10 - t) / 0.8));
    const op = Math.min(fadeIn, fadeOut);
    setTreemapOpacity((prev) => Math.abs(prev - op) > 0.02 ? op : prev);
  }, []);

  const startRecording = useCallback(() => {
    setSceneKey(k => k + 1);
    setRecording(true);

    setTimeout(() => {
      const canvas = document.querySelector("canvas");
      if (!canvas) { setRecording(false); return; }

      const stream = canvas.captureStream(30);

      // Pick best supported codec: mp4 (Safari) > webm/vp9 > webm/vp8 > webm
      const candidates = [
        "video/mp4;codecs=avc1",
        "video/mp4",
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
      ];
      const mimeType = candidates.find(m => MediaRecorder.isTypeSupported(m)) || "video/webm";
      const ext = mimeType.startsWith("video/mp4") ? "mp4" : "webm";

      console.log("Recording with:", mimeType);

      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 5_000_000 });
      } catch {
        recorder = new MediaRecorder(stream);
      }

      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onerror = (e) => { console.error("Recording error:", e); setRecording(false); };
      recorder.onstop = () => {
        try {
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          document.body.appendChild(a);
          a.href = url;
          a.download = `graphical-abstract.${ext}`;
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 1000);
        } catch (err) {
          console.error("Download error:", err);
        }
        setRecording(false);
      };

      recorderRef.current = recorder;
      recorder.start(2000); // larger chunks = fewer allocations

      setTimeout(() => {
        if (recorderRef.current?.state === "recording") {
          recorderRef.current.stop();
        }
      }, (ANIMATION_DURATION + 1) * 1000);
    }, 300);
  }, []);

  return (
    <div style={{
      width: "100%", height: "100%", position: "relative",
      background: "#ffffff", fontFamily: FONT,
    }}>
      <VideoScene key={sceneKey} onTime={onTime} />
      <TreemapOverlay opacity={treemapOpacity} />
      <CubeLegend onTime={onTime} />

      {/* Record button */}
      <button
        onClick={startRecording}
        disabled={recording}
        style={{
          position: "absolute", top: 12, right: 12, zIndex: 20,
          padding: "8px 16px", fontSize: 13, fontWeight: 600,
          fontFamily: FONT, cursor: recording ? "default" : "pointer",
          background: recording ? "#eee" : "#e53935",
          color: recording ? "#999" : "#fff",
          border: "none", borderRadius: 6,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {recording ? `Recording (${ANIMATION_DURATION}s)...` : "Record MP4"}
      </button>
    </div>
  );
}
