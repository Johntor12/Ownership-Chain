import { Bot, Check, ChevronDown, ChevronUp, CircleEllipsis, X, FileText, Fingerprint, Flag, MapPin, ShoppingCart } from "lucide-react";
import React from "react";
import { ModalKindEnum, SpecificAssetOverview } from "../types/ui";
import { CustomizableBarChart, CustomizableLineChart } from "./chart/asset-detail-chart";
import { AccessInfoMaps } from "./map/asset-detals-map";
import { getAssetStatusText } from "../utils/union-handler";
import { Asset as AssetData, Rule, LocationType } from "../../../declarations/backend/backend.did";
import { ModalContext } from "../context/ModalContext";

export function AssetMainContent({ data }: { data: AssetData }) {

    const { setModalKind } = React.useContext(ModalContext);

    return (
        <div className="flex flex-col space-y-5 md:flex-row md:space-y-0 md:space-x-10">
            <div className="aspect-[4/3] w-full bg-gray-400 flex justify-center items-center rounded-md">Logo Asset</div>
            <div className="border border-gray-300 w-full aspect-[3/2] p-5 rounded-md space-y-4">
                <h1 className="font-bold capitalize text-[rgb(0,51,102)] text-2xl">{data.name}</h1>
                <div
                    onClick={() => navigator.clipboard.writeText(data.id)}
                    className="text-lg text-gray-700 cursor-pointer"
                >
                    {data.id}
                </div>
                <div className="flex space-x-4 items-center">
                    <p className="p-2 bg-blue-950 text-white rounded-sm text-xl">{getAssetStatusText(data.assetStatus)}</p>
                    <p>
                        <span className="font-semibold">{data.pricePerToken}</span>
                        <span> USD/token</span>
                    </p>
                </div>
                <div className="flex items-center justify-between space-x-5">
                    <div className="w-full bg-gray-100 aspect-[2/1] flex flex-col justify-center items-center rounded-md">
                        <p>Total Token</p>
                        <p className="font-bold">{data.totalToken}</p>
                    </div>
                    <div className="w-full bg-gray-100 aspect-[2/1] flex flex-col justify-center items-center rounded-md">
                        <p>Left Token</p>
                        <p className="font-bold">{data.tokenLeft}</p>
                    </div>
                    <div className="w-full bg-gray-100 aspect-[2/1] flex flex-col justify-center items-center rounded-md">
                        <p>Provided Totken</p>
                        <p className="font-bold">{data.providedToken}</p>
                    </div>
                </div>
                <div className="flex flex-col w-full space-y-2">
                    <div
                        onClick={() => {
                            setModalKind(ModalKindEnum.proposebuytoken)
                        }}
                        className="p-4 rounded-lg cursor-pointer bg-[rgb(17,24,39)] text-white flex capitalize space-x-2 justify-center"
                    >
                        <ShoppingCart color="white" />
                        <span>proposed to buy</span>
                    </div>
                    <div className="p-4 rounded-lg cursor-pointer text-gray-600 border border-gray-300 flex capitalize space-x-2 justify-center">
                        <Bot />
                        <span>AI examiner</span>
                    </div>
                    <div className="p-4 rounded-lg cursor-pointer text-gray-600 border border-gray-300 flex capitalize space-x-2 justify-center">
                        <Flag />
                        <span>report asset</span>
                    </div>
                </div>
            </div>
        </div >
    )
}

function DocumentOverview({ name, hash, description }: { name: string, hash: string, description: string }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-gray-100">
                <div className="flex items-center space-x-2">
                    <FileText />
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="font-medium cursor-pointer font-mono"
                    >
                        {name}
                    </button>
                </div>
                <button
                    className="cursor-pointer p-1"
                    aria-label="Toggle details"
                    onClick={() => navigator.clipboard.writeText(hash)}
                >
                    <Fingerprint />
                </button>
            </div>

            {isOpen && (
                <div className="p-3 text-sm text-gray-600 bg-white border-t border-gray-200">
                    {description}
                </div>
            )}
        </div>
    );
}

