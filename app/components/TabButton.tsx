  type Props = {
    name: string;
    value: string;
    enabled: boolean;
    tab: string;
    setTab: (value: string) => void;
  }
  
  export const TabButton = ({ name, value, enabled, tab, setTab}: Props) => {
    return (
      <>
      {enabled && <button
        disabled={!enabled}
        className={`relative w-[100px] flex items-center gap-1 px-6 py-3 font-semibold transition-colors z-10
          ${enabled ? "cursor-pointer hover:text-gray-200" : "cursor-not-allowed opacity-50"}
          ${tab === value ? "text-white" : "text-gray-400 "}`}
        onClick={() => setTab(value)}
      >
        {name}
      </button>}
      {!enabled && 
      <button
        className={`relative text-gray-500 w-[100px] flex items-center gap-1 px-6 py-3 font-semibold transition-colors z-10
          ${enabled ? "cursor-pointer hover:text-gray-200" : "cursor-not-allowed opacity-50"}`}
        >{name}
        </button>}
      </>
    );
  }