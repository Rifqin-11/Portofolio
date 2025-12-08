import ProfileCard from "./ProfileCard";

const ContactExperience = () => {
  return (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center">
      <ProfileCard
        name="Rifqi Naufal"
        title="Software Developer"
        handle="rifqin11_"
        status="Online"
        contactText="Contact Me"
        avatarUrl="/images/card.png"
        miniAvatarUrl="/images/card.png"
        showUserInfo={true}
        enableTilt={true}
        enableMobileTilt={true}
        iconUrl="/images/code.svg"
        onContactClick={() => {
          // Scroll to contact form or similar action
          document
            .getElementById("contact")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
};

export default ContactExperience;
