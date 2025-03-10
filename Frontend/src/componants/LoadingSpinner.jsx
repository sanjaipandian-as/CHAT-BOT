import React from "react";

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="relative w-16 h-16">
                {/* Spinning Outer Ring */}
                <div className="absolute w-full h-full border-4 border-transparent border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>

                {/* Pulsing Dot in Center */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;