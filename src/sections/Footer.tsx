import { navLinks, socialImgs } from "../constants";

const Footer = () => {
  const socialNames: Record<string, string> = {
    insta: "Instagram",
    x: "X",
    linkedin: "LinkedIn",
    github: "GitHub",
  };

  const footerLinks = [
    {
      title: "Menu",
      links: [...navLinks, { name: "Contact", link: "#contact" }],
    },
    {
      title: "Connect",
      links: socialImgs.map((socialImg) => ({
        name: socialNames[socialImg.name] ?? socialImg.name,
        link: socialImg.link,
      })),
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-intro">
            <div className="socials">
              {socialImgs.map((socialImg) => (
                <a
                  href={socialImg.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={socialImg.name}
                  className={`icon icon-${socialImg.name}`}
                  aria-label={socialImg.name}
                >
                  <img src={socialImg.imgPath} alt="" />
                </a>
              ))}
            </div>

            <div className="footer-contact">
              <p>Semarang, Indonesia</p>
              <a href="mailto:rifqinaufal9009@gmail.com">
                rifqinaufal9009@gmail.com
              </a>
              <a
                href="https://rifqinaufal.tech"
                target="_blank"
                rel="noopener noreferrer"
              >
                rifqinaufal.tech
              </a>
            </div>
          </div>

          <div className="footer-links">
            {footerLinks.map((group) => (
              <div key={group.title} className="footer-link-group">
                <p>{group.title}</p>
                {group.links.map((link) => (
                  <a
                    key={link.name}
                    href={link.link}
                    target={link.link.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.link.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Rifqin11
          </p>
          <a href="#contact">Let&apos;s work together</a>
        </div>

        <h2 className="footer-name" aria-label="Rifqi Naufal">
          RIFQI NAUFAL
        </h2>
      </div>
    </footer>
  );
};

export default Footer;
