import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

async function getFeaturedAdventures() {
  try {
    // In a real app, you would fetch from your database
    return [
      {
        id: "1",
        title: "Mountain Hiking Trail",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1470&auto=format&fit=crop",
        category: "Hiking",
        duration: "3 hours",
        rating: 4.8,
        location: "Rocky Mountains"
      },
      {
        id: "2",
        title: "City Art Gallery Tour",
        image: "https://images.unsplash.com/photo-1594784053305-20a0c78a4956?q=80&w=1470&auto=format&fit=crop",
        category: "Culture",
        duration: "2 hours",
        rating: 4.6,
        location: "Downtown Arts District"
      },
      {
        id: "3",
        title: "Coastal Kayaking",
        image: "https://images.unsplash.com/photo-1603114595741-3971b9b6a5e2?q=80&w=1470&auto=format&fit=crop",
        category: "Water Sports",
        duration: "4 hours",
        rating: 4.9,
        location: "Pacific Coast"
      }
    ];
  } catch (error) {
    console.error("Error fetching featured adventures:", error);
    return [];
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const featuredAdventures = await getFeaturedAdventures();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1470&auto=format&fit=crop"
            alt="NearVibe Hero"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Discover Adventures Near You</h1>
            <p className="text-xl mb-8">Explore unique experiences in your area and create unforgettable memories.</p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/adventures" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Explore Adventures
              </Link>
              {!session ? (
                <Link 
                  href="/auth/signin" 
                  className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Sign In / Sign Up
                </Link>
              ) : (
                <Link 
                  href="/itineraries" 
                  className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  My Itineraries
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Adventures */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">Featured Adventures</h2>
          <p className="text-gray-600 mb-8">Explore our top-rated experiences</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAdventures.map((adventure) => (
              <div key={adventure.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-60">
                  <Image
                    src={adventure.image}
                    alt={adventure.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {adventure.category}
                    </span>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span className="ml-1 text-sm font-medium text-gray-700">{adventure.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{adventure.title}</h3>
                  <div className="flex items-center mb-4">
                    <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">{adventure.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-sm text-gray-600">{adventure.duration}</span>
                    </div>
                    <Link 
                      href={`/adventures/${adventure.id}`} 
                      className="text-emerald-600 hover:text-emerald-800 font-medium text-sm"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/adventures" 
              className="inline-flex items-center px-6 py-3 border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors font-medium"
            >
              View All Adventures
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">How NearVibe Works</h2>
          <p className="text-gray-600 text-center mb-12">Simple steps to discover and plan your next adventure</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Discover</h3>
              <p className="text-gray-600">Find adventures near you based on your interests and location.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Plan</h3>
              <p className="text-gray-600">Create personalized itineraries with your favorite adventures.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Experience</h3>
              <p className="text-gray-600">Enjoy your adventures and share your experiences with the community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join NearVibe today and discover amazing experiences waiting for you just around the corner.</p>
          <Link 
            href="/auth/signup" 
            className="bg-white text-emerald-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}
