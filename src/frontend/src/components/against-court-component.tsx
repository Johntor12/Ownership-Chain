import { CircleX, FileCheck, Upload } from "lucide-react";
import React from "react";
import { ReduceCharacters, signDoc, verifyHash } from "../utils/rwa-hepler";
import { backendService } from "../services/backendService";
import { PopUpContext } from "../context/PopUpContext";
import { DocumentHash } from "../../../declarations/backend/backend.did";
import { Loader } from "./loader-component";

export function AgainstPlagiarism(
    { hashComplain, assetId }:
        { hashComplain: [string] | [] | undefined, assetId: string | undefined }
) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [privKey, setPrivKey] = React.useState<File | null>(null);
    const [isMatchHash, setIsMatchHash] = React.useState(false);
    const [isMatchSignature, setIsMatchSignature] = React.useState(false);
    const [docHash, setDocHash] = React.useState<[DocumentHash[]] | []>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const { setPopUpData } = React.useContext(PopUpContext);

    React.useEffect(() => {
        async function fetchData() {
            if (!hashComplain || hashComplain.length == 0 || !assetId) {
                setPopUpData({
                    title: "Failed!",
                    description: "hash or asset id not settup well",
                    position: "bottom-right"
                });
                return;
            }
            try {
                const res = await backendService.getAssetDocumentHash(assetId);
                setDocHash(res);
            } catch (error) {
                setPopUpData({
                    title: "Failed!",
                    description: "Failed to load hash document target",
                    position: "bottom-right"
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchData()
    }, [])

    async function onDefenseHandler() {
        const pubKey = await backendService.getPubKeyUser();
        if (!pubKey) {
            setPopUpData({
                title: "Failed to verify!",
                description: "You have no public key stored",
                position: "bottom-right"
            });
            return;
        };

        if (!hashComplain || hashComplain.length == 0 || !assetId) {
            setPopUpData({
                title: "Failed!",
                description: "hash or asset id not settup well",
                position: "bottom-right"
            });
            return;
        }

        if (!privKey) {
            setPopUpData({
                title: "Failed!",
                description: "You have no private key setted up",
                position: "bottom-right"
            });
            return;
        }

        const privBuffer = await privKey.arrayBuffer();
        const privPem = new TextDecoder().decode(privBuffer);

        console.log(hashComplain[0]);

        console.log(docHash);

        const signHash = signDoc(privPem, hashComplain[0]);
        const verifyHashStatus = verifyHash(pubKey, hashComplain[0], privPem)

        console.log(signHash);

        console.log(verifyHashStatus)

        setIsMatchHash(verifyHashStatus);
        setIsMatchSignature(verifyHashStatus);

    };

    if (isLoading) return <Loader fullScreen />;

    return (
        <div className="w-full">
            <div className={`p-4 rounded-md border border-gray-300 w-full ${isOpen ? 'space-y-4' : 'space-y-0'}`}>
                <div
                    className="cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Document Hash Clarity
                </div>
                <div className={`space-y-3 ${isOpen ? 'block' : 'hidden space-y-0'}`}>
                    <div className="space-y-1">
                        <p className="font-semibold">
                            hash complainer
                        </p>
                        <div className="flex border border-gray-300 rounded-md p-2">
                            <input
                                type="text" name="hashcomplainer" id="hashcomplainer"
                                className="w-full"
                                disabled
                                placeholder="hashvalue"
                                value={hashComplain ? ReduceCharacters(hashComplain?.toString(), 25) : ''}
                            />
                            {isMatchHash ? <FileCheck /> : <CircleX color="red" />}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold">
                            signatured document
                        </p>
                        <div className="flex border border-gray-300 rounded-md p-2">
                            <input
                                type="text" name="docsignature" id="docsignature"
                                className="w-full"
                                disabled
                                placeholder="doc signature"
                            />
                            {isMatchSignature ? <FileCheck /> : <CircleX color="red" />}
                        </div>
                    </div>
                    <label
                        htmlFor="file"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 rounded-lg border-gray-300 ${privKey ? 'bg-blue-300' : 'border-dashed cursor-pointer hover:bg-gray-50'}`}
                    >
                        <Upload className={`${!privKey ? 'w-8 h-8 text-gray-400' : 'hidden'}`} />
                        <span className="mt-2 text-sm text-gray-600">
                            {!privKey ? "Click to upload your privatekey" : privKey.name}
                        </span>
                        <input
                            id="file"
                            name="file"
                            type="file"
                            accept="text"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0] || null;
                                setPrivKey(f);
                            }}
                        />
                    </label>
                    <button
                        className="p-2 background-dark rounded-md text-white text-sm w-full cursor-pointer"
                        onClick={() => onDefenseHandler()}
                    >
                        Submit Clarification
                    </button>
                </div>

            </div>
        </div>
    );
}

export function AgainsUserFlow() {
    return (
        <div className="w-full">
            <div className="p-4 rounded-md border border-gray-300 w-full cursor-pointer">
                against user flow fraud analysis
            </div>
        </div>
    );
}