import logo from "../assets/logo.svg";

function Hero() {
  return (
    <header className="w-full flex justify-center items-center flex-col font-mono">
      <nav className="flex justify-between items-center w-full mb-10 pt-3">
        <img src={logo} alt="Logo" className="object-contain w-28" />
        <a
          href="https://github.com/ALTal77/AI-Summarizer"
          target="_blank"
          rel="noopener noreferrer"
          className="black_btn cursor-pointer"
        >
          GitHub
        </a>{" "}
      </nav>

      <h1 className="head_text">
        Summarize Articles with <br className="max-md:hidden" />
        <span className="orange_gradient">OpenAI GPT-4</span>
      </h1>

      <p className="desc">
        Simplify your reading with Summarizer, an open-source AI-powered article
        summarization tool.
      </p>
    </header>
  );
}

export default Hero;
