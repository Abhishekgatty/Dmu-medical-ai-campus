import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from 'lucide-react';

const NotificationBar = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    fetchUserAndNotifications();
  }, []);

  const fetchUserAndNotifications = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
        await fetchNotifications(user.email);
      } else {
        // For non-authenticated users, still show public notifications
        await fetchNotifications(null);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchNotifications = async (email: string | null) => {
    try {
      // Fetch active notifications
      const { data: notificationData, error: notificationError } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_active', true)
        .lte('publish_date', new Date().toISOString())
        .or('expiry_date.is.null,expiry_date.gt.' + new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      if (notificationError) throw notificationError;

      if (email) {
        // Fetch read notifications for this user
        const { data: readData, error: readError } = await supabase
          .from('notification_reads')
          .select('notification_id')
          .eq('user_email', email);

        if (readError) throw readError;

        const readNotificationIds = readData?.map(r => r.notification_id) || [];
        const unreadNotifications = notificationData?.filter(n => 
          !readNotificationIds.includes(n.id)
        ) || [];

        setUnreadCount(unreadNotifications.length);
      }

      setNotifications(notificationData || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  if (notifications.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {notifications.length > 0 && (
                  `Latest: ${notifications[0].title}`
                )}
              </span>
              {notifications[0]?.category && (
                <Badge variant="outline" className="text-xs">
                  {notifications[0].category}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount} new
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleNotificationClick}
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              View All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;