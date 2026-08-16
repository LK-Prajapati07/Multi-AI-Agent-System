import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

const Globe = lazy(() => import("react-globe.gl"));


const CosmicHome = () => {
  const globeRef = useRef(null);
  const [globeSize, setGlobeSize] = useState(500);

  useEffect(() => {
    const updateGlobeSize = () => {
      const width = window.innerWidth;

      if (width < 480) {
        setGlobeSize(280);
      } else if (width < 640) {
        setGlobeSize(320);
      } else if (width < 768) {
        setGlobeSize(390);
      } else {
        setGlobeSize(500);
      }
    };

    updateGlobeSize();

    window.addEventListener("resize", updateGlobeSize);

    return () => {
      window.removeEventListener("resize", updateGlobeSize);
    };
  }, []);

  // =========================================================
  // STARS
  // =========================================================

  const stars = useMemo(() => {
    return Array.from({ length: 140 }, (_, i) => ({
      id: i,
      size:
        i % 12 === 0
          ? 3
          : i % 5 === 0
            ? 2
            : 1,

      left: `${(i * 43.17) % 100}%`,
      top: `${(i * 71.39) % 100}%`,

      duration: 2 + (i % 5),
      delay: (i % 9) * 0.4,
    }));
  }, []);

  // =========================================================
  // GLOBE
  // =========================================================

  useEffect(() => {
    if (!globeRef.current) return;

    globeRef.current.pointOfView(
      {
        lat: 22.5,
        lng: 78.9,
        altitude: 1.55,
      },
      1800
    );

    const controls = globeRef.current.controls();

    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.18;

    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = true;

    return () => {
      controls.autoRotate = false;
    };
  }, []);

  // =========================================================
  // COMPONENT
  // =========================================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#010208] text-white">

      {/* =====================================================
          GLOBAL BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 pointer-events-none">

        {/* Deep space */}

        <div
          className="
            absolute
            inset-0
            bg-[#010208]
          "
        />

        {/* Purple energy */}

        <motion.div
          className="
            absolute
            -top-80
            -right-80
            w-175
            h-175
            rounded-full
            bg-purple-700/15
            blur-[160px]
          "
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Cyan energy */}

        <motion.div
          className="
            absolute
            -bottom-80
            -left-80
            w-175
            h-175
            rounded-full
            bg-cyan-600/10
            blur-[160px]
          "
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Central energy */}

        <motion.div
          className="
            absolute
            left-1/2
            top-[42%]
            -translate-x-1/2
            -translate-y-1/2
            w-137.5
            h-137.5
            rounded-full
            bg-indigo-600/6
            blur-[120px]
          "
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* =================================================
            FUTURISTIC GRID
        ================================================== */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.055]
            bg-[linear-gradient(rgba(99,102,241,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,.7)_1px,transparent_1px)]
            bg-size-[45px_45px]
            mask-[radial-gradient(ellipse_at_center,black_15%,transparent_78%)]
          "
        />

        {/* Perspective floor grid */}

        <div
          className="
            absolute
            left-1/2
            bottom-[-35%]
            -translate-x-1/2
            w-[160%]
            h-[70%]
            opacity-[0.07]
            bg-[linear-gradient(rgba(34,211,238,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.5)_1px,transparent_1px)]
            bg-size-[60px_60px]
            transform-[perspective(500px)_rotateX(65deg)]
          "
        />

        {/* =================================================
            STARS
        ================================================== */}

        {stars.map((star) => (
          <motion.span
            key={star.id}
            className="
              absolute
              rounded-full
              bg-white
            "
            style={{
              width: star.size,
              height: star.size,
              left: star.left,
              top: star.top,
              boxShadow:
                star.size > 1
                  ? "0 0 8px rgba(255,255,255,.8)"
                  : "none",
            }}
            animate={{
              opacity: [0.05, 0.9, 0.05],
              scale: [1, 1.8, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* =================================================
            SCANNING LIGHT
        ================================================== */}

        <motion.div
          className="
            absolute
            left-0
            right-0
            h-48
            bg-linear-to-b
            from-transparent
            via-cyan-400/[0.035]
            to-transparent
          "
          animate={{
            y: ["-30vh", "120vh"],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "linear",
          }}
        />

      </div>

      {/* =====================================================
          TOP NAV / AI CORE
      ====================================================== */}

      <motion.header
        className="
          absolute
          top-4
          left-1/2
          -translate-x-1/2
          z-50

          flex
          items-center
          gap-2

          max-w-[calc(100%-24px)]

          rounded-full
          border
          border-cyan-400/15

          bg-black/30
          backdrop-blur-2xl

          px-3
          sm:px-5
          py-2

          shadow-[0_0_40px_rgba(34,211,238,.08)]
        "
        initial={{
          opacity: 0,
          y: -25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
      >

        {/* Status */}

        <motion.span
          className="
            w-2
            h-2
            rounded-full
            bg-emerald-400

            shadow-[0_0_12px_rgba(52,211,153,.9)]
          "
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
          }}
        />

        <span className="
          text-[8px]
          sm:text-[10px]
          tracking-[0.25em]
          text-slate-400
          uppercase
          whitespace-nowrap
        ">
          AGENIS NEURAL CORE
        </span>

        <span className="
          hidden
          sm:block
          text-[9px]
          tracking-widest
          text-emerald-400
        ">
          ONLINE
        </span>

      </motion.header>

      {/* =====================================================
          SIDE SYSTEM HUD
      ====================================================== */}

      <div
        className="
          hidden
          lg:flex

          fixed
          left-6
          top-1/2
          -translate-y-1/2

          z-30

          flex-col
          gap-5

          text-[8px]
          tracking-[0.25em]
          text-slate-600
        "
      >

        <div>
          <p className="text-purple-400/70">
            SYSTEM
          </p>

          <p className="mt-1">
            AGENIS // 01
          </p>
        </div>

        <div>
          <p className="text-cyan-400/70">
            NETWORK
          </p>

          <p className="mt-1">
            GLOBAL
          </p>
        </div>

        <div>
          <p className="text-emerald-400/70">
            STATUS
          </p>

          <p className="mt-1">
            STABLE
          </p>
        </div>

      </div>

      {/* =====================================================
          RIGHT HUD
      ====================================================== */}

      <div
        className="
          hidden
          lg:flex

          fixed
          right-6
          top-1/2
          -translate-y-1/2

          z-30

          flex-col
          items-end
          gap-5

          text-[8px]
          tracking-[0.25em]
          text-slate-600
        "
      >

        <div>
          <p className="text-cyan-400/70">
            LATITUDE
          </p>

          <p className="mt-1">
            22.5°
          </p>
        </div>

        <div>
          <p className="text-purple-400/70">
            LONGITUDE
          </p>

          <p className="mt-1">
            78.9°
          </p>
        </div>

        <div>
          <p className="text-emerald-400/70">
            CONNECTION
          </p>

          <p className="mt-1">
            SECURE
          </p>
        </div>

      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <section
        className="
          relative
          z-10

          min-h-screen

          flex
          flex-col
          items-center

          px-4
          pt-20
          pb-24

          overflow-hidden
        "
      >

        {/* =================================================
            EARTH / HOLOGRAM SYSTEM
        ================================================== */}

        <motion.div
          className="
            relative
            shrink-0
          "
          initial={{
            opacity: 0,
            scale: 0.65,
            y: 50,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 1.4,
            ease: "easeOut",
          }}
        >

          <div
            className="
              relative

              w-72.5
              h-72.5

              xs:w-[320px]
              xs:h-[320px]

              sm:w-95
              sm:h-95

              md:w-125
              md:h-125
            "
          >

            {/* =================================================
                ENERGY CORE
            ================================================== */}

            <motion.div
              className="
                absolute
                inset-[15%]

                rounded-full

                bg-cyan-400/10

                blur-[75px]
              "
              animate={{
                opacity: [0.25, 0.65, 0.25],
                scale: [0.85, 1.1, 0.85],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* =================================================
                ORBIT 1
            ================================================== */}

            <motion.div
              className="
                absolute
                inset-[5%]

                rounded-full

                border
                border-cyan-400/20

                shadow-[0_0_25px_rgba(34,211,238,.06)]
              "
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 28,
                repeat: Infinity,
                ease: "linear",
              }}
            >

              <span
                className="
                  absolute
                  top-1/2
                  -right-1

                  w-2
                  h-2

                  rounded-full

                  bg-cyan-300

                  shadow-[0_0_15px_rgba(34,211,238,1)]
                "
              />

            </motion.div>

            {/* =================================================
                ORBIT 2
            ================================================== */}

            <motion.div
              className="
                absolute
                inset-[10%]

                rounded-full

                border
                border-purple-400/20

                scale-y-[0.42]
              "
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >

              <span
                className="
                  absolute
                  top-1/2
                  -left-1

                  w-2
                  h-2

                  rounded-full

                  bg-purple-300

                  shadow-[0_0_15px_rgba(192,132,252,1)]
                "
              />

            </motion.div>

            {/* =================================================
                ORBIT 3
            ================================================== */}

            <motion.div
              className="
                absolute
                inset-[17%]

                rounded-full

                border
                border-indigo-400/10

                scale-y-[0.25]
              "
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* =================================================
                RADAR CIRCLE
            ================================================== */}

            <motion.div
              className="
                absolute
                inset-[25%]

                rounded-full

                border
                border-cyan-300/10
              "
              animate={{
                scale: [0.8, 1.15, 0.8],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* =================================================
                GLOBE
            ================================================== */}

            <div
              className="
                absolute
                inset-0

                flex
                items-center
                justify-center
              "
            >

              <Suspense
                fallback={
                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      gap-4
                    "
                  >

                    <motion.div
                      className="
                        w-14
                        h-14

                        rounded-full

                        border-2
                        border-cyan-400
                        border-t-transparent

                        shadow-[0_0_35px_rgba(34,211,238,.5)]
                      "
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <span
                      className="
                        text-[8px]
                        tracking-[0.35em]
                        text-cyan-300
                      "
                    >
                      CONNECTING
                    </span>

                  </div>
                }
              >

                <Globe
                  ref={globeRef}
                  width={globeSize}
                  height={globeSize}
                  backgroundColor="rgba(0,0,0,0)"

                  globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"

                  bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

                  showAtmosphere={true}
                  atmosphereColor="#22d3ee"
                  atmosphereAltitude={0.2}

                  enablePointerInteraction={false}
                />

              </Suspense>

            </div>

            {/* =================================================
                TARGETING CORNERS
            ================================================== */}

            <div className="
              absolute
              top-[14%]
              left-[14%]

              w-7
              h-7

              border-t
              border-l
              border-cyan-400/50
            " />

            <div className="
              absolute
              top-[14%]
              right-[14%]

              w-7
              h-7

              border-t
              border-r
              border-cyan-400/50
            " />

            <div className="
              absolute
              bottom-[14%]
              left-[14%]

              w-7
              h-7

              border-b
              border-l
              border-purple-400/50
            " />

            <div className="
              absolute
              bottom-[14%]
              right-[14%]

              w-7
              h-7

              border-b
              border-r
              border-purple-400/50
            " />

            {/* =================================================
                TELEMETRY
            ================================================== */}

            <div
              className="
                absolute
                top-[21%]
                left-[5%]

                text-[7px]
                tracking-[0.2em]

                text-cyan-300/60
              "
            >
              LAT 22.5°
            </div>

            <div
              className="
                absolute
                top-[21%]
                right-[5%]

                text-[7px]
                tracking-[0.2em]

                text-purple-300/60
              "
            >
              LNG 78.9°
            </div>

            <div
              className="
                absolute
                bottom-[21%]
                left-[5%]

                text-[7px]
                tracking-[0.2em]

                text-slate-500
              "
            >
              EARTH // 001
            </div>

            <div
              className="
                absolute
                bottom-[21%]
                right-[5%]

                text-[7px]
                tracking-[0.2em]

                text-emerald-400/70
              "
            >
              SYNCED
            </div>

          </div>

        </motion.div>

        {/* =====================================================
            BRAND
        ====================================================== */}

        <motion.div
          className="
            relative
            z-20

            -mt-3
            sm:-mt-8

            text-center
          "
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.8,
            duration: 0.9,
          }}
        >

          {/* Eyebrow */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              mb-3
            "
          >

            <span className="w-8 sm:w-12 h-px bg-linear-to-r from-transparent to-cyan-400/60" />

            <span
              className="
                text-[8px]
                sm:text-[10px]

                tracking-[0.4em]

                text-cyan-300/80
              "
            >
              FUTURE INTELLIGENCE
            </span>

            <span className="w-8 sm:w-12 h-px bg-linear-to-l from-transparent to-cyan-400/60" />

          </div>

          {/* Main title */}

          <motion.h1
            className="
              text-5xl
              sm:text-6xl
              md:text-8xl

              font-black

              tracking-[-0.04em]

              bg-linear-to-r
              from-cyan-200
              via-violet-300
              to-fuchsia-300

              bg-clip-text
              text-transparent

              select-none
            "
            animate={{
              filter: [
                "drop-shadow(0 0 8px rgba(34,211,238,.15))",
                "drop-shadow(0 0 30px rgba(139,92,246,.45))",
                "drop-shadow(0 0 8px rgba(34,211,238,.15))",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Agenis AI
          </motion.h1>

          <p
            className="
              mt-3

              text-xs
              sm:text-sm
              md:text-base

              text-slate-400

              tracking-wide
            "
          >
            Intelligence beyond imagination.
          </p>

          {/* =================================================
              SYSTEM STATUS
          ================================================== */}

          <div
            className="
              mt-5

              flex
              items-center
              justify-center
              gap-3
              sm:gap-5
            "
          >

            <SystemStatus
              color="purple"
              label="NEURAL"
            />

            <span className="h-3 w-px bg-white/10" />

            <SystemStatus
              color="cyan"
              label="QUANTUM"
            />

            <span className="h-3 w-px bg-white/10" />

            <SystemStatus
              color="emerald"
              label="ONLINE"
            />

          </div>

        </motion.div>

        {/* =====================================================
            COMMAND CENTER
        ====================================================== */}

        <motion.div
          className="
            relative
            z-30

            mt-8
            sm:mt-10

            w-full
            max-w-5xl
          "
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.1,
            duration: 0.9,
          }}
        >

          <div
            className="
              relative

              overflow-hidden

              rounded-2xl
              sm:rounded-3xl

              border
              border-white/8

              bg-white/2.5

              backdrop-blur-2xl

              shadow-[0_0_80px_rgba(76,29,149,.12)]
            "
          >

            {/* Top cyan line */}

            <div
              className="
                absolute
                top-0
                left-1/2
                -translate-x-1/2

                w-1/2
                h-px

                bg-linear-to-r
                from-transparent
                via-cyan-400
                to-transparent
              "
            />

            {/* Header */}

            <div
              className="
                flex
                items-center
                justify-between

                px-4
                sm:px-6

                pt-4
                pb-3
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    items-center
                    justify-center

                    w-7
                    h-7

                    rounded-lg

                    border
                    border-purple-400/20

                    bg-purple-500/10
                  "
                >
                  ✦
                </div>

                <div>

                  <p
                    className="
                      text-[8px]
                      tracking-[0.3em]
                      text-slate-500
                    "
                  >
                    AGENIS COMMAND CENTER
                  </p>

                  <p
                    className="
                      mt-1

                      text-[9px]
                      tracking-wider
                      text-purple-300/70
                    "
                  >
                    SELECT AN INTELLIGENCE MODULE
                  </p>

                </div>

              </div>

              <div
                className="
                  hidden
                  sm:block

                  text-[8px]
                  tracking-[0.25em]
                  text-slate-600
                "
              >
                AI // 04
              </div>

            </div>

            {/* Suggestion cards */}

            <div className="px-2 sm:px-4 pb-4">

              <Suspense
                fallback={
                  <div className="flex justify-center py-8">

                    <div
                      className="
                        w-8
                        h-8

                        rounded-full

                        border-2
                        border-purple-400
                        border-t-transparent

                        animate-spin
                      "
                    />

                  </div>
                }
              >
      
              </Suspense>

            </div>

          </div>

        </motion.div>

      </section>

      {/* =====================================================
          BOTTOM SYSTEM BAR
      ====================================================== */}

      <motion.footer
        className="
          fixed

          bottom-3
          sm:bottom-5

          left-1/2
          -translate-x-1/2

          z-50

          max-w-[calc(100%-24px)]

          flex
          items-center
          justify-center
          gap-2
          sm:gap-4

          rounded-full

          border
          border-white/[0.07]

          bg-black/35

          backdrop-blur-2xl

          px-3
          sm:px-5

          py-2
        "
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1.6,
        }}
      >

        <span
          className="
            text-[7px]
            sm:text-[8px]

            tracking-[0.2em]

            text-slate-600
          "
        >
          INDIA
        </span>

        <span className="text-slate-800">
          •
        </span>

        <span
          className="
            text-[7px]
            sm:text-[8px]

            tracking-[0.2em]

            text-slate-500
          "
        >
          GLOBAL
        </span>

        <span className="text-slate-800">
          •
        </span>

        <span
          className="
            text-[7px]
            sm:text-[8px]

            tracking-[0.2em]

            text-cyan-400/60
          "
        >
          AGENIS
        </span>

        <span className="text-slate-800">
          •
        </span>

        <span
          className="
            text-[7px]
            sm:text-[8px]

            tracking-[0.2em]

            text-purple-400/60
          "
        >
          V1.0
        </span>

      </motion.footer>

    </main>
  );
};

// =========================================================
// SYSTEM STATUS COMPONENT
// =========================================================

const SystemStatus = ({ color, label }) => {

  const colors = {
    purple: {
      dot: "bg-purple-400",
      glow: "shadow-[0_0_9px_rgba(168,85,247,.9)]",
    },

    cyan: {
      dot: "bg-cyan-400",
      glow: "shadow-[0_0_9px_rgba(34,211,238,.9)]",
    },

    emerald: {
      dot: "bg-emerald-400",
      glow: "shadow-[0_0_9px_rgba(52,211,153,.9)]",
    },
  };

  return (
    <div
      className="
        flex
        items-center
        gap-2

        text-[7px]
        sm:text-[8px]

        tracking-[0.25em]

        text-slate-500
      "
    >

      <motion.span
        className={`
          w-1.5
          h-1.5

          rounded-full

          ${colors[color].dot}
          ${colors[color].glow}
        `}
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />

      {label}

    </div>
  );
};

export default CosmicHome;