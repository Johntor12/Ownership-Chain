import React from "react";
import { AssetLists, AssetTypeFilterTab, filterAssets, SearchComp } from "../components/market-place-components";
import { MainLayout } from "../layout/main-layout";
import { backendService } from "../services/backendService";
import { Asset } from "../../../declarations/backend/backend.did";
import { FilterState } from "../types/ui";
import { Loader } from "../components/loader-component";

function MarketPlace() {
  const [load, setLoading] = React.useState(true);
  const [data, setData] = React.useState<Asset[] | null>([]);
  const [filteredData, setFilteredData] = React.useState<Asset[]>([]);

  const [filters, setFilters] = React.useState<FilterState>({
    searchQuery: '',
    selectedAssetTypes: []
  });


  React.useEffect(() => {
    async function fetch() {
      const res = await backendService.getAssets();
      setData(res);
    }

    fetch();
    setLoading(false);
  }, []);

  React.useEffect(() => {
    if (data) {
      const filtered = filterAssets(data, filters);
      setFilteredData(filtered);
    }
  }, [data, filters]);

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleSearch = () => {
    // You can add additional logic here if needed (like analytics)
    console.log('Searching for:', filters.searchQuery);
  };

  const handleTypeChange = (types: string[]) => {
    setFilters(prev => ({ ...prev, selectedAssetTypes: types }));
  };

  if (load) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <Loader fullScreen />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SearchComp
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
      />
      <div className="flex flex-col md:flex-row justify-between">
        <AssetTypeFilterTab
          selectedTypes={filters.selectedAssetTypes}
          onTypeChange={handleTypeChange}
        />
        <AssetLists data={filteredData} />
      </div>
    </MainLayout>
  );
}

export default MarketPlace;
