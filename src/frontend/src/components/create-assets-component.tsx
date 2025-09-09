import { ChevronDown, ChevronRight, Dot, FileLock2, Hash, Plus, X } from "lucide-react";
import { AccordionProps, FormDataCreateAseet, ModalKindEnum } from "../types/ui";
import { AccessInfoMaps } from "./map/asset-detals-map";
import React from "react";
import { ModalContext } from "../context/ModalContext";
import { backendService } from "../services/backendService";
import { DocumentHash, LocationType, Rule } from "../../../declarations/backend/backend.did";
import { mapFormDataToCreateAsset, mapRule } from "../utils/union-handler";
import { PopUpContext } from "../context/PopUpContext";

export function CreateAssetAccordion({ title, isOpen, onToggle, children }: AccordionProps) {
    return (
        <div className="p-5 bg-white rounded-lg shadow-sm">
            <div
                onClick={onToggle}
                className="cursor-pointer flex w-full items-center justify-between"
            >
                <p className="font-medium">{title}</p>
                <span className="transition-transform duration-200">
                    {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                </span>
            </div>
            {isOpen && <div className="transition-all duration-200 mt-3">{children}</div>}
        </div>
    );
}

export const createDataInitial: FormDataCreateAseet = {
    name: "",
    description: "",
    assetType: "Property",
    assetStatus: "Active",

    totalToken: 0,
    providedToken: 0,
    minTokenPurchased: 0,
    maxTokenPurchased: 0,
    pricePerToken: 0,

    locationInfo: { lat: 0, long: 0, details: [] },
    documentHash: [],

    rule: {
        sellSharing: false,
        sellSharingNeedVote: false,
        sellSharingPrice: 0,
        needDownPayment: false,
        minDownPaymentPercentage: 0,
        downPaymentCashback: 0,
        downPaymentMaturityTime: 0,
        paymentMaturityTime: 0,
        ownerShipMaturityTime: 0,
        details: [""],
    },

    agreement: false,
}

export function OverviewIdentity({ formData, setFormData }: { formData: any; setFormData: React.Dispatch<React.SetStateAction<any>> }) {
    return (
        <div className="space-y-4">
            {/* name */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Asset Name</p>
                </div>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    placeholder="put your asset name here"
                    onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, name: e.target.value }))
                    }
                    className="p-2 border border-gray-400 rounded-md w-full"
                />
            </div>
            {/* name */}

            {/* description */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Asset Description</p>
                </div>
                <textarea
                    name="description"
                    id="description"
                    placeholder="put your asset description here"
                    value={formData.description}
                    onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, description: e.target.value }))
                    }
                    className="p-2 border border-gray-400 rounded-md w-full resize-none"
                    rows={5}

                />
            </div>
            {/* description */}

            {/* type */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Asset Types</p>
                </div>
                <select
                    onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, assetType: e.target.value }))
                    }
                    value={formData.assetType}
                    className="border border-gray-400 p-2 w-full rounded"
                >
                    <option value={"Property"}>Property</option>
                    <option value={"Business"}>Business</option>
                    <option value={"Artwork"}>Artwork</option>
                    <option value={"Vehicle"}>Vehicle</option>
                    <option value={"Equipment"}>Equipment</option>
                    <option value={"Other"}>Other</option>
                </select>
            </div>
            {/* type */}

            {/* status */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Asset Status</p>
                </div>
                <select
                    onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, assetStatus: e.target.value }))
                    }
                    value={formData.assetStatus}
                    className="border border-gray-400 p-2 w-full rounded"
                >
                    <option value={"Active"}>Active</option>
                    <option value={"Inactive"}>Inactive</option>
                    <option value={"Pending"}>Pending</option>
                    <option value={"Open"}>Open</option>
                </select>
            </div>
            {/* status */}
        </div>
    );
}

