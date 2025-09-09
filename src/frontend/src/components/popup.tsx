import { useContext, useEffect, useState } from "react";
import { PopUpContext } from "../context/PopUpContext";

export function PopUp() {
  const context = useContext(PopUpContext);

  const { popUpData, setPopUpData } = context;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (popUpData.title !== "default notif") {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setPopUpData({
          title: "default notif",
          description: "no-description",
          position: "bottom-right",
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [popUpData, setPopUpData]);

  if (!visible) return null;

  const positionClasses: Record<typeof popUpData.position, string> = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "top": "top-4 left-1/2 transform -translate-x-1/2",
  };

  return (
    <div
      className={`fixed z-[60] p-4 rounded-xl shadow-lg bg-white border border-gray-300 
      transition-all duration-300 ${positionClasses[popUpData.position]} md:w-[30vw] w-[60vw]`}
    >
      <h3 className="font-semibold text-gray-800">{popUpData.title}</h3>
      <p className="text-sm text-gray-600">{popUpData.description}</p>
    </div>
  );
}
