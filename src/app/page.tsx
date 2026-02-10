import { ArrowRight, MapPin, History, Users, Leaf, Music, Utensils } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      {/* Tri-color Accent Bar */}
      <div className="h-2 w-full flex sticky top-0 z-50">
        <div className="flex-1 bg-rasta-red"></div>
        <div className="flex-1 bg-rasta-yellow"></div>
        <div className="flex-1 bg-rasta-green"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center isolate">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/River-768x424.jpg"
            alt="Rastafari Indigenous Village River"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>

        <div className="container px-6 md:px-12 text-center text-white z-10 flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-1000">
          <div className="w-32 md:w-48 mb-4">
            <img src="/riv-logo.webp" alt="RIV Logo" className="w-full h-auto drop-shadow-2xl" />
          </div>

          <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-tight max-w-4xl drop-shadow-lg">
            Preserving Traditions.<br />
            Protecting Nature.<br />
            <span className="text-rasta-yellow">Promoting Life.</span>
          </h1>

          <p className="text-lg md:text-2xl font-medium max-w-2xl text-white/90 drop-shadow-md">
            Welcome to the Rastafari Indigenous Village. A sanctuary for culture, healing, and connection.
          </p>

          <Link href="/community">
            <button className="group relative px-8 py-4 md:px-10 md:py-5 rounded-full bg-rasta-green text-white font-bold text-lg md:text-xl shadow-[0_0_20px_rgba(0,166,81,0.5)] hover:shadow-[0_0_30px_rgba(0,166,81,0.7)] hover:scale-105 transition-all duration-300 flex items-center gap-3 mt-4 border border-white/20">
              Enter Community Platform
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      {/* About Us */}
      <section className="py-20 px-6 md:px-12 bg-background relative z-10">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="space-y-6">
            <span className="text-rasta-red font-bold tracking-widest uppercase text-sm">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
              More Than A Visit.<br />
              A Homecoming.
            </h2>
            <div className="space-y-4 text-foreground/80 text-lg leading-relaxed">
              <p>
                Come visit a community that preserves traditions, protects the natural environment, and promotes the Rastafari way of life. Wake up to the sound of songbirds, river water and the chanting/drumming of traditional Rastafari music in the Tabernacle.
              </p>
              <p>
                Walk down a flower lined path to the garden and harvest some callaloo or cacao, and bring it up to our Ital kitchen that cooks the most delicious and authentic plant based food on the island. Pound your own cacao for chocolate tea; press your own cane juice; help make recipes that originated in Africa.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 border-4 border-background">
              <img src="/images/Food-Spread-1024x768.jpeg" alt="Ital Food Preparation" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -left-10 w-2/3 aspect-video rounded-2xl overflow-hidden shadow-2xl -rotate-3 hover:rotate-0 transition-all duration-500 border-4 border-background hidden md:block">
              <img src="/images/Z62_5334-768x511.jpg" alt="Artisan Drum Making" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Community Pillars Grid */}
      <section className="py-20 px-6 md:px-12 bg-foreground/5 relative">
        <div className="container mx-auto max-w-6xl text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-6">A Thriving Village Economy</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            The RIV Community platform connects every aspect of our village life, creating a space for members, artisans, curious souls, and creators.
          </p>
        </div>

        <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1: Artisans */}
          <div className="bg-background p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="size-14 rounded-2xl bg-rasta-yellow/10 text-rasta-yellow flex items-center justify-center mb-6 group-hover:bg-rasta-yellow group-hover:text-black transition-colors">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Artisans & Craftsmen</h3>
            <p className="text-foreground/60">
              Learn how to make drums and soap by hand. Support local creators preserving traditional Rastafari techniques.
            </p>
          </div>

          {/* Pillar 2: Retreat Leaders */}
          <div className="bg-background p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="size-14 rounded-2xl bg-rasta-green/10 text-rasta-green flex items-center justify-center mb-6 group-hover:bg-rasta-green group-hover:text-white transition-colors">
              <Leaf size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Retreat Curators</h3>
            <p className="text-foreground/60">
              Host and attend immersive 5-day retreats. Connect with nature and find healing in the valley.
            </p>
          </div>

          {/* Pillar 3: Creators */}
          <div className="bg-background p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="size-14 rounded-2xl bg-rasta-red/10 text-rasta-red flex items-center justify-center mb-6 group-hover:bg-rasta-red group-hover:text-white transition-colors">
              <Music size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Creators & Musicians</h3>
            <p className="text-foreground/60">
              Share music, stories, and educational content. A platform for the voices of the village to be heard globally.
            </p>
          </div>

          {/* Pillar 4: Spiritual */}
          <div className="bg-background p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="size-14 rounded-2xl bg-foreground/5 text-foreground flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:text-background transition-colors">
              <Utensils size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Natural Living</h3>
            <p className="text-foreground/60">
              Ital cooking, natural farming, and herbal medicine. Wisdom for a healthy mind, body, and spirit.
            </p>
          </div>
        </div>
      </section>

      {/* History & Location */}
      <section className="py-20 px-6 md:px-12 bg-background">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-12">

          {/* History Card */}
          <div className="flex-1 bg-foreground/5 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-foreground/5 select-none pointer-events-none">
              <History size={200} />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">Our History</h3>
            <p className="text-foreground/70 leading-relaxed mb-6 relative z-10">
              Founded in 2007, the Village has been in a process of constant evolution. Its purpose has always been the preservation, protection and promotion of the traditional Rastafari way of life.
            </p>
            <div className="relative z-10 mt-auto">
              <div className="h-48 w-full rounded-xl overflow-hidden mt-4">
                <img src="/images/Firstman-_-Nereri-BW-1-768x576.jpg" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105" alt="RIV Founding History" />
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="flex-1 bg-foreground text-background rounded-3xl p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-background/5 select-none pointer-events-none">
              <MapPin size={200} />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">Location</h3>
            <p className="opacity-70 leading-relaxed mb-6 relative z-10">
              The Village sits alongside the beautiful Montego Valley River, just twenty minutes from the Sangster International Airport and downtown Montego Bay.
            </p>
            <div className="relative z-10 mt-auto">
              <div className="h-48 w-full rounded-xl overflow-hidden mt-4">
                <img src="/images/DJI_0073-retreats-768x519.jpeg" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 hover:scale-105" alt="Montego Valley River" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer / Final CTA */}
      <section className="py-24 px-6 md:px-12 bg-cover bg-center relative isolate" style={{ backgroundImage: "url('/images/Ceremonial-1f35b70-1-768x1024.jpg')" }}>
        <div className="absolute inset-0 bg-black/70 -z-10"></div>
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl md:text-6xl font-black mb-6">Welcome Home.</h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10">
            "The Village is an actual, functioning community that is home to several families... Visitors are welcomed as honored guests."
          </p>
          <Link href="/community">
            <button className="px-10 py-5 rounded-full bg-white text-black font-bold text-xl hover:bg-rasta-yellow transition-colors shadow-2xl">
              Join the Community
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--sidebar-left)] text-white/50 py-12 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/riv-logo.webp" alt="RIV" className="h-8" />
            <span className="text-sm">© 2026 Rastafari Indigenous Village. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
