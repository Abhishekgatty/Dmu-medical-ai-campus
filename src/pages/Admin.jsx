
// import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";

// // ✅ Edge function call using fetch
// const approveEnrollment = async (enrollmentId) => {
//   const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
//   console.log("Session Data:", sessionData.session);
//   if (sessionError || !sessionData.session) {
//     throw new Error("User not authenticated");
//   }

//   const token = sessionData.session.access_token;

//   const response = await fetch(
//     "https://guhuscxooirllxghwsno.supabase.co/functions/v1/manage-student-enrollments",
//     {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         action: "approve",
//         enrollment_id:enrollmentId,
//         approved_by: "0cc4115a-3cd7-4a6d-b057-20b1c5b0fe45", // or hardcode if preferred

//        }),
//     }
//   );

//   const result = await response.json();
//   console.log("Approve Enrollment Result:", result);

//   if (!response.ok) {
//     throw new Error(result.error || "Failed to approve enrollment");
//   }

//   return result;
// };

// function Admin() {
//   const [students, setStudents] = useState([]);
//   const [loadingId, setLoadingId] = useState(null);
//   const [approvedIds, setApprovedIds] = useState([]);
//   const { toast } = useToast();

//   const fetchStudents = async () => {
//     const { data, error } = await supabase.from("student_enrollments").select("*");
//     if (error) {
//       toast({ title: "Fetch Error", description: error.message, variant: "destructive" });
//     } else {
//       setStudents(data);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const handleApprove = async (student) => {
//     setLoadingId(student.id);
//     try {
//       await approveEnrollment(student.id);
//       setApprovedIds((prev) => [...prev, student.id]);

//       toast({
//         title: "Student Approved",
//         description: `${student.student_name} has been approved.`,
//       });
//     } catch (err) {
//       toast({
//         title: "Approval Error",
//         description: err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <Card>
//         <CardHeader>
//           <CardTitle>Approve Students</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {students.length === 0 ? (
//             <p className="text-center text-gray-500">No students found.</p>
//           ) : (
//             students.map((student) => (
//               <div
//                 key={student.id}
//                 className="border p-4 rounded flex justify-between items-center"
//               >
//                 <div>
//                   <p className="font-medium">{student.student_name}</p>
//                   <p className="text-sm text-gray-500">{student.email}</p>
//                 </div>
//                 {approvedIds.includes(student.id) ? (
//                   <span className="text-green-600 text-sm font-semibold">Approved</span>
//                 ) : (
//                   <Button
//                     onClick={() => handleApprove(student)}
//                     disabled={loadingId === student.id}
//                   >
//                     {loadingId === student.id ? "Approving..." : "Approve"}
//                   </Button>
//                 )}
//               </div>
//             ))
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default Admin;






// import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";

// // ✅ Edge function call using fetch
// const approveEnrollment = async (enrollmentId) => {
//   const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
//   console.log("Session Data:", sessionData.session);
//   if (sessionError || !sessionData.session) {
//     throw new Error("User not authenticated");
//   }

//   const token = sessionData.session.access_token;

//   const response = await fetch(
//     "https://guhuscxooirllxghwsno.supabase.co/functions/v1/manage-student-enrollments",
//     {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         action: "approve",
//         enrollment_id: enrollmentId,
//         approved_by: "0cc4115a-3cd7-4a6d-b057-20b1c5b0fe45", // or hardcode if preferred
//       }),
//     }
//   );

//   const result = await response.json();
//   console.log("Approve Enrollment Result:", result);

//   if (!response.ok) {
//     throw new Error(result.error || "Failed to approve enrollment");
//   }

//   return result;
// };

// function Admin() {
//   const [students, setStudents] = useState([]);
//   const [loadingId, setLoadingId] = useState(null);
//   const [approvedIds, setApprovedIds] = useState([]);
//   const { toast } = useToast();

//   const fetchStudents = async () => {
//     const { data, error } = await supabase.from("student_enrollments").select("*");
//     if (error) {
//       toast({ title: "Fetch Error", description: error.message, variant: "destructive" });
//     } else {
//       setStudents(data);
//        const approved = data.filter(student => student.approved_at).map(student => student.id);
//       setApprovedIds(approved);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const handleApprove = async (student) => {
//     setLoadingId(student.id);
//     try {
//       const result = await approveEnrollment(student.id);

//       // Update approved_at in the student_enrollments table
//       const { error } = await supabase
//         .from("student_enrollments")
//         .update({ approved_at: new Date().toISOString() })
//         .eq("id", student.id);

