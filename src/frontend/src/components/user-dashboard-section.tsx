import React from "react";
import { CreateAssetStep, FormDataCreateAseet, ModalKindEnum } from "../types/ui";
import { CreateAssetAccordion, createDataInitial, DocumentAsset, LocationAsset, OverviewIdentity, RuleAssetHolder, TermsAndCondition, TokenAsset } from "./create-assets-component";
import { ModalContext } from "../context/ModalContext";
import { CustomizableBarChart, CustomizableLineChart } from "./chart/asset-detail-chart";
import { DocumentHashDataType, ReportTypeResult, UserOverviewResult } from "../types/rwa";
import { Loader } from "./loader-component";
import { backendService } from "../services/backendService";
import { Search } from "lucide-react";
import { ReportAimToMeCard } from "./user-dashboard-component";

export function AboutMeSection() {
    const { setModalKind, load } = React.useContext(ModalContext);
    const [fethedData, setFetchedData] = React.useState<UserOverviewResult | null>(null);
    const [loadFetchData, setLoadFetchData] = React.useState(true);

    React.useEffect(() => {
        async function fetch() {
            try {
                const data = await backendService.getMyprofileInfo();
                setFetchedData(data);
            } finally {
                setLoadFetchData(false);
            }
        }

        fetch();
    }, []);

    if (load || loadFetchData) {
        return <Loader />;
    }

    return (
        <div className="px-2 space-y-10">
            <div>
                <div className="space-y-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="font-semibold">Personal Information</h1>
                            <p>{fethedData?.userIdentity.id ?? ''}</p>
                        </div>
                        <button
                            className={`cursor-pointer bg-black p-2 text-[12px] text-white rounded-md ${fethedData ? 'hidden' : ''}`}
                            onClick={() => setModalKind(ModalKindEnum.personalinfo)}
                        >
                            Create
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                        <p>First name</p>
                        <p>{fethedData?.userIdentity.fullName ?? '-'}</p>
                        <p>Last name</p>
                        <p>{fethedData?.userIdentity.lastName ?? '-'}</p>
                        <p>phone</p>
                        <p>{fethedData?.userIdentity.phone ?? '-'}</p>
                        <p>Country</p>
                        <p>{fethedData?.userIdentity.country ?? ''}</p>
                        <p>City</p>
                        <p>{fethedData?.userIdentity.city ?? '-'}</p>
                        <p>Identity code</p>
                        <p>{fethedData?.userIdentity.userIDNumber ?? '-'}</p>

                    </div>
                </div>
            </div>
            <div className="flex items-start justify-between space-x-2 md:space-x-10">
                <div className="w-full p-2 border border-gray-300">
                    <div className="p-2 w-full bg-gray-200 text-center rounded-md border border-gray-300">Transactions</div>
                    <div className="grid grid-cols-2 p-2 gap-2 text-sm">
                        <p>Total</p>
                        <p>{fethedData?.transaction.total}</p>
                        <p>Buy</p>
                        <p>{fethedData?.transaction.buy}</p>
                        <p>Sell</p>
                        <p>{fethedData?.transaction.sell}</p>
                        <p>Transfer</p>
                        <p>{fethedData?.transaction.transfer}</p>
                        <p>Dividend</p>
                        <p>{fethedData?.transaction.dividend}</p>
                    </div>
                </div>
                <div className="w-full p-2 border border-gray-300">
                    <div className="p-2 w-full bg-gray-200 text-center rounded-md border border-gray-300">Owership</div>
                    <div className="grid grid-cols-2 p-2 gap-2 text-sm">
                        <p>Total Ownership</p>
                        <p>{fethedData?.ownership.total}</p>
                        <p>Total Token</p>
                        <p>{fethedData?.ownership.token}</p>
                    </div>
                </div>
                <div className="w-full p-2 border border-gray-300">
                    <div className="p-2 w-full bg-gray-200 text-center rounded-md border border-gray-300">Asset</div>
                    <div className="grid grid-cols-2 p-2 gap-2 text-sm">
                        <p>Total Asset</p>
                        <p>{fethedData?.asset.total}</p>
                        <p>Total Token</p>
                        <p>{fethedData?.asset.token}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


export function AssetListSection() {
    return (
        <div>Hallo This is Asset Lists Section</div>
    );
}

export function ProposalsSection() {
    return (
        <div>Hallo This is Proposals Section</div>
    );
}

export function CreateAssetSection() {
    const [stepProgress, setStepProgress] = React.useState<CreateAssetStep>(CreateAssetStep.overview)
    const { managementAddDocument, managementRuleDetail } = React.useContext(ModalContext);
    const [isLoading, setIsLoading] = React.useState(false);

    const [formData, setFormData] = React.useState<FormDataCreateAseet>(createDataInitial);

    function resetFormData() {
        setFormData(createDataInitial)
        managementAddDocument.reseter();
        managementRuleDetail.reseter();
    }

    function loadingCreateDataHandler(d: boolean) {
        setIsLoading(d)
    }

    React.useEffect(() => {
        if (managementAddDocument?.data) {
            setFormData((prev) => {
                return {
                    ...prev,
                    documentHash: managementAddDocument.data as DocumentHashDataType[],
                };
            });
        }

        if (managementRuleDetail?.data) {
            setFormData((prev) => {
                return {
                    ...prev,
                    rule: {
                        ...prev.rule,
                        details: managementRuleDetail.data as string[]
                    },
                };
            });
        }
    }, [managementAddDocument?.data, managementRuleDetail?.data]);

    if (isLoading) return <Loader />

    return (
        <div className="p-2 space-y-5">
            <CreateAssetAccordion
                title="Asset Overview and Identity"
                isOpen={stepProgress === CreateAssetStep.overview}
                onToggle={() => setStepProgress(CreateAssetStep.overview)}
            >
                <OverviewIdentity formData={formData} setFormData={setFormData} />
            </CreateAssetAccordion>

            <CreateAssetAccordion
                title="Asset Token"
                isOpen={stepProgress === CreateAssetStep.token}
                onToggle={() => setStepProgress(CreateAssetStep.token)}
            >
                <TokenAsset formData={formData} setFormData={setFormData} />
            </CreateAssetAccordion>

            <CreateAssetAccordion
                title="Asset Documents"
                isOpen={stepProgress === CreateAssetStep.document}
                onToggle={() => setStepProgress(CreateAssetStep.document)}
            >
                <DocumentAsset />
            </CreateAssetAccordion>

            <CreateAssetAccordion
                title="Asset Location"
                isOpen={stepProgress === CreateAssetStep.location}
                onToggle={() => setStepProgress(CreateAssetStep.location)}
            >
                <LocationAsset formData={formData} setFormData={setFormData} />
            </CreateAssetAccordion>

            <CreateAssetAccordion
                title="Asset Rules"
                isOpen={stepProgress === CreateAssetStep.rule}
                onToggle={() => setStepProgress(CreateAssetStep.rule)}
            >
                <RuleAssetHolder formData={formData} setFormData={setFormData} />
            </CreateAssetAccordion>

            <CreateAssetAccordion
                title="Terms and Condition"
                isOpen={stepProgress === CreateAssetStep.tag}
                onToggle={() => setStepProgress(CreateAssetStep.tag)}
            >
                <TermsAndCondition
                    formData={formData}
                    resetter={resetFormData}
                    loadingHandler={loadingCreateDataHandler}
                />
            </CreateAssetAccordion>
        </div>
    );
}


export function DividendSection() {

    const data2 = [
        { date: 'date-1', usd: 2400 },
        { date: 'date-2', usd: 4200 },
        { date: 'date-3', usd: 2012 },
        { date: 'date-4', usd: 1023 },
        { date: 'date-5', usd: -201 },
        { date: 'date-6', usd: 2012 },
        { date: 'date-7', usd: 1023 },
    ];

    const aiSummary = `
    The dividend transactions over the last 7 periods show a generally stable trend 
    with notable peaks on date-2 (USD 4200) and dips on date-5 (USD -201). 
    Overall performance remains positive with consistent payouts.`;

    return (
        <div className="w-full flex items-center justify-center flex-col">
            <h1 className="text-xl pb-10">Dividend Transaction</h1>
            <div className="w-full md:h-[25vw] h-[50vw]">
                <CustomizableLineChart data={data2} />
            </div>
            <div className="w-full p-5">
                <h2 className="font-normal">Summary</h2>
                <p className="text-gray-700 whitespace-pre-line">{aiSummary}</p>

            </div>
        </div>
    );
}

export function TransactionSection() {
    const data2 = [
        { date: 'date-1', usd: 2400 },
        { date: 'date-2', usd: 4200 },
        { date: 'date-3', usd: 2012 },
        { date: 'date-4', usd: 1023 },
        { date: 'date-6', usd: 2012 },
        { date: 'date-7', usd: 1023 },
    ];

    const aiSummary = `
    The dividend transactions over the last 7 periods show a generally stable trend 
    with notable peaks on date-2 (USD 4200) and dips on date-5 (USD -201). 
    Overall performance remains positive with consistent payouts.`;

    return (
        <div className="w-full flex items-center justify-center flex-col">
            <h1 className="text-xl pb-10">my Transaction</h1>
            <div className="w-full md:h-[25vw] h-[50vw]">
                <CustomizableBarChart data={data2} />
            </div>
            <div className="w-full p-5">
                <h2 className="font-normal">Summary</h2>
                <p className="text-gray-700 whitespace-pre-line">{aiSummary}</p>

            </div>
        </div>
    );
}

export function ReportingSection() {
    const [search, setSearch] = React.useState("")
    const [isLoad, setIsLoad] = React.useState(true);
    const [data, setData] = React.useState<ReportTypeResult | null>(null);

    React.useEffect(() => {
        async function fetchData() {
            const res = await backendService.getReportToMe();
            setData(res);
            setIsLoad(false)
        }
        fetchData()
    }, [])

    if (isLoad) return <Loader />

    return (
        <div className="w-full flex items-center justify-center flex-col">
            <div className="w-full p-5">
                <div className="flex justify-between items-center">
                    <h1 className="font-semibold">Report aim to me</h1>
                    <div className="flex space-x-1 items-center border border-gray-300 rounded-md">
                        <input
                            type="text" name="search" id="search"
                            className="p-2 text-sm"
                            placeholder="find report title here ..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="p-3 cursor-pointer bg-gray-200 rounded-r-md">
                            <Search size={15} />
                        </button>
                    </div>
                </div>
                <div className="my-4 space-y-3">
                    {!data || data.asset.length + data.personal.length == 0 && <div>Belom ada data</div>}
                    {data?.asset.map((d, idx) => (
                        <ReportAimToMeCard
                            key={idx}
                            id={d.id}
                            content={d.content}
                            description={d.description}
                            reputation={d.reputation}
                            created={d.created}
                            footprint={d.evidence[0]?.footPrintFlow}
                            hashClarity={d.evidence[0]?.hashclarity}
                        />
                    ))}
                    {data?.personal.map((d, idx) => (
                        <ReportAimToMeCard
                            key={idx}
                            id={d.id}
                            content={d.content}
                            description={d.description}
                            reputation={d.reputation}
                            created={d.created}
                            footprint={d.evidence[0]?.footPrintFlow}
                            hashClarity={d.evidence[0]?.hashclarity}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}