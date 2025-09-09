import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { X } from "lucide-react";
import { backendService } from "../../services/backendService";
import { value2BigInt } from "../../utils/rwa-hepler";
import { PopUpContext } from "../../context/PopUpContext";

export function ProposedToBuyToken() {

    const { setModalKind, assetId } = React.useContext(ModalContext);
    const [tokenPrice, setTokenPrice] = React.useState("");
    const [token, setToken] = React.useState("");

    const { setPopUpData } = React.useContext(PopUpContext);

    function closeButtonHandler() {
        setModalKind(null);
        setToken("");
        setTokenPrice("");
    }

    async function proposalHandler() {
        try {
            const res = await backendService.proposedToken(assetId, value2BigInt(token), value2BigInt(tokenPrice))

            setPopUpData({
                title: "Success to proposed token asset!",
                description: `propsal was created as ${res}, wait for the approval`,
                position: "bottom-right",
            });

            closeButtonHandler()

        } catch (error) {
            setPopUpData({
                title: "Failed to proposed token asset!",
                description: `proposal was not created becasue error, ${error}`,
                position: "bottom-right",
            });
        }
    }

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>You are going to buy this token asset</p>
                        <button
                            className="p-2 rounded-full cursor-pointer"
                            onClick={() => closeButtonHandler()}
                        >
                            <X size={15} color="red" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="pice">Price Per Token</label>
                            <input
                                value={tokenPrice}
                                onChange={(e) => setTokenPrice(e.target.value)}
                                type="text"
                                name="price"
                                id="pice"
                                placeholder="120 (usd)"
                                className="p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="token">Token Purchased</label>
                            <input
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                name="token"
                                id="token"
                                placeholder="120 (usd)"
                                className="p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <button
                            onClick={() => proposalHandler()}
                            className="text-sm text-white background-dark p-2 rounded-md w-full cursor-pointer"
                        >
                            Send Proposal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}