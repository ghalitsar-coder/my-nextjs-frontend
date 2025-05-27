export default function Footer() {
  const footerSections = [
    {
      title: "Explore",
      links: [
        { name: "Our Story", href: "#" },
        { name: "Coffee Making", href: "#" },
        { name: "Sustainability", href: "#" },
        { name: "Careers", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "FAQ", href: "#" },
        { name: "Contact Us", href: "#" },
        { name: "Shipping & Returns", href: "#" },
        { name: "Order Status", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: "fab fa-facebook-f", href: "#" },
    { icon: "fab fa-twitter", href: "#" },
    { icon: "fab fa-instagram", href: "#" },
    { icon: "fab fa-tiktok", href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4 display-font">Lavazza</h3>
            <p className="text-gray-400 mb-6">
              Elevating coffee culture through craftsmanship, quality, and
              community.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition"
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-bold text-gray-100 mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2023 Lavazza Coffee Co. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition"
            >
              Accessibility
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition"
            >
              Modern Slavery Statement
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
