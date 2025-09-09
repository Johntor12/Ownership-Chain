import React from "react";
import { NavBar } from "../components/navigation";
import { Footer } from "../components/footer";
import ModalWrapper from "../components/modals/modal-wrapper";
import { ModalKindEnum } from "../types/ui";
import { AddDocumentsModal, EditPersonalInfoModal, AddRuleDetails } from "../components/modals/create-asset";
import { PopUp } from "../components/popup";
import { ProposedToBuyToken } from "../components/modals/detail-asset";
import { DocHash, ReportPlagiarism, ReportUser, UserFootPrint } from "../components/modals/report";

export function MainLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="hide-scrollbar w-full min-h-screen">
            <NavBar />
            <div className="min-h-screen">{children}</div>
            <Footer />
            <ModalWrapper
                listcontent={[
                    { name: ModalKindEnum.adddocument, component: <AddDocumentsModal /> },
                    { name: ModalKindEnum.personalinfo, component: <EditPersonalInfoModal /> },
                    { name: ModalKindEnum.addruledetails, component: <AddRuleDetails /> },
                    { name: ModalKindEnum.proposebuytoken, component: <ProposedToBuyToken /> },
                    { name: ModalKindEnum.userscam, component: <ReportUser /> },
                    { name: ModalKindEnum.plagiarism, component: <ReportPlagiarism /> },
                    { name: ModalKindEnum.hashclarity, component: <DocHash /> },
                    { name: ModalKindEnum.userfootprintflow, component: <UserFootPrint /> },
                ]}
            />
            <PopUp />
        </div>
    );
}
