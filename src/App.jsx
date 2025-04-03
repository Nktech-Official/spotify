import { useState } from "react"
import { useEffect } from "react"
import data from './assets/data.json'
import MobilePlayer from "./components/MobilePlayer"
import ListSong from "./components/ListSong";
import Navigation from "./components/Navigation";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [currentSong, setCurrentSong] = useState({});
  const [songData, SetSongData] = useState([])
  const [navigation, setNavigation] = useState('foryou')
  const [label, setLabel] = useState('For You')
  useEffect(() => {
    const bg = document.querySelector('.root');
    bg.classList.add('transition');

    document.documentElement.style.setProperty('--primaryGradient', currentSong.color1)
    setTimeout(() => bg.classList.remove('transition'), 1500);

    // document.documentElement.style.setProperty('--secondaryGradient',currentSong.color2)
  }, [currentSong])
  //mock api call
  const fetchData = async () => {
    SetSongData(data)
    setCurrentSong(data[3])
    console.log(data);
  }
  useEffect(() => {
    fetchData()
  }, [])
  useEffect(() => {
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
  }, [navigation])
  const changeSong = (song) => {
    setCurrentSong(song);
  }
  const changeNavigation = (x) => {
    setNavigation(x)
  }
  return (
    <div className="root">
      <div class="row" style={{ height: '100%' }}>
        <div class="col-3 menu"><Navigation navigation={navigation} onChange={changeNavigation} /></div>
        <div style={{ padding: '15px' }} class="col-3 song-list"><ListSong label={label} onChange={changeSong} songs={songData} currentSong={currentSong} /></div>
        <div className="col-6 mobileView">
          <MobilePlayer song={currentSong} />
        </div>

      </div>

    </div>
  )
}

export default App
