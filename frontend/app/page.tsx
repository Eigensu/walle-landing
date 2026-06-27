"use client";

import { useState } from "react";
import { useTournaments } from "@/lib/hooks";
import { TournamentCard } from "@/components/TournamentCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import {
  Loader,
  AlertCircle,
  Trophy,
  Users,
  Zap,
  Shield,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [showCompleted, setShowCompleted] = useState(false);
  const { data: tournaments, isLoading, error } = useTournaments();

  const features = [
    {
      icon: Trophy,
      title: "Live Tournaments",
      description:
        "Compete in real-time fantasy tournaments with players worldwide.",
    },
    {
      icon: Users,
      title: "Build Your Squad",
      description:
        "Create your dream team by selecting the best players strategically.",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description:
        "Track live scores and see your rankings update in real-time.",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description:
        "Your data and transactions are protected with industry-standard security.",
    },
  ];

  return (
    <main className="min-h-screen bg-walle-darker">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full">
        <HeroCarousel />
      </section>

      {/* Tournaments Section */}
      <section id="tournaments" className="pb-20 pt-8 bg-walle-dark/30">
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
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Active Tournaments
                </h3>
                <p className="text-purple-300">
                  New tournaments are coming soon. Stay tuned!
                </p>
              </div>
            </div>
          )}

          {tournaments && tournaments.length > 0 && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {(() => {
                  // Filter and sort tournaments
                  const processedTournaments = tournaments
                    .filter((t) => showCompleted || t.status !== "COMPLETED")
                    .sort((a, b) => {
                      // Custom sort order: LIVE > UPCOMING > COMPLETED
                      const statusPriority = {
                        LIVE: 0,
                        UPCOMING: 1,
                        COMPLETED: 2,
                      };
                      const priorityDiff =
                        statusPriority[a.status] - statusPriority[b.status];

                      if (priorityDiff !== 0) return priorityDiff;

                      // Secondary sort by date
                      const dateA = new Date(a.start_time).getTime();
                      const dateB = new Date(b.start_time).getTime();

                      // For COMPLETED, show most recent first (descending)
                      if (a.status === "COMPLETED") {
                        return dateB - dateA;
                      }

                      // For LIVE and UPCOMING, show earliest first (ascending)
                      return dateA - dateB;
                    });

                  if (processedTournaments.length === 0) {
                    return (
                      <div className="col-span-full text-center py-10">
                        <p className="text-purple-300">No tournaments found.</p>
                      </div>
                    );
                  }

                  return processedTournaments.map((tournament) => (
                    <TournamentCard
                      key={tournament.id}
                      tournament={tournament}
                    />
                  ));
                })()}
              </div>

              {/* Show Completed Toggle */}
              {tournaments.some((t) => t.status === "COMPLETED") && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowCompleted(!showCompleted)}
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-walle-purple/10 border border-walle-purple/20 hover:bg-walle-purple/20 hover:border-purple-500/40 transition-all duration-300"
                  >
                    <span className="text-purple-300 group-hover:text-white font-medium">
                      {showCompleted
                        ? "Hide Completed Contests"
                        : "Show Completed Contests"}
                    </span>
                    {showCompleted ? (
                      <ChevronRight className="w-4 h-4 text-purple-400 rotate-270" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-purple-400 rotate-90" />
                    )}
                  </button>
                </div>
              )}
            </>
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
              Experience the most engaging fantasy sports platform with powerful
              features designed for winners
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
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-purple-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
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
                Join thousands of players competing in fantasy tournaments.
                Build your team and prove your skills.
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
