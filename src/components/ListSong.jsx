import React from 'react'
import searchIcon from '../assets/search.svg'
import { useState } from 'react'
import { useEffect } from 'react';
const fuzzySearchSongs = (songs, searchTerm) => {
    if (!searchTerm.trim()) return songs; // If search is empty, return all songs

    const lowerSearch = searchTerm.toLowerCase();

    return songs.filter(({ title, artistName }) =>
        title.toLowerCase().includes(lowerSearch) ||
        artistName.toLowerCase().includes(lowerSearch)
    );
};
export default function ListSong({ songs, onChange, currentSong, label, }) {
    const [currentSongList, setCurrentSongList] = useState(songs)
    const [search, setSearch] = useState();
    useEffect(() => {
        if (search && search.length !== 0) {
            const filteredSongs = fuzzySearchSongs(songs, search)
            setCurrentSongList(filteredSongs)
        } else {
            setCurrentSongList(songs)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, songs])
    return (
        <>

            <h1 style={{ fontWeight: '700', fontSize: '32px', lineHeight: '36px', fontFamily: 'Basier Circle' }}>{label}</h1>

            <div className='search-container'>
                <input onChange={(e) => setSearch(e.target.value)} value={search} placeholder='Search Song, Artist' className='search' type="text" />
                <img src={searchIcon} alt="" className="search-icon" />
            </div>
            <div className='song-list-container'>
                {
                    !currentSongList || currentSongList.length === 0 ? <div style={{ display: 'flex', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', fontSize: '30px', fontWeight: '600' }}>
                        No {label} Song
                    </div> : <>
                        {
                            currentSongList.map((song) => {
                                return (
                                    <div className={`song-item ${currentSong.title === song.title ? 'active' : ''}`} onClick={() => { onChange(song) }} key={song.id}>
                                        <div className="avtar">
                                            <img src={`/album/small/${song.thumbnail}`} alt="" />
                                        </div>
                                        <div className='title'>
                                            <p>{song.title}</p>
                                            <p style={{ fontSize: '14px', opacity: 0.7 }}>{song.artistName}</p>
                                        </div>
                                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '18px', margin: 0 }}>{song.duration}</p>
                                    </div>
                                )
                            })
                        }
                    </>

                }

            </div>
        </>
    )
}
