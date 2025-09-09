import { Files, Grid, List, Search } from "lucide-react";
import { AssetTypeFilterTabProps, AssetTypeOptions, FilterState, SearchCompProps, ShowAssetoption } from "../types/ui";
import React from "react";
import { formatMotokoTime, ReduceCharacters } from "../utils/rwa-hepler";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hook/useMobile";
import { Asset } from "../../../declarations/backend/backend.did";
import { getAssetStatusText, getAssetTypeText } from "../utils/union-handler";


export function filterAssets(assets: Asset[], filters: FilterState): Asset[] {
    return assets.filter(asset => {
        const matchesSearch = filters.searchQuery === '' ||
            asset.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            asset.id.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            asset.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

        const assetTypeText = getAssetTypeText(asset.assetType);
        const matchesType = filters.selectedAssetTypes.length === 0 ||
            filters.selectedAssetTypes.includes('All') ||
            filters.selectedAssetTypes.includes(assetTypeText);

        return matchesSearch && matchesType;
    });
}

export function SearchComp({ searchQuery, onSearchChange, onSearch }: SearchCompProps) {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };
    return (
        <div className="bg-gray-100 min-h-[40vw] md:min-h-[30vw] pt-25 pb-10 space-y-5 flex flex-col items-center">
            <div className="space-y-5 px-20">
                <h1 className="text-3xl font-normal text-center">Discover Digital Assets</h1>
                <p className="text-center capitalize">Buy, sell, and trade unique digital assets on our marketplace</p>
            </div>
            <div className="p-5 bg-white mx-10 rounded-lg flex flex-col gap-2 w-[90vw] md:w-[50%] md:flex-row shadow-lg">
                <input
                    type="text"
                    placeholder="Search by asset id or name.."
                    className="border border-gray-300 p-2 rounded-md md:w-full"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button
                    className="text-white bg-[rgb(17,24,39)] flex gap-3 py-2 px-5 items-center justify-center cursor-pointer rounded-md"
                    onClick={onSearch}
                >
                    <Search />
                    <span className="font-bold">Search</span>
                </button>
            </div>
        </div>
    )
}

