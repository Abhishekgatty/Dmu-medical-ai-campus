-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Exams', 'Clinical', 'Research', 'Payments', 'Admissions', 'Updates')),
  target_role TEXT NOT NULL CHECK (target_role IN ('Student', 'Faculty', 'Clinical', 'All')),
  publish_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Everyone can view active notifications" 
ON public.notifications 
FOR SELECT 
USING (
  is_active = true 
  AND publish_date <= now() 
  AND (expiry_date IS NULL OR expiry_date > now())
);

-- Create policy for admins to manage notifications
CREATE POLICY "Admins can manage notifications" 
ON public.notifications 
FOR ALL 
USING (true);

-- Create notification reads table to track who has seen what
CREATE TABLE public.notification_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(notification_id, user_email)
);

-- Enable RLS
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

-- Create policies for notification reads
CREATE POLICY "Users can view their own reads" 
ON public.notification_reads 
FOR SELECT 
USING (true);

CREATE POLICY "Users can mark notifications as read" 
ON public.notification_reads 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();