export function TokenAsset({ formData, setFormData }: { formData: any; setFormData: React.Dispatch<React.SetStateAction<any>> }) {
    return (
        <div className="space-y-4">
            {/* total token */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Total Token</p>
                </div>
                <input
                    type="text"
                    value={formData.totalToken}
                    onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, totalToken: e.target.value }))
                    }
                    name="totaltoken"
                    id="totaltoken"
                    placeholder="set your total token here"
                    className="p-2 border border-gray-400 rounded-md w-full"
                />
            </div>
            {/* total token */}

            {/* provided token */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Provided Token</p>
                </div>
                <input
                    type="text"
                    name="providedtoken"
                    value={formData.providedToken}
                    onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, providedToken: e.target.value }))
                    }
                    id="providedtoken"
                    placeholder="set your token provided here"
                    className="p-2 border border-gray-400 rounded-md w-full"
                />
            </div>
            {/* provided token */}

            {/* minimal token */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Minimal Token</p>
                </div>
                <input
                    type="text"
                    name="mintoken"
                    value={formData.minTokenPurchased}
                    onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, minTokenPurchased: e.target.value }))
                    }
                    id="mintoken"
                    placeholder="set your minimal token purchased here"
                    className="p-2 border border-gray-400 rounded-md w-full"
                />
            </div>
            {/* minimal token */}

            {/* maximal token */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Maximal Token</p>
                </div>
                <input
                    type="text"
                    name="maxtoken"
                    value={formData.maxTokenPurchased}
                    onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, maxTokenPurchased: e.target.value }))
                    }
                    id="maxtoken"
                    placeholder="set your maximal token purchased here"
                    className="p-2 border border-gray-400 rounded-md w-full"
                />
            </div>
            {/* maximal token */}

            {/* price per token */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Price per Token</p>
                </div>
                <input
                    type="text"
                    name="tokenprice"
                    value={formData.pricePerToken}
                    onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, pricePerToken: e.target.value }))
                    }
                    id="tokenprice"
                    placeholder="set your token price here"
                    className="p-2 border border-gray-400 rounded-md w-full"
                />
            </div>
            {/* price per token */}

        </div>
    );
}

function ComponentDocs({ name, onremove }: { name: string, onremove: (d: string) => void }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <FileLock2 size={18} />
                <div className="font-mono text-sm">
                    {name}
                </div>
            </div>
            <button
                onClick={() => onremove(name)}
                className="p-1 bg-red-200 rounded-full flex items-center justify-center cursor-pointer"
            >
                <X color="red" size={15} />
            </button>
        </div>
    );
}

export function DocumentAsset() {
    const { setModalKind, managementAddDocument } = React.useContext(ModalContext);
    const documentsData = managementAddDocument.data || [];

    return (
        <div className="space-y-4">
            {documentsData.length === 0 && (
                <p className="text-[12px]">You need to add at least one document</p>
            )}

            {documentsData.length > 0 && (
                <div className="space-y-2">
                    {documentsData.map((data, idx) => (
                        <ComponentDocs
                            key={idx}
                            name={data.name}
                            onremove={managementAddDocument.remover}
                        />
                    ))}
                </div>
            )}

            <button
                onClick={() => setModalKind(ModalKindEnum.adddocument)}
                className="bg-black p-2 rounded-md text-white uppercase text-[10px] cursor-pointer"
            >
                add documents
            </button>
        </div>
    );
}

function LocationDetailsComp({ content, onDelete }: { content: string; onDelete: () => void }) {
    return (
        <div className="flex w-full items-center justify-between space-y-2">
            <div className="flex space-x-1 items-center">
                <Hash size={12} />
                <p>{content}</p>
            </div>
            <button
                type="button"
                onClick={onDelete}
                className="p-1 bg-red-200 rounded-full flex items-center justify-center cursor-pointer"
            >
                <X color="red" size={15} />
            </button>
        </div>
    );
}


