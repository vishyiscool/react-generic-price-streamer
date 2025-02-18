'use client'

import { useContext } from 'react';
import styles from './header.module.scss';
import { SearchDataContext } from '@/services/search-data';
import { useDeviceType } from '@/lib/hooks';

export interface HeaderProps {
  onMenuToggle: () => void;
  isMenuVisible?: boolean;
}

export function Header({ onMenuToggle }: HeaderProps) {

  const { searchData, setSearchData } = useContext(SearchDataContext);
  const deviceType = useDeviceType();

  return (
    <header>
      <div className={styles.title} onClick={onMenuToggle}>
        {
          deviceType === 'mobile' ?
            <div className={styles['hamburger-menu']}>
              <i className='fa-solid fa-bars'></i>
            </div>
            : <img src="/images/TRANS_H_white-on-transparent.png" />
        }
        {/* TransientAI */}

      </div>

      <div className={styles['global-search']}>
        {/* {
          searchData?.description ?
            <div className={styles['search-pill']}>
              {searchData.description}

              <i className='fa-solid fa-x'></i>
            </div>
            :
            <>
              <i className='fa-solid fa-magnifying-glass'></i>
              'Search for Instrument by Name or ID'
            </>
        } */}
        {
          searchData.description ?
            <>
              Selected Security:
              <div className={styles['selected-security']}>
                {searchData.description}

                <i className='fa-regular fa-x' onClick={() => setSearchData({})}></i>
              </div>
            </> : <></>
        }

      </div>

      {/* // todo remove inlines tyling */}
      <div className='flex'>

        <div className={styles['client-logo']}>
          <img src="/images/HurricaneLogo_Brightened.png" />
          <span>HURRICANE CAPITAL</span>
        </div>

        <div className='profile-pic'>
          <img src="/images/ProfilePic.jpeg"></img>
        </div>
        {/* 
        <div className='profile-pic'>
          <img src="/images/ProfilePicAI.png"></img>
        </div> */}
      </div>
    </header>
  );
}