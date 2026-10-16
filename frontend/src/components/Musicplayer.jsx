import { useEffect, useRef, useState } from "react";
// import "./MusicPlayer.css";

/* ------------------------------------------------------------------
   ADD YOUR MUSIC HERE
   Put .mp3 files in the `public/` folder (or `public/music/`) and list them.
   `cover` is optional - null uses the built-in artwork.
------------------------------------------------------------------- */
const TRACKS = [
  {
    title: "Billie Jean",
    artist: "Portfolio Radio",
    src: "/Paint It Black.mp3",
    cover: "/skull.png",
  },
  // {
  //   title: "Another Track",
  //   artist: "Portfolio Radio",
  //   src: "/music/track2.mp3",
  //   cover: "/music/cover2.jpg",
  // },
];

const RING_LENGTH = 2 * Math.PI * 24; // circle r=24 (collapsed progress ring)

/* ---------- small inline icons ---------- */
const Icon = ({ children, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    {children}
  </svg>
);
const PlayIcon = () => (
  <Icon size={16}>
    <path d="M8 5.5v13a1 1 0 0 0 1.55.83l10-6.5a1 1 0 0 0 0-1.66l-10-6.5A1 1 0 0 0 8 5.5z" />
  </Icon>
);
const PauseIcon = () => (
  <Icon size={16}>
    <rect x="6" y="5" width="4.2" height="14" rx="1.2" />
    <rect x="13.8" y="5" width="4.2" height="14" rx="1.2" />
  </Icon>
);
const PrevIcon = () => (
  <Icon size={16}>
    <rect x="5" y="5" width="2.4" height="14" rx="1" />
    <path d="M19 6.2v11.6a.8.8 0 0 1-1.25.66l-8.4-5.8a.8.8 0 0 1 0-1.32l8.4-5.8A.8.8 0 0 1 19 6.2z" />
  </Icon>
);
const NextIcon = () => (
  <Icon size={16}>
    <rect x="16.6" y="5" width="2.4" height="14" rx="1" />
    <path d="M5 6.2v11.6a.8.8 0 0 0 1.25.66l8.4-5.8a.8.8 0 0 0 0-1.32l-8.4-5.8A.8.8 0 0 0 5 6.2z" />
  </Icon>
);
const VolumeIcon = ({ muted }) => (
  <Icon size={16}>
    <path d="M4 9.5v5h3.6l4.4 3.6V5.9L7.6 9.5H4z" />
    {muted ? (
      <path
        d="M16 9.5l5 5M21 9.5l-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    ) : (
      <path
        d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    )}
  </Icon>
);

/* ---------- default artwork (mountain + moon + waveform) ---------- */
const DefaultCover = () => (
  <svg viewBox="0 0 120 120" className="mp__cover-svg" aria-hidden="true">
    <defs>
      <linearGradient id="mpSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0a1a2a" />
        <stop offset="1" stopColor="#06101a" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" fill="url(#mpSky)" />
    <circle cx="82" cy="34" r="12" fill="#4de8f4" opacity=".95" />
    <path d="M0 78 L30 42 L52 66 L70 50 L120 90 L120 120 L0 120z" fill="#16384a" />
    <path d="M0 92 L26 64 L48 84 L72 62 L120 98 L120 120 L0 120z" fill="#0d2230" />
    <g stroke="#4de8f4" strokeWidth="3" strokeLinecap="round">
      {[8, 16, 10, 22, 30, 18, 34, 14, 26, 12, 20, 8].map((h, i) => (
        <line
          key={i}
          x1={14 + i * 8.4}
          x2={14 + i * 8.4}
          y1={96 - h / 2}
          y2={96 + h / 2}
        />
      ))}
    </g>
  </svg>
);

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const track = TRACKS[index];
  const multi = TRACKS.length > 1;
  const progressPct = duration ? (current / duration) * 100 : 0;
  const volumePct = (muted ? 0 : volume) * 100;

  /* ----- audio controls ----- */
  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false); // browser blocked it - visitor must press play
    }
  };
  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };
  const toggle = () => (isPlaying ? pause() : play());

  const goTo = (i) => {
    setIndex((i + TRACKS.length) % TRACKS.length);
    setCurrent(0);
  };
  const next = () => goTo(index + 1);
  const prev = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      goTo(index - 1);
    }
  };

  const seek = (e) => {
    const t = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrent(t);
  };

  /* ----- keep <audio> volume in sync ----- */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  /* ----- when track changes while playing, keep playing ----- */
  useEffect(() => {
    if (isPlaying) play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  /* ----- browsers block autoplay: start on the visitor's first click/tap/key.
         (Ignored if that first click is on the player itself, so the
         play button doesn't start-then-pause.) ----- */
  useEffect(() => {
    const cleanup = () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    function start(e) {
      cleanup();
      if (e.target?.closest?.(".mp")) return;
      play();
    }
    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disc = (
    <span className="mp__disc">
      {track.cover ? <img src={track.cover} alt="" /> : <DefaultCover />}
    </span>
  );

  return (
    <>
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onTimeUpdate={(e) => setCurrent(e.target.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onEnded={() => (multi ? next() : pause())}
      />

      <aside
        className={`mp ${collapsed ? "mp--collapsed" : ""} ${
          isPlaying ? "is-playing" : ""
        }`}
        aria-label="Music player"
      >
        {collapsed ? (
          /* ---------- collapsed: just the spinning disc + progress ring ---------- */
          <button
            className="mp__mini"
            onClick={() => setCollapsed(false)}
            aria-label="Open music player"
          >
            <svg className="mp__ring" viewBox="0 0 52 52" aria-hidden="true">
              <circle className="mp__ring-bg" cx="26" cy="26" r="24" />
              <circle
                className="mp__ring-fg"
                cx="26"
                cy="26"
                r="24"
                strokeDasharray={RING_LENGTH}
                strokeDashoffset={RING_LENGTH * (1 - progressPct / 100)}
              />
            </svg>
            {disc}
          </button>
        ) : (
          /* ---------- expanded: compact single row ---------- */
          <>
            <div className="mp__row">
              {disc}

              <div className="mp__info">
                <div className="mp__title-row">
                  <h4 className="mp__title">{track.title}</h4>
                  <div className="mp__eq" aria-hidden="true">
                    <span /><span /><span /><span />
                  </div>
                </div>
                <p className="mp__artist">{track.artist}</p>
              </div>

              <div className="mp__buttons">
                {multi && (
                  <button
                    className="mp__btn mp__prev"
                    onClick={prev}
                    aria-label="Previous track"
                  >
                    <PrevIcon />
                  </button>
                )}
                <button
                  className="mp__play"
                  onClick={toggle}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                {multi && (
                  <button
                    className="mp__btn"
                    onClick={next}
                    aria-label="Next track"
                  >
                    <NextIcon />
                  </button>
                )}
              </div>

              <div className="mp__volume">
                <button
                  className="mp__btn"
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  <VolumeIcon muted={muted || volume === 0} />
                </button>
                <input
                  className="mp__range"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setMuted(false);
                  }}
                  style={{ "--fill": `${volumePct}%` }}
                  aria-label="Volume"
                />
              </div>

              <button
                className="mp__collapse"
                onClick={() => setCollapsed(true)}
                aria-label="Minimize player"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M5 12h14" />
                </svg>
              </button>
            </div>

            {/* thin seek bar along the bottom edge */}
            <input
              className="mp__range mp__seek"
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={current}
              onChange={seek}
              style={{ "--fill": `${progressPct}%` }}
              aria-label="Seek"
            />
          </>
        )}
      </aside>
    </>
  );
}