export function LocationAsset({
    formData,
    setFormData,
}: {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}) {
    const [detailInput, setDetailInput] = React.useState<string>("");

    const updateLocation = (key: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            locationInfo: {
                ...prev.locationInfo,
                [key]: value,
            },
        }));
    };

    const addDetail = () => {
        if (!detailInput.trim()) return; // jangan tambah kalau kosong
        updateLocation("details", [...(formData.locationInfo.details || []), detailInput.trim()]);
        setDetailInput(""); // reset textarea
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                {/* Latitude */}
                <input
                    type="text"
                    name="lat"
                    id="lat"
                    value={formData.locationInfo.lat}
                    onChange={(e) => updateLocation("lat", e.target.value)}
                    placeholder="latitude"
                    className="p-2 border border-gray-400 rounded-md w-full"
                />

                {/* Longitude */}
                <input
                    type="text"
                    name="long"
                    id="long"
                    value={formData.locationInfo.long}
                    onChange={(e) => updateLocation("long", e.target.value)}
                    placeholder="longitude"
                    className="p-2 border border-gray-400 rounded-md w-full"
                />
            </div>

            <AccessInfoMaps lat={formData.locationInfo.lat} long={formData.locationInfo.long} />

            {/* Location details */}
            <div className="space-y-2">
                <div>
                    {formData.locationInfo.details.map((data: string, idx: number) => (
                        <LocationDetailsComp
                            key={idx}
                            content={data}
                            onDelete={() =>
                                updateLocation(
                                    "details",
                                    formData.locationInfo.details.filter((_: string, i: number) => i !== idx)
                                )
                            }
                        />
                    ))}
                </div>
                <textarea
                    name="locationdetails"
                    id="locationdetails"
                    placeholder="put your location details here"
                    className="p-2 border border-gray-400 rounded-md w-full resize-none"
                    rows={4}
                    value={detailInput}
                    onChange={(e) => setDetailInput(e.target.value)}
                />
                <button
                    type="button"
                    onClick={addDetail}
                    className="background-dark rounded-md p-2 text-white text-sm"
                >
                    Add Details
                </button>
            </div>
        </div>
    );
}



function SimpleToggle(
    { val, setVal }:
        { val: boolean, setVal: (v: boolean) => void }
) {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={val}
                onChange={(e) => setVal(e.target.checked)}
                className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
        </label>
    );
}


function RuleDetailsComponent({ content }: { content: string }) {
    const { managementRuleDetail } = React.useContext(ModalContext);
    return (
        <div className="w-full flex justify-between">
            <div className="flex items-center space-x-1">
                <Dot size={24} />
                <p>{content}</p>
            </div>
            <button
                className="p-1 bg-red-200 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => managementRuleDetail.remover(content)}
            >
                <X color="red" size={15} />
            </button>
        </div>
    )
}

