import { useEffect, useState } from "react";
import Slider from "../slider/slider";

const slides = [
  {
    title: "Generate & Capture Leads Effortlessly",
    text: "Build your client pipeline with smart lead generation tools designed for freelancers who want to grow their business.",
    img: "/slide-1.jpg",
  },
  {
    title: "Manage All Your Customers in One Place",
    text: "Keep client details, project history, and communication organized so you can focus on delivering great work.",
    img: "/slide-2.png",
  },
  {
    title: "Track Progress & Close More Deals",
    text: "Monitor your leads from first contact to conversion with simple, visual dashboards built for solo entrepreneurs.",
    img: "/slide-3.png",
  },
];

function AuthOverlay() {
  const [activeSlider, setActiveSlider] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSlider((prev) => (prev === slides.length -1 ? 0 : prev + 1));
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeSlider]);

  return (
    <div className="h-screen sticky top-0 2xl:w-[45.625%] xl:w-[45%] md:w-[45%] md:block hidden relative">
      {/* Background Image */}
      <img
        key={activeSlider}
        src={slides[activeSlider].img}
        alt={slides[activeSlider].title}
        className="absolute inset-0 w-full h-full object-cover animate-blur-reveal"
      />

      {/* Content Overlay */}
      <div className="relative flex flex-col h-full justify-between gap-6 text-white w-full">
        <h1 className="flex justify-end p-[5%]">
          <img src="/logo.png" alt="Logo" width={140} height={140} />
        </h1>

        <div className="bg-gradient-to-b via-[#00000090] to-[#000000] px-[12%] pb-[18%] pt-[20%]">
          <div className="relative h-[190px] min-[1920px]:h-[140px] overflow-hidden">
            <div
              className="flex relative h-full"
            >
              <Slider slides={slides} activeSlider={activeSlider} />
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-start gap-3">
            {slides.map((_, i) => (
              <button onClick={() => setActiveSlider(i)}
                key={i}
                className={`cursor-pointer duration-500 rounded-lg ${activeSlider === i ? "w-8 h-[6px] bg-[#D4A574]" : "w-5 h-[6px] bg-white"}`}
              ></button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthOverlay;
