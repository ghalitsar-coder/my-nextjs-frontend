export default function SpecialtyCards() {
  const specialties = [
    {
      icon: "fas fa-seedling",
      title: "Single Origin",
      description:
        "Traceable beans from sustainable farms with unique regional flavors.",
      link: "Explore Origins",
    },
    {
      icon: "fas fa-fire-flame-curved",
      title: "Specialty Roasts",
      description:
        "Precision roasted in small batches daily for peak freshness.",
      link: "View Roasts",
    },
    {
      icon: "fas fa-hand-holding-heart",
      title: "Sustainable",
      description: "Ethically sourced with fair trade partnerships worldwide.",
      link: "Our Promise",
    },
  ];

  return (
    <section id="specialties" className="py-16 px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-40 z-10 relative">
          {specialties.map((specialty, index) => (
            <div
              key={index}
              className="coffee-card rounded-2xl p-8 bg-white/80 shadow-lg"
            >
              <div className="w-16 h-16 rounded-full bg-[#c08450]/10 flex items-center justify-center mb-6">
                <i className={`${specialty.icon} text-2xl text-[#c08450]`}></i>
              </div>
              <h3 className="text-xl font-bold mb-3 display-font">
                {specialty.title}
              </h3>
              <p className="text-gray-600 mb-6">{specialty.description}</p>
              <a
                href="#"
                className="text-[#c08450] font-medium inline-flex items-center hover:text-[#9a6c3e] transition"
              >
                {specialty.link}{" "}
                <i className="fas fa-arrow-right ml-2 text-xs"></i>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
