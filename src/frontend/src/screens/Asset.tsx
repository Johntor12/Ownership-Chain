import { MainLayout } from "../layout/main-layout"
import { AssetMainContent, AssetSecondaryContent } from "../components/asset-details-component";
import { useParams } from "react-router-dom";
import React from "react";
import { backendService } from "../services/backendService";
import { Asset as AssetData } from "../../../declarations/backend/backend.did";
import { Loader } from "../components/loader-component";
import { ModalContext } from "../context/ModalContext";

function Asset() {
  const { assetid } = useParams<{ assetid: string }>();
  const [data, setData] = React.useState<AssetData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const { changeAssetId } = React.useContext(ModalContext);

  React.useEffect(() => {
    if (!assetid) {
      setError("Asset ID not found");
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        if (!assetid) return null;
        const res = await backendService.getAssetById(assetid);
        console.log(data, assetid);
        setData(res);
      } catch (err) {
        setError("Failed to load asset data");
      } finally {
        setIsLoading(false);
      }
    }

    async function sureToSetAssetId() {
      if (!assetid) return null;
      console.log(assetid);
      changeAssetId(assetid);
    }

    fetchData();
    sureToSetAssetId();

  }, []);

  if (error) return <div>{error}</div>;

  if (isLoading) return <Loader fullScreen />;

  if (!data)
    return (
      <MainLayout>
        <div>Data tidak ditemukan</div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="px-5 pt-15 pb-5 md:px-20 space-y-5 md:space-y-10">
        {/* main content */}
        <AssetMainContent data={data} />
        {/* secondary content */}
        <div>
          <AssetSecondaryContent mainData={data} />
        </div>
      </div>
    </MainLayout>
  );
}

export default Asset;
