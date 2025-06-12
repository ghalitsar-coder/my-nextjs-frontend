export default function AboutSection() {
  const features = [
    {
      icon: "fas fa-leaf",
      title: "Sustainable Sourcing",
      description:
        "Direct relationships with farmers using ethical, organic practices.",
    },
    {
      icon: "fas fa-fire-flame-curved",
      title: "Small Batch Roasting",
      description:
        "Precision roasted in micro-batches for peak flavor development.",
    },
    {
      icon: "fas fa-handshake",
      title: "Community Focused",
      description:
        "Local partnerships & education to grow appreciation for quality coffee.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-[#f9f5f0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl animate-float">
              <img
                src="https://images.unsplash.com/photo-1512034400317-de97d7a83c31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Our Coffee Shop"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-xl shadow-lg w-3/4 hidden lg:block">
              <h4 className="display-font font-bold mb-2">Since 2010</h4>
              <p className="text-sm text-gray-600">
                Passion for perfect coffee
              </p>
            </div>
          </div>
          <div>
            <h2 className="display-font text-4xl font-bold mb-6">
              Our Coffee Journey
            </h2>
            <div className="w-24 h-1 gradient-bg rounded-full animate-gradient mb-6"></div>
            <p className="text-gray-600 mb-6">
              What began as a small roasting experiment in a basement has
              blossomed into a celebration of coffee craftsmanship. Our journey
              has taken us to remote coffee farms across three continents in
              pursuit of the perfect bean.
            </p>
            <p className="text-gray-600 mb-8">
              Each roast tells a story - of the farmers who nurtured the crop,
              the landscapes that shaped its flavor, and the meticulous craft
              that transforms green beans into exceptional coffee.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex">
                  <div className="text-[#c08450] text-2xl mr-4">
                    <i className={feature.icon}></i>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
