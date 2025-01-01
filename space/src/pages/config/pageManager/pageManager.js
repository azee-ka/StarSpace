import React, { useEffect, useState } from "react";
import PageEditor from "../pageEditor/pageEditor";
import './pageManager.css';

const PageManager = ({ pageId }) => {
    const [layout, setLayout] = useState([]);

    useEffect(() => {
        // Fetch initial layout
        // fetch(`/api/pages/${pageId}/layout`)
        //   .then((res) => res.json())
        //   .then((data) => setLayout(data.widgets));
    }, [pageId]);

    const saveLayout = () => {
        // fetch(`/api/pages/${pageId}/layout`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ widgets: layout }),
        // });
        
    };

    return (
        <div className="page-manager">
            <PageEditor layout={layout} onUpdate={setLayout} />

            <button className="exit-customizer-btn">
                Exit Customization
            </button>
            <div className="customizer-controls-btn">
                <button onClick={saveLayout}>
                    Save Layout
                </button>
                <button>
                    Reset Layout
                </button>
            </div>
        </div>
    );
};

export default PageManager;
