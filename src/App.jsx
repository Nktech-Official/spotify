import { useState } from "react"
import { useEffect } from "react"
import data from './assets/data.json'
import MobilePlayer from "./components/MobilePlayer"
import ListSong from "./components/ListSong";
import Navigation from "./components/Navigation";
import BottomDrawer from "./components/BottomDrawer";
import useDisablePullToRefresh from "./hooks/useDisableRefresh";

function App() {
  useDisablePullToRefresh()
  const [currentSong, setCurrentSong] = useState({});
  const [songData, SetSongData] = useState([])
  const [navigation, setNavigation] = useState('foryou')
  const [label, setLabel] = useState('For You')

  useEffect(() => {
    document.documentElement.style.setProperty('--primaryGradient', currentSong.color1)
    localStorage.setItem('current', JSON.stringify(currentSong))
  }, [currentSong])
  //mock api call
  const fetchData = async () => {
    SetSongData(data)

    if (Object.keys(currentSong).length === 0) {
      setCurrentSong(data[3])
    }

    console.log(data);
  }
  const updateList = () => {
    if (navigation === 'foryou') {
      fetchData();
      setLabel('For You')
    } else if (navigation === 'toptracks') {
      fetchData();
      setLabel('Top Tracks')
    } else if (navigation === 'favourites') {
      const favsongs = JSON.parse(localStorage.getItem('favourites') || '[]');
      SetSongData(favsongs)
      setLabel('Favourites')
    } else if (navigation === 'recent') {
      const recent = JSON.parse(localStorage.getItem('recent') || '[]')
      SetSongData(recent)
      setLabel('Recently Played')

    }
  }
  useEffect(() => {
    updateList()
  }, [navigation])
  const changeSong = (song) => {
    setCurrentSong(song);
  }
  const changeNavigation = (x) => {
    setNavigation(x)
  }

  const PlayNext = () => {
    // const currIndex = songData.findIndex((val) => { val.title === currentSong.title });
    // if (currIndex === -1) setCurrentSong(songData[0])
    if (!songData.length) return; // If the list is empty, do nothing

    // Find index of current song
    let currentIndex = songData.findIndex(song => song.title === currentSong?.title);

    // If not found, start from the first song
    if (currentIndex === -1) currentIndex = 0;
    else currentIndex = (currentIndex + 1) % songData.length; // Move to next, loop if at the end

    setCurrentSong(songData[currentIndex]); // Play the next song 
  }
  const PlayPrevious = () => {
    if (!songData.length) return; // If the list is empty, do nothing

    // Find index of current song
    let currentIndex = songData.findIndex(song => song.title === currentSong?.title);

    // If not found, start from the last song
    if (currentIndex === -1) currentIndex = songData.length - 1;
    else currentIndex = (currentIndex - 1 + songData.length) % songData.length; // Move to previous, loop if at the start

    setCurrentSong(songData[currentIndex]); // Play the previous song 
  };
  return (
    <div className="root">
      <div class="row" style={{ height: '100%' }}>
        <div class="col-3 menu">
          <Navigation navigation={navigation} onChange={changeNavigation} />
        </div>
        <div style={{ padding: '15px' }} class="col-3 song-list">
          <ListSong label={label} onChange={changeSong} songs={songData} currentSong={currentSong} />
        </div>
        <div className="col-6 mobileView">
          <MobilePlayer PlayPrevious={PlayPrevious} PlayNext={PlayNext} updateList={updateList} song={currentSong} />

        </div>

      </div>

      <BottomDrawer trigger={
        <>
          <p onClick={() => changeNavigation('foryou')} className={`${navigation === 'foryou' ? 'active-link' : ''}`}>For You</p>
          <p onClick={() => changeNavigation('toptracks')} className={`${navigation === 'toptracks' ? 'active-link' : ''}`}>Top Tracks</p>
          <p onClick={() => changeNavigation('favourites')} className={`${navigation === 'favourites' ? 'active-link' : ''}`}>Favourites</p>
          <p onClick={() => changeNavigation('recent')} className={`${navigation === 'recent' ? 'active-link' : ''}`}>Recently Played</p>
        </>} >
        <ListSong label={label} onChange={changeSong} songs={songData} currentSong={currentSong} />
      </BottomDrawer>
    </div>
  )
}

export default App
