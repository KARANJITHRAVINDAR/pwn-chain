import { Leaf, Heart, Sprout } from 'lucide-react';
import LeafDivider from '../components/LeafDivider';

export default function AboutPage() {
  return (
    <div className="min-h-screen">

      {/* Page header */}
      <div className="bg-ivory-dark py-14 text-center border-b border-ivory-dark">
        <span className="text-sage text-xs font-medium uppercase tracking-widest">Our Story</span>
        <h1 className="font-serif text-5xl text-charcoal mt-2 mb-3">About InbaNaturals</h1>
        <LeafDivider />
      </div>

      {/* Founder story */}
      <section id="founder-story" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Photo placeholder */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-72 h-80 md:w-96 md:h-[26rem] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="https://placehold.co/400x450/A8C1A1/2E2A26?text=Founder+Photo"
                  alt="Founder placeholder"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-5 -right-5 w-28 h-28 bg-ivory-dark rounded-3xl border-4 border-white flex items-center justify-center shadow-md">
                <div className="text-center">
                  <p className="font-serif text-2xl font-bold text-sage">5+</p>
                  <p className="text-xs text-charcoal-light">Years of<br/>Research</p>
                </div>
              </div>
            </div>
          </div>

          {/* Story text */}
          <div>
            <span className="text-sage text-xs font-medium uppercase tracking-widest">Meet the Founder</span>
            <h2 className="font-serif text-4xl text-charcoal mt-2 mb-4 leading-tight">
              A passion for <em>pure beauty</em>, born in a kitchen.
            </h2>
            <p className="text-charcoal-light leading-relaxed mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. InbaNaturals was born from a simple frustration — the inability to find beauty products free from harsh chemicals that actually worked.
            </p>
            <p className="text-charcoal-light leading-relaxed mb-4">
              What started as small-batch experiments in a home kitchen, guided by grandmother's age-old Ayurvedic wisdom, blossomed into a passionate brand dedicated to clean, conscious beauty. Every formula is a labour of love, tested on family and friends before it ever reaches your hands.
            </p>
            <p className="text-charcoal-light leading-relaxed mb-6">
              We believe that nature has everything your skin and hair need. Our mission is simply to bring those gifts to you — thoughtfully, sustainably, and beautifully.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-sage">
                <img src="https://placehold.co/50x50/7A9471/FAF6EE?text=Founder" alt="Founder signature" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-serif text-charcoal font-semibold">Ananya Founder</p>
                <p className="text-sage text-xs">Founder & Formulator, InbaNaturals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission statement */}
      <section id="mission" className="py-16" style={{ background: 'linear-gradient(135deg, #EEF4EC, #FAF6EE)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-sage text-xs font-medium uppercase tracking-widest">Our Mission</span>
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal mt-2 mb-4 leading-tight">
            Clean beauty that <em>honours</em> both you and the planet.
          </h2>
          <LeafDivider />
          <p className="text-charcoal-light mt-5 leading-relaxed">
            We are committed to formulating products that harness the best of nature — sustainably sourced, cruelty-free, and crafted without compromise. Because what goes on your body matters just as much as what goes in it.
          </p>
        </div>
      </section>

      {/* Process / Values */}
      <section id="values" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sage text-xs font-medium uppercase tracking-widest">Our Values</span>
          <h2 className="font-serif text-4xl text-charcoal mt-2 mb-3">The InbaNaturals Way</h2>
          <LeafDivider />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Leaf size={36} className="text-sage" />,
              title: 'Sustainably Sourced',
              desc: 'We partner with ethical farms and co-operatives to source the purest botanical ingredients — respecting both the land and the people who tend it.',
            },
            {
              icon: <Sprout size={36} className="text-sage" />,
              title: 'Small-Batch Crafted',
              desc: 'Every batch is made in small quantities to ensure maximum freshness, potency, and quality. No shortcuts, no mass production.',
            },
            {
              icon: <Heart size={36} className="text-sage" />,
              title: 'Cruelty-Free Always',
              desc: "We never test on animals. Our products are certified cruelty-free and vegan, because beauty should never come at another's expense.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="text-center group">
              <div className="w-20 h-20 bg-sage/10 group-hover:bg-sage/20 transition-colors rounded-full flex items-center justify-center mx-auto mb-5">
                {icon}
              </div>
              <h3 className="font-serif text-xl text-charcoal font-semibold mb-3">{title}</h3>
              <p className="text-charcoal-light text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
