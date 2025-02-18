import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import '../styles/AudioPlayer.css';

const songs = {
  song: ["https://listen.openstream.co/4428/audio", "https://prclive1.listenon.in/", "https://www.liveradio.es/http://radios.crabdance.com:8002/1", "https://radios.crabdance.com:8002/2","https://www.liveradio.es/http://radios.crabdance.com:8002/4"],
  images: ["hfm.png", "rcfm.png", "rmfm.png","sfm.png","bigfm.png"],
  song_name: [
    "Hello FM 106.4",
    "Radio City 91.1",
    "Radio Mirchi 98.3",
    "Suriyan FM 93.5",
    "Big FM 92.7"
  ]
};

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const setMetadata = () => setDuration(audio.duration);
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', setMetadata);
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', setMetadata);
      };
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songs.song[currentIndex];
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentIndex]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    audioRef.current.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === "0");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !audioRef.current.muted;
  };

  const nextSong = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % songs.song.length);
  };

  const prevSong = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + songs.song.length) % songs.song.length);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="audio-player-wrapper">
      <div className="song-info">
        <img src={songs.images[currentIndex]} alt="Song Cover" className="song-cover" />
        <p className="song-title">{songs.song_name[currentIndex]}</p>
      </div>

      <div className="audio-player">
        <audio ref={audioRef} src={songs.song[currentIndex]}></audio>

        <div className="controls">
          <button onClick={prevSong} className="control-btn">
            <SkipBack size={22} />
          </button>
          <button onClick={togglePlay} className="play-pause-btn">
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>
          <button onClick={nextSong} className="control-btn">
            <SkipForward size={22} />
          </button>
        </div>

        <div className="progress-container">
          <span>{formatTime(currentTime)}</span>
          <input type="range" min="0" max={duration} value={currentTime} onChange={handleSeek} className="progress-bar" />
          <span>{formatTime(duration)}</span>
        </div>

        <div className="volume-container">
          <button onClick={toggleMute} className="volume-btn">
            {isMuted || volume === "0" ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="volume-slider" />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
