import {
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  FileCode2,
  FileJson,
  FileText,
  PanelRight,
  Play,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const Artifact = ({ artifacts = [] }) => {
  const [hideArtifact, setHideArtifact] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const project = artifacts?.[0];
  const files = project?.files ?? [];

  const activeFile = selectedFile
    ? files.find((file) => file.name === selectedFile)
    : files[0];

  const language = useMemo(() => {
    if (!activeFile?.name) return "text";

    const extension = activeFile.name
      .split(".")
      .pop()
      ?.toLowerCase();

    const languages = {
      html: "html",
      htm: "html",
      css: "css",
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "tsx",
      json: "json",
      md: "markdown",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      sql: "sql",
      xml: "xml",
      sh: "bash",
    };

    return languages[extension] || "text";
  }, [activeFile]);

  const copyCode = async () => {
    if (!activeFile?.content) return;

    try {
      await navigator.clipboard.writeText(activeFile.content);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const getFileIcon = (fileName) => {
    if (fileName.endsWith(".html")) {
      return <FileCode2 size={15} />;
    }

    if (
      fileName.endsWith(".json") ||
      fileName.endsWith(".js") ||
      fileName.endsWith(".jsx")
    ) {
      return <FileJson size={15} />;
    }

    return <FileText size={15} />;
  };

  const getFileColor = (fileName) => {
    if (fileName.endsWith(".html")) return "text-orange-400";
    if (fileName.endsWith(".css")) return "text-blue-400";
    if (
      fileName.endsWith(".js") ||
      fileName.endsWith(".jsx")
    ) {
      return "text-yellow-300";
    }

    if (
      fileName.endsWith(".ts") ||
      fileName.endsWith(".tsx")
    ) {
      return "text-blue-400";
    }

    if (fileName.endsWith(".json")) return "text-yellow-200";

    return "text-gray-400";
  };

  const getPreview = () => {
    const html =
      files.find((file) => file.name === "index.html")
        ?.content || "";

    const css =
      files.find((file) => file.name === "style.css")
        ?.content || "";

    const js =
      files.find((file) => file.name === "script.js")
        ?.content || "";

    return html
      .replace(
        "</head>",
        `<style>${css}</style></head>`
      )
      .replace(
        "</body>",
        `<script>${js}</script></body>`
      );
  };

  if (hideArtifact) {
    return (
      <div className="flex h-full w-10 shrink-0 items-start justify-center border-l border-white/[0.08] bg-[#171717] pt-4">
        <button
          onClick={() => setHideArtifact(false)}
          className="rounded-md p-2 text-white/40 transition hover:bg-white/[0.06] hover:text-white"
          title="Open artifact"
        >
          <PanelRight size={17} />
        </button>
      </div>
    );
  }

  return (
    <aside className="hidden h-full w-[520px] shrink-0 flex-col overflow-hidden border-l border-white/[0.08] bg-[#171717] lg:flex">

      {/* Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#171717] px-4">

        <div className="flex items-center gap-2.5">

          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06]">
            <Code2
              size={15}
              className="text-white/70"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">
              {project?.title || "Artifact"}
            </span>

            {files.length > 0 && (
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/40">
                {files.length} files
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setHideArtifact(true)}
          className="rounded-md p-1.5 text-white/40 transition hover:bg-white/[0.06] hover:text-white"
          title="Close artifact"
        >
          <X size={16} />
        </button>
      </div>

      {files.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="text-center">

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05]">
              <Code2
                size={22}
                className="text-white/30"
              />
            </div>

            <p className="text-sm font-medium text-white/70">
              No artifact generated
            </p>

            <p className="mt-1 max-w-[260px] text-xs leading-5 text-white/30">
              AI-generated files and previews will appear here.
            </p>

          </div>
        </div>
      ) : (
        <>

          {/* Explorer */}
          <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/[0.07] bg-[#171717] px-3">
            <ChevronDown
              size={13}
              className="text-white/40"
            />

            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
              Files
            </span>
          </div>

          <div className="max-h-32 shrink-0 overflow-y-auto border-b border-white/[0.07] bg-[#171717] py-1">

            {files.map((file) => {
              const active =
                activeFile?.name === file.name;

              return (
                <button
                  key={file.name}
                  onClick={() => {
                    setSelectedFile(file.name);
                    setShowPreview(false);
                  }}
                  className={`
                    group flex w-full items-center gap-2
                    px-4 py-1.5 text-left text-xs
                    transition
                    ${
                      active
                        ? "bg-white/[0.08] text-white"
                        : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                    }
                  `}
                >

                  {active ? (
                    <ChevronDown
                      size={11}
                      className="text-white/30"
                    />
                  ) : (
                    <ChevronRight
                      size={11}
                      className="text-white/20"
                    />
                  )}

                  <span className={getFileColor(file.name)}>
                    {getFileIcon(file.name)}
                  </span>

                  <span className="truncate">
                    {file.name}
                  </span>

                </button>
              );
            })}

          </div>

          {/* File Tabs */}
          <div className="flex h-10 shrink-0 overflow-x-auto border-b border-white/[0.08] bg-[#141414]">

            {files.map((file) => {
              const active =
                activeFile?.name === file.name;

              return (
                <button
                  key={file.name}
                  onClick={() => {
                    setSelectedFile(file.name);
                    setShowPreview(false);
                  }}
                  className={`
                    relative flex min-w-fit items-center gap-2
                    border-r border-white/[0.06]
                    px-3 text-[11px]
                    transition
                    ${
                      active
                        ? "bg-[#1e1e1e] text-white"
                        : "text-white/35 hover:bg-white/[0.03] hover:text-white/60"
                    }
                  `}
                >

                  <span className={getFileColor(file.name)}>
                    {getFileIcon(file.name)}
                  </span>

                  {file.name}

                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/70" />
                  )}

                </button>
              );
            })}

          </div>

          {/* Toolbar */}
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#1e1e1e] px-3">

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-white/35">
                {activeFile?.name}
              </span>

              <span className="text-[10px] text-white/20">
                {language}
              </span>
            </div>

            <div className="flex items-center gap-1">

              {activeFile?.name === "index.html" && (
                <button
                  onClick={() =>
                    setShowPreview(!showPreview)
                  }
                  className={`
                    flex items-center gap-1.5 rounded-md
                    px-2 py-1.5 text-[11px]
                    transition
                    ${
                      showPreview
                        ? "bg-white/[0.1] text-white"
                        : "text-white/40 hover:bg-white/[0.06] hover:text-white"
                    }
                  `}
                  title="Preview"
                >
                  <Play size={11} />
                  Preview
                </button>
              )}

              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
              >
                {copied ? (
                  <>
                    <Check
                      size={12}
                      className="text-green-400"
                    />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy
                  </>
                )}
              </button>

            </div>
          </div>

          {/* Preview */}
          {showPreview ? (
            <div className="flex min-h-0 flex-1 bg-white">

              <iframe
                title="Artifact Preview"
                srcDoc={getPreview()}
                className="h-full w-full border-0"
                sandbox="allow-scripts"
              />

            </div>
          ) : (
            /* Code */
            <div className="min-h-0 flex-1 overflow-auto bg-[#1e1e1e]">

              {activeFile && (
                <SyntaxHighlighter
                  language={language}
                  style={vscDarkPlus}
                  showLineNumbers
                  wrapLongLines
                  customStyle={{
                    margin: 0,
                    minHeight: "100%",
                    background: "#1e1e1e",
                    fontSize: "12px",
                    lineHeight: "1.65",
                    padding: "14px 0",
                  }}
                  lineNumberStyle={{
                    color: "#858585",
                    minWidth: "42px",
                    paddingRight: "16px",
                    textAlign: "right",
                    userSelect: "none",
                    opacity: 0.5,
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily:
                        "JetBrains Mono, Fira Code, Consolas, monospace",
                      fontFeatureSettings:
                        '"liga" 1',
                    },
                  }}
                >
                  {activeFile.content}
                </SyntaxHighlighter>
              )}

            </div>
          )}

        </>
      )}
    </aside>
  );
};

export default Artifact;