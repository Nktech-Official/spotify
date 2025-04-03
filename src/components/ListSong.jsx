import React from 'react'
import searchIcon from '../assets/search.svg'

export default function ListSong({ songs, onChange, currentSong, label }) {

    return (
        <>

            <h1 style={{ fontWeight: '700', fontSize: '32px', lineHeight: '36px', fontFamily: 'Basier Circle' }}>{label}</h1>

            <div className='search-container'>
                <input placeholder='Search Song, Artist' className='search' type="text" />
                <img src={searchIcon} alt="" className="search-icon" />
            </div>
            <div className='song-list-container'>
                {
                    !songs || songs.length === 0 ? <div style={{ display: 'flex', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', fontSize: '30px', fontWeight: '600' }}>
                        No {label} Song
                    </div> : <>
                        {
                            songs.map((song) => {
                                return (
                                    <div className={`song-item ${currentSong.title === song.title ? 'active' : ''}`} onClick={() => { onChange(song) }} key={song.id}>
                                        <div className="avtar">
                                            <img src={`/album/small/${song.thumbnail}`} alt="" />
                                        </div>
                                        <div className='title'>
                                            <p>{song.title}</p>
                                            <p style={{ fontSize: '14px', opacity: 0.7 }}>{song.artistName}</p>
                                        </div>
                                        <p >{song.duration}</p>
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
