import { Gavel } from "lucide-react";
import { MainLayout } from "../layout/main-layout";
import React from "react";
import { ReportCenterEnum } from "../types/ui";
import { FraudReporting, PlagiarismReporting, ReportCenterContent } from "../components/reporting-components";
import { ModalContext } from "../context/ModalContext";

function Courting() {
  const [selectedTab, setSelectedTab] = React.useState<ReportCenterEnum>(ReportCenterEnum.asset);
  const {reportManagement} = React.useContext(ModalContext);


  React.useEffect(() => {
    console.log(reportManagement.data)
  }, [
    reportManagement.data
  ])

  return (
    <MainLayout>
      <div className="px-5 pt-15 pb-5 md:px-20 space-y-5 md:space-y-10">
        <div className="space-y-8">
          <div className="p-4 border border-gray-300 rounded-md space-y-4">
            <div className="flex items-center space-x-4">
              <Gavel size={30} />
              <h1 className="text-[rgb(0,8,26)] capitalize text-3xl">Asset reporting Center</h1>
            </div>
            <p className="text-normal text-gray-700">Report issues with assets to maintain marketplace integrity</p>
          </div>

          <div className="space-y-4">
            <div className="flex space-x-2 border-b border-gray-300 pb-2">
              <div
                onClick={() => {
                  setSelectedTab(ReportCenterEnum.asset)
                  reportManagement.reseter()
                }}
                className={`${selectedTab === ReportCenterEnum.asset ? 'text-gray-500' : ''} cursor-pointer`}
              >
                Plagiarism Report
              </div>
              <div
                onClick={() => {
                  setSelectedTab(ReportCenterEnum.user)
                  reportManagement.reseter()
                }}
                className={`${selectedTab === ReportCenterEnum.user ? 'text-gray-500' : ''} cursor-pointer`}
              >
                User Report
              </div>
            </div>

            <div className="p-4 border border-gray-300 rounded-md space-y-4">
              <ReportCenterContent
                selectedTab={selectedTab}
                contentLists={[
                  { name: ReportCenterEnum.asset, component: <PlagiarismReporting /> },
                  { name: ReportCenterEnum.user, component: <FraudReporting /> }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Courting;
