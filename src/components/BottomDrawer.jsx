import { useRef } from "react";
import { useState } from "react";
import closeIcon from '../assets/close.svg'
const BottomDrawer = ({ children, trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const drawerRef = useRef(null);
    const startY = useRef(0);

    const handleTouchStart = (e) => {
        startY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
        const currentY = e.touches[0].clientY;
        const diffY = currentY - startY.current;

        if (diffY > 50) {
            setIsOpen(false);
        }
    };
    return (
        <>
            <div className="mobile-controls" onClick={() => setIsOpen(true)} >
                {trigger}
            </div>

            <div className="drawer-container">
                {/* <button className="open-btn" >Open Drawer</button> */}

                <div ref={drawerRef}
                    className={`drawer ${isOpen ? "open" : ""}`} onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}>
                    <div className="close-btn" onClick={() => setIsOpen(false)}> <img src={closeIcon} alt="clos" /> </div>
                    <div className="drawer-content ">
                        {children}
                    </div>
                </div>

                {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
            </div>
        </>
    );
};

export default BottomDrawer;
