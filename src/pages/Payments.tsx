import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  CreditCard, 
  Download, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Building,
  Users,
  GraduationCap
} from 'lucide-react';

const Payments = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [studentPayments, setStudentPayments] = useState<any[]>([]);
  const [facultyEarnings, setFacultyEarnings] = useState<any[]>([]);
  const [clinicalPayments, setClinicalPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserAndFetchData();
  }, []);

  const checkUserAndFetchData = async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error('Please log in to view payments');
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email);

      // Determine user role by checking which tables they exist in
      await determineUserRole(user.email!);
    } catch (error) {
      console.error('Error checking user:', error);
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const determineUserRole = async (email: string) => {
    try {
      // Check if user is a student
      const { data: studentData } = await supabase
        .from('student_enrollments')
        .select('id')
        .eq('email', email)
        .single();

      if (studentData) {
        setUserRole('student');
        await fetchStudentPayments(studentData.id);
        return;
      }

      // Check if user is faculty
      const { data: facultyData } = await supabase
        .from('faculty')
        .select('id')
        .eq('email', email)
        .single();

      if (facultyData) {
        setUserRole('faculty');
        await fetchFacultyEarnings(facultyData.id);
        return;
      }

      // Check if user is clinical center
      const { data: clinicalData } = await supabase
        .from('clinical_centers')
        .select('id')
        .eq('contact_email', email)
        .single();

      if (clinicalData) {
        setUserRole('clinical');
        await fetchClinicalPayments(clinicalData.id);
        return;
      }

      // Default role if not found in any table
      setUserRole('general');
    } catch (error) {
      console.error('Error determining user role:', error);
    }
  };

  const fetchStudentPayments = async (enrollmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('enrollment_id', enrollmentId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setStudentPayments(data || []);
    } catch (error) {
      console.error('Error fetching student payments:', error);
      toast.error('Failed to load student payments');
    }
  };

  const fetchFacultyEarnings = async (facultyId: string) => {
    try {
      const { data, error } = await supabase
        .from('faculty_earnings')
        .select('*')
        .eq('faculty_id', facultyId)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      setFacultyEarnings(data || []);
    } catch (error) {
      console.error('Error fetching faculty earnings:', error);
      toast.error('Failed to load faculty earnings');
    }
  };

  const fetchClinicalPayments = async (clinicalCenterId: string) => {
    try {
      const { data, error } = await supabase
        .from('clinical_payments')
        .select(`
          *,
          clinical_student_assignments (
            student_enrollments (student_name, roll_number)
          )
        `)
        .eq('clinical_center_id', clinicalCenterId)
        .order('due_date', { ascending: false });

      if (error) throw error;
      setClinicalPayments(data || []);
    } catch (error) {
      console.error('Error fetching clinical payments:', error);
      toast.error('Failed to load clinical payments');
    }
  };

  const handleMakePayment = async (paymentId: string, amount: number) => {
    try {
      // This will call the Stripe checkout edge function
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          paymentId: paymentId,
          amount: amount,
          currency: 'usd'
        }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast.error('Failed to initiate payment: ' + error.message);
    }
  };

  const exportInvoice = (earning: any) => {
    // Create a simple invoice export
    const invoiceData = {
      id: earning.id,
      amount: earning.amount,
      currency: earning.currency,
      date: earning.payment_date,
      description: earning.description,
      status: earning.payment_status
    };

    const dataStr = JSON.stringify(invoiceData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `invoice-${earning.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast.success('Invoice exported successfully');
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'received':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading Payment Information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <CreditCard className="h-8 w-8" />
            Payment Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your payments and financial information
          </p>
        </div>

        {userRole === 'student' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Student Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{payment.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(payment.due_date).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-bold">${payment.amount}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPaymentStatusBadge(payment.status)}
                      {payment.status === 'pending' && (
                        <Button 
                          onClick={() => handleMakePayment(payment.id, payment.amount)}
                          className="flex items-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          Make Payment
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {studentPayments.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No payment records found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {userRole === 'faculty' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Faculty Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {facultyEarnings.map((earning) => (
                  <div key={earning.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{earning.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(earning.payment_date).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-bold">
                        ${earning.amount} {earning.currency?.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPaymentStatusBadge(earning.payment_status)}
                      <Button 
                        variant="outline"
                        onClick={() => exportInvoice(earning)}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export Invoice
                      </Button>
                    </div>
                  </div>
                ))}
                {facultyEarnings.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No earnings records found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {userRole === 'clinical' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Clinical Payments from DMU
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clinicalPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{payment.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        Student: {payment.clinical_student_assignments?.student_enrollments?.student_name}
                        ({payment.clinical_student_assignments?.student_enrollments?.roll_number})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(payment.due_date).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-bold">${payment.amount}</p>
                    </div>
                    <div>
                      {getPaymentStatusBadge(payment.status)}
                    </div>
                  </div>
                ))}
                {clinicalPayments.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No payment records found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {userRole === 'general' && (
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                You don't have access to payment information. Please contact administrator.
              </p>
            </CardContent>
          </Card>
        )}

        {!userRole && (
          <Card>
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Please log in to view your payment information.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Payments;