export function AssetTypeFilterTab({ selectedTypes, onTypeChange }: AssetTypeFilterTabProps) {
    const handleTypeChange = (type: string, checked: boolean) => {
        if (type === 'All') {
            onTypeChange(checked ? ['All'] : []);
            return;
        }

        let newSelectedTypes: string[];

        if (checked) {
            newSelectedTypes = selectedTypes.filter(t => t !== 'All').concat(type);
        } else {
            newSelectedTypes = selectedTypes.filter(t => t !== type);
        }

        onTypeChange(newSelectedTypes);
    };

    const clearAllFilters = () => {
        onTypeChange([]);
    };
    return (
        <div className="m-5 md:w-[20%]">
            <div className="p-5 border border-gray-200 rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="font-normal">Filter By Asset Type</h1>
                    {selectedTypes.length > 0 && (
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                            Clear all
                        </button>
                    )}
                </div>
                <div className="space-y-2">
                    {Object.values(AssetTypeOptions).map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name={type}
                                id={type}
                                checked={selectedTypes.includes(type)}
                                onChange={(e) => handleTypeChange(type, e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={type} className="text-sm cursor-pointer">
                                {type}
                            </label>
                        </div>
                    ))}
                </div>

                {/* Show active filters */}
                {selectedTypes.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">Active filters:</p>
                        <div className="flex flex-wrap gap-1">
                            {selectedTypes.map(type => (
                                <span
                                    key={type}
                                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                    {type}
                                    <button
                                        onClick={() => handleTypeChange(type, false)}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ListComp({ data }: { data: Asset }) {
    const isMobile = useIsMobile();
    const reducedTitle = ReduceCharacters(data.name, isMobile ? 10 : 15);

    const { isAuthenticated } = useAuth();

    if (isAuthenticated) return (
        <div className="bg-white border border-gray-300 rounded-md shadow hover:shadow-md w-full min-h-[12vw] md:min-h-[5vw]">
            <div className="w-full h-full flex items-center justify-start px-5">
                <div className="w-full grid grid-cols-6 items-center gap-5">
                    <h1 className="font-bold capitalize">
                        <Link className="" to={`/asset/${data.id}`}>{reducedTitle}</Link>
                    </h1>
                    <p>{data.tokenLeft}</p>
                    <p>{formatMotokoTime(data.createdAt)}</p>
                    <p>{getAssetTypeText(data.assetType)}</p>
                    <p><span className="font-semibold">{data.pricePerToken}</span> USD</p>
                    <p>{getAssetStatusText(data.assetStatus)}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white border border-gray-300 rounded-md shadow hover:shadow-md w-full min-h-[12vw] md:min-h-[5vw]">
            <div className="w-full h-full flex items-center justify-start px-5">
                <div className="w-full grid grid-cols-6 items-center gap-5">
                    <h1 className="font-bold capitalize">{reducedTitle}</h1>
                    <p>{data.tokenLeft}</p>
                    <p>{formatMotokoTime(data.createdAt)}</p>
                    <p>{getAssetTypeText(data.assetType)}</p>
                    <p><span className="font-semibold">{data.pricePerToken}</span> USD</p>
                    <p>{getAssetStatusText(data.assetStatus)}</p>
                </div>
            </div>
        </div>
    );
}

export function AssetListData({ data }: { data: Asset[] }) {
    return (
        <div className="grid gap-2">
            {data.map((d, idx) =>
                <ListComp key={idx} data={d} />
            )}
        </div>
    );
}

function AssetCard({ data }: { data: Asset }) {
    const { isAuthenticated } = useAuth();
    const isMobile = useIsMobile();

    const descNumWord = isMobile && isAuthenticated ? 200 : isMobile && !isAuthenticated ? 300 : !isAuthenticated && !isMobile ? 120 : 80;

    const reducedTitle = ReduceCharacters(data.name);
    const reducedDesription = ReduceCharacters(data.description, descNumWord);

    return (
        <div className="bg-white md:w-[24vw] aspect-[3/2] md:aspect-[7/8] shadow-md hover:shadow-lg rounded-md border border-gray-300 pb-2">
            <div className="w-full h-full">
                <div className="bg-gray-600 w-full h-[50%] rounded-t-md"></div>
                <div className="px-2 pt-1 space-y-2">
                    <div className="w-full flex items-center justify-between">
                        <h1 className="text-lg text-[rgb(0,51,102)] font-semibold capitalize">{reducedTitle}</h1>
                        <button
                            className={`cursor-pointer ${isAuthenticated ? 'block' : 'hidden'}`}
                            onClick={() => { navigator.clipboard.writeText(data.id) }}
                        >
                            <Files size={15} />
                        </button>
                    </div>
                    <p className="text-sm">
                        {reducedDesription}
                    </p>
                </div>
                <div className="w-full p-2 flex justify-between items-center">
                    <p className="text-sm">tokens: <span className="text-sm text-gray-600">{data.tokenLeft}</span> / <span className="text-sm font-bold">{data.totalToken}</span></p>
                    <p className="lowercase text-sm p-2 font-bold">{getAssetStatusText(data.assetStatus)}</p>
                </div>
                <div className="flex items-center justify-between px-2">
                    <p className="text-sm"><span className="text-[rgb(0,51,102)] font-semibold">{data.pricePerToken} </span><span className="font-semibold">USD</span></p>
                    {isAuthenticated &&
                        <button className="w-1/2 flex items-center justify-center">
                            <Link
                                className="bg-[rgb(0,51,102)] p-1 w-full text-center text-white rounded-md"
                                to={`/asset/${data.id}`}
                            >
                                Take Look
                            </Link>
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}

export function AssetCardData({ data }: { data: Asset[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {data.map((d, idx) =>
                <AssetCard key={idx} data={d} />
            )}
        </div>
    );
}

export function AssetLists({ data }: { data: Asset[] }) {
    const [viewOption, setViewOption] = React.useState<ShowAssetoption>(ShowAssetoption.card);

    return (
        <div className="px-5 py-5 md:w-[80%] space-y-5">
            {/* header list */}
            <div className="flex items-center justify-between">
                <h1 className="text-gray-600 font-semibold">{data.length} Total Assets</h1>
                <div className="flex">
                    <div
                        className={`${viewOption === ShowAssetoption.card ? 'bg-[rgb(0,8,26)]' : 'bg-white border border-gray-300'} p-1 cursor-pointer rounded-l-md`}
                        onClick={() => setViewOption(ShowAssetoption.card)}
                    >
                        <Grid color={`${viewOption === ShowAssetoption.card ? 'white' : 'black'}`} size={20} />
                    </div>
                    <div
                        className={`${viewOption === ShowAssetoption.list ? 'bg-[rgb(0,8,26)]' : 'bg-white border border-gray-300'} p-1 cursor-pointer rounded-r-md`}
                        onClick={() => setViewOption(ShowAssetoption.list)}
                    >
                        <List color={`${viewOption === ShowAssetoption.list ? 'white' : 'black'}`} size={20} />
                    </div>
                </div>
            </div>
            {/* card lists */}
            {viewOption === ShowAssetoption.card &&
                <AssetCardData data={data} />
            }
            {viewOption === ShowAssetoption.list &&
                <AssetListData data={data} />
            }

        </div>
    );
}