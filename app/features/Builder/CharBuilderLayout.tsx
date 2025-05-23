import CharacterPrompts from './CharacterPrompts';
import CharacterCard from './CharacterCard';
import BuilderAction from './BuilderAction';
import CharacterSketchGrid from './CharacterSketchGrid';

export default function CharBuilderLayout() {
  return (
    <div className="flex flex-row bg-gray-900 h-[90vh] text-white overflow-y-scroll w-full justify-between mb-2">
        <CharacterCard />
        <div className="flex-1 flex flex-col
        gap-4 p-4 border-x border-sky-900/30 relative min-w-[500px] xl:min-w-[700px] max-w-[1700px]">
          <CharacterSketchGrid />
          <BuilderAction />
        </div>
        <CharacterPrompts />
    </div>
  );
}