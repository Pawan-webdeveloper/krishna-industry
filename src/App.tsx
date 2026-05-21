/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { 
  ArrowRight, 
  Settings, 
  ShieldCheck, 
  Rocket, 
  MapPin, 
  Mail, 
  PhoneCall, 
  Globe, 
  ChevronRight,
  Menu,
  X,
  Factory,
  Search,
  CheckCircle2,
  Award,
  Zap
} from "lucide-react";

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md border-b border-border-subtle py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="font-display text-2xl font-bold tracking-tighter text-brand-navy flex items-center gap-2">
          <Factory className="text-brand-blue" />
          KRISHNA INDUSTRIES
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          {["Submersible", "Monoblock", "Shallow Well", "Vertical Turbine", "Service"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-sm font-medium hover:text-brand-blue transition-colors text-brand-navy/70"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block bg-brand-blue text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-blue/90 transition-all active:scale-95 shadow-lg shadow-brand-blue/20">
            Request Quote
          </button>
          <button 
            className="md:hidden p-2 text-brand-navy"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-border-subtle p-6 space-y-4">
          {["Submersible", "Monoblock", "Shallow Well", "Vertical Turbine", "Service"].map((item) => (
            <a 
              key={item} 
              href="#" 
              className="block text-lg font-medium text-brand-navy"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <button className="w-full bg-brand-blue text-white py-4 rounded-lg font-bold">
            Request Quote
          </button>
        </div>
      )}
    </header>
  );
};

const StatCard = ({ value, label, suffix = "" }: { value: number, label: string, suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center px-4">
      <div className="font-display text-4xl md:text-5xl font-bold text-brand-blue mb-1">
        {count}{suffix}
      </div>
      <div className="text-sm font-bold text-text-muted uppercase tracking-widest leading-none">
        {label}
      </div>
    </div>
  );
};

const ProductCard = ({ title, hp, stages, type, img, series }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass-card group rounded-xl overflow-hidden flex flex-col transition-all duration-300"
  >
    <div className="aspect-[4/3] relative bg-white p-8">
      <img 
        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
        src={img} 
        alt={title}
      />
      <div className="absolute top-4 right-4">
        <span className="bg-brand-blue/10 text-brand-blue font-bold text-[10px] px-3 py-1 rounded-full border border-brand-blue/20">
          {series}
        </span>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="font-display text-xl text-brand-navy mb-3 group-hover:text-brand-blue transition-colors">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {[hp, stages, type].map(spec => (
          <span key={spec} className="bg-brand-navy/5 text-brand-navy/70 text-[10px] font-bold px-2 py-1 rounded border border-border-subtle">
            {spec}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-6 border-t border-border-subtle flex gap-2">
        <button className="flex-grow bg-brand-navy text-white text-xs font-bold py-3 rounded-lg hover:bg-brand-blue transition-all">
          Inquire Now
        </button>
        <button className="px-3 border border-border-subtle rounded-lg hover:bg-brand-blue/5 transition-colors">
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </motion.div>
);

const SectionHeading = ({ badge, title, description, dark = false }: any) => (
  <div className={`text-center mb-16 ${dark ? "text-white" : ""}`}>
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`inline-block px-3 py-1 mb-4 font-bold text-[10px] uppercase tracking-widest rounded-full ${
        dark ? "bg-white/10 text-white" : "bg-brand-blue/10 text-brand-blue"
      }`}
    >
      {badge}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight"
    >
      {title}
    </motion.h2>
    {description && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className={`max-w-2xl mx-auto text-lg leading-relaxed ${dark ? "text-white/70" : "text-text-muted"}`}
      >
        {description}
      </motion.p>
    )}
  </div>
);

// --- Main App ---

export default function App() {
  return (
    <div className="w-full">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-GK0HRtpGz50ebE14pwKALeC8cO1k4wqsDRFgLrDB9FG7H5lunJaHMEJ-vtfZ8UO_mObFJlIXa2k-x2u1_MW4rbKW5rNnJ4nZUi_JYv34dvELIOM0PzneE7WW1RnHpTSCEbnz4VVXsP_m7Ci8hDENOGpg7EszKOLFYRGHlijRZF9O6qk_jhVLXCVNKUK5lSsFqVI_ktb9Lnyao-mkMYNy0atG40S6Chl8aQaCJPwtdEwgaiTu_M2EZGhjJJvPxrKs-C5N0NzldHo" 
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-brand-navy/40 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-4 mb-6 bg-brand-blue text-white font-bold text-xs rounded-full">
                ESTABLISHED 1988
              </span>
              <h1 className="font-display text-5xl md:text-7xl text-white mb-8 leading-[1.1] font-bold tracking-tight">
                Engineered for <br/>
                <span className="text-brand-cyan">Technical Excellence</span>
              </h1>
              <p className="text-xl text-white/80 mb-10 max-w-xl leading-relaxed">
                Setting the global benchmark in high-performance pump manufacturing through relentless innovation and precision fluid dynamic engineering.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-brand-blue text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-blue/90 transition-all flex items-center justify-center gap-3 group">
                  Explore Products <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
                  Our Story
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-white/20 relative">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-blue animate-bounce"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-border-subtle">
          <StatCard value={2500} label="Installations" suffix="+" />
          <StatCard value={99} label="Uptime Rate" suffix=".8%" />
          <StatCard value={120} label="Max Head Lift" suffix="m" />
          <StatCard value={15} label="Global Markets" suffix="+" />
        </div>
      </section>

      {/* Legacy Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeading 
              badge="Our Journey"
              title="A Legacy of Technical Mastery"
              description="From a specialized workshop to a global industrial leader, we have spent over three decades perfecting the art of fluid dynamics. Our commitment is to solve the most complex pumping challenges."
            />
            <div className="grid grid-cols-2 gap-8">
              {[
                { icon: ShieldCheck, title: "ISO Certified", text: "Quality assured manufacturing" },
                { icon: Rocket, title: "R&D Driven", text: "Continuous product innovation" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-brand-blue/10 p-3 rounded-lg flex-shrink-0 h-fit">
                    <item.icon className="text-brand-blue w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-brand-navy mb-1">{item.title}</h4>
                    <p className="text-sm text-text-muted leading-tight">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-12 text-brand-blue font-bold flex items-center gap-2 hover:gap-4 transition-all group">
              Learn more about our heritage <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden glass-card p-6 rotate-3">
              <img 
                className="w-full h-full object-cover rounded-2xl" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEd3BWzQ6xXMykqPqV8EMQpBUfx08BUFQnOsBB2CiQIy846GhY71p4fvsJrwgytstwUbOC_dyNImF_a87sTrokze0QYItfMqqKyoAyb0H67j7gPe1cVZ_gFwuWy0vVtdLGfvqTG0pJvhdVVC7vbAwLQ56fzq15kIalLdR4l2xQj82v9G9HmfXr_IKVRk7CuLSbBAvPjXOy5DPY36gdJuJMe5b1koueCEY-wittEKvpwkiDL563GMGUSAeZ5KtcOdrKWBICYQeXbUg" 
                alt="Engineering Table"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-brand-blue text-white p-8 rounded-2xl shadow-2xl">
              <div className="text-4xl font-bold font-display tracking-tighter">35+</div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-80">Years in Engineering</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="bg-brand-navy py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            dark
            badge="Precision Built"
            title="Production Infrastructure"
            description="Our facilities utilize advanced CNC machining, automated winding, and rigorous hydro-testing to ensure zero-defect standards."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Precision CNC",
                desc: "Micron-level accuracy in component fabrication using vertical machining centers.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8U0g9sinnGWr3-qT-naFAoLXquzljv9N4hdb8WK37DgIr39Z_5qNazULvG8q7va3F69Ll_f1f6W4N2tz68fAQNZPL3DBADsNuRjgiYAWcYYP6K_Riy_AeCEX3LiGh6KONmzzhU8JAhIrZbClRsv9GYH8V_nSbJoipmEML3Vepf91XDeUwT4FL9uwTIdw-itgiXW7o_vC-2Th9aszo0lq2dB-YGodrzwxeqkNE2wxjZgefzn6_rU9Y_mYCY7O910O_Bd1j0whsHOQ"
              },
              {
                title: "Quality Control",
                desc: "Multi-stage inspection protocols ensuring compliance with global standards.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_qfMJCC78HiTT_UW6KuUmsd0JViOAtcqy7IxzxrgXr7YjvEBUgtOerzht1jovS46NC6d77kY_rsbLOE8stJ5xiF6RmM3oytHEwhyCVPCimnfNBrVac6LNapiZUQrhCPYTl2xaUvJeqsWVkZbDIwokE03SjbFFmY5zT8kJ5KSD9igWM0imKeeba88K5R7stdVPUDcYj2vKC_Muy1FaUZgGa43S_MVB9qZmfmVbyoOyHaeCbFzD9Uv3apNGLvUMx2evY1CpAbmDpgo"
              },
              {
                title: "Automated Assembly",
                desc: "Robotic winding and assembly systems guaranteeing production consistency.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBt7CTq0lra0dW-pncDW1Nh9zI_v_USOc1Zd52xaJ41EMiGw1TN9XPfZ56woa3fNO7rIgxqOuHEazj8UllnB3ctUdw6UuZt-p0wvz7m0pZSHYn-bgoJcBQsqFwB8APORT1aQerO_YHsbBxaXx3kEjWRLBpMFbngwBFpBacXrgLZi1CJrYyLElF6HJn6sc__OivNojZDdFdaNGbBnQIAHtnMJrRR5uwPLEHrvhMps8AUkIWdCe_kE9sCZmQ-iJQhPu7bDsH7nb57Z4k"
              }
            ].map((cap, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group"
              >
                <div className="h-64 overflow-hidden">
                  <img src={cap.img} alt={cap.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
                </div>
                <div className="p-8">
                  <h3 className="font-display text-xl text-white mb-3 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-brand-cyan" /> {cap.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm">{cap.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="submersible" className="py-24 bg-background-cool">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-brand-blue font-bold text-xs uppercase tracking-widest mb-4 block">Product Catalog</span>
              <h2 className="font-display text-4xl font-bold tracking-tight text-brand-navy">Core Engineering Selection</h2>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-white border border-border-subtle rounded-xl font-bold text-sm hover:border-brand-blue transition-all">All Products</button>
              <button className="px-6 py-3 bg-brand-blue text-white rounded-xl font-bold text-sm hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20">Featured Models</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard 
              title="KR-SUB 6000 Pro"
              hp="10.0 HP"
              stages="18 Stages"
              type="CI Adapter"
              series="V6 SERIES"
              img="https://lh3.googleusercontent.com/aida-public/AB6AXuC6wZQQLMqWOiVheU5QfK61W8L2i5r1TNvjIt3UGW9x3WdCD7yW3dqZolBH-KSaUH7YDtoTAhK4kuP-JdrtdkMRp8e1bFoG9Np7XqvBaI6_Rp9ZpeNHjOJjhOM9QXNtgfoVDlIp9Ren_HGfuNcrLMz0Ib7LEj9LMGQkeEhXTSLXpmDr-rnytRy9je4vkcU7roihCB4_cP4L9UqJ69KiDlQWnxsoYCaQ0dM1LUld56i5duNHLEzrAGkCREyqp_CgoZO1_70b8bz__a8"
            />
            <ProductCard 
              title="KR-AGRI 4200"
              hp="5.5 HP"
              stages="12 Stages"
              type="Stainless"
              series="V4 SERIES"
              img="https://lh3.googleusercontent.com/aida-public/AB6AXuANtuIahj_DQIymRTKs5yrp7FLLl9h8hMOGz2z7ha-pulQM4QrdHOenEACoO8ImJKdKpWbQuHq_Q_kIYKcw71E6Tw2uuhcTwXHZtD4nEL86MVXqajU0aDw8kTXjPksXY2DTIJy-IqUnJaw2cbq9Cashtsiddw6tmeeWd92hhYMs1bssdLsOae-hO--ZbvS1qNNtUFc1K2vQcJ6R1KE7U58kkUiNCjxHxeLbTV6yPW26E8xCYpJftEfIrKqhvxnKhf7bSAmjvL3ovbs"
            />
            <ProductCard 
              title="KR-IND 8000 X"
              hp="25.0 HP"
              stages="32 Stages"
              type="High Flow"
              series="V8 SERIES"
              img="https://lh3.googleusercontent.com/aida-public/AB6AXuB7CLK7UoECWOHe1j3wbJPs2tPF8Sq_oeZC_BPBwtSie_soyy3xDWnjRypaB8PU_wCz5bCxScpoeHOlGyUiHgP2Pi9yivLeRf2WErEEbjPCsSvPeMcRbbL5_EXAKgFqyzVFRFMaIaORJpS5UXfNJVhUTf_jAj6oIz2WYmHXJ3OWiN_BSldKbPK15BFbmw2r2bf2TMx97pjNHFiyqY9TdZ8N-INbjf2z6FjcLP_lLiACmMNKaOdmeHjCxADNopeiSynVIciPeHuxd4c"
            />
            <ProductCard 
              title="KR-SUB 6200 Ultra"
              hp="12.5 HP"
              stages="22 Stages"
              type="Bronze Bush"
              series="V6 SERIES"
              img="https://lh3.googleusercontent.com/aida-public/AB6AXuBvJZXNGaone5FgO1JgEMvlnDmVJYsnzMUshM6kmKzSXFzB-o7wfNjDPu_9LzdX1AoshuGgMP0b4a901G1cIspEkV9r7ac_tu2Cdjx_R8oMkN0hF8Y9O5zbjH6IyxQB_0C9SuGmVaBTdrDHHEJUkyoGnR1pfX-HWunaHWVidRb8-YdyJwvKU6hLnLoir7q5wdUOF4odpeQamceQz7ITawdKApjhhfoAz3Il8Nl50ikF05yD-oOeI6tu62PmQl5-QrJneDaC65wOTZg"
            />
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            badge="Versatility"
            title="Critical Water Solutions"
            description="Our range is engineered to perform in environments where reliable water access is most paramount."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="relative h-[450px] rounded-[32px] overflow-hidden group shadow-2xl"
            >
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMPIkv2G4UeaECk-TZLaQtl3-e4WxCYiXPOXlxfrLWJEuK-UyNYaLNc5SqZDpKRFk917VgG4qD2ygYGciWfOR2wMb2S0dYgkZW6_uY5c2sD_BiX4VLaluqNITxdXzfSS9Slpu5mWYs9pDq0NToQDtigesIeO0TEkfKUSi4sI5C3N9q9YKOl-YRlZi5bdWxSd3BuNtxmHiSHUyNb-5VxUPt5WjUIlgLmhoLxY9Dy73KX3aYv_naeyC6hWBMfePkTnGq5ud7AfZ17do" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="Agriculture" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent flex flex-col justify-end p-10">
                <span className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center mb-6 text-white font-bold">AG</span>
                <h3 className="font-display text-3xl font-bold text-white mb-4 tracking-tight">Agricultural Irrigation</h3>
                <p className="text-white/70 max-w-sm leading-relaxed">Sustainable solutions for large-scale crop management, ensuring consistent water supply across drought-prone regions.</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="relative h-[450px] rounded-[32px] overflow-hidden group shadow-2xl"
            >
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaNe1Yo67xzx_VB3kyF9rsVj-cPpXOJ-fbf-nCFtTJAauwZzb3ShnIdHehoiHmXk6Xzc9e5ZeOcDvDysEcPob6Q_3gQJKuciEzTL0wl-XEBE48sJJ2Y7BtYMrAnPfv62h7U0Eayqxg30KeO_y3366tfenxVZvyclEJr1rpZCVZkQ9xBZSxx2ecUYo9h-qufk1qV2q7G3GfIJlwQ8JUa_J3EaC-u5LnCy_IpQRnDc2ccK2nt0Y2_Fl8Xk7lvutO5cH1In7EW7DUdNQ" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="Industrial" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent flex flex-col justify-end p-10">
                <span className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center mb-6 text-white font-bold">ID</span>
                <h3 className="font-display text-3xl font-bold text-white mb-4 tracking-tight">Civil & Industrial</h3>
                <p className="text-white/70 max-w-sm leading-relaxed">High-pressure delivery for municipal water supply and multi-story building infrastructures with industrial reliability.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="bg-white py-24 border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <SectionHeading 
            badge="Compliance"
            title="Global Certified Standards"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "ISO 9001:2015", sub: "Quality Management" },
              { icon: Globe, title: "ISO 14001", sub: "Environmental Standards" },
              { icon: CheckCircle2, title: "CE Certified", sub: "European Safety" },
              { icon: Award, title: "BEE 5-Star", sub: "Energy Efficiency" }
            ].map((cert, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-8 rounded-2xl bg-background-cool border border-border-subtle hover:border-brand-blue transition-all group"
              >
                <cert.icon className="w-12 h-12 text-brand-blue mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-display font-bold text-lg mb-1">{cert.title}</h4>
                <p className="text-xs text-text-muted font-bold uppercase tracking-widest">{cert.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="service" className="py-24 bg-background-cool overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5">
              <span className="text-brand-blue font-bold text-xs uppercase tracking-widest mb-4 block">Get in Touch</span>
              <h2 className="font-display text-5xl font-bold mb-8 tracking-tight">Global Support Network</h2>
              <p className="text-lg text-text-muted mb-12">Connect with our engineering teams for specialized solutions, maintenance support, or global distribution inquiries.</p>
              
              <div className="space-y-8">
                {[
                  { icon: MapPin, title: "Global HQ", content: "782 Industrial Park Blvd, Ahmedabad, India" },
                  { icon: Mail, title: "Business Inquiries", content: "sales@krishnapumps.com" },
                  { icon: PhoneCall, title: "Technical Support", content: "+91 (0) 79 4567 8900" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-center">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-border-subtle flex items-center justify-center text-brand-blue shadow-ambient">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-brand-navy mb-1">{item.title}</h4>
                      <p className="text-text-muted leading-tight">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-8 bg-brand-navy rounded-[32px] text-white flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Emergency Service</p>
                  <p className="text-xl font-display font-bold">24/7 Support Hotline</p>
                </div>
                <div className="w-12 h-12 bg-brand-cyan rounded-full flex items-center justify-center text-brand-navy animate-pulse">
                  <Zap className="fill-current" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-12 rounded-[40px] shadow-2xl border border-border-subtle"
              >
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-navy uppercase tracking-widest px-1">Full Name</label>
                      <input type="text" className="w-full px-5 py-4 rounded-xl border border-border-subtle bg-background-cool focus:bg-white focus:border-brand-blue outline-none transition-all" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-navy uppercase tracking-widest px-1">Company</label>
                      <input type="text" className="w-full px-5 py-4 rounded-xl border border-border-subtle bg-background-cool focus:bg-white focus:border-brand-blue outline-none transition-all" placeholder="Industrial Corp." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-navy uppercase tracking-widest px-1">Email</label>
                    <input type="email" className="w-full px-5 py-4 rounded-xl border border-border-subtle bg-background-cool focus:bg-white focus:border-brand-blue outline-none transition-all" placeholder="john@company.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-navy uppercase tracking-widest px-1">Message</label>
                    <textarea rows={4} className="w-full px-5 py-4 rounded-xl border border-border-subtle bg-background-cool focus:bg-white focus:border-brand-blue outline-none transition-all resize-none" placeholder="How can our engineers assist?" />
                  </div>
                  <button className="w-full bg-brand-blue text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-blue/90 shadow-xl shadow-brand-blue/20 transition-all flex items-center justify-center gap-3">
                    Submit Inquiry <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="font-display text-2xl font-bold tracking-tighter mb-6">KRISHNA INDUSTRIES</div>
              <p className="text-white/60 leading-relaxed mb-8">Engineering superior fluid management solutions since 1988. Precision-driven, quality-focused.</p>
              <div className="flex gap-4">
                {[Factory, Globe, ShieldCheck].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors">
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-brand-cyan">Products</h4>
              <ul className="space-y-4 text-white/50 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Submersible Catalog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Monoblock Systems</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Vertical Turbine</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Replacement Parts</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-brand-cyan">Resources</h4>
              <ul className="space-y-4 text-white/50 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Technical Drawings</a></li>
                <li><a href="#" className="hover:text-white transition-colors">BOM Specifications</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Certifications</a></li>
                <li><a href="#" className="hover:text-white transition-colors">White Papers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-brand-cyan">Newsletter</h4>
              <p className="text-xs text-white/50 mb-4 font-bold uppercase tracking-widest">Engineering Insights</p>
              <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl">
                <input type="text" className="bg-transparent border-none px-4 py-2 text-sm w-full outline-none" placeholder="Email address" />
                <button className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest">Join</button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p>© 2024 Krishna Industries Co. Engineered for Precision.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
