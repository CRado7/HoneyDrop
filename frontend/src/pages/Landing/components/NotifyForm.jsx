const SignupForm = () => {
  return (
    <section
      className="py-5 px-3 text-center"
      style={{ backgroundColor: 'var(--golden-honey)', color: 'var(--bee-black)' }}
    >
      <h2 className="h4 fw-bold mb-3">Be the first to know</h2>
      <p className="mb-4">
        Get early access and updates when Honeydrop launches.
      </p>
      <form className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-3">
        <input
          type="email"
          placeholder="you@email.com"
          className="form-control rounded-pill w-auto"
          style={{ maxWidth: '250px' }}
        />
        <button
          type="submit"
          className="btn rounded-pill fw-semibold"
          style={{ backgroundColor: 'var(--bee-black)', color: 'var(--cream-white)' }}
        >
          Notify Me
        </button>
      </form>
    </section>
  );
};

export default SignupForm;

  