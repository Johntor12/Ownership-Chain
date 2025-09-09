import { ChevronDown, ChevronRight, PanelsLeftBottomIcon, LayoutList, CircleDollarSign, FileCheck, Flag, ImagePlus, User, Images, Banknote, ArrowLeftRight, ArrowUpRight } from "lucide-react";
import { useIsMobile } from "../hook/useMobile";
import React from "react";
import { ContentDashboardInterface, UserDashboardMenus, UserDashboardMenusInterface } from "../types/ui";
import { formatMotokoTime, ReduceCharacters } from "../utils/rwa-hepler";
import { Link } from "react-router-dom";

export const DashboardMenu: UserDashboardMenusInterface[] = [
    {
        name: 'About Me',
        usermenu: UserDashboardMenus.AboutMe,
        icon: User,
        submenu: [],
    },
    {
        name: 'Assets',
        icon: Images,
        submenu: [
            {
                name: 'List',
                usermenu: UserDashboardMenus.AssetsList,
                icon: LayoutList
            },
            {
                name: 'Proposals',
                usermenu: UserDashboardMenus.Proposals,
                icon: FileCheck
            },
        ]
    },
    {
        name: 'Create Asset',
        icon: ImagePlus,
        usermenu: UserDashboardMenus.CreateAsset,
        submenu: []
    },
    {
        name: 'Inome',
        icon: CircleDollarSign,
        submenu: [
            {
                name: 'Dividend',
                usermenu: UserDashboardMenus.Dividend,
                icon: Banknote
            },
            {
                name: 'Transaction',
                usermenu: UserDashboardMenus.Transaction,
                icon: ArrowLeftRight
            },
        ]
    },
    {
        name: 'Reporting',
        icon: Flag,
        usermenu: UserDashboardMenus.MyReport,
        submenu: []
    },
];

export function SidebarDashboard(
    { isSidebarOpen, setIsSidebarOpen, children }:
        { isSidebarOpen: boolean; setIsSidebarOpen: (d: boolean) => void; children: React.ReactNode; }
) {
    if (!isSidebarOpen) return null;
    const isMobile = useIsMobile();

    return (
        <div
            className={`
                        ${isMobile
                    ? "absolute top-0 left-0 w-1/2 h-full z-20 transform transition-transform duration-300 ease-in-out"
                    : "relative w-[40%] md:w-[25%] transform transition-all duration-300 ease-in-out"
                } 
                        flex items-start justify-center p-2
                      `}
        >
            <div className="bg-white w-full h-full rounded-l-md rounded-b-md shadow-lg border border-gray-300 p-2">
                {isMobile &&
                    <div
                        className="border-b border-gray-300 pb-2 cursor-pointer w-full flex justify-start"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <PanelsLeftBottomIcon />
                    </div>
                }
                <div>{children}</div>
            </div>
        </div>
    );
}

export function SidebarItem({
    selectedMenu,
    setSelectedMenu,
    content,
}: {
    selectedMenu: UserDashboardMenus;
    setSelectedMenu: (d: UserDashboardMenus) => void;
    content: UserDashboardMenusInterface;
}) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleMainClick = () => {
        if (content.submenu.length > 0) {
            setIsOpen(!isOpen);
        } else {
            setSelectedMenu(content.usermenu ?? selectedMenu);
        }
    };

    return (
        <div className="cursor-pointer space-y-2 rounded-md text-sm">
            <div
                onClick={handleMainClick}
                className={`w-full flex items-center justify-between hover:bg-gray-100 p-2 rounded-md ${selectedMenu === content.usermenu ? "bg-gray-200" : ""
                    }`}
            >
                <div className="flex items-center space-x-1">
                    {content.icon && <content.icon size={15} />}
                    <p>{content.name}</p>
                </div>
                {content.submenu.length > 0 && (
                    <span className="transition-transform duration-200">
                        {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                    </span>
                )}
            </div>

            {isOpen && content.submenu.length > 0 && (
                <div className="transition-all duration-200 space-y-1 pl-6">
                    {content.submenu.map((sub, idx) => (
                        <div
                            key={idx}
                            className={`flex items-center space-x-1 p-2 rounded-md hover:bg-gray-100 ${selectedMenu === sub.usermenu ? "bg-gray-200" : ""
                                }`}
                            onClick={() => setSelectedMenu(sub.usermenu)}
                        >
                            {sub.icon && <sub.icon size={15} />}
                            <p>{sub.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function ContentDashboard(
    { isSidebarOpen, setIsSidebarOpen, contentList, selectedMenu }:
        { isSidebarOpen: boolean; setIsSidebarOpen: (d: boolean) => void; contentList: ContentDashboardInterface[], selectedMenu: UserDashboardMenus }
) {
    const isMobile = useIsMobile();

    return (
        <div
            className={`
              ${isMobile
                    ? "w-full relative z-10"
                    : !isSidebarOpen
                        ? "w-full"
                        : "w-[60%] md:w-[75%]"
                } 
              p-2
            `}
        >
            <div className="bg-gray-100 w-full h-full rounded-md shadow-lg border border-gray-300 p-2 overflow-y-scroll hide-scrollbar">
                <div
                    className={`border-b border-gray-300 pb-2 cursor-pointer w-full`}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <PanelsLeftBottomIcon />
                </div>
                <div className="pt-4">
                    {contentList.find(c => c.name === selectedMenu)?.component}
                </div>
            </div>
        </div>
    );
}

export function ReportAimToMeCard(
    { id, content, description, reputation, created, hashClarity, footprint }:
        { id:string, content: string; description: string; reputation: bigint, created: bigint, hashClarity: [] | [string] | undefined, footprint: [] | [bigint] | undefined }
) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="w-full bg-white p-4 rounded-md border border-gray-300 shadow-md">
            <div
            >
                <div
                    className="flex items-center justify-between uppercase font-semibold my-2"
                >
                    <div
                        className="cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {content}
                    </div>
                    <Link
                        className="p-1 bg-gray-300 rounded-sm cursor-pointer"
                        to={`/report/${id}`}
                    >
                        <ArrowUpRight size={20} />
                    </Link>
                </div>
                <div className={`text-sm my-2 ${isOpen ? 'block' : 'hidden'}`}>
                    {description}
                </div>
                <div className="text-sm space-y-2">
                    <p>{formatMotokoTime(created)}</p>
                    <p>Report Score {reputation.toString()}</p>
                    <p>{hashClarity ? ReduceCharacters(hashClarity.toString()) : "-"}</p>
                    <p>User foot print score {footprint?.toString() ?? "-"}</p>
                </div>
            </div>
        </div>
    );
}