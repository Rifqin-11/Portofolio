import { navLinks } from "../constants";
import type { ProfileContent, SocialLink } from "../lib/portfolio-types";

type FooterProps = {
  profile: ProfileContent;
  socialLinks: SocialLink[];
};

const Footer = ({ profile, socialLinks }: FooterProps) => {
  const websiteUrl = profile.website.startsWith("http")
    ? profile.website
    : `https://${profile.website}`;

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
      links: socialLinks.map((socialImg) => ({
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
              {socialLinks.map((socialImg) => (
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
              <p>{profile.location}</p>
              <a href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.website}
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
            © {new Date().getFullYear()} {profile.brandName}
          </p>
          <a href="#contact">{profile.contactCta}</a>
        </div>

        <h2 className="footer-name" aria-label="Rifqi Naufal">
          {profile.footerName}
        </h2>
      </div>
    </footer>
  );
};

export default Footer;
