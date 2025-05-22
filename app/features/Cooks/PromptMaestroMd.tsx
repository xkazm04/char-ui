import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

type Props = {
    editMode: boolean;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    localPrompt: string;
    updatedPrompt?: string;
    showDiff: boolean;
    setLocalPrompt: (value: string) => void;
}

const PromptMaestroMd = ({ editMode, textareaRef, localPrompt, updatedPrompt, showDiff, setLocalPrompt }: Props) => {
    const highlightDiff = () => {
        if (!updatedPrompt || !showDiff) return localPrompt;

        const lines1 = localPrompt.split('\n');
        const lines2 = updatedPrompt.split('\n');

        let result = '';
        let i = 0;

        while (i < Math.max(lines1.length, lines2.length)) {
            if (i >= lines1.length) {
                result += `**+ ${lines2[i]}**\n`;
            } else if (i >= lines2.length) {
                result += `~~- ${lines1[i]}~~\n`;
            } else if (lines1[i] !== lines2[i]) {
                result += `**${lines2[i]}**\n`;
            } else {
                result += `${lines1[i]}\n`;
            }
            i++;
        }

        return result;
    };

    const fallbackCodeStyle = {
        backgroundColor: '#1E1E1E',
        padding: '1em',
        borderRadius: '4px',
        overflowX: 'auto',
        fontSize: '0.9em',
        lineHeight: 1.5,
        color: '#D4D4D4',
    };

    return (
        <div className="flex-1 overflow-auto p-4">
            {editMode ? (
                <textarea
                    ref={textareaRef}
                    value={localPrompt}
                    onChange={(e) => setLocalPrompt(e.target.value)}
                    className="w-full h-full bg-gray-750 border border-gray-600 focus:border-sky-500 rounded-md p-4 text-gray-200 font-mono text-sm outline-none resize-none"
                    spellCheck={false}
                />
            ) : (
                <div className="prose prose-invert max-w-none prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                
                                if (inline) {
                                    return (
                                        <code 
                                            className="bg-gray-800 px-1 py-0.5 rounded text-sky-300" 
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    );
                                }
                                
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={atomDark}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{
                                            borderRadius: '6px',
                                            padding: '1em',
                                            backgroundColor: '#1E1E1E',
                                            border: '1px solid #333',
                                            marginBottom: '1em',
                                            marginTop: '1em',
                                        }}
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <div style={fallbackCodeStyle} {...props}>
                                        {children}
                                    </div>
                                );
                            },
                            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4 text-sky-300" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-3 mt-6 text-sky-300" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 mt-5 text-sky-300" {...props} />,
                            h4: ({ node, ...props }) => <h4 className="text-base font-bold mb-2 mt-4 text-sky-300" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold text-yellow-300" {...props} />,
                            em: ({ node, ...props }) => <em className="italic text-gray-300" {...props} />,
                            blockquote: ({ node, ...props }) => (
                                <blockquote 
                                    className="border-l-4 border-sky-600 pl-4 py-1 italic bg-gray-800/50 pr-2 rounded-r-md my-4" 
                                    {...props} 
                                />
                            ),
                            ul: ({ node, ...props }) => <ul className="list-disc list-inside pl-4 my-4 space-y-1" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside pl-4 my-4 space-y-1" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                            a: ({ node, ...props }) => <a className="text-sky-400 hover:underline" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                            hr: ({ node, ...props }) => <hr className="my-6 border-gray-700" {...props} />,
                            table: ({ node, ...props }) => <table className="border-collapse table-auto w-full my-4" {...props} />,
                            thead: ({ node, ...props }) => <thead className="bg-gray-800" {...props} />,
                            tbody: ({ node, ...props }) => <tbody className="bg-gray-900/50" {...props} />,
                            tr: ({ node, ...props }) => <tr className="border-b border-gray-700" {...props} />,
                            th: ({ node, ...props }) => <th className="px-4 py-2 text-left" {...props} />,
                            td: ({ node, ...props }) => <td className="px-4 py-2 border-r last:border-r-0 border-gray-700" {...props} />,
                        }}
                    >
                        {showDiff ? highlightDiff() : localPrompt}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default PromptMaestroMd;