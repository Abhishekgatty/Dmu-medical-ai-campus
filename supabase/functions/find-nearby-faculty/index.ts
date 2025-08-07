import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FacultyLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  experience_years: number;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

// Get coordinates from address using Google Maps Geocoding API
async function getCoordinatesFromAddress(address: string, apiKey: string) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocoding/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentLocation, faculty, maxDistance = 25 } = await req.json();
    
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!apiKey) {
      throw new Error('Google Maps API key not configured');
    }

    // Get student coordinates if address is provided
    let studentCoords = null;
    if (studentLocation) {
      if (typeof studentLocation === 'string') {
        studentCoords = await getCoordinatesFromAddress(studentLocation, apiKey);
      } else if (studentLocation.latitude && studentLocation.longitude) {
        studentCoords = studentLocation;
      }
    }

    // If we can't get student coordinates, return all faculty
    if (!studentCoords) {
      return new Response(JSON.stringify({ 
        nearbyFaculty: faculty,
        message: 'Location not available, showing all faculty'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Filter faculty within the specified distance
    const nearbyFaculty = faculty
      .map((f: FacultyLocation) => ({
        ...f,
        distance: calculateDistance(
          studentCoords.latitude,
          studentCoords.longitude,
          f.latitude,
          f.longitude
        )
      }))
      .filter((f: FacultyLocation & { distance: number }) => f.distance <= maxDistance)
      .sort((a: FacultyLocation & { distance: number }, b: FacultyLocation & { distance: number }) => a.distance - b.distance);

    return new Response(JSON.stringify({ 
      nearbyFaculty,
      studentCoordinates: studentCoords,
      totalFound: nearbyFaculty.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in find-nearby-faculty function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      nearbyFaculty: [],
      message: 'Error finding nearby faculty'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});