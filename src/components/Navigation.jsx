import React from 'react'
import logo from '../assets/Logo.svg'
export default function Navigation({ navigation, onChange }) {
    return (
        <div className='navigation'>
            <img width={130} height={40} className='logo' src={logo} alt="spotify logo" />
            <div className="navs">
                <p onClick={() => onChange('foryou')} className={`${navigation === 'foryou' ? 'active-link' : ''}`}>For You</p>
                <p onClick={() => onChange('toptracks')} className={`${navigation === 'toptracks' ? 'active-link' : ''}`}>Top Tracks</p>
                <p onClick={() => onChange('favourites')} className={`${navigation === 'favourites' ? 'active-link' : ''}`}>Favourites</p>
                <p onClick={() => onChange('recent')} className={`${navigation === 'recent' ? 'active-link' : ''}`}>Recently Played</p>
            </div>
            <img className='avtar' src={'/avtar.png'} alt="" />
        </div>
    )
}
