import React, { useEffect, useState } from 'react';
import { slide as Menu } from 'react-burger-menu'
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';
import { DropdownToggle, Toast, ToastBody, Tooltip, UncontrolledDropdown } from 'reactstrap';
import { parse, parseUrl, stringifyUrl } from 'query-string';
import { openDb } from './indexedDb';
import { BiHelpCircle } from 'react-icons/bi';
import TitleModal from './TitleModal';
import useStateRef from './UseStateRef';

const styles = {
  bmBurgerButton: {
    width: '36px',
    height: '30px',
    right: '36px',
    top: '36px',
  },
  bmBurgerBars: {
    background: '#fff'
  },
  bmBurgerBarsHover: {
    background: '#a90000'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmMenuWrap: {
    position: 'fixed',
    top: '0',
    height: '100%',
    maxWidth: '480px',
    width: '100%',
  },
  bmMenu: {
    background: 'var(--main-bg-color)',
    paddingTop: '2.5em',
    fontSize: '0.875em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    padding: '0.8em'
  },
  bmItem: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    borderBottom: '0.01rem solid var(--secondary-bg-color)',
    color: 'white',
    textDecoration: 'none',
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
}

const storeName = 'songs';

const SidebarMenu: React.FC<{
  goHome: () => void,
  songTitle: string,
  showTargetNotes: boolean,
  toggleShowTargetNotes: () => void,
  showSheetMusic: boolean,
  toggleShowSheetMusic: () => void,
  getStringifiedSongState: () => string,
  pushSavedSong: (stringifiedQuery: string) => void,
  pushDeletedSong: () => void,
  goBack: () => void,
  appCanGoBackRef: React.MutableRefObject<boolean>,
  loadSong: (savedSongTitle: string) => void,
  saveSongTitle: (songTitle: string) => void,
}> = ({
  goHome,
  songTitle,
  showTargetNotes,
  toggleShowTargetNotes,
  showSheetMusic,
  toggleShowSheetMusic,
  getStringifiedSongState,
  pushSavedSong,
  pushDeletedSong,
  goBack,
  appCanGoBackRef,
  loadSong,
  saveSongTitle,
}) => {
  const [isOpen, setIsOpen, isOpenRef] = useStateRef(false)

  const [showCopyToast, setShowCopyToast] = useState(false);

  const [songTitles, setSongTitles] = useState([] as IDBValidKey[]);
  const [showSavedSongs, setShowSavedSongs] = useState(false);

  const [targetNotesTooltipOpen, setTargetNotesTooltip] = useState(false);
  const toggleTargetNotesTooltip = () => setTargetNotesTooltip(!targetNotesTooltipOpen);

  const [showSheetMusicTooltipOpen, setShowSheetMusicTooltip] = useState(false);
  const toggleShowSheetMusicTooltip = () => setShowSheetMusicTooltip(!showSheetMusicTooltipOpen);

  const [editingTitle, setEditingTitle, editingTitleRef] = useStateRef(false);
  const toggleTitleModal = () => setEditingTitle(!editingTitle);

  const [requestedPersistence, setRequestedPersistence] = useState(false);

  async function loadSongTitles() {
    const db = await openDb();

    const keys = await db.getAllKeys(storeName);
    setSongTitles(keys.filter((value) => !!value));
  }

  useEffect(() => { loadSongTitles() }, []);

  async function storeSong(songTitle: string) {
    const db = await openDb();

    const stringifiedQuery = `?${getStringifiedSongState()}`;

    await db.put(storeName, stringifiedQuery, songTitle);

    pushSavedSong(stringifiedQuery);
    loadSongTitles();

    // Check if site's storage has been marked as persistent
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persisted();
      console.warn(`Persisted storage preexisting: ${isPersisted}`);

      if (!isPersisted && !requestedPersistence) {
        // Request persistent storage for site
        setRequestedPersistence(true);
        const persistanceGranted = await navigator.storage.persist();
        console.warn(`Persisted storage granted: ${persistanceGranted}`);
      }
    }

  }

  async function deleteStoredSong(songTitle: IDBValidKey) {
    const db = await openDb();

    await db.delete(storeName, songTitle);
    loadSongTitles();

    pushDeletedSong();
  }

  const toggleShowSavedSongs = () => {
    setShowSavedSongs(showingSavedSongs => !showingSavedSongs);
  }

  const bufferHistoryState = () => {
    if ((isOpenRef.current || editingTitleRef.current || appCanGoBackRef.current) && !window.history.state?.songScalerBufferedHistory) {
      window.history.pushState({ songScalerBufferedHistory: true }, '');
    }
  }

  const handlePopState = () => {
    if (editingTitleRef.current) setEditingTitle(false);
    else if (isOpenRef.current) setIsOpen(false);
    else goBack();
    bufferHistoryState();
  };

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // event listener doesn't need to update closure because it has refs

  useEffect(() => {
    bufferHistoryState();
  }, [isOpen || editingTitle || appCanGoBackRef.current]); // history does need to be rebuffered when the conditions for hijacking change value

  const isAndroid = () => {
    return (/android/i.test(navigator.userAgent));
  }

  const isIOs = () => {
    return (/iPad|iPhone|iPod/i.test(navigator.userAgent));
  }

  const venmoWithAppleAppStoreFallback = () => {
    setTimeout(function () { window.location.href = "https://apps.apple.com/us/app/venmo/id351727428"; }, 20);
    window.location.href = "venmo://paycharge?txn=pay&recipients=JohnMangel&note=SongScaler!";
  }

  return (
    <Menu
      styles={styles}
      customBurgerIcon={<GiHamburgerMenu onClick={() => setIsOpen(true)} />}
      customCrossIcon={<MdClose style={{backgroundColor: 'transparent'}} />}
      right
      isOpen={isOpen}
      onStateChange={(state) => setIsOpen(state.isOpen)}
      menuClassName="px-3"
      itemListClassName="px-1"
      itemClassName="py-1 px-3"
      id="sidebar-menu"
    >
      <a id="home" className="menu-item" onClick={() => { goHome(); setIsOpen(false); } }>Home</a>
      <a
        className="menu-item"
        onClick={() => storeSong(songTitle)}
      >
        Save Current Song
      </a>
      { songTitles.includes(songTitle) && (
        <a
          className="menu-item"
          onClick={() => deleteStoredSong(songTitle)}
        >
          Delete Current Saved Song
        </a>
      )}
      <a
        className="menu-item"
        onClick={() => setEditingTitle(true)}
      >
        Edit Title
      </a>
      <TitleModal
        isOpen={editingTitle}
        toggle={toggleTitleModal}
        onSet={songTitle => saveSongTitle(songTitle)}
        startingValue={songTitle}
        zIndex={1200}
      />
      <a
        className="menu-item"
        onClick={() => {
          const el = document.createElement('textarea');
          const { url } = parseUrl(window.location.href);
          const parsedQuery = parse(getStringifiedSongState());
          el.value = stringifyUrl({ url, query: parsedQuery });
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          document.body.removeChild(el);
          setShowCopyToast(true);
          setTimeout(() => {setShowCopyToast(false)}, 3000);
        }}
      >
        Copy Link to Share Song
      </a>
      <UncontrolledDropdown onClick={() => toggleShowSavedSongs()}>
        <DropdownToggle caret tag="div" className="menu-item">
          Saved Songs
        </DropdownToggle>
      </UncontrolledDropdown>
      { showSavedSongs && songTitles.map(savedSongTitle => (
        <a
          className="menu-item pl-5"
          onClick={() => {
            loadSong(savedSongTitle as string);
            setIsOpen(false);
          }}
        >{savedSongTitle}</a>
      )) }
      <a className="menu-item" onClick={() => toggleShowTargetNotes()}>
        Highlight Target Notes <BiHelpCircle size='1.5em' id="target-notes-tooltip" className="d-inline" onClick={(e) => e.stopPropagation()} />
        <Tooltip
          container="sidebar-menu"
          placement="bottom"
          trigger="click hover"
          isOpen={targetNotesTooltipOpen}
          target="target-notes-tooltip"
          toggle={() => toggleTargetNotesTooltip()}
        >
          On the piano visualization, highlight the notes from the upcoming chord that are the same as ("common tones") or a semitone away from (have a "leading tone") notes in the current chord.
        </Tooltip>
        { showTargetNotes ? (
          <BsToggleOn className="float-right" size='1.5em' />
        ) : (
          <BsToggleOff className="float-right" size='1.5em' />
        ) }
      </a>
      <a className="menu-item" onClick={() => toggleShowSheetMusic()}>
        Show Sheet Music Scales <BiHelpCircle size='1.5em' id="show-sheet-music-tooltip" className="d-inline" onClick={(e) => e.stopPropagation()} />
        <Tooltip
          container="sidebar-menu"
          placement="bottom"
          trigger="click hover"
          isOpen={showSheetMusicTooltipOpen}
          target="show-sheet-music-tooltip"
          toggle={() => toggleShowSheetMusicTooltip()}
        >
          Instead of a piano visualization, show the scale in sheet music notation.
        </Tooltip>
        { showSheetMusic ? (
          <BsToggleOn className="float-right" size='1.5em' />
        ) : (
          <BsToggleOff className="float-right" size='1.5em' />
        ) }
      </a>
      {
        isAndroid() ? (
          <a id="venmo" className="menu-item" href="intent://paycharge?txn=pay&recipients=JohnMangel&note=SongScaler!#Intent;package=com.venmo;scheme=venmo;end">Donate</a>
          ) : isIOs() ? (
          <a id="venmo" className="menu-item" onClick={() => venmoWithAppleAppStoreFallback()}>Donate</a>
        ) : (
          <a id="venmo" className="menu-item" href="https://www.venmo.com/u/JohnMangel" target="_blank">Donate</a>
        )
      }
      <a id="feedback" className="menu-item" href="mailto:songscaler+feedback@gmail.com">Send Feedback</a>
      <Toast
        style={{ bottom: '1rem', position: 'fixed', backgroundColor: 'var(--secondary-bg-color)' }}
        isOpen={showCopyToast}
      >
        <ToastBody>
          Link copied to clipboard
        </ToastBody>
      </Toast>
    </Menu>
  );
}

export default SidebarMenu;