export default function CallToActionSection() {
  return (
    <section
      id="order"
      className="py-20 gradient-bg text-white animate-gradient"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="display-font text-4xl font-bold mb-6">
          Experience the Difference
        </h2>
        <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
          Download our app to order ahead, earn rewards, and discover limited
          edition seasonal specials.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-full inline-flex items-center justify-center border border-white/20 transition"
          >
            <i className="fab fa-apple text-xl mr-3"></i> App Store
          </a>
          <a
            href="#"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-full inline-flex items-center justify-center border border-white/20 transition"
          >
            <i className="fab fa-google-play text-xl mr-3"></i> Play Store
          </a>
        </div>
      </div>
    </section>
  );
}
