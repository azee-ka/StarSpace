import QuantaSidebar from "./quantaSidebar/quantaSidebar";
import './quantaLayout.css';
import CreatePacketOverlay from "../createPacket/createPacket";

const QuantaLayout = ({ children }) => {
    
    return (
        <div className="quanta-layout">
            <div className="quanta-layout-sidebar-left">
                <QuantaSidebar />
            </div>
            <div className="quanta-layout-child">
                {children}
            </div>
            <div className="quanta-layout-sidebar-right">
            </div>
        </div>
    )
}

export default QuantaLayout;