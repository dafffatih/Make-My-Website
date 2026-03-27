export default function DashboardPage() {
  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-surface-container-low/80 backdrop-blur-lg border-b border-outline-variant/10 font-manrope">
        <div className="flex justify-between items-center px-8 h-20 w-full max-w-screen-2xl mx-auto">
          <div className="text-xl font-extrabold tracking-tighter text-white">
            Make My Website
          </div>
          <div className="hidden md:flex items-center space-x-12">
            <a className="text-primary font-bold border-b-2 border-primary pb-1" href="#">Home</a>
            <a className="text-on-surface-variant hover:text-white transition-colors" href="#portfolio">Portfolio</a>
            <a className="text-on-surface-variant hover:text-white transition-colors" href="#services">Services</a>
            <a className="text-on-surface-variant hover:text-white transition-colors" href="#contact">Contact</a>
          </div>
          <button className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded-full text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all">
            Chat Now
          </button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden px-8">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 z-10 py-16 md:py-24">
              <span className="inline-block px-4 py-1.5 rounded-full bg-surface-container-high text-primary text-[0.6875rem] font-bold tracking-[0.2em] uppercase mb-10">
                The Digital Architect
              </span>
              <h1 className="text-[3.5rem] md:text-[5rem] font-headline font-extrabold leading-[0.95] tracking-[0] mb-10 text-white mt-4">
                Crafting Your <br /> <span className="text-transparent bg-clip-text bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)]">Digital Masterpiece</span>
              </h1>
              <p className="text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed mb-16">
                We don't just build websites; we engineer digital environments that command attention and foster elite user experiences.
              </p>
              <div className="flex flex-wrap gap-6">
                <button className="px-8 py-4 rounded-full bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] text-white font-bold tracking-wide active:scale-95 transition-all shadow-xl shadow-primary/20">
                  START A PROJECT
                </button>
                <button className="px-8 py-4 rounded-full border border-outline-variant/20 hover:bg-white/5 text-on-surface font-bold tracking-wide active:scale-95 transition-all">
                  VIEW SHOWCASE
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-6 relative hidden lg:block">
              <div className="relative w-full aspect-square rounded-full border border-outline-variant/10 p-8">
                <div className="w-full h-full rounded-full overflow-hidden shadow-2xl shadow-indigo-500/10">
                  <img alt="Modern Web UI" className="w-full h-full object-cover grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_vGvOVWRruUkkis_maboqeNBfkTmayc9FJmsx-KRTktxCJDpYUBx2hBGmYgm_WNqsQjAc_MkpQaAjZmcAtrP_6JCnL9HYgQTc1T3nGAuZylccMZ8KGQQcHeLa5MAoeP9dR7N64iwcnyPQBgk_721xbZd4QCgcobbO_1bR7Kj2KyyJ3JzxJMmVnEU-ZD8AQbCl3KyTjSImrcrb88uvgDDz-0dwNtOQlRUDuUT7XEyIv6G_bksHgrzg4PpUBKWp_Eyk7McWgTrQhnY" />
                </div>
              </div>

              {/* Floating Element */}
              <div className="absolute -top-10 -left-10 bg-surface-container-highest p-6 rounded-xl border border-outline-variant/10 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">speed</span>
                  </div>
                  <div>
                    <div className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant font-bold">Performance</div>
                    <div className="text-xl font-headline font-bold text-white">99.9%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Background Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent -z-10"></div>
        </section>

        {/* Portfolio Section */}
        <section className="py-32 bg-surface-container-low" id="portfolio">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-xs text-primary uppercase tracking-[0.3em] font-bold mb-4">Curated Works</h2>
                <h3 className="text-[2.5rem] font-headline font-extrabold leading-tight text-white tracking-tighter">
                  Selected projects that define the new digital standard.
                </h3>
              </div>
              <a className="group flex items-center gap-3 text-on-surface-variant hover:text-white transition-colors pb-2 border-b border-outline-variant/30" href="#">
                <span className="font-bold tracking-widest uppercase text-xs">Explore Portfolio</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {/* Project 1 */}
              <div className="group">
                <div className="aspect-[4/5] bg-surface-container-high rounded-xl overflow-hidden mb-6 relative">
                  <img alt="Project 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsSFJs13bHTOQ_iwAjFQPWwsHWmopcBx4QHPEugBGBnuoB3VuUVjta6WZl1tULl2ybsBmxJY7m4BcUOXvuMo6qNbo7vsI02pFnent5QiuyUc1JtyVoZhJ2rCGne5eUyrL-WsrJhDkpSiGqLKpICud8XtgTpnRq9cN4Jb3syWYg34A-MyipXoCEQJmc-u0bSEfwH6KkKOSHSj0hhMYkQqlIP86CTIhDgf9G7KpiO_AAkw5i5-OJUTFUwET68nm8jXqVJ979BfNkHCY" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-6 py-3 bg-white text-black font-bold tracking-widest uppercase text-xs rounded-full">View Project</span>
                  </div>
                </div>
                <h4 className="text-xl font-headline font-bold text-white mb-2">Lumina Analytics</h4>
                <p className="text-on-surface-variant text-sm tracking-wide">Brand Identity • UI Architecture</p>
              </div>

              {/* Project 2 */}
              <div className="group lg:mt-24">
                <div className="aspect-[4/5] bg-surface-container-high rounded-xl overflow-hidden mb-6 relative">
                  <img alt="Project 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvLQTaTJCtDLlNd980I4Vp8p8VAwllp_bGi8lrfMvaZh5fL6dHRn3Z7mBQiYXwQD8YWRmfIdoCqUBn5wB5zSzwD_RfXBNSYavfZH_ng-1J2vSYXTnRfZyliVgwL2F96l0nHep_6k1ZDcKvueqM8Npqu5yPlWXsCsg1t9hIOA7biSN47eRCnZLzQMNdO8o1BvHxpoASanRbL-fe7siHhGEpjBwKgScUmqJ9Wk_TZjKtxSd54PJvT3nTvawcq7COZhcUwanLVGbsN_w" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-6 py-3 bg-white text-black font-bold tracking-widest uppercase text-xs rounded-full">View Project</span>
                  </div>
                </div>
                <h4 className="text-xl font-headline font-bold text-white mb-2">Aether Architecture</h4>
                <p className="text-on-surface-variant text-sm tracking-wide">WebGL Experience • Creative Direction</p>
              </div>

              {/* Project 3 */}
              <div className="group">
                <div className="aspect-[4/5] bg-surface-container-high rounded-xl overflow-hidden mb-6 relative">
                  <img alt="Project 3" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjpxZFtwOiIVLOh8MM8IOC6ql9pYeuDwAN4CfjrvY5vSy3KA9e3CgqgzLkUrh6AHHcVeuyjiw9hBqqgMZcvcZgVZmLBN82kT0IfelhGLsfolTwD08XlwF-m8GQ_LuahrhxWfq40x8i9o6y26Sl3AMVt8ks4xsATXuud19T7PDOTduo_ALQyY-yUGTbrCKA-kL8XGRFOzxTlbpLiSxBpFDhImto9LJ-HG0X6QeY8gI3ZO6R1jkjFXZ7zakvFgrbkP6AdPaZpsSVGeA" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-6 py-3 bg-white text-black font-bold tracking-widest uppercase text-xs rounded-full">View Project</span>
                  </div>
                </div>
                <h4 className="text-xl font-headline font-bold text-white mb-2">Vogue Collective</h4>
                <p className="text-on-surface-variant text-sm tracking-wide">E-Commerce • Headless Commerce</p>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Tiers */}
        <section className="py-32 px-8" id="services">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-xs text-primary uppercase tracking-[0.3em] font-bold mb-4">Investment Tiers</h2>
              <h3 className="text-4xl md:text-5xl font-headline font-extrabold text-white tracking-tighter">Scalable Digital Solutions</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Starter */}
              <div className="bg-surface-container p-10 rounded-2xl flex flex-col hover:bg-surface-container-high transition-colors border border-outline-variant/10">
                <div className="mb-8">
                  <div className="text-on-surface-variant font-bold tracking-widest uppercase text-[10px] mb-4">Starter</div>
                  <div className="text-4xl font-headline font-extrabold text-white">$4,900<span className="text-base font-normal text-on-surface-variant ml-2">/project</span></div>
                </div>
                <ul className="space-y-6 mb-12 flex-grow">
                  <li className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    <span className="text-sm">5 Bespoke Pages</span>
                  </li>
                  <li className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    <span className="text-sm">SEO Foundations</span>
                  </li>
                  <li className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    <span className="text-sm">Mobile First Architecture</span>
                  </li>
                </ul>
                <button className="w-full py-4 rounded-lg border border-outline-variant/30 text-white font-bold tracking-widest uppercase text-[10px] hover:bg-white/5 transition-all">Select Package</button>
              </div>

              {/* Growth (Featured) */}
              <div className="bg-surface-container-highest p-10 rounded-2xl flex flex-col relative overflow-hidden shadow-2xl scale-105 border border-primary/20">
                <div className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Most Popular</div>
                <div className="mb-8">
                  <div className="text-primary font-bold tracking-widest uppercase text-[10px] mb-4">Growth</div>
                  <div className="text-4xl font-headline font-extrabold text-white">$9,500<span className="text-base font-normal text-on-surface-variant ml-2">/project</span></div>
                </div>
                <ul className="space-y-6 mb-12 flex-grow">
                  <li className="flex items-center gap-3 text-on-surface">
                    <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-sm">12 Custom Pages</span>
                  </li>
                  <li className="flex items-center gap-3 text-on-surface">
                    <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-sm">CMS Integration</span>
                  </li>
                  <li className="flex items-center gap-3 text-on-surface">
                    <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-sm">Custom Interactions</span>
                  </li>
                  <li className="flex items-center gap-3 text-on-surface">
                    <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-sm">Priority Launch Support</span>
                  </li>
                </ul>
                <button className="w-full py-4 rounded-lg bg-primary text-on-primary font-bold tracking-widest uppercase text-[10px] hover:shadow-lg hover:shadow-primary/20 transition-all">Select Package</button>
              </div>

              {/* Enterprise */}
              <div className="bg-surface-container p-10 rounded-2xl flex flex-col hover:bg-surface-container-high transition-colors border border-outline-variant/10">
                <div className="mb-8">
                  <div className="text-on-surface-variant font-bold tracking-widest uppercase text-[10px] mb-4">Enterprise</div>
                  <div className="text-4xl font-headline font-extrabold text-white">Custom<span className="text-base font-normal text-on-surface-variant ml-2">/starting</span></div>
                </div>
                <ul className="space-y-6 mb-12 flex-grow">
                  <li className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    <span className="text-sm">Unlimited Scale</span>
                  </li>
                  <li className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    <span className="text-sm">Custom WebApp Development</span>
                  </li>
                  <li className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    <span className="text-sm">24/7 Concierge Tech Lead</span>
                  </li>
                </ul>
                <button className="w-full py-4 rounded-lg border border-outline-variant/30 text-white font-bold tracking-widest uppercase text-[10px] hover:bg-white/5 transition-all">Select Package</button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-32 bg-surface-container-lowest" id="contact">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
              <div>
                <h2 className="text-xs text-primary uppercase tracking-[0.3em] font-bold mb-4">Initiate Contact</h2>
                <h3 className="text-4xl font-headline font-extrabold text-white mb-8 tracking-tighter leading-tight">Ready to build your masterpiece? Let's talk.</h3>
                <p className="text-on-surface-variant mb-12 max-w-md">Our team of architects is ready to map out your digital vision. Fill out the form or start a live session.</p>
                <div className="space-y-8">
                  <div className="flex items-center gap-6 p-6 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">chat_bubble</span>
                    </div>
                    <div>
                      <div className="text-white font-bold mb-1">Live Chat</div>
                      <div className="text-sm text-on-surface-variant">Average response: 2 minutes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 p-6 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">mail</span>
                    </div>
                    <div>
                      <div className="text-white font-bold mb-1">Email Inquiry</div>
                      <div className="text-sm text-on-surface-variant">hello@makemywebsite.io</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-surface-container p-12 rounded-3xl border border-outline-variant/10 shadow-3xl">
                <form action="#" className="space-y-8">
                  <div className="group">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors">Full Name</label>
                    <input className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-4 focus:ring-0 focus:border-primary text-white transition-all placeholder:text-zinc-700" placeholder="Alexander Graham" type="text" />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors">Business Email</label>
                    <input className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-4 focus:ring-0 focus:border-primary text-white transition-all placeholder:text-zinc-700" placeholder="alex@company.com" type="email" />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors">Project Brief</label>
                    <textarea className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-4 focus:ring-0 focus:border-primary text-white transition-all placeholder:text-zinc-700 resize-none" placeholder="Tell us about your digital ambition..." rows={4}></textarea>
                  </div>
                  <button className="w-full py-5 rounded-full bg-white text-black font-black tracking-widest uppercase text-xs hover:bg-primary hover:text-on-primary transition-all" type="submit">Send Brief</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-dim w-full py-16 px-8 border-t border-outline-variant/10 font-manrope">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 w-full max-w-7xl mx-auto">
          <div className="col-span-1 md:col-span-1">
            <div className="text-lg font-black text-white mb-6">Make My Website</div>
            <p className="text-on-surface-variant text-sm normal-case leading-relaxed max-w-xs mb-8">
              Architecting the future of web experiences with precision and creative audacity.
            </p>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold mb-6 tracking-[0.2em] uppercase">Explore</h4>
            <div className="flex flex-col space-y-4 text-sm">
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Home</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#portfolio">Portfolio</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#services">Services</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#contact">Contact</a>
            </div>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold mb-6 tracking-[0.2em] uppercase">Company</h4>
            <div className="flex flex-col space-y-4 text-sm">
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Terms</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Careers</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">About</a>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <h4 className="text-white text-xs font-bold mb-6 tracking-[0.2em] uppercase">Social</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all cursor-pointer">
                <span className="material-symbols-outlined text-base">public</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all cursor-pointer">
                <span className="material-symbols-outlined text-base">camera</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto w-full mt-20 pt-8 border-t border-outline-variant/10 text-[10px] text-on-surface-variant tracking-[0.3em] uppercase">
          © 2024 Make My Website. Built for the digital architect.
        </div>
      </footer>
    </>
  );
}
