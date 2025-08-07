import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  Tag,
  Settings,
  Bell
} from 'lucide-react';

const NotificationAdmin = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNotification, setEditingNotification] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    target_role: '',
    publish_date: new Date().toISOString().slice(0, 16),
    expiry_date: '',
    is_active: true
  });

  const categories = ['Exams', 'Clinical', 'Research', 'Payments', 'Admissions', 'Updates'];
  const roles = ['Student', 'Faculty', 'Clinical', 'All'];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      target_role: '',
      publish_date: new Date().toISOString().slice(0, 16),
      expiry_date: '',
      is_active: true
    });
    setEditingNotification(null);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.category || !formData.target_role) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to manage notifications');
        return;
      }

      const notificationData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        target_role: formData.target_role,
        publish_date: formData.publish_date,
        expiry_date: formData.expiry_date || null,
        is_active: formData.is_active,
        created_by: user.id
      };

      if (editingNotification) {
        const { error } = await supabase
          .from('notifications')
          .update(notificationData)
          .eq('id', editingNotification.id);

        if (error) throw error;
        toast.success('Notification updated successfully');
      } else {
        const { error } = await supabase
          .from('notifications')
          .insert(notificationData);

        if (error) throw error;
        toast.success('Notification created successfully');
      }

      resetForm();
      fetchNotifications();
    } catch (error: any) {
      toast.error('Failed to save notification: ' + error.message);
    }
  };

  const handleEdit = (notification: any) => {
    setFormData({
      title: notification.title,
      content: notification.content,
      category: notification.category,
      target_role: notification.target_role,
      publish_date: new Date(notification.publish_date).toISOString().slice(0, 16),
      expiry_date: notification.expiry_date ? new Date(notification.expiry_date).toISOString().slice(0, 16) : '',
      is_active: notification.is_active
    });
    setEditingNotification(notification);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Notification deleted successfully');
      fetchNotifications();
    } catch (error: any) {
      toast.error('Failed to delete notification: ' + error.message);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Notification ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchNotifications();
    } catch (error: any) {
      toast.error('Failed to update notification status: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Notification Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Create and manage notifications for students, faculty, and clinical centers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create/Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {editingNotification ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {editingNotification ? 'Edit Notification' : 'Create New Notification'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="target_role">Target Role *</Label>
                    <Select 
                      value={formData.target_role} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, target_role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="publish_date">Publish Date *</Label>
                    <Input
                      id="publish_date"
                      type="datetime-local"
                      value={formData.publish_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, publish_date: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="expiry_date">Expiry Date</Label>
                    <Input
                      id="expiry_date"
                      type="datetime-local"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingNotification ? 'Update' : 'Create'} Notification
                  </Button>
                  {(isCreating || editingNotification) && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  All Notifications
                </span>
                <Badge variant="secondary">{notifications.length} total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Switch
                          checked={notification.is_active}
                          onCheckedChange={() => toggleActive(notification.id, notification.is_active)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline">
                        <Tag className="h-3 w-3 mr-1" />
                        {notification.category}
                      </Badge>
                      <Badge variant="secondary">
                        <Users className="h-3 w-3 mr-1" />
                        {notification.target_role}
                      </Badge>
                      <Badge variant={notification.is_active ? 'default' : 'secondary'}>
                        {notification.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(notification.publish_date).toLocaleDateString()}
                      </div>
                      {notification.expiry_date && (
                        <div>
                          Expires: {new Date(notification.expiry_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(notification)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No notifications created yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationAdmin;