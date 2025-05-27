interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  comment: string;
  rating: number;
}

export default function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah K.",
      role: "Coffee Enthusiast",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      comment:
        "The attention to detail in every cup is remarkable. I've traveled the world tasting coffee, and Lavazza's single-origin pour overs stand with the best I've had.",
      rating: 5,
    },
    {
      id: 2,
      name: "James L.",
      role: "Daily Customer",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      comment:
        "As a remote worker, this is my office away from home. Consistent quality, great WiFi, and the friendliest baristas who remember my usual order.",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Maya S.",
      role: "First-time Visitor",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      comment:
        "The seasonal honey lavender latte was divine! The barista took time to explain the flavor notes. I'll definitely be back to explore more of their menu.",
      rating: 5,
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    return stars;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="display-font text-4xl font-bold mb-4">
            What People Say
          </h2>
          <div className="w-24 h-1 gradient-bg rounded-full mx-auto animate-gradient"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-[#f9f5f0] p-8 rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">{testimonial.comment}</p>
              <div className="flex text-amber-400">
                {renderStars(testimonial.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
