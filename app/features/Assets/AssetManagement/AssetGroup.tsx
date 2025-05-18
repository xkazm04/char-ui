import { AssetGroup } from "@/app/functions/assetFns";
import AssetGroupFullScreen from "./AssetGroupFullScreen";
import AssetGroupSidebar from "./AssetGroupSidebar";

type Props = {
  assetGroups: AssetGroup[];
  setSelectedAssets: React.Dispatch<React.SetStateAction<Set<string>>>;
  isFullScreen?: boolean;
}

const AssetGroupList = ({
  assetGroups,
  setSelectedAssets,
  isFullScreen = false,
}: Props) => {
  if (isFullScreen) {
    return (
      <AssetGroupFullScreen
        assetGroups={assetGroups}
        setSelectedAssets={setSelectedAssets}
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