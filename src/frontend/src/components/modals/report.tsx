import { Upload, X } from "lucide-react";
import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { PopUpContext } from "../../context/PopUpContext";
import { ReduceCharacters } from "../../utils/rwa-hepler";

export function ReportPlagiarism() {
    const { setModalKind, reportManagement } = React.useContext(ModalContext);
    const [content, setContent] = React.useState<string | undefined>(reportManagement.data?.content)
    const [desc, setDesc] = React.useState<string | undefined>(reportManagement.data?.description)
    const { setPopUpData } = React.useContext(PopUpContext);

    function closeButtonHandler() {
        setModalKind(null);
    }

    function onSetHandler() {
        if (!content || !desc) {
            setPopUpData({
                title: "No Content or description setted up",
                description: "if you want to make any changes pleaase set up the field first!",
                position: "bottom-right",
            })

            return;
        }

        reportManagement.setter(content, "content");
        reportManagement.setter(desc, "description");

        setPopUpData({
            title: "Success to make a change",
            description: "change the reporting form, you can now submit the report",
            position: "bottom-right"
        });

        setModalKind(null);
    }

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Report Plagiarism</p>
                        <button
                            className="p-2 rounded-full cursor-pointer"
                            onClick={() => closeButtonHandler()}
                        >
                            <X size={15} color="red" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="content" className="text-sm font-semibold">Report Content</label>
                            <input
                                type="text" name="content" id="content"
                                className="p-2 border rounded-md border-gray-300 text-sm"
                                placeholder="tell your complaint here.."
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label htmlFor="descriptiom" className="text-sm font-semibold">Report Descriptiom</label>
                            <input
                                type="text" name="descriptiom" id="descriptiom"
                                className="p-2 border rounded-md border-gray-300 text-sm"
                                placeholder="describe your complaint here.."
                                required
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label htmlFor="claritycheck" className="text-sm font-semibold">Clarity Check Result</label>
                            <input
                                type="text" name="claritycheck" id="claritycheck"
                                className="p-2 border rounded-md border-gray-300 text-sm"
                                value={reportManagement.data?.hashClarity ? "setted up" : "not set up"}
                                disabled
                            />
                        </div>

                        <button
                            onClick={() => onSetHandler()}
                            className="background-dark text-white p-2 rounded-md w-full cursor-pointer text-sm"
                        >
                            Set Report Form
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ReportUser() {
    const { setModalKind, reportManagement } = React.useContext(ModalContext);

    const [content, setContent] = React.useState<string | undefined>(reportManagement.data?.content)
    const [desc, setDesc] = React.useState<string | undefined>(reportManagement.data?.description)
    const { setPopUpData } = React.useContext(PopUpContext);

    function closeButtonHandler() {
        setModalKind(null);
    }


    function onSetHandler() {
        if (!content || !desc) {
            setPopUpData({
                title: "No Content or description setted up",
                description: "if you want to make any changes pleaase set up the field first!",
                position: "bottom-right",
            })

            return;
        }

        reportManagement.setter(content, "content");
        reportManagement.setter(desc, "description");

        setPopUpData({
            title: "Success to make a change",
            description: "change the reporting form, you can now submit the report",
            position: "bottom-right"
        });

        setModalKind(null);
    }

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Report User</p>
                        <button
                            className="p-2 rounded-full cursor-pointer"
                            onClick={() => closeButtonHandler()}
                        >
                            <X size={15} color="red" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="content" className="text-sm font-semibold">Report Content</label>
                            <input
                                type="text" name="content" id="content"
                                className="p-2 border rounded-md border-gray-300 text-sm"
                                placeholder="tell your complaint here.."
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label htmlFor="descriptiom" className="text-sm font-semibold">Report Descriptiom</label>
                            <input
                                type="text" name="descriptiom" id="descriptiom"
                                className="p-2 border rounded-md border-gray-300 text-sm"
                                placeholder="describe your complaint here.."
                                required
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={() => onSetHandler()}
                            className="background-dark text-white p-2 rounded-md w-full cursor-pointer text-sm"
                        >
                            Set Report Form
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function DocHash() {
    const { setModalKind, reportManagement } = React.useContext(ModalContext);
    const { setPopUpData } = React.useContext(PopUpContext);

    const [file, setFile] = React.useState<File | null>(null);
    const [hashValue, setHashValue] = React.useState<string | undefined>(reportManagement.data?.hashClarity);

    function closeButtonHandler() {
        setModalKind(null);
    }

    async function onUploadDoc(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0] || null;
        setFile(f);

        if (!f) {
            setPopUpData({
                title: "Error, you have to set the documents first!",
                description: `no document uploaded`,
                position: "bottom-right",
            })

            return;
        }

        const arrayBuffer = await f.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

        setHashValue(hashHex);

        setPopUpData({
            title: "Hash setted!",
            description: "succesfully add document, hash it",
            position: "bottom-right",
        })
    }

    function onSetHashDoc() {
        if (!hashValue) {
            setPopUpData({
                title: "Error, you have to set the documents and then hash it first!",
                description: `no hash document setup`,
                position: "bottom-right",
            })

            return;
        }

        reportManagement.setter(hashValue, "hashClarity")

        setPopUpData({
            title: "Hash setted!",
            description: "succesfully add document, hash it",
            position: "bottom-right",
        })

        setModalKind(null)
    }

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Document Evidence</p>
                        <button
                            className="p-2 rounded-full cursor-pointer"
                            onClick={() => closeButtonHandler()}
                        >
                            <X size={15} color="red" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <label
                            htmlFor="file"
                            className={`flex flex-col items-center justify-center w-full h-32 border-2 rounded-lg border-gray-300 ${file ? 'bg-blue-300' : 'border-dashed cursor-pointer hover:bg-gray-50'}`}
                        >
                            <Upload className={`${!file ? 'w-8 h-8 text-gray-400' : 'hidden'}`} />
                            <span className="mt-2 text-sm text-gray-600">
                                Klik untuk upload PDF
                            </span>
                            <input
                                id="file"
                                name="file"
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={onUploadDoc}
                            />
                        </label>

                        <div className="flex flex-col space-y-1">
                            <label htmlFor="claritycheck" className="text-sm font-semibold">Document Hash</label>
                            <input
                                type="text" name="claritycheck" id="claritycheck"
                                className="p-2 border rounded-md border-gray-300 text-sm"
                                value={reportManagement.data?.hashClarity ? ReduceCharacters(reportManagement.data?.hashClarity) : "not setup"}
                                disabled
                            />
                        </div>

                        <button
                            onClick={() => onSetHashDoc()}
                            className="background-dark text-white p-2 rounded-md w-full cursor-pointer text-sm"
                        >
                            Set This Document as Hash Clarity
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function UserFootPrint() {
    const { setModalKind } = React.useContext(ModalContext);

    function closeButtonHandler() {
        setModalKind(null);
    }

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>User Foot Print Evidence</p>
                        <button
                            className="p-2 rounded-full cursor-pointer"
                            onClick={() => closeButtonHandler()}
                        >
                            <X size={15} color="red" />
                        </button>
                    </div>
                    <div>User FootPrint</div>
                </div>
            </div>
        </div>
    )
}