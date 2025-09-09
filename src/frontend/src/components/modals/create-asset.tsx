import { RotateCcwKey, Upload, X } from "lucide-react";
import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { DocumentHashDataType } from "../../types/rwa";
import countriesData from "../../utils/countries.json"
import { backendService } from "../../services/backendService";
import { CreatePairKey, mapToIdentityNumberType, ReduceCharacters, signDoc } from "../../utils/rwa-hepler";
import { PopUpContext } from "../../context/PopUpContext";

export function AddDocumentsModal() {
    const { setModalKind, managementAddDocument } = React.useContext(ModalContext);
    const [file, setFile] = React.useState<File | null>(null);
    const [privKey, setPrivKey] = React.useState<File | null>(null);
    const [docName, setDocName] = React.useState("");
    const [docDesc, setDocDesc] = React.useState("");
    const { setPopUpData } = React.useContext(PopUpContext);

    function closeButtonHandler() {
        setModalKind(null);
        setFile(null);
        setDocName("");
        setDocDesc("");
    }

    async function handleAddDocument() {
        if (!privKey) {
            setPopUpData({
                title: "Cannot add document!",
                description: `set your privatekey first`,
                position: "bottom-right",
            })

            return;
        }

        if (!file) {
            setPopUpData({
                title: "Error, you have to set the documents first!",
                description: `no document uploaded`,
                position: "bottom-right",
            })

            return
        }

        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

        console.log(hashHex)

        const privBuffer = await privKey.arrayBuffer();
        const privPem = new TextDecoder().decode(privBuffer);
        const signature = signDoc(privPem, hashHex);

        const newDoc: DocumentHashDataType = {
            hash: signature,
            name: docName,
            description: docDesc,
        };

        managementAddDocument.setter(newDoc);

        setModalKind(null);

        setPopUpData({
            title: "Created!",
            description: "succesfully add document, hash and sign it with your signature",
            position: "bottom-right",
        })
    }


    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-full md:w-[60vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Asset Documents</p>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={closeButtonHandler}
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>
                    <div className="space-y-5">
                        <div className="flex items-center space-x-10">
                            <label
                                htmlFor="file"
                                className={`flex flex-col items-center justify-center w-full h-32 border-2 rounded-lg border-gray-300 ${file ? 'bg-blue-300' : 'border-dashed cursor-pointer hover:bg-gray-50'}`}
                            >
                                <Upload className={`${!file ? 'w-8 h-8 text-gray-400' : 'hidden'}`} />
                                <span className="mt-2 text-sm text-gray-600">
                                    {!file ? "Click to uplaod document PDF" : file.name}
                                </span>
                                <input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0] || null;
                                        setFile(f);
                                    }}
                                />
                            </label>
                            <label
                                htmlFor="privfile"
                                className={`flex flex-col items-center justify-center w-full h-32 border-2 rounded-lg border-gray-300 ${privKey ? 'bg-blue-300' : 'border-dashed cursor-pointer hover:bg-gray-50'}`}
                            >
                                <Upload className={`${!privKey ? 'w-8 h-8 text-gray-400' : 'hidden'}`} />
                                <span className="mt-2 text-sm text-gray-600">
                                    {!privKey ? "Click to upload private key" : privKey.name}
                                </span>
                                <input
                                    id="privfile"
                                    name="privfile"
                                    type="file"
                                    accept="text"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0] || null;
                                        setPrivKey(f);
                                    }}
                                />
                            </label>
                        </div>
                        <div className="flex flex-col w-full space-y-2">
                            <label className="text-sm" htmlFor="docname">Document Name</label>
                            <input
                                type="text"
                                name="docname"
                                id="docname"
                                placeholder="ex. comp dividend"
                                className="p-2 rounded-md border border-gray-200"
                                value={docName}
                                onChange={(e) => setDocName(e.target.value)}
                            />
                            <label className="text-sm" htmlFor="docdesc">Document Description</label>
                            <input
                                type="text"
                                name="docdesc"
                                id="docdesc"
                                placeholder="ex. comp dividend in last 5 years"
                                className="p-2 rounded-md border border-gray-200"
                                value={docDesc}
                                onChange={(e) => setDocDesc(e.target.value)}
                            />
                        </div>
                        <button
                            className="text-white text-sm background-dark p-2 rounded-md cursor-pointer"
                            onClick={handleAddDocument}
                        >
                            Sign and Add Documents
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export function EditPersonalInfoModal() {
    const { setModalKind } = React.useContext(ModalContext);
    const { setPopUpData } = React.useContext(PopUpContext);

    const [selectedCountry, setSelectedCountry] = React.useState<string>(countriesData[0].name);
    const [selectedCity, setSelectedCity] = React.useState<string>(countriesData[0].cities[0].name);
    const [fisrtname, setFirstname] = React.useState("");
    const [lastname, setLastname] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [idnumber, setIdnumber] = React.useState("");
    const [idtype, setIdtype] = React.useState("IdentityNumber");
    const [pubKey, setPubKey] = React.useState("");
    const [privKey, setPrivKey] = React.useState("");

    function closeButtonHandler() {
        setSelectedCountry(countriesData[0].cities[0].name);
        setSelectedCountry(countriesData[0].name);
        setFirstname("")
        setLastname("")
        setPhone("")
        setIdnumber("")
        setIdtype("")
        setModalKind(null);
    }

    async function handleSubmit() {
        try {
            const res = await backendService.registUser(
                fisrtname,
                lastname,
                phone,
                selectedCountry,
                selectedCity,
                idnumber,
                mapToIdentityNumberType(idtype),
                pubKey,
            );

            setPopUpData({
                title: "Success to regist and set user details as kyc details!",
                description: `user details was created ${res}`,
                position: "bottom-right",
            })
            onDownload();
            setModalKind(null);
        } catch (error) {
            console.log(error);
            setPopUpData({
                title: "Error To Set User Identity!",
                description: `no changes happened becasue of error ${error}`,
                position: "bottom-right",
            })
        }
    }

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const country = e.target.value;
        setSelectedCountry(country);
        setSelectedCity("");
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCity(e.target.value);
    };

    function handleGeneratePairKey() {
        const [pub, priv] = CreatePairKey();
        setPubKey(pub);
        setPrivKey(priv);
    }

    function onDownload() {
        if (!privKey) return;

        const blob = new Blob([privKey], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "ownership_chainner_privkey_DONOT_SHARE.txt";
        a.click();

        URL.revokeObjectURL(url);
    }


    const availableCities =
        countriesData.find((c) => c.name === selectedCountry)?.cities || [];

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-full md:w-[60vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Personal Info</p>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={() => closeButtonHandler()}
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <div className="flex space-x-5 w-full">
                            <div className="flex flex-col space-y-1 w-full">
                                <label htmlFor="firstname">First Name</label>
                                <input
                                    value={fisrtname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    type="text"
                                    name="firstname"
                                    id="firstname"
                                    placeholder="firstname"
                                    className="p-2 rounded-md border border-gray-300"
                                />
                            </div>

                            <div className="flex flex-col space-y-1 w-full">
                                <label htmlFor="lastname">Last Name</label>
                                <input
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    type="text"
                                    name="lastname"
                                    id="lastname"
                                    placeholder="lastname"
                                    className="p-2 rounded-md border border-gray-300"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-1 w-full">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                type="text"
                                name="phone"
                                id="phone"
                                placeholder="phone"
                                className="p-2 rounded-md border border-gray-300"
                            />
                        </div>

                        {/* Country + City */}
                        <div className="flex space-x-5 w-full">
                            <div className="flex flex-col space-y-1 w-full">
                                <label htmlFor="country">Country</label>
                                <select
                                    className="border border-gray-400 p-2 w-full rounded"
                                    value={selectedCountry}
                                    onChange={handleCountryChange}
                                >
                                    {countriesData.map((country) => (
                                        <option key={country.name} value={country.name}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col space-y-1 w-full">
                                <label htmlFor="city">City</label>
                                <select
                                    className="border border-gray-400 p-2 w-full rounded"
                                    value={selectedCity}
                                    onChange={handleCityChange}
                                    disabled={!selectedCountry}
                                >
                                    {availableCities.map((city) => (
                                        <option key={city.name} value={city.name}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Id Section */}
                        <div className="flex space-x-5 w-full">
                            <div className="flex flex-col space-y-1 w-full">
                                <label htmlFor="idtype">Id Number Type</label>
                                <select
                                    className="border border-gray-400 p-2 w-full rounded"
                                    value={idtype}
                                    onChange={(e) => setIdtype(e.target.value)}
                                >
                                    <option value={"IdentityNumber"}>Identity Number</option>
                                    <option value={"LiscenseNumber"}>Liscense Number</option>
                                    <option value={"Pasport"}>Pasport</option>
                                </select>
                            </div>
                            <div className="flex flex-col space-y-1 w-full">
                                <label htmlFor="idnum">Id Number</label>
                                <input
                                    value={idnumber}
                                    onChange={(e) => setIdnumber(e.target.value)}
                                    type="text"
                                    name="idnum"
                                    id="idnum"
                                    placeholder="idnum"
                                    className="p-2 rounded-md border border-gray-300"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex space-x-2 items-center my-2">
                                <button
                                    onClick={() => handleGeneratePairKey()}
                                    className="p-1 cursor-pointer"
                                >
                                    <RotateCcwKey size={20} />
                                </button>
                                <p>Signature Identity</p>
                            </div>
                            <div className="flex space-x-5 w-full">
                                <input
                                    type="text"
                                    name="publickey"
                                    id="publickey"
                                    placeholder="pubkey"
                                    className="p-2 rounded-md border border-gray-300 w-full"
                                    value={ReduceCharacters(pubKey.split("\n")[1] ?? "")}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => handleSubmit()}
                        className="background-dark text-white text-sm p-2 rounded-md cursor-pointer">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}


export function AddRuleDetails() {
    const { setModalKind, managementRuleDetail } = React.useContext(ModalContext);
    const [detail, setDetail] = React.useState("");

    function closeButtonHandler() {
        setModalKind(null);
        setDetail("")
    }

    function onAddDetailsHandler() {
        managementRuleDetail.setter(detail);
        setModalKind(null);
        setDetail("")
    }

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Rules Details</p>
                        <button
                            className="p-2 rounded-full cursor-pointer"
                            onClick={() => closeButtonHandler()}
                        >
                            <X size={15} color="red" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="ruledetails"
                            id="ruledetails"
                            placeholder="some rule and details about the token asset"
                            className="p-2 border border-gray-300 rounded-md w-full"
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                        />
                        <button
                            className="text-sm text-white background-dark p-2 rounded-md w-full cursor-pointer"
                            onClick={() => onAddDetailsHandler()}
                        >
                            Set Rule Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}