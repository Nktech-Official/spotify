import React from 'react'
import playIcon from '../assets/play.svg'
import pauseIcon from '../assets/pause.svg'
import leftIcon from '../assets/left.svg'
import rightIcon from '../assets/right.svg'
import dots from '../assets/dots.svg'
import heartIcon from '../assets/heart.svg'
import heartFilledIcon from '../assets/heart-filled.svg'
import audioIcon from '../assets/audio.svg'
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00"; // Handle NaN and negative values

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

// Example Usage
function cleanArray(arr) {
  const seen = new Set();

  return arr
    .filter(obj => Object.keys(obj).length > 0) // Remove empty objects
    .filter(obj => {
      const key = JSON.stringify(obj);
      if (seen.has(key)) return false; // Remove duplicates
      seen.add(key);
      return true;
    })
    .slice(0, 10); // Limit to 10 elements
}


export default function Player({ song }) {
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [volume, setVolume] = useState(1); // Default volume: 100%
  const [isFav, setIsFav] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0)
  // Toggle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  useEffect(() => {
    if (isPlaying) {
      togglePlay();
    }
    const recentlyPlayed = JSON.parse(localStorage.getItem('recent') || '[]');
    const newList = cleanArray([song, ...recentlyPlayed])
    localStorage.setItem('recent', JSON.stringify(newList));

    const favs = JSON.parse(localStorage.getItem('favourites') || '[]');
    if (favs || favs.length > 0) {
      const result = favs.find(obj => obj.title === song.title); // Finds first valid title
      if (result) setIsFav(true);
      else setIsFav(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song])
  // Update progress bar as audio plays
  useEffect(() => {
    const updateProgress = () => {
      if (!audioRef.current || !progressRef.current) return;
      const progressPercent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      console.log(progressPercent)
      if (Number.isNaN(progressPercent)) {
        setProgress(0);
      } else {
        setProgress(progressPercent);
      }
      setCurrentTime(audioRef.current.currentTime)

    };

    audioRef.current?.addEventListener("timeupdate", updateProgress);
    const refClean = audioRef;
    return () => {
      refClean?.current?.removeEventListener("timeupdate", updateProgress);
    };
  }, [song]);

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const newTime = (Number(e.target.value) / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(Number(e.target.value));
  };
  const changeVolume = (volume) => {
    const newVolume = parseFloat(volume);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }
  const toggleFavourite = () => {
    const getPrev = JSON.parse(localStorage.getItem('favourites') || '[]')
    const exists = getPrev.find(obj => obj.title === song.title);
    if (exists) {
      const removedList = getPrev.filter((obj) => obj.title !== song.title);
      const newList = cleanArray(removedList)
      localStorage.setItem('favourites', JSON.stringify(newList))
      setIsFav(false);
    } else {
      const newList = cleanArray([song, ...getPrev])
      localStorage.setItem('favourites', JSON.stringify(newList))
      setIsFav(true)
    }

  }
  const PopoverContent = (
    <Popover style={{ background: 'rgba(255,255,255,0.3)' }} >
      {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
      <Popover.Body style={{ background: 'rgba(255,255,255,0.00)' }}>
        <p onClick={toggleFavourite} style={{ margin: 0, cursor: 'pointer', fontSize: '18px', fontWeight: '500', color: '#ed1573' }}> <img src={isFav ? heartFilledIcon : heartIcon} alt="" /> Favourite</p>
      </Popover.Body>
    </Popover >
  );

  useEffect(() => {
    if ("mediaSession" in navigator && audioRef.current) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artistName,
        artwork: [
          { src: `/album/main/${song.thumbnail}`, sizes: "512x512", type: "image/jpeg" }
        ]
      });
    }
  }, [song]);
  const Volume = (
    <Popover style={{ background: 'transparent', border: 'none', outlin: 'none' }} >
      {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
      <Popover.Body style={{ background: 'transparent', width: 'fit-content' }}>
        <input type="range" min={0} max={1} step={0.01} value={volume} style={{
          transform: 'rotate(-90deg)',
          transformOrigin: 'center',
          marginBottom: '40px'
        }} onChange={(e) => { changeVolume(e.target.value) }} />
      </Popover.Body>
    </Popover >
  );
  return (
    <div className=' PlayerView'>

      <h1 style={{ fontSize: '32px', fontWeight: '700', lineHeight: '36px', margin: 0 }} >{song.title}</h1>
      <p style={{ fontSize: '14px', color: '#ffffff', padding: '0', marginTop: 0, opacity: 0.8, marginLeft: '4px' }}>{song.artistName}</p>
      <div className='thumbnail'>
        <img src={`/album/main/${song.thumbnail}`} height={400} width={400} alt="" />
      </div>
      <input
        ref={progressRef}
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleSeek}
        className="progress"
        style={{ width: '100%', marginTop: '30px' }}
      />

      <div className="duration">
        <p>{formatTime(currentTime)}</p>
        <p>{song.duration}</p>
      </div>
      <audio ref={audioRef} src={`/songs/${song.musicUrl}`} preload="metadata"></audio>

      <div className="controls-container">

        <OverlayTrigger trigger="click" placement="top" overlay={PopoverContent}>
          {/* <Button variant="success">Click me to see</Button> */}
          <div className='actions'>
            <img src={dots} alt="" />
          </div>
        </OverlayTrigger>



        <div className="controls">
          <img className='arrow-icon' width={30} height={30} src={leftIcon} alt="" />
          <img onClick={togglePlay}
            className='play-icon' src={isPlaying ? pauseIcon : playIcon} alt="" />
          <img className='arrow-icon' width={30} height={30} src={rightIcon} alt="" />
        </div>
        <OverlayTrigger trigger="click" placement="top" overlay={Volume}>
          <div className='actions'>
            <img src={audioIcon} alt="" />
          </div>
        </OverlayTrigger >


      </div>
    </div>
  )
}
