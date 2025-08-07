import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Bell, 
  Calendar, 
  Clock, 
  GraduationCap, 
  Building, 
  Search, 
  DollarSign, 
  FileText, 
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  X
} from 'lucide-react';

const NotificationsList = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<any[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Exams', 'Clinical', 'Research', 'Payments', 'Admissions', 'Updates'];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Exams': return <FileText className="h-4 w-4" />;
      case 'Clinical': return <Building className="h-4 w-4" />;
      case 'Research': return <Search className="h-4 w-4" />;
      case 'Payments': return <DollarSign className="h-4 w-4" />;
      case 'Admissions': return <GraduationCap className="h-4 w-4" />;
      case 'Updates': return <AlertCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    fetchUserAndNotifications();
  }, [selectedCategory]);

  useEffect(() => {
    if (notifications.length > 0) {
      filterNotifications();
    }
  }, [searchQuery, notifications]);

  const filterNotifications = () => {
    if (!searchQuery.trim()) {
      setFilteredNotifications(notifications);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = notifications.filter(notification => 
      notification.title.toLowerCase().includes(query) || 
      notification.content.toLowerCase().includes(query) ||
      notification.category.toLowerCase().includes(query)
    );
    
    setFilteredNotifications(filtered);
  };

  const fetchUserAndNotifications = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
        await fetchReadNotifications(user.email);
      }

      await fetchNotifications();
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchReadNotifications = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('notification_reads')
        .select('notification_id')
        .eq('user_email', email);

      if (error) throw error;

      setReadNotifications(data?.map(r => r.notification_id) || []);
    } catch (error) {
      console.error('Error fetching read notifications:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('is_active', true)
        .lte('publish_date', new Date().toISOString())
        .or('expiry_date.is.null,expiry_date.gt.' + new Date().toISOString())
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      setNotifications(data || []);
      setFilteredNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!userEmail) return;

    try {
      const { error } = await supabase
        .from('notification_reads')
        .insert({
          notification_id: notificationId,
          user_email: userEmail
        });

      if (error && error.code !== '23505') { // Ignore duplicate key error
        throw error;
      }

      setReadNotifications(prev => [...prev, notificationId]);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = (notification: any) => {
    setSelectedNotification(notification);
    if (userEmail && !readNotifications.includes(notification.id)) {
      markAsRead(notification.id);
    }
  };

  const isUnread = (notificationId: string) => {
    return userEmail && !readNotifications.includes(notificationId);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Loading Notifications...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 px-6 pt-28 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Button 
              variant="secondary" 
              className="mb-4 gap-1 px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
              onClick={() => navigate(-1)}
              size="lg"
            >
              <ChevronLeft className="h-5 w-5" />
              Back to Previous Page
            </Button>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="h-8 w-8 text-ai-accent" />
              Campus Notification Hub
            </h1>
            <p className="text-muted-foreground">
              Stay updated with the latest announcements, events, and academic updates
            </p>
          </div>
            
            <div className="relative w-full md:w-64">
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="flex items-center gap-1">
                  {getCategoryIcon(category)}
                  <span className="hidden sm:inline">{category}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-6">
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isUnread(notification.id) ? 'border-primary/50 shadow-sm' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(notification.category)}
                            {isUnread(notification.id) && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">
                              {notification.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(notification.created_at).toLocaleDateString()}
                              <Clock className="h-3 w-3 ml-2" />
                              {new Date(notification.created_at).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {notification.category}
                          </Badge>
                          <Badge 
                            variant={notification.target_role === 'All' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {notification.target_role}
                          </Badge>
                          {isUnread(notification.id) ? (
                            <Badge className="bg-primary text-primary-foreground">
                              New
                            </Badge>
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2">
                        {notification.content.substring(0, 150)}...
                      </p>
                    </CardContent>
                  </Card>
                ))}

                {filteredNotifications.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery 
                          ? `No notifications matching "${searchQuery}"` 
                          : selectedCategory === 'All' 
                            ? 'There are no active notifications at the moment.' 
                            : `No notifications in the ${selectedCategory} category.`
                        }
                      </p>
                      {searchQuery && (
                        <Button onClick={clearSearch} variant="outline" className="mt-4">
                          Clear search
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Notification Detail Modal */}
          <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  {selectedNotification && getCategoryIcon(selectedNotification.category)}
                  <Badge variant="outline">
                    {selectedNotification?.category}
                  </Badge>
                  <Badge 
                    variant={selectedNotification?.target_role === 'All' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {selectedNotification?.target_role}
                  </Badge>
                </div>
                <DialogTitle className="text-xl">
                  {selectedNotification?.title}
                </DialogTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Calendar className="h-3 w-3" />
                  {selectedNotification && new Date(selectedNotification.created_at).toLocaleDateString()}
                  <Clock className="h-3 w-3 ml-2" />
                  {selectedNotification && new Date(selectedNotification.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  {selectedNotification?.expiry_date && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="text-amber-600">
                        Expires: {new Date(selectedNotification.expiry_date).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </DialogHeader>
              
              <div className="mt-4">
                <div className="prose prose-sm max-w-none">
                  {selectedNotification?.content.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 text-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotificationsList;