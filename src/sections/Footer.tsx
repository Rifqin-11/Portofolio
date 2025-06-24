import { socialImgs } from "../constants";

const Footer = () => {
  return (
    <footer className="footer ">
      <div className="footer-container ">
        <div className="flex flex-col justify-center "></div>
        <div className="socials ">
          {socialImgs.map((socialImg, index) => (
            <a
              href={socialImg.link}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              className="icon "
            >
              <img src={socialImg.imgPath} alt="social icon" />
            </a>
          ))}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-center md:text-end">
            © {new Date().getFullYear()} Rifqin11
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
