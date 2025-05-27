export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="hero-section flex items-center justify-center text-white relative overflow-hidden"
      style={{
        background: `linear-gradient(rgba(30, 30, 30, 0.4), rgba(30, 30, 30, 0.4)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        minHeight: "800px",
      }}
    >
      <div className="absolute w-full h-full bg-black/20"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 text-center relative z-10">
        <div className="mb-6 text-sm tracking-widest text-white/70">
          PREMIUM COFFEE EXPERIENCE
        </div>
        <h1 className="display-font text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="gradient-text animate-gradient">Artisan</span>
          <br />
          Coffee Craftsmanship
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
          Savor the exceptional taste of our hand-selected, specialty grade
          coffee beans roasted to perfection by our master roasters.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => scrollToSection("menu")}
            className="btn-cta text-white font-semibold py-4 px-10 rounded-full inline-flex items-center justify-center"
          >
            View Our Menu <i className="fas fa-chevron-right ml-2 text-sm"></i>
          </button>
          <button
            onClick={() => scrollToSection("order")}
            className="border-2 border-white/40 text-white font-semibold py-4 px-10 rounded-full hover:border-white/80 transition inline-flex items-center justify-center"
          >
            <i className="fas fa-mobile-screen-button mr-2"></i> Order Now
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 text-center animate-bounce">
        <button
          onClick={() => scrollToSection("about")}
          className="text-white/60 hover:text-white transition"
        >
          <i className="fas fa-chevron-down text-xl"></i>
        </button>
      </div>
    </section>
  );
}
