import { useState } from "react";
import {
  Code,
  
    PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { useSelector } from "react-redux";

function Artifact() {
  const [collapsed, setCollapsed] = useState(false);

  const { artifact } = useSelector((state) => state.message);

  const artifacts = Array.isArray(artifact) ? artifact : [];

  // Collapsed rail — just a button to re-expand
  if (collapsed) {
    return (
      <div
        className="
          hidden
          lg:flex
          h-full
          w-10
          shrink-0
          flex-col
          items-center
          border-l
          border-white/6
          bg-[#0d0f14]
          py-3
        "
      >
        <button
          onClick={() => setCollapsed(false)}
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-md
            border
            border-transparent
            text-slate-500
            transition-all
            duration-200
            hover:border-white/6
            hover:bg-white/5
            hover:text-slate-200
          "
        >
          <PanelRightOpen size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      className="
        hidden
        lg:flex
        h-full
        w-75
        shrink-0
        flex-col
        overflow-hidden
        border-l
        border-white/6
        bg-[#0d0f14]
      "
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div
          className="
            flex
            h-12
            shrink-0
            items-center
            gap-3
            border-b
            border-white/6
            px-3
          "
        >
          <button
            onClick={() => setCollapsed(true)}
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-md
              border
              border-transparent
              text-slate-500
              transition-all
              duration-200
              hover:border-white/6
              hover:bg-white/5
              hover:text-slate-200
            "
          >
            <PanelRightClose size={16} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-slate-200">
              Artifacts
            </div>
            <div className="text-[10px] text-slate-500">
              {artifacts.length} item{artifacts.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Content — list of all artifacts */}
        <div className="flex-1 overflow-auto p-3 space-y-3">
          {artifacts.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-xs text-slate-500">No artifact</p>
            </div>
          )}

          {artifacts.map((item, idx) => {
            const isImage = item.type === "image" && item.url;
            const key = item.id ?? item.url ?? item.filename ?? idx;

            return (
              <div key={key}>
                {isImage ? (
                  <div
                    className="
                      overflow-hidden
                      rounded-lg
                      border
                      border-white/6
                      bg-[#111318]
                    "
                  >
                    <div className="p-2">
                      <img
                        src={item.url}
                        alt={item.prompt || "Generated image"}
                        className="
                          block
                          w-full
                          h-auto
                          rounded-md
                          object-contain
                        "
                        onError={(e) => {
                          console.error("Image failed:", item.url);
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>

                    <div className="border-t border-white/6 p-3">
                      <p className="truncate text-xs font-medium text-slate-300">
                        {item.filename || "Generated Image"}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Generated image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="
                      rounded-lg
                      border
                      border-white/6
                      bg-[#111318]
                      p-3
                      transition
                      hover:border-white/10
                    "
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-md
                          bg-white/5
                          text-slate-400
                        "
                      >
                        <Code size={15} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-slate-300">
                          {item.title || item.filename || "Untitled Artifact"}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-500">
                          Generated code
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Artifact;