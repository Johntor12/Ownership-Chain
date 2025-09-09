import React from "react";
import { MainLayout } from "../layout/main-layout";
import { ContentDashboard, DashboardMenu, SidebarDashboard, SidebarItem } from "../components/user-dashboard-component";
import { UserDashboardMenus } from "../types/ui";
import { AboutMeSection, AssetListSection, CreateAssetSection, DividendSection, ProposalsSection, ReportingSection, TransactionSection } from "../components/user-dashboard-section";

function DashboardUser() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [selectedMenu, setSelectedMenu] = React.useState<UserDashboardMenus>(UserDashboardMenus.AboutMe);

  return (
    <MainLayout>
      <div className="pt-15 flex min-h-screen relative">
        <div className="w-full h-[91dvh] flex relative">
          <SidebarDashboard
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          >
            <div className="py-2 space-y-3">
              {DashboardMenu.map((menus, idx) =>
                <SidebarItem
                  key={idx}
                  content={menus}
                  selectedMenu={selectedMenu}
                  setSelectedMenu={setSelectedMenu}
                />
              )}
            </div>
          </SidebarDashboard>

          <ContentDashboard
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            selectedMenu={selectedMenu}
            contentList={[
              { name: UserDashboardMenus.AboutMe, component: <AboutMeSection /> },
              { name: UserDashboardMenus.AssetsList, component: <AssetListSection /> },
              { name: UserDashboardMenus.CreateAsset, component: <CreateAssetSection /> },
              { name: UserDashboardMenus.Dividend, component: <DividendSection /> },
              { name: UserDashboardMenus.Proposals, component: <ProposalsSection /> },
              { name: UserDashboardMenus.MyReport, component: <ReportingSection /> },
              { name: UserDashboardMenus.Transaction, component: <TransactionSection /> },
            ]}
          >

          </ContentDashboard>
        </div>
      </div>
    </MainLayout >
  );
}

export default DashboardUser;
