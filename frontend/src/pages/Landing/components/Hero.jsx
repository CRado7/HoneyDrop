const Hero = () => {
  return (
    <section
      className="py-5 px-3 text-center"
      style={{ backgroundColor: 'var(--butter-beige)' }}
    >
      <h1
        className="display-3 fw-bold mb-3"
        style={{ color: 'var(--bee-black)' }}
      >
        Honeydrop
      </h1>
      <p className="fs-4" style={{ color: 'var(--bee-black)' }}>
        Simple, sweet, done.
      </p>
      <p
        className="fst-italic fs-6 mt-2"
        style={{ color: 'var(--soft-sage)' }}
      >
        So simple, it’s sweet.
      </p>
    </section>
  );
};

export default Hero;
