'use client';

import { useTournaments } from '@/lib/hooks';
import { TournamentCard } from '@/components/TournamentCard';
import { Footer } from '@/components/Footer';
import { Loader, AlertCircle, Trophy, Users, Zap, Shield, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const { data: tournaments, isLoading, error } = useTournaments();

  const features = [
    {
      icon: Trophy,
      title: 'Live Tournaments',
      description: 'Compete in real-time fantasy tournaments with players worldwide.',
    },
    {
      icon: Users,
      title: 'Build Your Squad',
      description: 'Create your dream team by selecting the best players strategically.',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Track live scores and see your rankings update in real-time.',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data and transactions are protected with industry-standard security.',
    },
  ];

  return (
    <main className="min-h-screen bg-walle-darker">
      {/* Header */}
      <header className="bg-walle-dark/80 backdrop-blur-md border-b border-walle-purple/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/walle-logo.png" 
              alt="WallE Arena Logo" 
              width={44} 
              height={44}
              className="object-contain"
            />
            <span className="text-xl font-bold text-white">WallE Arena</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#tournaments" className="text-purple-300 hover:text-white transition-colors text-sm font-medium">
              Tournaments
            </a>
            <a href="#features" className="text-purple-300 hover:text-white transition-colors text-sm font-medium">
              Features
            </a>
            <Link 
              href="/contact"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-5 py-2 rounded-full transition-all duration-300 hover:scale-105 text-sm"
            >
              Contact Us
            </Link>
          </nav>
          <Link 
            href="/contact"
            className="md:hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-full text-sm"
          >
            Contact
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-purple-300 text-sm font-medium">Live Tournaments Available</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Build Your Dream Team,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Dominate the Game
              </span>
            </h1>
            <p className="text-purple-200 text-lg md:text-xl mb-8 leading-relaxed">
              Join the ultimate fantasy sports platform. Create your squad, compete in tournaments, and climb the leaderboards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#tournaments"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/25"
              >
                View Tournaments
                <ChevronRight className="w-4 h-4" />
              </a>
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tournaments Section */}
      <section id="tournaments" className="py-20 bg-walle-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Active Tournaments
            </h2>
            <p className="text-purple-300 text-lg max-w-2xl mx-auto">
              Join live competitions and showcase your fantasy sports skills
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader className="w-10 h-10 animate-spin mx-auto mb-4 text-purple-400" />
                <p className="text-purple-300">Loading tournaments...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-20">
              <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-8 max-w-md text-center">
                <AlertCircle className="w-10 h-10 mx-auto mb-4 text-red-400" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Unable to Load Tournaments
                </h3>
                <p className="text-red-200/80 text-sm">
                  Please check your connection and try again.
                </p>
              </div>
            </div>
          )}

          {tournaments && tournaments.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-walle-purple/10 border border-walle-purple/20 rounded-2xl p-12 max-w-lg mx-auto">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-xl font-semibold text-white mb-2">No Active Tournaments</h3>
                <p className="text-purple-300">
                  New tournaments are coming soon. Stay tuned!
                </p>
              </div>
            </div>
          )}

          {tournaments && tournaments.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose WallE Arena?
            </h2>
            <p className="text-purple-300 text-lg max-w-2xl mx-auto">
              Experience the most engaging fantasy sports platform with powerful features designed for winners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 rounded-2xl bg-gradient-to-b from-walle-purple/10 to-transparent border border-walle-purple/20 hover:border-purple-500/40 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 p-12 md:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Winning?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Join thousands of players competing in fantasy tournaments. Build your team and prove your skills.
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-purple-600 font-semibold px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Get Started Today
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
