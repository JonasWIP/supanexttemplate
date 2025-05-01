# Sample Feature Implementation Guide: Task Management System

This guide walks through the process of implementing a complete feature in the SupaNext Template project. We'll build a "Task Management" feature that allows users to create, view, update, and delete tasks.

## Table of Contents

1. [Planning the Feature](#1-planning-the-feature)
2. [Creating a Supabase Migration](#2-creating-a-supabase-migration)
3. [Applying the Migration](#3-applying-the-migration)
4. [Updating Database Types](#4-updating-database-types)
5. [Creating Components](#5-creating-components)
6. [Creating Pages](#6-creating-pages)
7. [Using Layouts](#7-using-layouts)
8. [Implementing Styling](#8-implementing-styling)
9. [Implementing Dark Mode](#9-implementing-dark-mode)
10. [Adjusting Middleware](#10-adjusting-middleware)
11. [Adding Authentication Requirements](#11-adding-authentication-requirements)
12. [Creating Public Access Pages](#12-creating-public-access-pages)
13. [Testing the Feature](#13-testing-the-feature)

## 1. Planning the Feature

Before writing code, let's define what our Task Management feature will include:

- **Data Model**: Tasks will have a title, description, status, due date, and will be associated with a user
- **Features**:
  - Create new tasks
  - View a list of tasks
  - View task details
  - Update task status and details
  - Delete tasks
  - Filter tasks by status
- **Pages**:
  - Task list page within the dashboard
  - Task detail page
  - Create/edit task page
- **Components**:
  - Task card
  - Task form
  - Status filter
  - Task list

## 2. Creating a Supabase Migration

First, we need to create a database table to store tasks. We'll create a migration file in the Supabase folder:

1. Create a new migration file in the terminal:

```bash
cd supabase
npm run supabase:dbdiff -- -f add_tasks_table
```

2. This will create a new migration file in `supabase/migrations/`. You'll need to edit it to define your table:

```sql
-- Create tasks table
CREATE TABLE IF NOT EXISTS "public"."tasks" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" uuid NOT NULL,
    "title" text NOT NULL,
    "description" text,
    "status" text NOT NULL DEFAULT 'pending',
    "due_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create a trigger to update updated_at on change
CREATE TRIGGER "set_tasks_updated_at"
BEFORE UPDATE ON "public"."tasks"
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add RLS policies
ALTER TABLE "public"."tasks" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own tasks
CREATE POLICY "Users can read own tasks" 
ON "public"."tasks" FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own tasks
CREATE POLICY "Users can insert own tasks" 
ON "public"."tasks" FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own tasks
CREATE POLICY "Users can update own tasks" 
ON "public"."tasks" FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Users can delete their own tasks
CREATE POLICY "Users can delete own tasks" 
ON "public"."tasks" FOR DELETE 
USING (auth.uid() = user_id);

-- GRANTS
GRANT ALL ON TABLE "public"."tasks" TO "anon";
GRANT ALL ON TABLE "public"."tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."tasks" TO "service_role";
```

## 3. Applying the Migration

After creating the migration file, apply it to your local Supabase instance:

```bash
npm run supabase:dbmigrationup
```

This command will apply your new migration to the database. If you're using a production database, you would eventually apply these migrations there as well.

## 4. Updating Database Types

After changing your database schema, update the TypeScript types to reflect the new tables:

```bash
npm run supabase:updatetypes
```

This will update your `lib/database.types.ts` file with the new `tasks` table type definitions. Now TypeScript will know about your new table structure.

## 5. Creating Components

Now let's create the UI components we need for the task management feature. We'll create these in the `components/tasks` directory.

### Task Card Component

Create a new file at `components/tasks/TaskCard.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { Card } from '../ui/card';
import Button from '../ui/button';
import { formatDate } from '@/lib/utils';
import { Database } from '@/lib/database.types';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200'
  };
  
  const statusColor = statusColors[task.status as keyof typeof statusColors] || statusColors.pending;
  
  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(task.id);
    setIsDeleting(false);
  };
  
  return (
    <Card className="p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{task.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
          
          {task.due_date && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Due: {formatDate(task.due_date)}
            </p>
          )}
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs border ${statusColor}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      
      <div className="flex mt-4 justify-between">
        <select 
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(task.id)}>
            Edit
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

### Task Form Component

Create a new file at `components/tasks/TaskForm.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Card } from '../ui/card';
import { Database } from '@/lib/database.types';
import { getSupabaseClient } from '@/lib/supabase';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskInput = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>;

interface TaskFormProps {
  task?: Task;
  isEditing?: boolean;
}

export default function TaskForm({ task, isEditing = false }: TaskFormProps) {
  const initialTask: TaskInput = {
    title: '',
    description: '',
    status: 'pending',
    due_date: null,
  };
  
  const [formData, setFormData] = useState<TaskInput>(task || initialTask);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        due_date: task.due_date,
      });
    }
  }, [task]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const supabase = getSupabaseClient();
      
      if (isEditing && task) {
        // Update existing task
        const { error } = await supabase
          .from('tasks')
          .update({
            title: formData.title,
            description: formData.description,
            status: formData.status,
            due_date: formData.due_date,
          })
          .eq('id', task.id);
          
        if (error) throw error;
      } else {
        // Insert new task
        const { error } = await supabase
          .from('tasks')
          .insert([{
            ...formData
          }]);
          
        if (error) throw error;
      }
      
      // Redirect back to task list
      router.push('/dashboard/tasks');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save task');
      console.error('Error saving task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Title"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          
          <div>
            <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={4}
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <Input
            type="datetime-local"
            label="Due Date"
            id="due_date"
            name="due_date"
            value={formData.due_date ? new Date(formData.due_date).toISOString().slice(0,16) : ''}
            onChange={handleChange}
          />
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/tasks')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
```

### Task Status Filter Component

Create a new file at `components/tasks/TaskStatusFilter.tsx`:

```tsx
'use client';

interface TaskStatusFilterProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function TaskStatusFilter({ currentFilter, onFilterChange }: TaskStatusFilterProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-3 py-1.5 text-sm font-medium rounded-full ${
            currentFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange('pending')}
          className={`px-3 py-1.5 text-sm font-medium rounded-full ${
            currentFilter === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => onFilterChange('in_progress')}
          className={`px-3 py-1.5 text-sm font-medium rounded-full ${
            currentFilter === 'in_progress'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`px-3 py-1.5 text-sm font-medium rounded-full ${
            currentFilter === 'completed'
              ? 'bg-green-600 text-white'
              : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
          }`}
        >
          Completed
        </button>
      </div>
    </div>
  );
}
```

### Tasks List Component

Create a new file at `components/tasks/TasksList.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import TaskCard from './TaskCard';
import TaskStatusFilter from './TaskStatusFilter';
import Button from '../ui/Button';

type Task = Database['public']['Tables']['tasks']['Row'];

export default function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();
  
  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);
  
  async function fetchTasks() {
    setIsLoading(true);
    setError(null);
    
    try {
      const supabase = getSupabaseClient();
      
      // Start building the query
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filter if not showing all
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) throw error;
      
      setTasks(data || []);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleEdit = (id: string) => {
    router.push(`/dashboard/tasks/edit/${id}`);
  };
  
  const handleDelete = async (id: string) => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      
      if (error) throw error;
      
      // Update UI after successful delete
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err: any) {
      console.error('Error deleting task:', err);
      setError(err.message || 'Failed to delete task');
    }
  };
  
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update UI after successful status change
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, status: newStatus } : task
      ));
    } catch (err: any) {
      console.error('Error updating task status:', err);
      setError(err.message || 'Failed to update task status');
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Tasks</h2>
        <Button onClick={() => router.push('/dashboard/tasks/new')}>
          Create New Task
        </Button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
          <button 
            className="ml-2 underline" 
            onClick={fetchTasks}
          >
            Retry
          </button>
        </div>
      )}
      
      <TaskStatusFilter 
        currentFilter={statusFilter} 
        onFilterChange={setStatusFilter}
      />
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-500">Loading tasks...</div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No tasks found</p>
          <Button onClick={() => router.push('/dashboard/tasks/new')}>
            Create Your First Task
          </Button>
        </div>
      ) : (
        <div>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

## 6. Creating Pages

Now that we have our components, let's create the pages that will use them.

### Tasks List Page

Create a new file at `app/dashboard/tasks/page.tsx`:

```tsx
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import TasksList from '@/components/tasks/TasksList';

export const metadata = {
  title: 'Tasks - SupaNext Template',
  description: 'Manage your tasks',
};

export default function TasksPage() {
  return (
    <PageContainer>
      <PageHeader title="Tasks" description="Manage your tasks" />
      <TasksList />
    </PageContainer>
  );
}
```

### Create Task Page

Create a new file at `app/dashboard/tasks/new/page.tsx`:

```tsx
'use client';

import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import TaskForm from '@/components/tasks/TaskForm';

export default function CreateTaskPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Create New Task" 
        description="Add a new task to your list"
        backLink="/dashboard/tasks"
      />
      <TaskForm />
    </PageContainer>
  );
}
```

### Edit Task Page

Create a new file at `app/dashboard/tasks/edit/[id]/page.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import TaskForm from '@/components/tasks/TaskForm';
import { getSupabaseClient } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Task = Database['public']['Tables']['tasks']['Row'];

export default function EditTaskPage() {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchTask() {
      if (!id) return;
      
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setTask(data);
      } catch (err: any) {
        console.error('Error fetching task:', err);
        setError(err.message || 'Failed to load task');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTask();
  }, [id]);
  
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-500">Loading task...</div>
        </div>
      </PageContainer>
    );
  }
  
  if (error || !task) {
    return (
      <PageContainer>
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error || 'Task not found'}
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader 
        title={`Edit Task: ${task.title}`}
        description="Update your task details"
        backLink="/dashboard/tasks"
      />
      <TaskForm task={task} isEditing />
    </PageContainer>
  );
}
```

## 7. Using Layouts

The pages we created above use the layout components already included in the template. The `PageContainer` and `PageHeader` components provide consistent layout and styling.

If you want to create a specific layout just for the tasks feature, you could add a layout file at `app/dashboard/tasks/layout.tsx`:

```tsx
export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="tasks-layout">
      {/* Any tasks-specific layout elements would go here */}
      {children}
    </div>
  );
}
```

This would wrap all pages under the `/dashboard/tasks` route.

## 8. Implementing Styling

Our components already use Tailwind CSS classes for styling, which is already set up in the project. If you want to add custom styles specifically for the tasks feature, you could add them to the global CSS file or create a new CSS module.

### Adding Task-specific styles to the global CSS file

You can add custom styles to `app/globals.css`:

```css
/* Add to the existing globals.css file */

/* Task-specific styles */
.task-card-container {
  transition: all 0.2s ease-in-out;
}

.task-card-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Status badge animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.status-badge-pending {
  animation: pulse 2s infinite;
}
```

## 9. Implementing Dark Mode

The template already supports dark mode through Tailwind's `dark:` variant. We've already added dark mode styles to our components. 

For example, in our TaskCard component:

```tsx
<p className="text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
```

The `dark:text-gray-300` class will be applied when dark mode is active.

To ensure all your components have proper dark mode styles, follow this pattern of including both light and dark mode variants for colors, backgrounds, and borders:

- Text: `text-gray-700 dark:text-gray-200`
- Backgrounds: `bg-white dark:bg-gray-800`
- Borders: `border-gray-200 dark:border-gray-700`

## 10. Adjusting Middleware

The middleware in the template already handles authentication. By default, it protects all routes except for specific public ones like the login and registration pages.

If you need to adjust the middleware to allow public access to certain task routes (e.g., a public tasks showcase), you would edit the `middleware.ts` file:

```typescript
// In middleware.ts, modify the publicRoutes array:

const publicRoutes = [
  '/',
  '/login', 
  '/register',
  '/forgot-password',
  '/public/tasks', // Add this line to allow public access to this route
];
```

## 11. Adding Authentication Requirements

The authentication is already set up in the middleware.ts file. All routes under `/dashboard` are already protected and require authentication.

If you need to add more granular permissions or role-based access, you could enhance the middleware or add checks in your components.

For example, to add role-based access to the tasks pages:

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import TasksList from '@/components/tasks/TasksList';

export default function TasksPage() {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  
  // Check if user has the required role
  useEffect(() => {
    if (!isLoading && (!user || user?.user_metadata?.role !== 'task_manager')) {
      // Redirect users without proper permissions
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  // If user doesn't have permission, don't render the content
  if (!user || user?.user_metadata?.role !== 'task_manager') {
    return null;
  }
  
  return <TasksList />;
}
```

## 12. Creating Public Access Pages

To create a page that can be accessed without authentication, create it outside the `/dashboard` directory and add it to the `publicRoutes` list in the middleware.

For example, create a public tasks showcase at `app/public/tasks/page.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Public Tasks - SupaNext Template',
  description: 'View public task examples',
};

export default function PublicTasksPage() {
  const [featuredTasks, setFeaturedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchFeaturedTasks() {
      try {
        const supabase = getSupabaseClient();
        // This would require a separate RLS policy allowing public access
        // Or a specific view or function that returns curated public tasks
        const { data } = await supabase
          .from('featured_tasks_view') // This would be a database view that exposes only public tasks
          .select('*')
          .limit(5);
        
        setFeaturedTasks(data || []);
      } catch (error) {
        console.error('Error fetching featured tasks:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchFeaturedTasks();
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Featured Tasks</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        See examples of how our task management system works. Sign up to create your own tasks!
      </p>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : featuredTasks.length === 0 ? (
        <div>No featured tasks available</div>
      ) : (
        <div className="space-y-4">
          {featuredTasks.map((task) => (
            <Card key={task.id} className="p-4">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{task.description}</p>
              {task.due_date && (
                <p className="text-sm text-gray-500 mt-2">Due: {formatDate(task.due_date)}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 13. Testing the Feature

After implementing the feature, you should thoroughly test it to ensure everything works as expected:

1. **Create Task**: Test creating tasks with various statuses and due dates
2. **View Tasks**: Ensure the task list displays correctly and filters work
3. **Update Tasks**: Test updating task details and statuses
4. **Delete Tasks**: Verify that task deletion works properly
5. **Authentication**: Confirm that unauthenticated users can't access protected routes
6. **Public Access**: Test any public pages to ensure they're accessible without login
7. **Dark Mode**: Switch between light and dark mode to make sure styling is correct in both
8. **Responsive Design**: Test on different screen sizes to ensure the UI is responsive

## Summary

In this guide, we've covered:

1. Planning the Task Management feature
2. Creating a Supabase migration to define the database structure
3. Applying the migration and updating TypeScript types
4. Building components for displaying and managing tasks
5. Creating pages using the existing layout components
6. Implementing styling with Tailwind CSS
7. Ensuring dark mode compatibility
8. Configuring access through middleware
9. Adding authentication requirements
10. Creating public access pages
11. Testing the complete feature

This comprehensive approach ensures that your feature is well-structured, properly integrated with the database, styled consistently, and secured appropriately within the application's authentication system.

You can use this same process to implement other features in your SupaNext template project.