export function RuleAssetHolder({
    formData,
    setFormData,
}: {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}) {
    const { setModalKind, managementRuleDetail } = React.useContext(ModalContext);

    const ruleDetails = managementRuleDetail.data || [];

    // helper untuk update nested state rule
    const updateRule = (key: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            rule: {
                ...prev.rule,
                [key]: value,
            },
        }));
    };

    return (
        <div className="space-y-4">
            {/* Sell Sharing toggle */}
            <div className="border-b px-2 py-3 border-gray-300 flex items-center justify-between">
                <p>Allowed Asset holder to sell their token</p>
                <SimpleToggle
                    val={formData.rule.sellSharing}
                    setVal={(v) => updateRule("sellSharing", v)}
                />
            </div>

            {/* Sell Sharing details */}
            {formData.rule.sellSharing && (
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${formData.rule.sellSharing
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="px-2 space-y-3">
                        <input
                            type="text"
                            name="sellprice"
                            id="sellprice"
                            value={formData.rule.sellSharingPrice}
                            onChange={(e) =>
                                updateRule("sellSharingPrice", Number(e.target.value))
                            }
                            placeholder="Sell Sharing Price"
                            className="p-2 border border-gray-200 rounded-lg w-full"
                        />
                        <div>
                            <div className="flex justify-between items-center pr-2">
                                <p>Token Holder need vote first to sell their sharing</p>
                            </div>
                            <select
                                value={formData.rule.sellSharingNeedVote ? "Yes" : "No"}
                                onChange={(e) =>
                                    updateRule("sellSharingNeedVote", e.target.value === "Yes")
                                }
                                className="border border-gray-400 p-2 w-full rounded"
                            >
                                <option>No</option>
                                <option>Yes</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Down Payment toggle */}
            <div className="border-b px-2 py-3 border-gray-300 flex items-center justify-between">
                <p>To Buy This Asset Token the buyer need to proceed Down Payment First</p>
                <SimpleToggle
                    val={formData.rule.needDownPayment}
                    setVal={(v) => updateRule("needDownPayment", v)}
                />
            </div>

            {/* Down Payment details */}
            {formData.rule.needDownPayment && (
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${formData.rule.needDownPayment
                        ? "max-h-48 opacity-100"
                        : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="px-2 space-y-3">
                        <input
                            type="text"
                            value={formData.rule.minDownPaymentPercentage}
                            onChange={(e) =>
                                updateRule("minDownPaymentPercentage", Number(e.target.value))
                            }
                            placeholder="Minimal Down Payment Percentage Price (%)"
                            className="p-2 w-full border border-gray-200 rounded-lg"
                        />
                        <input
                            type="text"
                            value={formData.rule.downPaymentCashback}
                            onChange={(e) =>
                                updateRule("downPaymentCashback", Number(e.target.value))
                            }
                            placeholder="Down Payment Cashback Percentage (%)"
                            className="p-2 w-full border border-gray-200 rounded-lg"
                        />
                        <input
                            type="text"
                            value={formData.rule.downPaymentMaturityTime}
                            onChange={(e) =>
                                updateRule("downPaymentMaturityTime", Number(e.target.value))
                            }
                            placeholder="Down Payment Maturity Time or Deadline (day)"
                            className="p-2 w-full border border-gray-200 rounded-lg"
                        />
                    </div>
                </div>
            )}

            {/* Full Payment Maturity */}
            <div className="border-b px-2 py-3 border-gray-300">
                <label htmlFor="fpmaturity">
                    After Approval Proposal Succeded, buyer must finished remaining payment until
                </label>
                <input
                    type="text"
                    value={formData.rule.paymentMaturityTime}
                    onChange={(e) =>
                        updateRule("paymentMaturityTime", Number(e.target.value))
                    }
                    placeholder="... (days)"
                    className="p-2 w-full border border-gray-200 rounded-lg"
                />
            </div>

            {/* Ownership Maturity */}
            <div className="border-b px-2 py-3 border-gray-300">
                <label htmlFor="ownershipmaturity">
                    Every Token Holder will have their own token in this asset until
                </label>
                <input
                    type="text"
                    value={formData.rule.ownerShipMaturityTime}
                    onChange={(e) =>
                        updateRule("ownerShipMaturityTime", Number(e.target.value))
                    }
                    placeholder="... (days)"
                    className="p-2 w-full border border-gray-200 rounded-lg"
                />
            </div>

            {/* Extra rule details */}
            <div>
                <div className="border-b px-2 py-3 border-gray-300 flex items-center justify-between">
                    <p>Add Another Details here</p>
                    <button
                        className="p-1 rounded-full background-dark cursor-pointer"
                        onClick={() => setModalKind(ModalKindEnum.addruledetails)}
                    >
                        <Plus size={12} color="white" />
                    </button>
                </div>
                <div className="px-1 my-3 text-sm space-y-1">
                    {ruleDetails.map((d, idx) => (
                        <RuleDetailsComponent content={d} key={idx} />
                    ))}
                    {ruleDetails.length === 0 && <p>You need to add at least one detail here</p>}
                </div>
            </div>
        </div>
    );
}


export function TermsAndCondition(
    { formData, resetter, loadingHandler }:
        { formData: FormDataCreateAseet, resetter: () => void, loadingHandler: (d: boolean) => void }
) {

    const { setPopUpData } = React.useContext(PopUpContext);

    async function submitCreateAsset(d: FormDataCreateAseet) {
        loadingHandler(true)
        try {
            const mapped = mapFormDataToCreateAsset(d);
            const mappedRule = mapRule(d.rule);

            const location: LocationType = {
                ...d.locationInfo,
                lat: parseFloat(String(d.locationInfo.lat)),
                long: parseFloat(String(d.locationInfo.long)),
            };

            const res = await backendService.createAsset(
                mapped.name,
                mapped.description,
                mapped.totalToken,
                mapped.providedToken,
                mapped.minTokenPurchased,
                mapped.maxTokenPurchased,
                mapped.pricePerToken,
                location,
                d.documentHash as Array<DocumentHash>,
                mapped.assetType,
                mapped.assetStatus,
                mappedRule as Rule
            );

            setPopUpData({
                title: "Success create new assset!",
                description: `asset was created as ${res}`,
                position: "bottom-right",
            })

            resetter();

            loadingHandler(false)

        } catch (error) {
            console.error("Error creating asset:", error);
            setPopUpData({
                title: "Error creating asset!",
                description: `no asset was created becasue of error happened ${error}`,
                position: "bottom-right",
            })
            loadingHandler(false)
        }
    }


    return (
        <div className="space-y-6 text-sm leading-relaxed">
            <div className="space-y-2 border-b border-gray-300 pb-4">
                <h1 className="font-bold text-base">By submitting this document and asset, I consciously declare that:</h1>
                <ul className="list-decimal list-inside space-y-1">
                    <li>
                        If at any point it is proven that my asset constitutes plagiarism, fraud,
                        manipulation, or any form of scam, all ownership rights to the asset may be revoked
                        without compensation, and I agree to accept any administrative sanctions or penalties as required.
                    </li>
                    <li>
                        I am fully responsible for completing all administrative obligations,
                        including dividend distribution, profit sharing, and business closure in the event of
                        bankruptcy or liquidation.
                    </li>
                    <li>
                        I take full responsibility for the control and management of the asset,
                        and I am required to comply with all regulations and provisions that I have
                        established in the <span className="font-semibold">Asset Rules</span> section.
                    </li>
                </ul>
            </div>

            <div className="space-y-2 border-b border-gray-300 pb-4">
                <h1 className="font-bold text-base">I hereby truthfully declare that:</h1>
                <ul className="list-decimal list-inside space-y-1">
                    <li>All documents I upload are accurate, valid, and their authenticity can be accounted for.</li>
                    <li>I have set the location, type, and total token amount with full awareness and responsibility.</li>
                    <li>I understand that any mistakes in data entry or negligence are entirely my own responsibility.</li>
                </ul>
            </div>

            <div className="space-y-2 border-b border-gray-300 pb-4">
                <h1 className="font-bold text-base">Additional Terms</h1>
                <ul className="list-decimal list-inside space-y-1">
                    <li>I acknowledge that there are market, legal, and technological risks that may affect the value and sustainability of the asset.</li>
                    <li>I agree to provide clarification, additional evidence, or supporting documents if requested by an authorized party.</li>
                    <li>I accept that any violation of these terms and conditions may result in suspension, freezing, or removal of the asset.</li>
                    <li>By submitting, I confirm that I have read, understood, and agreed to all the applicable terms & conditions.</li>
                </ul>
            </div>

            <button
                className="p-2 background-dark rounded-md text-white cursor-pointer"
                onClick={() => submitCreateAsset(formData)}
            >
                Create Asset
            </button>
        </div>
    );
}