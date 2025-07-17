import React, { useState, useRef, useEffect } from 'react';

const moods = ['Happy', 'Sad', 'Energetic', 'Calm'];
const tracks = [
  {
    id: 1,
    title: "Wave Rider",
    artist: "Synth Surge",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    mood: "Happy",
  },
  {
    id: 2,
    title: "Deep Reflections",
    artist: "Echoes",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    mood: "Sad",
  },
  {
    id: 3,
    title: "Pulse Machine",
    artist: "Beat Reactor",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    mood: "Energetic",
  },
  {
    id: 4,
    title: "Night Flow",
    artist: "Dreamwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    mood: "Calm",
  },
];

const styles = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    width: '100vw',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #0a0a23 0%, #1a1a40 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Orbitron', 'Segoe UI', Arial, sans-serif",
  },
  waveform: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 0,
    pointerEvents: 'none',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: 540,
    background: 'rgba(10,10,30,0.92)',
    borderRadius: 22,
    boxShadow: '0 0 40px 10px #00fff7cc, 0 8px 32px #ff00cc44',
    padding: '2.7rem 2.2rem',
    margin: '2rem',
    textAlign: 'center',
    border: '2.5px solid #00fff7',
    backdropFilter: 'blur(2px)',
  },
  title: {
    fontSize: '2.4rem',
    fontWeight: 900,
    color: '#00fff7',
    marginBottom: '1.7rem',
    letterSpacing: '3px',
    textShadow: '0 0 18px #ff00cc, 0 0 32px #00fff7, 0 2px 8px #000',
    textTransform: 'uppercase',
    fontFamily: "'Orbitron', 'Segoe UI', Arial, sans-serif",
  },
  section: {
    marginBottom: '2.2rem',
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 800,
    marginBottom: '1.1rem',
    fontSize: '1.2rem',
    textShadow: '0 0 12px #00fff7, 0 0 8px #ff00cc',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    fontFamily: "'Orbitron', 'Segoe UI', Arial, sans-serif",
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '1.2rem',
    marginTop: '1.2rem',
  },
  glassButton: {
    padding: '0.8rem 1.7rem',
    border: 'none',
    borderRadius: '16px',
    color: '#fff',
    fontWeight: 800,
    fontSize: '1.1rem',
    cursor: 'pointer',
    background: 'rgba(30, 0, 60, 0.35)',
    boxShadow: '0 0 24px #00fff7aa, 0 2px 8px #ff00cc55',
    backdropFilter: 'blur(8px)',
    outline: 'none',
    borderBottom: '2.5px solid #00fff7',
    borderTop: '2.5px solid #ff00cc',
    textShadow: '0 0 10px #00fff7, 0 0 6px #ff00cc',
    transition: 'background 0.3s, transform 0.2s, box-shadow 0.2s, border 0.2s',
  },
  glassButtonActive: {
    background: 'rgba(0,255,200,0.18)',
    borderBottom: '2.5px solid #ff00cc',
    borderTop: '2.5px solid #00fff7',
    boxShadow: '0 0 40px #00fff7, 0 2px 8px #ff00cc55',
    transform: 'scale(1.07)',
  },
  playerSection: {
    marginTop: '2.7rem',
    background: 'rgba(0, 255, 247, 0.10)',
    borderRadius: '18px',
    padding: '2rem 1.2rem',
    boxShadow: '0 0 32px #ff00cc55, 0 0 18px #00fff755',
    border: '2px solid #00fff7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backdropFilter: 'blur(8px)',
  },
  nowPlaying: {
    color: '#fff',
    fontWeight: 900,
    marginBottom: '1.2rem',
    fontSize: '1.25rem',
    textShadow: '0 0 10px #00fff7, 0 0 6px #ff00cc',
    letterSpacing: '1.2px',
    fontFamily: "'Orbitron', 'Segoe UI', Arial, sans-serif",
  },
  playButton: {
    marginTop: '1.2rem',
    padding: '0.7rem 2.2rem',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(90deg, #00fff7 0%, #ff00cc 100%)',
    color: '#fff',
    fontWeight: 900,
    fontSize: '1.15rem',
    cursor: 'pointer',
    boxShadow: '0 0 18px #00fff7, 0 2px 8px #ff00cc55',
    transition: 'background 0.3s, transform 0.2s, box-shadow 0.2s',
    textShadow: '0 0 8px #ff00cc',
    fontFamily: "'Orbitron', 'Segoe UI', Arial, sans-serif",
    letterSpacing: '2px',
  },
};

function Waveform({ isPlaying }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.beginPath();
        let color;
        if (i === 0) color = "#00fff7";
        if (i === 1) color = "#39ff14";
        if (i === 2) color = "#ff00cc";
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 16;
        ctx.lineWidth = 3;
        for (let x = 0; x <= w; x += 4) {
          const freq = 0.008 + i * 0.003;
          const amp = 32 + i * 10;
          const y =
            h / 2 +
            Math.sin(x * freq + t * (isPlaying ? 0.13 + i * 0.04 : 0.03)) *
              amp *
              (isPlaying ? 1.1 : 0.5);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }
      t += 1;
      animationId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);
  useEffect(() => {
    const canvas = canvasRef.current;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  return <canvas ref={canvasRef} style={styles.waveform} />;
}

function App() {
  const [selectedMood, setSelectedMood] = useState('');
  const [currentTrack, setCurrentTrack] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const pickRandomTrack = (mood) => {
    const moodTracks = tracks.filter(track => track.mood === mood);
    if (moodTracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * moodTracks.length);
      setCurrentTrack(moodTracks[randomIndex]);
    } else {
      setCurrentTrack(null);
    }
    setSelectedMood(mood);
    setIsPlaying(false);
    if (audioRef.current) audioRef.current.pause();
  };

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={styles.container}>
      <Waveform isPlaying={isPlaying} />
      <div style={styles.content}>
        <h1 style={styles.title}>PLAY DA MUSIC</h1>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Pick Your Mood</h2>
          <div style={styles.buttonContainer}>
            {moods.map(mood => (
              <button
                key={mood}
                style={{
                  ...styles.glassButton,
                  ...(selectedMood === mood ? styles.glassButtonActive : {}),
                }}
                onClick={() => pickRandomTrack(mood)}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>
        {!currentTrack && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              No track found. Choose a mood!
            </h3>
          </div>
        )}
        {currentTrack && (
          <div style={styles.playerSection}>
            <h4 style={styles.nowPlaying}>
               {currentTrack.title} - {currentTrack.artist}
            </h4>
            <audio ref={audioRef} src={currentTrack.url} />
            <button style={styles.playButton} onClick={togglePlay}>
              {isPlaying ? '⏸Pause' : '▶ Play'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;