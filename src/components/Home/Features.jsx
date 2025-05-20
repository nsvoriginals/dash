export const Features = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center font-satoshi gap-20 px-4 py-10 bg-[#131515]">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center font-bold text-white">
        Features
      </h1>

      {[
        {
          title: "Authentication",
          text: "Users must be authenticated to access the platform's services, ensuring security and privacy.",
          img: "https://static.vecteezy.com/system/resources/previews/046/863/227/non_2x/a-linear-mini-illustration-of-user-authentication-vector.jpg",
          imgFirst: true,
        },
        {
          title: "Interview Questions Generator",
          text: "Users can generate and customize interview questions based on their resume and career goals.",
          img: "https://blog.internshala.com/wp-content/uploads/2019/04/Explore-Common-Interview-Questions-to-Ace-Any-Interview.jpg",
          imgFirst: false,
        },
        {
          title: "ATS Tracking",
          text: "Get insights into how your resume performs against Applicant Tracking Systems (ATS).",
          img: "https://img.freepik.com/free-vector/choice-worker-concept-illustrated_52683-44076.jpg?uid=R93846244&ga=GA1.1.312657223.1728147925&semt=ais_hybrid",
          imgFirst: true,
        },
        {
          title: "Resume Optimization",
          text: "Improve your resume with AI-driven insights to increase your chances of landing a job.",
          img: "https://media.istockphoto.com/id/1137470880/vector/people-vector-illustration-flat-cartoon-character-landing-page-template.jpg?s=612x612&w=0&k=20&c=_HPRNiholF1vID12DPaip2xqGJYBQmQvB4wXZ4psES8=",
          imgFirst: false,
        },
      ].map(({ title, text, img, imgFirst }, index) => (
        <div
          key={index}
          className={`flex flex-col ${
            imgFirst ? "lg:flex-row" : "lg:flex-row-reverse"
          } items-center justify-center gap-10 w-full max-w-6xl`}
        >
          {/* Image */}
          <img
            src={img}
            alt={`${title} Illustration`}
            className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%] object-contain border-2 border-blue-500 rounded-2xl"
          />

          {/* Text */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left px-4">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
              {title}
            </h3>
            <p className="mt-3 text-base sm:text-lg md:text-xl text-gray-300 max-w-xl">
              {text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};