function RuleLegalitiesOverview({ rule }: { rule: Rule }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="p-5 border border-gray-300 rounded-md space-y-5">
            <h1 className="text-2xl font-normal">Rules & Legalities</h1>

            <div className="space-y-1">
                {/* Sell Sharing */}
                <div className="text-gray-600 w-full flex space-x-4 items-start md:items-center">
                    {rule.sellSharing ? (
                        <div className="flex p-2 bg-green-400 rounded-full">
                            <Check size={12} />
                        </div>
                    ) : (
                        <div className="flex p-2 bg-red-400 rounded-full">
                            <X size={12} />
                        </div>
                    )}
                    <p>
                        This asset ownership holder as represented in token{" "}
                        {rule.sellSharing ? "can" : "cannot"} be reselling.
                    </p>
                </div>

                {/* Need Down Payment */}
                <div className="text-gray-600 w-full flex space-x-4 items-start md:items-center">
                    {rule.needDownPayment ? (
                        <div className="flex p-2 bg-green-400 rounded-full">
                            <Check size={12} />
                        </div>
                    ) : (
                        <div className="flex p-2 bg-red-400 rounded-full">
                            <X size={12} />
                        </div>
                    )}
                    <p>
                        If you want to buy this asset you need a down payment of{" "}
                        {rule.minDownPaymentPercentage * 100}% of your total purchased price.
                    </p>
                </div>

                {/* Down Payment Cashback */}
                <div className="text-gray-600 w-full flex space-x-4 items-start md:items-center">
                    {rule.downPaymentCashback > 0 ? (
                        <div className="flex p-2 bg-green-400 rounded-full">
                            <Check size={12} />
                        </div>
                    ) : (
                        <div className="flex p-2 bg-red-400 rounded-full">
                            <X size={12} />
                        </div>
                    )}
                    <p>
                        If payment or proposal is cancelled, the down payment cashback will
                        be {rule.downPaymentCashback * 100}% of your down payment.
                    </p>
                </div>

                {/* Ownership Maturity Time */}
                <div className="text-gray-600 w-full flex space-x-4 items-start md:items-center">
                    {rule.ownerShipMaturityTime !== 0n ? (
                        <div className="flex p-2 bg-green-400 rounded-full">
                            <Check size={12} />
                        </div>
                    ) : (
                        <div className="flex p-2 bg-red-400 rounded-full">
                            <X size={12} />
                        </div>
                    )}
                    <p>
                        This asset has an ownership maturity time. After{" "}
                        {rule.ownerShipMaturityTime} days of ownership you need to redeem
                        your ownership or you will lose it.
                    </p>
                </div>

                {/* Sell Sharing Need Vote */}
                <div className="text-gray-600 w-full flex space-x-4 items-start md:items-center">
                    {rule.sellSharingNeedVote ? (
                        <div className="flex p-2 bg-green-400 rounded-full">
                            <Check size={12} />
                        </div>
                    ) : (
                        <div className="flex p-2 bg-red-400 rounded-full">
                            <X size={12} />
                        </div>
                    )}
                    <p>
                        Selling shares requires voting approval by token holders.
                    </p>
                </div>
            </div>

            {/* Details */}
            <div className="border-t border-gray-200 pt-3">
                <button
                    className="flex justify-between items-center w-full py-2 text-left text-gray-800 font-medium"
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <span>Details Information</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isOpen && (
                    <div className="text-gray-600 space-y-2 mt-2">
                        {rule.details.map((det, idx) => (
                            <div className="flex w-full space-x-2" key={idx}>
                                <CircleEllipsis />
                                <p>{det}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


function LastFiveDividenOverview() {
    return (
        <div className="p-5 border border-gray-300 rounded-md space-y-5">
            <h1 className="text-2xl font-normal">Last 5 Dividends</h1>
            <div className="space-y-2">
                {/* heaader */}
                <div className="text-gray-600 border-b border-gray-300 grid grid-cols-3">
                    <p>Date</p>
                    <p>Amount</p>
                    <p>Details</p>
                </div>
                {/* content */}
                <div className="text-gray-600 grid grid-cols-3">
                    <p>Date</p>
                    <p>Amount</p>
                    <p>Details</p>
                </div>
                <div className="text-gray-600 grid grid-cols-3">
                    <p>Date</p>
                    <p>Amount</p>
                    <p>Details</p>
                </div>
                <div className="text-gray-600 grid grid-cols-3">
                    <p>Date</p>
                    <p>Amount</p>
                    <p>Details</p>
                </div>
                <div className="text-gray-600 grid grid-cols-3">
                    <p>Date</p>
                    <p>Amount</p>
                    <p>Details</p>
                </div>
                <div className="text-gray-600 grid grid-cols-3">
                    <p>Date</p>
                    <p>Amount</p>
                    <p>Details</p>
                </div>
            </div>
        </div>
    );
}

function OverviewCard({ data }: { data: AssetData | null }) {
    if (!data) return null;

    return (
        <div className="space-y-8">
            {/* description */}
            <div className="p-5 border border-gray-300 rounded-md space-y-5">
                <h1 className="text-2xl font-normal">Description</h1>
                <p className="text-gray-600">
                    {data.description}
                </p>
            </div>

            {/* rules */}
            <RuleLegalitiesOverview rule={data.rule} />

            {/* document hash and legalities */}
            <div className="p-5 border border-gray-300 rounded-md space-y-5">
                <h1 className="text-2xl font-normal">Document Legalities</h1>
                <div className="space-y-2">
                    {data.documentHash.map((doc, idx) =>
                        <DocumentOverview key={idx} name={doc.name} description={doc.description} hash={doc.hash} />
                    )}
                </div>
            </div>

            {/* last 5 dividen */}
            <LastFiveDividenOverview />
        </div>
    );
}

function TokenBox({ percent, label }: { percent: number; label: string }) {
    return (
        <div className="md:w-1/8 w-1/5 aspect-square flex flex-col justify-end items-center border border-gray-300 rounded-md text-center relative overflow-hidden">
            {/* Background fill sesuai persentase */}
            <div
                className="absolute bottom-0 left-0 w-full bg-gray-300"
                style={{ height: `${percent}%` }}
            />
            {/* Konten di atas background */}
            <div className="relative z-10 p-2 flex flex-col items-center">
                <p>{percent}%</p>
                <p className="text-sm">{label}</p>
            </div>
        </div>
    );
}

function TokenCard() {

    // data example
    const data1 = [
        { name: 'person-4000', token: 2400 },
        { name: 'person-3000', token: 13098 },
        { name: 'person-2000', token: 9800 },
        { name: 'person-2780', token: 3908 }
    ];

    const data2 = [
        { date: 'date-4000', tf: 4200, buy: 2040 },
        { date: 'date-3000', tf: 3198, buy: 1938 },
        { date: 'date-2000', tf: 8900, buy: 9080 },
        { date: 'date-2300', tf: 8900, buy: 9080 },
        { date: 'date-2400', tf: 8900, buy: 9080 },
        { date: 'date-2500', tf: 8900, buy: 9080 },
        { date: 'date-2780', tf: 9308, buy: 3098 },
        { date: 'date-2710', tf: 9308, buy: 3098 },
        { date: 'date-2010', tf: 9308, buy: 3098 },
        { date: 'date-2011', tf: 9308, buy: 3098 },
    ];
    return (
        <div className="space-y-8">
            <div className="p-5 border border-gray-300 rounded-md space-y-5">
                <div className="flex justify-around w-full">
                    <TokenBox percent={100} label="Total Token" />
                    <TokenBox percent={10} label="Provided Token" />
                    <TokenBox percent={10} label="Token Left" />
                    <TokenBox percent={10} label="Pending Token" />
                </div>
            </div>

            <div className="p-5 border border-gray-300 rounded-md space-y-5 pb-32">
                <div className="w-ful md:h-[20vw] h-[40vw]">
                    <h1 className="md:text-2xl text-xl font-normal my-5">Ownership Holder Percentage</h1>
                    <CustomizableBarChart data={data1} barSize={50} />
                </div>
            </div>

            <div className="p-5 border border-gray-300 rounded-md space-y-5 pb-32">
                <div className="w-ful md:h-[20vw] h-[40vw]">
                    <h1 className="md:text-2xl text-xl font-normal my-5">Transaction Pricing History</h1>
                    <CustomizableBarChart data={data2} />
                </div>
            </div>
        </div>
    );
}

function DividendCard() {
    const data1 = [
        { date: 'date-1', token: 2400 },
        { date: 'date-2', token: 13098 },
        { date: 'date-3', token: 9800 },
        { date: 'date-4', token: 3908 },
    ];

    const data2 = [
        { user: 'user-1', token: 2400 },
        { user: 'user-2', token: 4200 },
        { user: 'user-3', token: 2012 },
        { user: 'user-4', token: 1023 },
        { user: 'user-5', token: 2012 },
        { user: 'user-6', token: 1023 },
    ];

    return (
        <div className="space-y-8">
            <div className="p-5 border border-gray-300 rounded-md space-y-5">
                <h1 className="md:text-2xl text-xl font-normal my-5">Asset Dividend</h1>
                <CustomizableLineChart data={data1} />
            </div>
            <div className="p-5 border border-gray-300 rounded-md space-y-5">
                <h1 className="md:text-2xl text-xl font-normal my-5">Recent Dividend by Holder</h1>
                <CustomizableBarChart data={data2} barSize={50} />
            </div>
        </div>
    );
}

export function AccessInfo({ lat, long, details }: LocationType) {
    console.log(lat, long)
    return (
        <div className="space-y-8">
            <div className="p-5 border border-gray-300 rounded-md space-y-5">
                <h1 className="md:text-2xl text-xl font-semibold mb-3">
                    Location and Other Details
                </h1>

                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-6 h-6 text-red-500 mt-1" />
                        <p className="text-gray-700 leading-relaxed">
                            This asset is located at coordinates{" "}
                            <strong>{lat.toFixed(4)}, {long.toFixed(4)}</strong>.
                        </p>
                    </div>

                    {details.length > 0 && (
                        <div className="space-y-2">
                            {details.map((item, idx) => (
                                <p className="text-gray-600" key={idx}>
                                    {item}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                <AccessInfoMaps lat={lat} long={long} />
            </div>
        </div>
    );
}

export function AssetSecondaryContent({ mainData }: { mainData: AssetData }) {
    const [selectedOption, setSeletedOption] = React.useState<SpecificAssetOverview>(SpecificAssetOverview.Overview);

    return (
        <div className="space-y-8">
            <div className="p-2 border-b border-gray-300 flex flex-wrap gap-5">
                {Object.values(SpecificAssetOverview).map((data, idx) =>
                    <div
                        onClick={() => setSeletedOption(data)}
                        key={idx}
                        className={`${selectedOption === data ? 'font-semibold' : ''} cursor-pointer`}
                    >
                        {data}
                    </div>
                )}
            </div>
            {selectedOption === SpecificAssetOverview.Overview &&
                <OverviewCard data={mainData} />
            }
            {selectedOption === SpecificAssetOverview.Token &&
                <TokenCard />
            }
            {selectedOption === SpecificAssetOverview.Dividend &&
                <DividendCard />
            }
            {selectedOption === SpecificAssetOverview.AccessInfo &&
                <AccessInfo
                    details={mainData.locationInfo.details}
                    lat={mainData.locationInfo.lat}
                    long={mainData.locationInfo.long}
                />
            }
        </div>
    )
}