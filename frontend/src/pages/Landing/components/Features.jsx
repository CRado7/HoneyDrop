const features = [
  {
    title: 'Total Customization',
    desc: 'Build freely with no template limits.',
  },
  {
    title: 'No Lock-In',
    desc: 'Export clean HTML, CSS, and assets anytime.',
  },
  {
    title: 'Fast & Lightweight',
    desc: 'Optimized for performance and loading speed.',
  },
  {
    title: 'Transparent Pricing',
    desc: 'No surprises—everything you need upfront.',
  },
  {
    title: 'Dev-Ready',
    desc: 'Inject custom code and logic easily.',
  },
  {
    title: 'SEO & Accessibility',
    desc: 'Standards-compliant out of the box.',
  },
];

const Features = () => {
  return (
    <section className="py-5 px-3">
      <h2 className="text-center fw-semibold mb-4" style={{ fontSize: '2rem', color: 'var(--bee-black)' }}>
        Why Honeydrop?
      </h2>
      <div className="container">
        <div className="row g-4 justify-content-center">
          {features.map((feat, idx) => (
            <div className="col-md-6" key={idx}>
              <div className="p-4 border rounded-4 shadow-sm h-100" style={{ borderColor: 'var(--butter-beige)', backgroundColor: 'white' }}>
                <h3 className="h5 fw-bold mb-2" style={{ color: 'var(--golden-honey)' }}>{feat.title}</h3>
                <p style={{ color: 'var(--bee-black)' }}>{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

  