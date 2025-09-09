import { createContext, useState } from "react";

export type PopUpType = {
    title: string;
    description: string;
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top";
};

export type PopUpContextType = {
    popUpData: PopUpType;
    setPopUpData: (d: PopUpType) => void;
};

export const PopUpContext = createContext<PopUpContextType>({
    popUpData: { title: "default title", description: "no-description", position: "bottom-right" },
    setPopUpData: () => { }
});

export const PopUpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [popUpData, setPopUpData] = useState<PopUpType>({
        title: "default notif",
        description: "no-description",
        position: "bottom-right",
    });

    return (
        <PopUpContext.Provider value={{ popUpData, setPopUpData }}>
            {children}
        </PopUpContext.Provider>
    );
};
