import { Files, FileScan, Footprints, Hash } from "lucide-react";
import { ContentReportCenterInterface, ModalKindEnum, ReportCenterEnum } from "../types/ui";
import React from "react";
import { AuthContext } from "../context/AuthContext";
import { ModalContext } from "../context/ModalContext";
import { PopUpContext } from "../context/PopUpContext";
import { mapToReportType } from "../utils/rwa-hepler";
import { backendService } from "../services/backendService";

export function ReportCenterContent(
    { selectedTab, contentLists }:
        { selectedTab: ReportCenterEnum; contentLists: ContentReportCenterInterface[] }
) {
    return (
        <div>
            {contentLists.find(c => c.name === selectedTab)?.component}
        </div>
    )
}

export function PlagiarismReporting() {
    const { principal } = React.useContext(AuthContext);
    const { setModalKind, reportManagement } = React.useContext(ModalContext);
    const { setPopUpData } = React.useContext(PopUpContext);

    const [assetId, setAssetId] = React.useState("")
    const [reportType, setReportType] = React.useState("Fraud");

    async function onSubmitReport() {
        try {
            const res = await backendService.createreport(
                assetId,
                mapToReportType(reportType),
                reportManagement.data?.content ?? "",
                reportManagement.data?.description ?? "",
                [{
                    hashclarity: reportManagement.data?.hashClarity
                        ? [reportManagement.data.hashClarity]
                        : [],
                    footPrintFlow: reportManagement.data?.footPrintFlow
                        ? [BigInt(reportManagement.data.footPrintFlow)]
                        : []
                }]
            );

            console.log(reportManagement.data)

            setPopUpData({
                title: "Success to Create Reporting!",
                description: `reporting was created ${res}`,
                position: "bottom-right",
            })

            setModalKind(null);
        } catch (error) {
            setPopUpData({
                title: "Error To Create Report!",
                description: `no report was created becasue of error ${error}`,
                position: "bottom-right",
            })
            setModalKind(null);
        }

        reportManagement.reseter()
        setAssetId("");

    }


    return (
        <div className="space-y-4">

            <div className="flex items-center space-x-2 mb-8">
                <Files />
                <h1 className="text-lg">Plagiarism Reporting Options</h1>
            </div>


            <div className="flex flex-col space-y-2">
                <label htmlFor="identity" className="text-gray-600">Asset id</label>
                <input
                    type="text" name="identity" id="identity" placeholder="asset-id.."
                    className="p-2 border rounded-md border-gray-400"
                    value={assetId}
                    onChange={(e) => setAssetId(e.target.value)}
                />
            </div>

            <div className="space-y-4 w-full md:space-y-0 md:space-x-5 md:flex">
                <div
                    onClick={() => setModalKind(ModalKindEnum.plagiarism)}
                    className="p-4 rounded-md border border-gray-400 space-y-2 cursor-pointer w-full"
                >
                    <div className="flex items-center space-x-2">
                        <FileScan size={20} />
                        <h2>Straight Report</h2>
                    </div>
                    <p className="text-sm text-gray-600">Submit evidence directly</p>
                </div>

                <div
                    onClick={() => setModalKind(ModalKindEnum.hashclarity)}
                    className="p-4 rounded-md border border-gray-400 space-y-2 cursor-pointer w-full"
                >
                    <div className="flex items-center space-x-2">
                        <Hash size={20} />
                        <h2>Document Hash Clarity</h2>
                    </div>
                    <p className="text-sm text-gray-600">Compare document hash</p>
                </div>
            </div>

            <div className="p-4 rounded-md border border-gray-400 space-y-2 cursor-pointer w-full">
                <div className="flex flex-col space-y-1">
                    <label htmlFor="complainer">Complainer</label>
                    <input
                        type="text"
                        name="complainer"
                        id="complainer"
                        placeholder={principal?.toString()}
                        value={principal?.toString()}
                        className="p-2 border rounded-md border-gray-400"
                        disabled
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <label htmlFor="reporttype">Report type</label>
                    <select
                        name="reporttype"
                        id="complaintype"
                        className="border border-gray-400 p-2 w-full rounded"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value={"Scam"}>Scam</option>
                        <option value={"Fraud"}>Fraud</option>
                        <option value={"Legality"}>Legality</option>
                        <option value={"Plagiarism"}>Plagiarism</option>
                        <option value={"Bankrupting"}>Bankrupting</option>
                    </select>
                </div>
            </div>

            <button
                onClick={() => onSubmitReport()}
                className="p-2 rounded-md background-dark text-white w-full cursor-pointer"
            >
                Submit Report
            </button>
        </div>
    )
}

