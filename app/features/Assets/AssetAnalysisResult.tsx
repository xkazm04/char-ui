import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AssetTabConfig } from "./AssetAnalysisLayout";
import AssetAnalysisResultItem from "./AssetAnalysisResultItem";
import { TabButton } from "@/app/components/TabButton";
import { indicatorVariants } from "@/app/components/anim/variants";
import Lottie  from "lottie-react";
import tasklist from '../../components/anim/lottie/tasklist.json'
import { AssetType } from "@/app/types/asset";

type Props = {
  openaiAssets: AssetType[];
  geminiAssets: AssetType[];
  groqAssets: AssetType[];
  isLoading: boolean;
  config: AssetTabConfig;
};

const AssetAnalysisResult = ({
  openaiAssets,
  geminiAssets,
  groqAssets,
  isLoading,
  config,
}: Props) => {
  const [tab, setTab] = useState<string>("groq");
  const [openaiList, setOpenaiList] = useState(openaiAssets);
  const [geminiList, setGeminiList] = useState(geminiAssets);
  const [groqList, setGroqList] = useState(groqAssets);

  useEffect(() => {
    setOpenaiList(openaiAssets);
  }, [openaiAssets]);

  useEffect(() => {
    setGeminiList(geminiAssets);
  }, [geminiAssets]);

  useEffect(() => {
    setGroqList(groqAssets);
  }, [groqAssets]);

  const renderAssetList = (assets: Asset[]) => (
    <motion.div
      className="grid lg:grid-cols-1 xl:grid-cols-2 gap-4 px-[5] xl:max-w-[1000px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {assets.length === 0 ? (
        <div className="col-span-2 text-start py-10 text-gray-400">
          No assets available
        </div>
      ) : (
        <>
          {assets.map((asset, idx) => (
            <AssetAnalysisResultItem
              key={`${tab}-${asset.name}-${idx}`}
              asset={asset}
              idx={idx}
              setOpenaiList={setOpenaiList}
              setGroqList={setGroqList}
              setGeminiList={setGeminiList}
              tab={tab}
            />
          ))}
        </>
      )}
    </motion.div>
  );

  const tabConfig = [
    { name: "Groq", value: "groq", enabled: config.groq.enabled },
    { name: "OpenAI", value: "openai", enabled: config.openai.enabled },
    { name: "Gemini", value: "gemini", enabled: config.gemini.enabled },
  ];

  return (
    <div className="w-full flex-row justify-center px-[5%]">
      {isLoading ? (
        <div className="rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px] max-w-[400px]">
          <Loader2 className="h-12 w-12 text-sky-500 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-white">Asset extraction pending</h3>
           <div className="h-60 w-60"> <Lottie animationData={tasklist} loop={true} /></div>
        </div>
      ) : (
        <>
          {/* Improved tab design with animated indicator */}
          <div className="relative mb-6">
            <div className="flex gap-0.5">
              {tabConfig.map((tabItem) => (
                <TabButton
                  key={tabItem.value}
                  name={tabItem.name}
                  value={tabItem.value}
                  enabled={tabItem.enabled}
                  tab={tab}
                  setTab={setTab}
                />
              ))}
            </div>

            {/* Background track */}
            <div
              className={`absolute bottom-0 w-[300px] left-0 right-0 h-[2px] bg-gray-700 rounded-full`}
            >
              <motion.div
                className={`w-1/3 h-full bg-sky-500 rounded-full`}
                variants={indicatorVariants}
                animate={tab}
                initial={false}
              />
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {tab === "groq" && renderAssetList(groqList)}
            {tab === "openai" && renderAssetList(openaiList)}
            {tab === "gemini" && renderAssetList(geminiList)}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default AssetAnalysisResult;