//       if (error) {
//         throw new Error("Failed to update approved_at: " + error.message);
//       }

//       setApprovedIds((prev) => [...prev, student.id]);
//       await fetchStudents(); // Refresh the student list to reflect the update

//       toast({
//         title: "Student Approved",
//         description: `${student.student_name} has been approved.`,
//       });
//     } catch (err) {
//       toast({
//         title: "Approval Error",
//         description: err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <Card>
//         <CardHeader>
//           <CardTitle>Approve Students</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {students.length === 0 ? (
//             <p className="text-center text-gray-500">No students found.</p>
//           ) : (
//             students.map((student) => (
//               <div
//                 key={student.id}
//                 className="border p-4 rounded flex justify-between items-center"
//               >
//                 <div>
//                   <p className="font-medium">{student.student_name}</p>
//                   <p className="text-sm text-gray-500">{student.email}</p>
//                 </div>
//                 {student.approved_at  ? (
//                   <span className="text-green-600 text-sm font-semibold">Approved</span>
//                 ) : (
//                   <Button
//                     onClick={() => handleApprove(student)}
//                     disabled={loadingId === student.id}
//                   >
//                     {loadingId === student.id ? "Approving..." : "Approve"}
//                   </Button>
//                 )}
//               </div>
//             ))
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default Admin;




import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// ✅ Edge function call using fetch
const approveEnrollment = async (enrollmentId) => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  console.log("Session Data:", sessionData.session);
  if (sessionError || !sessionData.session) {
    throw new Error("User not authenticated");
  }

  const token = sessionData.session.access_token;

  const response = await fetch(
    "https://guhuscxooirllxghwsno.supabase.co/functions/v1/manage-student-enrollments",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "approve",
        enrollment_id: enrollmentId,
        approved_by: "0cc4115a-3cd7-4a6d-b057-20b1c5b0fe45", // or hardcode if preferred
      }),
    }
  );

  const result = await response.json();
  console.log("Approve Enrollment Result:", result);

  if (!response.ok) {
    throw new Error(result.error || "Failed to approve enrollment");
  }

  return result;
};

function Admin() {
  const [students, setStudents] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [approvedIds, setApprovedIds] = useState([]);
  const { toast } = useToast();
  const [rollNumbers, setRollNumbers] = useState({});


  const fetchStudents = async () => {
    const { data, error } = await supabase.from("student_enrollments").select("*");
    if (error) {
      toast({ title: "Fetch Error", description: error.message, variant: "destructive" });
    } else {
      setStudents(data);
      const approved = data.filter(student => student.approved_at).map(student => student.id);
      setApprovedIds(approved);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleApprove = async (student, rollNumber) => {
  setLoadingId(student.id);
  try {
    const result = await approveEnrollment(student.id);

    const { error } = await supabase
      .from("student_enrollments")
      .update({
        approved_at: new Date().toISOString(),
        roll_number: rollNumber,
      })
      .eq("id", student.id);

    if (error) {
      throw new Error("Failed to update approved_at: " + error.message);
    }

    setApprovedIds((prev) => [...prev, student.id]);
    await fetchStudents();

    toast({
      title: "Student Approved",
      description: `${student.student_name} has been approved.`,
    });
  } catch (err) {
    toast({
      title: "Approval Error",
      description: err.message,
      variant: "destructive",
    });
  } finally {
    setLoadingId(null);
  }
};


  return (
    <div className="p-6 max-w-4xl mx-auto">
  <Card>
    <CardHeader>
      <CardTitle>Approve Students</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {students.length === 0 ? (
        <p className="text-center text-gray-500">No students found.</p>
      ) : (
        students.map((student) => (
          <div
            key={student.id}
            className="border p-4 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
          >
            <div>
              <p className="font-medium">{student.student_name}</p>
              <p className="text-sm text-gray-500">{student.email}</p>
            </div>

            {student.approved_at ? (
              <span className="text-green-600 text-sm font-semibold">Approved</span>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter Roll Number"
                  className="border px-2 py-1 rounded text-sm w-48"
                  value={rollNumbers[student.id] || ""}
                  onChange={(e) =>
                    setRollNumbers({ ...rollNumbers, [student.id]: e.target.value })
                  }
                />
                <Button
                  onClick={() => handleApprove(student, rollNumbers[student.id])}
                  disabled={loadingId === student.id || !rollNumbers[student.id]}
                >
                  {loadingId === student.id ? "Approving..." : "Approve"}
                </Button>
              </div>
            )}
          </div>
        ))
      )}
    </CardContent>
  </Card>
</div>

  );
}

export default Admin;
