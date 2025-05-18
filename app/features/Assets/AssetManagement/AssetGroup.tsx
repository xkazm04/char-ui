import { AssetGroup } from "@/app/functions/assetFns";
import AssetGroupFullScreen from "./AssetGroupFullScreen";
import AssetGroupSidebar from "./AssetGroupSidebar";

type Props = {
  assetGroups: AssetGroup[];
  mainSearchQuery: string;
  setSelectedAssets: (assets: Set<string>) => void;
  selectedAssets: Set<string>;
  isFullScreen?: boolean;
}

const AssetGroupList = ({
  assetGroups,
  setSelectedAssets,
  selectedAssets,
  isFullScreen = false,
  mainSearchQuery
}: Props) => {
  if (isFullScreen) {
    return (
      <AssetGroupFullScreen
        assetGroups={assetGroups}
        mainSearchQuery={mainSearchQuery}
        setSelectedAssets={setSelectedAssets}
        selectedAssets={selectedAssets}
      />
    );
  }

  return (
    <AssetGroupSidebar
      assetGroups={assetGroups}
      setSelectedAssets={setSelectedAssets}
    />
  );
}

export default AssetGroupList;