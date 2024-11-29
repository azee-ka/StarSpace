import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './sidebars.css';
import { useActionData, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useAuth } from '../../reducers/auth/useAuth';
import LargeSidebar from './largeSidebar/largeSidebar';
import SmallSidebar from './smallSidebar/smallSidebar';
import API_BASE_URL, { CLIENT_BASE_URL } from '../../config';
import ProfilePicture from '../../utils/getProfilePicture';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faEdit, faPlus, faCompass, faCalculator, faTachometerAlt, faChartLine, faSearch} from '@fortawesome/free-solid-svg-icons';
import SearchSidebar from './searchSidebar/searchSidebar';
library.add(faChartBar, faEdit, faPlus, faCompass, faCalculator, faTachometerAlt, faChartLine);

const Sidebar = ({ handleCreatePostOverlayOpen }) => {

    const [showSeachSidebar, setShowSearchSidebar] = useState(false);

    const [showLargeSidebar, setShowLargeSidebar] = useState(true);

    const navigate = useNavigate();
    const { authState } = useAuth();

    const handleShowSearchSidebbar = () => {
        setShowSearchSidebar(!showSeachSidebar);
        setShowLargeSidebar(!showLargeSidebar);
    };


    const privatePagesSmallSidebar = [
        // Learner Links
        { path: '/learner/dashboard', icon: <FontAwesomeIcon icon="chart-bar" />, role: 'Learner' },
        { path: '', icon: <FontAwesomeIcon icon="edit" />, role: 'Learner', action: handleCreatePostOverlayOpen },
    
        // Professional Links
        { path: '/professional/dashboard', icon: <FontAwesomeIcon icon="chart-bar" />, role: 'Professional' },
        { path: '', icon: <FontAwesomeIcon icon="plus" />, role: 'Professional', action: handleCreatePostOverlayOpen },
        { path: '/professional/explore', icon: <FontAwesomeIcon icon="compass" />, role: 'Professional' },
    
        // Personal Links
        { path: '/personal/dashboard', icon: <FontAwesomeIcon icon={faChartBar} />, role: 'Personal' },
        { path: '', icon: <FontAwesomeIcon icon={faSearch} />, role: 'Personal', action: handleShowSearchSidebbar },
        { path: '', icon: <FontAwesomeIcon icon="edit" />, role: 'Personal', action: handleCreatePostOverlayOpen },
        { path: '/personal/explore', icon: <FontAwesomeIcon icon="compass" />, role: 'Personal' },
    
        { path: '/calculator', icon: <FontAwesomeIcon icon="calculator" />, role: 'any' },
    ];
    

    const privatePagesLargeSidebar = [
        // Learner Links
        { path: '/learner/dashboard', label: 'Dashboard', id: 'navbar-phrase', role: 'Learner' },
        { path: '', label: 'Create Post', id: 'navbar-phrase', role: 'Learner', action: handleCreatePostOverlayOpen },



        // Professional Links
        { path: '/professional/dashboard', label: 'Dashboard', id: 'navbar-phrase', role: 'Professional' },
        { path: '', label: '+', id: 'navbar-phrase', role: 'Professional', action: handleCreatePostOverlayOpen },
        { path: '/professional/explore', label: 'Explore', id: 'navbar-phrase', role: 'Professional' },




        // Personal Links
        { path: '/personal/dashboard', label: 'Dashboard', id: 'navbar-phrase', role: 'Personal' },
        { path: '', label: 'Create Post', id: 'navbar-phrase', role: 'Personal', action: handleCreatePostOverlayOpen },
        { path: '/personal/explore', label: 'Explore', id: 'navbar-phrase', role: 'Personal' },


        { path: '/calculator', label: 'Calculator', id: 'navbar-phrase', role: 'any' },

    ];

    const handleSidebarClick = (path, action) => {
        if (action) {
            action();
        } else {
            navigate(path);
        }
    };

    const handleSidebarToggle = () => {
        setShowLargeSidebar(!showLargeSidebar);
        // setSearchQuery('');
        // setSearchResults([]);
    };



    return (
        <div className={`sidebar-container`}>
           

            <div className='sidebar-content'>
                <SmallSidebar showSeachSidebar={showSeachSidebar} privatePagesSmallSidebar={privatePagesSmallSidebar} handleSidebarClick={handleSidebarClick} />


                
                {/* {showSeachSidebar && */}
                    <SearchSidebar showSeachSidebar={showSeachSidebar} />
                {/* } */}


                {/* {showLargeSidebar && */}
                    <LargeSidebar showLargeSidebar={showLargeSidebar} privatePagesLargeSidebar={privatePagesLargeSidebar} handleSidebarClick={handleSidebarClick}/>
                {/* } */}
            </div>
        </div>
    );
};

export default Sidebar;
