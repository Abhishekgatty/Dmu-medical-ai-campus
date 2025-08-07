// // @ts-ignore
// import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// }

// serve(async (req) => {
//   if (req.method === "OPTIONS") {
//     return new Response(null, {
//       status: 204,
//       headers: corsHeaders,
//     })
//   }

//   const { email, name, approvedBy } = await req.json()

//   if (!email) {
//     return new Response(JSON.stringify({ error: 'Missing email' }), {
//       status: 400,
//       headers: corsHeaders,
//     })
//   }

//   // @ts-ignore
//   const RESEND_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1aHVzY3hvb2lybGx4Z2h3c25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDI5NjIsImV4cCI6MjA2ODc3ODk2Mn0.Ga5qFwaU5YicYQCoOOmm0csu6bNUG-XHMaYt8WMSYNg"

//   const result = await fetch('https://api.resend.com/emails', {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${RESEND_API_KEY}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       from: 'admin@yourdomain.com',
//       to: email,
//       subject: 'Your Enrollment is Approved',
//       html: `<p>Hi ${name},</p><p>Your enrollment was approved by ${approvedBy}.</p>`,
//     }),
//   })

//   if (!result.ok) {
//     const text = await result.text()
//     return new Response(JSON.stringify({ error: text }), {
//       status: 500,
//       headers: corsHeaders,
//     })
//   }

//   return new Response(JSON.stringify({ success: true }), {
//     status: 200,
//     headers: corsHeaders,
//   })
// })



// // @ts-nocheck
// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// // Define allowed origins for CORS (update for production)
// const ALLOWED_ORIGINS = [
//   "http://localhost:8080", // Development
//   "https://your-production-domain.com", // Production
// ];

// // CORS headers
// const corsHeaders = {
//   "Access-Control-Allow-Methods": "POST, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
//   "Access-Control-Max-Age": "86400", // Cache preflight for 24 hours
// };

// // Validate email format
// const isValidEmail = (email: string) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// serve(async (req: Request) => {
//   // Set CORS origin based on request origin
//   const origin = req.headers.get("Origin") || "";
//   const corsHeadersWithOrigin = {
//     ...corsHeaders,
//    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : "null",

//   };

//   // Handle CORS preflight request
//   if (req.method === "OPTIONS") {
//     return new Response(null, {
//       status: 204,
//       headers: corsHeadersWithOrigin,
//     });
//   }

//   // Only allow POST requests
//   if (req.method !== "POST") {
//     return new Response(JSON.stringify({ error: "Method not allowed" }), {
//       status: 405,
//       headers: {
//         ...corsHeadersWithOrigin,
//         "Content-Type": "application/json",
//       },
//     });
//   }

//   try {
//     // Parse request body
//     const { email, name, approvedBy } = await req.json();

//     // Validate inputs
//     if (!email || !name || !approvedBy) {
//       return new Response(JSON.stringify({ error: "Missing required fields: email, name, and approvedBy" }), {
//         status: 400,
//         headers: {
//           ...corsHeadersWithOrigin,
//           "Content-Type": "application/json",
//         },
//       });
//     }

//     if (!isValidEmail(email)) {
//       return new Response(JSON.stringify({ error: "Invalid email format" }), {
//         status: 400,
//         headers: {
//           ...corsHeadersWithOrigin,
//           "Content-Type": "application/json",
//         },
//       });
//     }

//     // Get Resend API key from environment variables
//     // const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
//     const RESEND_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1aHVzY3hvb2lybGx4Z2h3c25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDI5NjIsImV4cCI6MjA2ODc3ODk2Mn0.Ga5qFwaU5YicYQCoOOmm0csu6bNUG-XHMaYt8WMSYNg"
//     if (!RESEND_API_KEY) {
//       console.error("RESEND_API_KEY is not set");
//       return new Response(JSON.stringify({ error: "Server configuration error" }), {
//         status: 500,
//         headers: {
//           ...corsHeadersWithOrigin,
//           "Content-Type": "application/json",
//         },
//       });
//     }

   
//     const result = await fetch("https://api.resend.com/emails", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${RESEND_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         from: "abhishekgatty0@gmail.com", // Update with your verified Resend sender
//         to: email,
//         subject: "Your Enrollment is Approved",
//         html: `<p>Hi ${name},</p><p>Your enrollment was approved by ${approvedBy}.</p>`,
//       }),
//     });

//     if (!result.ok) {
//       const errorData = await result.json().catch(() => ({ message: "Unknown error from Resend API" }));
//       console.error("Resend API error:", errorData);
//       return new Response(JSON.stringify({ error: errorData.message || "Failed to send email" }), {
//         status: 500,
//         headers: {
//           ...corsHeadersWithOrigin,
//           "Content-Type": "application/json",
//         },
//       });
//     }

//     return new Response(JSON.stringify({ success: true }), {
//       status: 200,
//       headers: {
//         ...corsHeadersWithOrigin,
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("Server error:", error);
//     return new Response(JSON.stringify({ error: "Internal server error" }), {
//       status: 500,
//       headers: {
//         ...corsHeadersWithOrigin,
//         "Content-Type": "application/json",
//       },
//     });
//   }
// });




// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGINS = [
  "http://localhost:8080",
];

const corsHeaders = {
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400", // 
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

serve(async (req: Request) => {
  const origin = req.headers.get("Origin") || "";
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "null";
  const headers = {
    ...corsHeaders,
    "Access-Control-Allow-Origin": allowOrigin,
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // Block disallowed origins
  if (allowOrigin === "null") {
    return new Response(JSON.stringify({ error: "Origin not allowed" }), {
      status: 403,
      headers,
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  }

  try {
    // 🔧 Hardcoded values for testing
    const email = "abhishekgatty0@gmail.com";
    const name = "Abhishek Gatty";
    const approvedBy = "Admin Team";

    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers,
        }
      );
    }

    const RESEND_API_KEY =
      Deno.env.get("RESEND_API_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1aHVzY3hvb2lybGx4Z2h3c25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDI5NjIsImV4cCI6MjA2ODc3ODk2Mn0.Ga5qFwaU5YicYQCoOOmm0csu6bNUG-XHMaYt8WMSYNg";

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "admin@yourdomain.com", // MUST be verified in Resend
        to: email,
        subject: "Your Enrollment is Approved",
        html: `<p>Hi ${name},</p><p>Your enrollment was approved by ${approvedBy}.</p>`,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.json().catch(() => ({}));
      console.error("Resend API error:", err);
      return new Response(
        JSON.stringify({ error: err.message || "Email failed" }),
        {
          status: 500,
          headers,
        }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("Unhandled server error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers,
      }
    );
  }
});
