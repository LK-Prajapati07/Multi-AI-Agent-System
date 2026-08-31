import { useState } from "react";
import {
  Code,
  Image as ImageIcon,
  PanelRightClose,
} from "lucide-react";
import { useSelector } from "react-redux";

function Artifact() {
  // eslint-disable-next-line no-unused-vars
  const [collpse, setcollpse] = useState(true);

  const { artifact } = useSelector(
    (state) => state.message
  );

  // Get latest artifact
  const currentArtifact =
    artifact?.[artifact.length - 1];

  // No artifact
  if (!currentArtifact) {
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
        <div className="flex h-full items-center justify-center">
          <p className="text-xs text-slate-500">
            No artifact
          </p>
        </div>
      </div>
    );
  }

  const isImage =
    currentArtifact.type === "image" &&
    currentArtifact.url;

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
          {/* Collapse Button */}
          <button
            onClick={() => setcollpse(false)}
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

          {/* Title */}
          <div className="flex min-w-0 flex-1 items-center gap-2">

            <div
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-md
                bg-white/5
                text-slate-400
              "
            >
              {isImage ? (
                <ImageIcon size={15} />
              ) : (
                <Code size={15} />
              )}
            </div>

            <div className="min-w-0">

              <div className="truncate text-[13px] font-medium text-slate-200">
                {currentArtifact.title ||
                  currentArtifact.filename ||
                  (isImage
                    ? "Generated Image"
                    : "Artifact")}
              </div>

              <div className="text-[10px] text-slate-500">
                {isImage ? "Image" : "Code"}
              </div>

            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-3">

          {/* ======================================
              IMAGE ARTIFACT
          ======================================= */}

          {isImage && (
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
                  src={currentArtifact.url}
                  alt={
                    currentArtifact.prompt ||
                    "Generated image"
                  }
                  className="
                    block
                    w-full
                    h-auto
                    rounded-md
                    object-contain
                  "
                  onLoad={() => {
                    console.log(
                      "Image loaded:",
                      currentArtifact.url
                    );
                  }}
                  onError={() => {
                    console.error(
                      "Image failed:",
                      currentArtifact.url
                    );
                  }}
                />

              </div>

              {/* Image Information */}
              <div
                className="
                  border-t
                  border-white/6
                  p-3
                "
              >
                <p className="truncate text-xs font-medium text-slate-300">
                  {currentArtifact.filename ||
                    "Generated Image"}
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  Generated image
                </p>
              </div>
            </div>
          )}

          {/* ======================================
              CODE ARTIFACT
          ======================================= */}

          {!isImage && (
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
                    {currentArtifact.title ||
                      "Untitled Artifact"}
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Generated code
                  </p>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Artifact;