export function FraudReporting() {
    const { principal } = React.useContext(AuthContext);
    const { setModalKind, reportManagement } = React.useContext(ModalContext);
    const [userTargetId, setUserTargetId] = React.useState("")
    const [reportType, setReportType] = React.useState("Fraud");

    const { setPopUpData } = React.useContext(PopUpContext);


    async function onSubmitReport() {
        console.log(reportManagement.data)
        try {
            const res = await backendService.createreport(
                userTargetId,
                mapToReportType(reportType),
                reportManagement.data?.content ?? "",
                reportManagement.data?.description ?? "",
                [{
                    hashclarity: reportManagement.data?.hashClarity
                        ? [reportManagement.data.hashClarity]
                        : [],
                    footPrintFlow: reportManagement.data?.footPrintFlow
                        ? [BigInt(reportManagement.data.footPrintFlow)]
                        : []
                }]
            );

            setPopUpData({
                title: "Success to Create Reporting!",
                description: `reporting was created ${res}`,
                position: "bottom-right",
            })

            setModalKind(null);

        } catch (error) {
            setPopUpData({
                title: "Error To Create Report!",
                description: `no report was created becasue of error ${error}`,
                position: "bottom-right",
            })
            setModalKind(null);
        }

        reportManagement.reseter();
        setUserTargetId("");
    }

    return (
        <div className="space-y-4">

            <div className="flex items-center space-x-2 mb-8">
                <Files />
                <h1 className="text-lg">Plagiarism Reporting Options</h1>
            </div>


            <div className="flex flex-col space-y-2">
                <label htmlFor="identity" className="text-gray-600">User target identity</label>
                <input
                    type="text" name="identity" id="identity" placeholder="user-id.."
                    className="p-2 border rounded-md border-gray-400"
                    value={userTargetId}
                    onChange={(e) => setUserTargetId(e.target.value)}
                />
            </div>

            <div
                className="space-y-4 w-full md:space-y-0 md:space-x-5 md:flex"
            >
                <div
                    onClick={() => setModalKind(ModalKindEnum.userscam)}
                    className="p-4 rounded-md border border-gray-400 space-y-2 cursor-pointer w-full"
                >
                    <div className="flex items-center space-x-2">
                        <FileScan size={20} />
                        <h2>Straight Report</h2>
                    </div>
                    <p className="text-sm text-gray-600">Submit evidence directly</p>
                </div>

                <div
                    onClick={() => setModalKind(ModalKindEnum.userfootprintflow)}
                    className="p-4 rounded-md border border-gray-400 space-y-2 cursor-pointer w-full"
                >
                    <div className="flex items-center space-x-2">
                        <Footprints size={20} />
                        <h2>User Flow Relation</h2>
                    </div>
                    <p className="text-sm text-gray-600">Use AI (graph neural network) to get the user footprints relations</p>
                </div>
            </div>

            <div className="p-4 rounded-md border border-gray-400 space-y-2 cursor-pointer w-full">
                <div className="flex flex-col space-y-1">
                    <label htmlFor="complainer">Complainer</label>
                    <input
                        type="text"
                        name="complainer"
                        id="complainer"
                        placeholder={principal?.toString()}
                        value={principal?.toString()}
                        className="p-2 border rounded-md border-gray-400"
                        disabled
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <label htmlFor="reporttype">Report type</label>
                    <select
                        name="reporttype"
                        id="complainer"
                        className="border border-gray-400 p-2 w-full rounded"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value={"Scam"}>Scam</option>
                        <option value={"Fraud"}>Fraud</option>
                    </select>
                </div>

                <button
                    onClick={() => onSubmitReport()}
                    className="p-2 rounded-md background-dark text-white w-full cursor-pointer"
                >
                    Submit Report
                </button>
            </div>
        </div>
    )
}