import React from "react";
import { ModalWrapperInterface } from "../../types/ui";
import { ModalContext } from "../../context/ModalContext";

export default function ModalWrapper({ listcontent }: { listcontent: ModalWrapperInterface[] }) {
    const { modalKind } = React.useContext(ModalContext);
    return (
        <div className={`${modalKind === null ? 'hidden' : 'fixed inset-0 bg-white/70 z-50 flex items-center justify-center'}`}>
            {listcontent.find(c => c.name === modalKind)?.component}
        </div>
    );
}