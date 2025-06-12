interface Location {
  id: number;
  name: string;
  address: string;
  image: string;
  hours: {
    weekdays: string;
    weekends: string;
  };
}

export default function LocationsSection() {
  const locations: Location[] = [
    {
      id: 1,
      name: "Downtown",
      address: "123 Main Street, Suite 100",
      image:
        "https://images.unsplash.com/photo-1463797221720-6b07e6426c24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      hours: {
        weekdays: "Mon-Fri: 6:30AM-8PM",
        weekends: "Sat-Sun: 7AM-9PM",
      },
    },
    {
      id: 2,
      name: "Riverside",
      address: "450 Riverwalk Boulevard",
      image:
        "https://images.unsplash.com/photo-1505275350441-83dcda8eeef5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      hours: {
        weekdays: "Mon-Fri: 7AM-8PM",
        weekends: "Sat-Sun: 8AM-9PM",
      },
    },
    {
      id: 3,
      name: "University",
      address: "89 Campus Plaza",
      image:
        "https://images.unsplash.com/photo-1519642918688-7e43b19245d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      hours: {
        weekdays: "Mon-Fri: 6AM-10PM",
        weekends: "Sat-Sun: 7AM-9PM",
      },
    },
  ];

  return (
    <section id="locations" className="py-20 bg-[#f9f5f0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="display-font text-4xl font-bold mb-4">
            Our Locations
          </h2>
          <div className="w-24 h-1 gradient-bg rounded-full mx-auto animate-gradient"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Visit one of our thoughtfully designed spaces to experience coffee
            in a welcoming atmosphere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={location.image}
                  alt={`${location.name} Location`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{location.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{location.address}</p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <i className="fas fa-clock mr-2"></i>
                  <span>{location.hours.weekdays}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <i className="fas fa-clock mr-2"></i>
                  <span>{location.hours.weekends}</span>
                </div>
                <a
                  href="#"
                  className="mt-4 inline-block text-[#c08450] hover:text-[#9a6c3e] text-sm font-medium transition"
                >
                  Get Directions{" "}
                  <i className="fas fa-arrow-right ml-1 text-xs"></i>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center text-[#c08450] hover:text-[#9a6c3e] font-medium transition"
          >
            View All Locations
            <i className="fas fa-chevron-right ml-2"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
