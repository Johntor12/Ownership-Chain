import { BadgeCheck, BadgeX, Scale } from "lucide-react";
import { MainLayout } from "../layout/main-layout";
import { useParams } from "react-router-dom";
import React from "react";
import { backendService } from "../services/backendService";
import { Report } from "../../../declarations/backend/backend.did";
import { Loader } from "../components/loader-component";
import { formatMotokoTime } from "../utils/rwa-hepler";
import { AgainstPlagiarism } from "../components/against-court-component";

function CourtingProblem() {
  const { reportid } = useParams<{ reportid: string }>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<[Report] | null | []>(null);

  React.useEffect(() => {
    if (!reportid) {
      setError("Asset ID not found");
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        if (!reportid) return null;
        const res = await backendService.getDetailsReport(reportid);
        setData(res);
        console.log(res);
      } catch (error) {
        setError("Failed to load asset data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [])

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
        <div className="space-y-8">
          <div className="p-4 border border-gray-300 rounded-md space-y-4">
            <div className="flex items-center space-x-4">
              <Scale size={30} />
              <h1 className="text-[rgb(0,8,26)] capitalize text-3xl">Asset reporting Center</h1>
            </div>
            <p className="text-normal text-gray-700">Courting settlement process, refute evidence in court and provide information on the charges</p>
          </div>

          <div className="space-y-4">
            <p className="border-b border-gray-300 pb-2 font-semibold">Demand against you</p>
            <div className="space-y-2 my-2">
              <div className="uppercase text-red-600">{data[0]?.content}</div>
              <div className="text-sm">This Report is created at {data[0]?.created ? formatMotokoTime(data[0]?.created) : ''}</div>
              <div className="text-sm">{data[0]?.description}</div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="border-b border-gray-300 pb-2 font-semibold">Info and Evidence</p>
            <div className="space-y-2 my-2">
              <div className="flex items-center space-x-2">
                {
                  data[0] !== undefined ? (
                    <BadgeCheck color="green" />
                  ) : (
                    <BadgeX color="red" />
                  )
                }
                <div>
                  The complainer reputation risk score is {
                    data[0] !== undefined ? (
                      <span className={`${data[0].reputation ?? data[0].reputation > 25 ? 'text-red-500' : 'text-green-500'} font-bold`}>
                        {data[0].reputation}
                      </span>
                    ) : (
                      <span>N/A</span>
                    )
                  }
                </div>
              </div>
              <p>
                If accusations such as fraud, plagiarism, scam, or other forms of misconduct are raised against you,
                you are encouraged to provide sufficient evidence to counter the claims. By submitting appropriate proof,
                you can demonstrate your compliance, challenge the allegations, and reduce the risk of
                sanctions or restrictions, including the freezing of assets.
              </p>
              <div className="space-y-4 w-full">
                <AgainstPlagiarism
                  hashComplain={data[0]?.evidence[0]?.hashclarity}
                  assetId={data[0]?.targetid}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default CourtingProblem;