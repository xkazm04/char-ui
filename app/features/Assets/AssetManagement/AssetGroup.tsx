import { AssetGroup } from "@/app/functions/assetFns";
import AssetGroupFullScreen from "./AssetGroupFullScreen";
import AssetGroupSidebar from "./AssetGroupSidebar";

type Props = {
  assetGroups: AssetGroup[];
  isFullScreen?: boolean;
}

const AssetGroupList = ({
  assetGroups,
  isFullScreen = false,
}: Props) => {
  if (isFullScreen) {
    return (
      <AssetGroupFullScreen
        assetGroups={assetGroups}
      />
    );
  }

  return (
    <AssetGroupSidebar
      assetGroups={assetGroups}
    />
  );
}

export default AssetGroupList;